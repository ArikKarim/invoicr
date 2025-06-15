
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDateHelpers } from '@/utils/invoiceUtils';

interface InvoiceDetailsFormProps {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  template: string;
  onUpdate: (field: string, value: string) => void;
}

const InvoiceDetailsForm = ({ 
  invoiceNumber, 
  issueDate, 
  dueDate, 
  currency,
  template,
  onUpdate 
}: InvoiceDetailsFormProps) => {
  const dateHelpers = getDateHelpers();

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
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onUpdate('dueDate', dateHelpers.net15)}
                className="text-xs"
              >
                Net 15
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onUpdate('dueDate', dateHelpers.net30)}
                className="text-xs"
              >
                Net 30
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onUpdate('dueDate', dateHelpers.net60)}
                className="text-xs"
              >
                Net 60
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={(value) => onUpdate('currency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="template">Template</Label>
          <Select value={template} onValueChange={(value) => onUpdate('template', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
