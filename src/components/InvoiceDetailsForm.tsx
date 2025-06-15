
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDateHelpers } from '@/utils/invoiceUtils';

interface InvoiceDetailsFormProps {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  onUpdate: (field: string, value: string) => void;
}

const InvoiceDetailsForm = ({ 
  invoiceNumber, 
  issueDate, 
  dueDate, 
  onUpdate 
}: InvoiceDetailsFormProps) => {
  const dateHelpers = getDateHelpers(issueDate);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => onUpdate('invoiceNumber', e.target.value)}
            className="bg-gray-50 font-mono"
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={issueDate}
            onChange={(e) => onUpdate('issueDate', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <div className="space-y-2">
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => onUpdate('dueDate', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <div className="grid grid-cols-3 gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onUpdate('dueDate', dateHelpers.net15)}
                className="text-xs px-2 py-1 h-7"
              >
                Net 15
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onUpdate('dueDate', dateHelpers.net30)}
                className="text-xs px-2 py-1 h-7"
              >
                Net 30
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onUpdate('dueDate', dateHelpers.net60)}
                className="text-xs px-2 py-1 h-7"
              >
                Net 60
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
