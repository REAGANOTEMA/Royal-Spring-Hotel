"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, History, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  fetchInventory, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  searchInventoryItems,
  fetchActivityLogs,
  updateInventoryStock
} from '@/lib/inventoryService';
import { InventoryItem, InventoryLog } from '@/types/inventory';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface InventoryManagerProps {
  department: string;
  staffId: string;
  staffLevel?: 'director' | 'manager' | 'supervisor' | 'staff';
  title?: string;
  icon?: React.ReactNode;
  categories?: string[];
  units?: string[];
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  department,
  staffId,
  staffLevel = 'staff',
  title = 'Inventory Manager',
  icon,
  categories = ['General'],
  units = ['pcs', 'kg', 'L', 'box', 'pack'],
}) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: units[0],
    category: categories[0],
    equipment_type: '',
  });

  const [stockAction, setStockAction] = useState({
    action: 'USE' as 'USE' | 'RESTOCK',
    quantity: '',
    reason: '',
  });

  // Fetch inventory on mount
  useEffect(() => {
    loadData();
  }, [department]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invData, logData] = await Promise.all([
        fetchInventory(department),
        fetchActivityLogs(department, 20),
      ]);
      setItems(invData);
      setLogs(logData);
    } catch (err) {
      showError('Failed to load inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await searchInventoryItems(department, query);
        setItems(results);
      } catch (err) {
        showError('Search failed');
      }
    } else {
      loadData();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_name.trim()) {
      showError('Item name is required');
      return;
    }

    try {
      await addInventoryItem(
        {
          item_name: formData.item_name,
          quantity: formData.quantity ? parseInt(formData.quantity) : 0,
          unit: formData.unit,
          category: formData.category,
          equipment_type: formData.equipment_type,
          department,
        },
        staffId
      );

      showSuccess(`${formData.item_name} added successfully`);
      setIsAddModalOpen(false);
      setFormData({
        item_name: '',
        quantity: '',
        unit: units[0],
        category: categories[0],
        equipment_type: '',
      });
      loadData();;
    } catch (err) {
      showError(`Failed to add item: ${err}`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await updateInventoryItem(
        selectedItem.id,
        department,
        {
          item_name: formData.item_name,
          category: formData.category,
          equipment_type: formData.equipment_type,
          unit: formData.unit,
        },
        staffId
      );

      showSuccess('Item updated successfully');
      setIsEditModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      showError(`Failed to update item: ${err}`);
    }
  };

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm(`Delete ${item.item_name}?`)) return;

    try {
      await deleteInventoryItem(item.id, department, staffId);
      showSuccess('Item deleted successfully');
      loadData();
    } catch (err) {
      showError(`Failed to delete item: ${err}`);
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !stockAction.quantity) return;

    try {
      const currentQty = (selectedItem.quantity || 0);
      let newQty = currentQty;

      if (stockAction.action === 'USE') {
        newQty = currentQty - parseInt(stockAction.quantity);
        if (newQty < 0) {
          showError('Cannot use more than available stock');
          return;
        }
      } else {
        newQty = currentQty + parseInt(stockAction.quantity);
      }

      await updateInventoryStock(
        selectedItem.id,
        department,
        newQty,
        stockAction.action,
        staffId,
        stockAction.reason
      );

      showSuccess(`Stock ${stockAction.action === 'USE' ? 'used' : 'restocked'}`);
      setIsLogModalOpen(false);
      setStockAction({ action: 'USE', quantity: '', reason: '' });
      loadData();
    } catch (err) {
      showError(`Failed to update stock: ${err}`);
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name,
      quantity: String(item.quantity || 0),
      unit: item.unit,
      category: item.category || categories[0],
      equipment_type: item.equipment_type || '',
    });
    setIsEditModalOpen(true);
  };

  const openStockModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setStockAction({ action: 'USE', quantity: '', reason: '' });
    setIsLogModalOpen(true);
  };

  const canEdit = ['director', 'manager'].includes(staffLevel);
  const currentQty = selectedItem ? (selectedItem.quantity || 0) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Search & Add Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{icon}</div>}
              <div>
                <CardTitle>{title}</CardTitle>
                <p className="text-xs text-slate-500 mt-1">{department} Department</p>
              </div>
            </div>
            {canEdit && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Item
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-slate-500 py-8">Loading inventory...</p>
          ) : items.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No inventory items. {canEdit && 'Click "Add Item" to get started.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    {categories.length > 0 && <TableHead>Category</TableHead>}
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Last Updated</TableHead>
                    {canEdit && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{item.item_name}</TableCell>
                      {categories.length > 0 && (
                        <TableCell>
                          <Badge variant="secondary">{item.category || '-'}</Badge>
                        </TableCell>
                      )}
                      <TableCell className="text-right font-semibold">
                        {item.quantity ?? 0}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStockModal(item)}
                            className="gap-1"
                          >
                            <History size={14} />
                            Stock
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(item)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        log.action === 'CREATE' ? 'default' :
                        log.action === 'DELETE' ? 'destructive' :
                        'secondary'
                      }>
                        {log.action}
                      </Badge>
                      <span className="font-medium text-sm">{log.description}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{log.inventory_type}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ADD ITEM MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <Label htmlFor="item_name">Item Name *</Label>
              <Input
                id="item_name"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                placeholder="e.g., Rice, Cleaning Supplies"
                required
              />
            </div>

            {categories.length > 0 && (
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT ITEM MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit_item_name">Item Name</Label>
              <Input
                id="edit_item_name"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              />
            </div>

            {categories.length > 0 && (
              <div>
                <Label htmlFor="edit_category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger id="edit_category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="edit_unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                <SelectTrigger id="edit_unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* STOCK ACTION MODAL */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.item_name} - Stock Update</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Current Stock:</span>
              <span className="text-2xl font-bold text-blue-600">{currentQty}</span>
            </div>
          </div>

          <form onSubmit={handleStockUpdate} className="space-y-4">
            <div>
              <Label htmlFor="stock_action">Action</Label>
              <Select value={stockAction.action} onValueChange={(v: any) => setStockAction({ ...stockAction, action: v })}>
                <SelectTrigger id="stock_action">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USE">Use/Remove</SelectItem>
                  <SelectItem value="RESTOCK">Restock/Add</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stock_qty">Quantity</Label>
              <Input
                id="stock_qty"
                type="number"
                value={stockAction.quantity}
                onChange={(e) => setStockAction({ ...stockAction, quantity: e.target.value })}
                placeholder="0"
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                value={stockAction.reason}
                onChange={(e) => setStockAction({ ...stockAction, reason: e.target.value })}
                placeholder="Why is this being updated?"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update Stock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManager;
