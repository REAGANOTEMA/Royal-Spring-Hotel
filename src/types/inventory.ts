export interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  category?: string;
  equipment_type?: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryLog {
  id: string;
  staff_id: string;
  department: string;
  action: string;
  description?: string;
  inventory_item_id: string;
  inventory_type: string;
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  created_at: string;
}

export interface InventoryOperationPayload {
  item_name: string;
  quantity: number;
  unit: string;
  category?: string;
  equipment_type?: string;
  department: string;
}

export type InventoryTable = 
  | 'rooms_inventory'
  | 'kitchen_inventory'
  | 'engineering_inventory'
  | 'housekeeping_supplies'
  | 'security_supplies'
  | 'it_supplies';

export const DEPARTMENT_INVENTORY_MAP: Record<string, InventoryTable> = {
  'Rooms Division': 'rooms_inventory',
  'Food & Beverage': 'kitchen_inventory',
  'Engineering': 'engineering_inventory',
  'Housekeeping': 'housekeeping_supplies',
  'Security': 'security_supplies',
  'Information Technology': 'it_supplies',
};
