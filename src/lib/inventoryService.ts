/**
 * InventoryService - Unified Supabase access layer for all inventory tables
 * Handles CRUD operations + automatic activity logging
 */

import { supabase } from './supabase';
import { 
  InventoryItem, 
  InventoryLog, 
  InventoryOperationPayload, 
  InventoryTable,
  DEPARTMENT_INVENTORY_MAP 
} from '@/types/inventory';

/**
 * Get the correct inventory table name for a department
 * @throws Error if department is not found
 */
export const getInventoryTable = (department: string): InventoryTable => {
  if (!department || typeof department !== 'string') {
    throw new Error('Invalid department: department must be a non-empty string');
  }
  
  const table = DEPARTMENT_INVENTORY_MAP[department];
  if (!table) {
    throw new Error(`Unknown department: ${department}. Valid departments are: ${Object.keys(DEPARTMENT_INVENTORY_MAP).join(', ')}`);
  }
  
  return table;
};

/**
 * Fetch all inventory items for a department
 * @param department - Department name (must be valid department)
 * @param orderBy - Column to order by (default: 'item_name')
 * @returns Array of inventory items
 * @throws Error if department is invalid or database query fails
 */
export const fetchInventory = async (
  department: string, 
  orderBy: string = 'item_name'
): Promise<InventoryItem[]> => {
  const table = getInventoryTable(department);
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('department', department)
    .order(orderBy);

  if (error) {
    console.error(`[Inventory] Fetch error for ${department}:`, error);
    throw new Error(`Failed to fetch inventory for ${department}: ${error.message}`);
  }

  return data || [];
};

/**
 * Add new inventory item with validation
 * @throws Error if validation fails or database operation fails
 */
export const addInventoryItem = async (
  item: InventoryOperationPayload,
  staffId: string
): Promise<InventoryItem> => {
  // Validation
  if (!item.item_name || !item.item_name.trim()) {
    throw new Error('Item name is required');
  }
  if (item.quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }
  if (!item.unit || !item.unit.trim()) {
    throw new Error('Unit is required');
  }
  if (!staffId || !staffId.trim()) {
    throw new Error('Staff ID is required for activity logging');
  }

  const table = getInventoryTable(item.department);

  const { data, error } = await supabase
    .from(table)
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error(`[Inventory] Add error:`, error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create inventory item');
  }

  // Log activity
  await logInventoryActivity(
    staffId,
    item.department,
    'CREATE',
    `Added ${item.item_name}`,
    data.id,
    table,
    null,
    data
  );

  return data;
};

/**
 * Update inventory item quantity/details with validation
 * @throws Error if validation fails or item not found
 */
export const updateInventoryItem = async (
  id: string,
  department: string,
  updates: Partial<InventoryOperationPayload>,
  staffId: string
): Promise<InventoryItem> => {
  // Validation
  if (!id || !id.trim()) {
    throw new Error('Item ID is required');
  }
  if (!staffId || !staffId.trim()) {
    throw new Error('Staff ID is required for activity logging');
  }
  if (updates.quantity !== undefined && updates.quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }
  if (updates.item_name !== undefined && !updates.item_name.trim()) {
    throw new Error('Item name cannot be empty');
  }

  const table = getInventoryTable(department);

  // Fetch old value for logging
  const { data: oldData, error: fetchError } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !oldData) {
    throw new Error(`Item not found: ${id}`);
  }

  const { data, error } = await supabase
    .from(table)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[Inventory] Update error:`, error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update inventory item');
  }

  // Log activity
  await logInventoryActivity(
    staffId,
    department,
    'UPDATE',
    `Updated ${updates.item_name || 'inventory item'}`,
    id,
    table,
    oldData,
    data
  );

  return data;
};

/**
 * Delete inventory item with validation
 * @throws Error if validation fails or item not found
 */
export const deleteInventoryItem = async (
  id: string,
  department: string,
  staffId: string
): Promise<boolean> => {
  // Validation
  if (!id || !id.trim()) {
    throw new Error('Item ID is required');
  }
  if (!staffId || !staffId.trim()) {
    throw new Error('Staff ID is required for activity logging');
  }

  const table = getInventoryTable(department);

  // Fetch old value for logging
  const { data: oldData, error: fetchError } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !oldData) {
    throw new Error(`Item not found: ${id}`);
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[Inventory] Delete error:`, error);
    throw error;
  }

  // Log activity
  await logInventoryActivity(
    staffId,
    department,
    'DELETE',
    `Deleted ${oldData.item_name}`,
    id,
    table,
    oldData,
    null
  );

  return true;
};

/**
 * Log inventory activities to department_activity_logs table
 * NOTE: Logging failures do not block main operations
 * @param staffId - Staff member ID performing the action
 * @param department - Department name
 * @param action - Type of action (CREATE, UPDATE, DELETE, USE, RESTOCK)
 * @param description - Human-readable description of the action
 * @param inventoryItemId - ID of the item affected
 * @param inventoryType - Type of inventory (table name)
 * @param oldValue - Previous state (optional)
 * @param newValue - New state (optional)
 * @returns Activity log entry if successful, null if logging fails
 */
export const logInventoryActivity = async (
  staffId: string,
  department: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'USE' | 'RESTOCK',
  description: string,
  inventoryItemId: string,
  inventoryType: string,
  oldValue?: Record<string, any> | null,
  newValue?: Record<string, any> | null
): Promise<InventoryLog | null> => {
  // Basic validation (non-critical, won't throw)
  if (!staffId?.trim() || !department?.trim() || !inventoryItemId?.trim()) {
    console.warn('[Inventory] Missing required fields for activity log');
    return null;
  }

  const { data, error } = await supabase
    .from('department_activity_logs')
    .insert([
      {
        staff_id: staffId,
        department,
        action,
        description,
        inventory_item_id: inventoryItemId,
        inventory_type: inventoryType,
        old_value: oldValue || null,
        new_value: newValue || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.warn(`[Inventory] Activity log error (non-blocking):`, error);
    // Don't throw - logging failure shouldn't block operations
    return null;
  }

  return data || null;
};

/**
 * Fetch activity logs for a department
 * @param department - Department name
 * @param limit - Maximum number of logs to fetch (default: 50)
 * @returns Array of activity logs, sorted by most recent first
 * @throws Error if fetch fails
 */
export const fetchActivityLogs = async (
  department: string,
  limit: number = 50
): Promise<InventoryLog[]> => {
  if (limit <= 0) {
    throw new Error('Limit must be a positive number');
  }

  const { data, error } = await supabase
    .from('department_activity_logs')
    .select('*')
    .eq('department', department)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`[Inventory] Activity log fetch error:`, error);
    throw new Error(`Failed to fetch activity logs: ${error.message}`);
  }

  return data || [];
};

/**
 * Search inventory items by name or category
 * @param department - Department name
 * @param query - Search query string
 * @returns Array of matching inventory items
 * @throws Error if search fails
 */
export const searchInventoryItems = async (
  department: string,
  query: string
): Promise<InventoryItem[]> => {
  if (!query || !query.trim()) {
    return [];
  }

  const table = getInventoryTable(department);

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('department', department)
    .or(`item_name.ilike.%${query.trim()}%,category.ilike.%${query.trim()}%`);

  if (error) {
    console.error(`[Inventory] Search error:`, error);
    throw new Error(`Search failed: ${error.message}`);
  }

  return data || [];
};

/**
 * Update inventory stock (use/restock) with validation
 * @throws Error if validation fails or operation fails
 */
export const updateInventoryStock = async (
  id: string,
  department: string,
  newQuantity: number,
  action: 'USE' | 'RESTOCK',
  staffId: string,
  reason?: string
): Promise<InventoryItem> => {
  // Validation
  if (!id || !id.trim()) {
    throw new Error('Item ID is required');
  }
  if (!staffId || !staffId.trim()) {
    throw new Error('Staff ID is required for activity logging');
  }
  if (typeof newQuantity !== 'number' || newQuantity < 0) {
    throw new Error('Quantity must be a non-negative number');
  }
  if (!['USE', 'RESTOCK'].includes(action)) {
    throw new Error('Action must be either USE or RESTOCK');
  }

  const table = getInventoryTable(department);

  const { data: oldData, error: fetchError } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !oldData) {
    throw new Error(`Item not found: ${id}`);
  }

  const { data, error } = await supabase
    .from(table)
    .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[Inventory] Stock update error:`, error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update inventory stock');
  }

  // Log activity
  await logInventoryActivity(
    staffId,
    department,
    action,
    reason || `${action === 'USE' ? 'Used' : 'Restocked'} ${data.item_name} (${oldData.quantity} → ${newQuantity})`,
    id,
    table,
    oldData,
    data
  );

  return data;
};
