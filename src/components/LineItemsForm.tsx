
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LineItem } from '@/types/invoice';
import LineItemRow from './LineItemRow';

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
  return (
    <div className="space-y-4">
      {lineItems.map((item, index) => (
        <LineItemRow
          key={index}
          item={item}
          index={index}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          canRemove={lineItems.length > 1}
        />
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
