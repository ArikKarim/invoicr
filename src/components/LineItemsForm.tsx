
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Copy } from 'lucide-react';
import { LineItem } from '@/types/invoice';
import { formatCurrency, duplicateLineItem } from '@/utils/invoiceUtils';

interface LineItemsFormProps {
  lineItems: LineItem[];
  onUpdate: (index: number, field: keyof LineItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
}

const LineItemsForm = ({ 
  lineItems, 
  onUpdate, 
  onAdd, 
  onRemove, 
  onDuplicate
}: LineItemsFormProps) => {
  const calculateLineTotal = (item: LineItem) => item.quantity * item.rate;

  return (
    <div className="space-y-4">
      {lineItems.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <div className="col-span-12 md:col-span-5">
            <Label htmlFor={`description-${index}`}>Description</Label>
            <Input
              id={`description-${index}`}
              value={item.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
              placeholder="Web development services"
              className="bg-white"
            />
          </div>
          <div className="col-span-4 md:col-span-2">
            <Label htmlFor={`quantity-${index}`}>Quantity</Label>
            <Input
              id={`quantity-${index}`}
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onUpdate(index, 'quantity', parseInt(e.target.value) || 1)}
              className="bg-white"
            />
          </div>
          <div className="col-span-4 md:col-span-2">
            <Label htmlFor={`rate-${index}`}>Rate (USD)</Label>
            <Input
              id={`rate-${index}`}
              type="number"
              min="0"
              step="0.01"
              value={item.rate}
              onChange={(e) => onUpdate(index, 'rate', parseFloat(e.target.value) || 0)}
              className="bg-white"
            />
          </div>
          <div className="col-span-4 md:col-span-2">
            <Label>Total</Label>
            <div className="h-10 px-3 py-2 bg-gray-100 border rounded-md flex items-center font-medium">
              {formatCurrency(calculateLineTotal(item))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-1 flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onDuplicate(index)}
              className="text-blue-600 hover:text-blue-700"
              title="Duplicate item"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={lineItems.length === 1}
              className="text-red-600 hover:text-red-700"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full border-dashed border-2 h-12 hover:bg-primary/5"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

export default LineItemsForm;
