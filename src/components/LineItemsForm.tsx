
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { LineItem } from '@/types/invoice';
import LineItemRow from './LineItemRow';
import { useRef } from 'react';
import { toast } from '@/components/ui/sonner';

interface LineItemsFormProps {
  lineItems: LineItem[];
  onUpdate: (index: number, field: keyof LineItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  onBulkImport: (items: LineItem[]) => void;
}

const LineItemsForm = ({ 
  lineItems, 
  onUpdate, 
  onAdd, 
  onRemove, 
  onDuplicate,
  onBulkImport
}: LineItemsFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is CSV or Excel
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          toast.error('File must contain at least a header row and one data row');
          return;
        }

        // Parse CSV
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
        const requiredColumns = ['description', 'quantity', 'rate'];
        
        // Find column indices
        const descIndex = headers.findIndex(h => h.includes('description'));
        const quantityIndex = headers.findIndex(h => h.includes('quantity') || h.includes('qty'));
        const rateIndex = headers.findIndex(h => h.includes('rate') || h.includes('price') || h.includes('cost'));

        if (descIndex === -1 || quantityIndex === -1 || rateIndex === -1) {
          toast.error('File must contain Description, Quantity, and Rate columns');
          return;
        }

        const newItems: LineItem[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
          
          if (values.length >= Math.max(descIndex, quantityIndex, rateIndex) + 1) {
            const description = values[descIndex] || '';
            const quantity = parseInt(values[quantityIndex]) || 1;
            const rate = parseFloat(values[rateIndex]) || 0;
            
            if (description) {
              newItems.push({ description, quantity, rate });
            }
          }
        }

        if (newItems.length > 0) {
          onBulkImport(newItems);
          toast.success(`Successfully imported ${newItems.length} items`);
        } else {
          toast.error('No valid items found in the file');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error('Error parsing file. Please check the format.');
      }
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

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
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="flex-1 border-dashed border-2 h-12 hover:bg-primary/5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileUpload}
          className="h-12 px-4 border-dashed border-2 hover:bg-blue-50"
          title="Upload spreadsheet (CSV or Excel)"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default LineItemsForm;
