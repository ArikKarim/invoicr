import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceData, LineItem, ContactInfo } from '@/types/invoice';
import { useInvoiceCalculations } from '@/hooks/useInvoiceCalculations';
import { duplicateLineItem } from '@/utils/invoiceUtils';
import ContactInfoForm from './ContactInfoForm';
import LineItemsForm from './LineItemsForm';
import InvoiceDetailsForm from './InvoiceDetailsForm';
import TaxTotalsForm from './TaxTotalsForm';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
}

const InvoiceForm = ({ invoiceData, setInvoiceData }: InvoiceFormProps) => {
  const { subtotal, total, taxAmount } = useInvoiceCalculations(invoiceData);

  const updateField = (section: string, field: string, value: string | number) => {
    if (section === 'root') {
      setInvoiceData({ ...invoiceData, [field]: value });
    } else if (section === 'contractor' || section === 'client') {
      const contactInfo = invoiceData[section] as ContactInfo;
      setInvoiceData({
        ...invoiceData,
        [section]: { ...contactInfo, [field]: value }
      });
    }
  };

  const updateContactInfo = (section: 'contractor' | 'client', field: string, value: string) => {
    updateField(section, field, value);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...invoiceData.lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    setInvoiceData({
      ...invoiceData,
      lineItems: updatedItems,
      subtotal,
      total
    });
  };

  const addLineItem = () => {
    setInvoiceData({
      ...invoiceData,
      lineItems: [...invoiceData.lineItems, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const removeLineItem = (index: number) => {
    if (invoiceData.lineItems.length > 1) {
      const updatedItems = invoiceData.lineItems.filter((_, i) => i !== index);
      setInvoiceData({
        ...invoiceData,
        lineItems: updatedItems,
        subtotal,
        total
      });
    }
  };

  const duplicateLineItemHandler = (index: number) => {
    const itemToDuplicate = invoiceData.lineItems[index];
    const duplicatedItem = duplicateLineItem(itemToDuplicate);
    const updatedItems = [...invoiceData.lineItems];
    updatedItems.splice(index + 1, 0, duplicatedItem);
    
    setInvoiceData({
      ...invoiceData,
      lineItems: updatedItems,
      subtotal,
      total
    });
  };

  const updateTax = (value: string) => {
    const tax = parseFloat(value) || 0;
    setInvoiceData({ ...invoiceData, tax, total });
  };

  const updateTaxType = (taxType: 'fixed' | 'percentage') => {
    setInvoiceData({ ...invoiceData, taxType, total });
  };

  const updateTaxRate = (value: string) => {
    const taxRate = parseFloat(value) || 0;
    setInvoiceData({ ...invoiceData, taxRate, total });
  };

  return (
    <div className="space-y-8">
      {/* Invoice Details */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-primary">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <InvoiceDetailsForm
            invoiceNumber={invoiceData.invoiceNumber}
            issueDate={invoiceData.issueDate}
            dueDate={invoiceData.dueDate}
            onUpdate={(field, value) => updateField('root', field, value)}
          />
        </CardContent>
      </Card>

      {/* Contractor Info */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-blue-900">Your Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ContactInfoForm
            contactInfo={invoiceData.contractor}
            onUpdate={(field, value) => updateContactInfo('contractor', field, value)}
            title="Your Information"
            type="contractor"
          />
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
          <CardTitle className="text-green-900">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ContactInfoForm
            contactInfo={invoiceData.client}
            onUpdate={(field, value) => updateContactInfo('client', field, value)}
            title="Client Information"
            type="client"
          />
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardTitle className="text-purple-900">Services/Items</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <LineItemsForm
            lineItems={invoiceData.lineItems}
            onUpdate={updateLineItem}
            onAdd={addLineItem}
            onRemove={removeLineItem}
            onDuplicate={duplicateLineItemHandler}
          />
          
          <TaxTotalsForm
            tax={invoiceData.tax}
            taxType={invoiceData.taxType}
            taxRate={invoiceData.taxRate}
            subtotal={subtotal}
            total={total}
            taxAmount={taxAmount}
            onTaxUpdate={updateTax}
            onTaxTypeUpdate={updateTaxType}
            onTaxRateUpdate={updateTaxRate}
          />
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardTitle className="text-orange-900">Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select 
              value={invoiceData.paymentMethod} 
              onValueChange={(value) => updateField('root', 'paymentMethod', value)}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="venmo">Venmo</SelectItem>
                <SelectItem value="zelle">Zelle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={invoiceData.notes}
              onChange={(e) => updateField('root', 'notes', e.target.value)}
              placeholder="Payment terms, additional notes, or instructions..."
              rows={4}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
