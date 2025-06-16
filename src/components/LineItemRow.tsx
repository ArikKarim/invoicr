
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Trash2 } from 'lucide-react';
import { LineItem } from '@/types/invoice';
import { formatCurrency } from '@/utils/invoiceUtils';

interface LineItemRowProps {
  item: LineItem;
  index: number;
  onUpdate: (index: number, field: keyof LineItem, value: string | number) => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  canRemove: boolean;
}

const LineItemRow = ({ 
  item, 
  index, 
  onUpdate, 
  onRemove, 
  onDuplicate, 
  canRemove 
}: LineItemRowProps) => {
  const calculateLineTotal = (item: LineItem) => item.quantity * item.rate;

  return (
    <div className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
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
        <div className="min-h-[2.5rem] px-3 py-2 bg-gray-100 border rounded-md flex items-center font-medium text-sm break-all">
          {formatCurrency(calculateLineTotal(item))}
        </div>
      </div>
      <div className="col-span-12 md:col-span-1 flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDuplicate(index)}
          className="h-8 w-8 text-blue-600 hover:text-blue-700"
          title="Duplicate item"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="h-8 w-8 text-red-600 hover:text-red-700 disabled:text-gray-400"
          title="Remove item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default LineItemRow;
