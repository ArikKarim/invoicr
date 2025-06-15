
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceData, LineItem } from '@/types/invoice';
import { calculateSubtotal, calculateTotal } from '@/utils/invoiceUtils';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
}

const InvoiceForm = ({ invoiceData, setInvoiceData }: InvoiceFormProps) => {
  const updateField = (section: string, field: string, value: string | number) => {
    if (section === 'root') {
      setInvoiceData({ ...invoiceData, [field]: value });
    } else {
      setInvoiceData({
        ...invoiceData,
        [section]: { ...invoiceData[section as keyof InvoiceData], [field]: value }
      });
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...invoiceData.lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    const subtotal = calculateSubtotal(updatedItems);
    const total = calculateTotal(subtotal, invoiceData.tax);
    
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
      const subtotal = calculateSubtotal(updatedItems);
      const total = calculateTotal(subtotal, invoiceData.tax);
      
      setInvoiceData({
        ...invoiceData,
        lineItems: updatedItems,
        subtotal,
        total
      });
    }
  };

  const updateTax = (value: string) => {
    const tax = parseFloat(value) || 0;
    const total = calculateTotal(invoiceData.subtotal, tax);
    setInvoiceData({ ...invoiceData, tax, total });
  };

  return (
    <div className="space-y-6">
      {/* Invoice Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) => updateField('root', 'invoiceNumber', e.target.value)}
                className="bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={invoiceData.issueDate}
                onChange={(e) => updateField('root', 'issueDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => updateField('root', 'dueDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contractor Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractorName">Full Name</Label>
              <Input
                id="contractorName"
                value={invoiceData.contractor.name}
                onChange={(e) => updateField('contractor', 'name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="contractorCompany">Company Name</Label>
              <Input
                id="contractorCompany"
                value={invoiceData.contractor.company}
                onChange={(e) => updateField('contractor', 'company', e.target.value)}
                placeholder="Your Company LLC"
              />
            </div>
            <div>
              <Label htmlFor="contractorEmail">Email</Label>
              <Input
                id="contractorEmail"
                type="email"
                value={invoiceData.contractor.email}
                onChange={(e) => updateField('contractor', 'email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="contractorPhone">Phone</Label>
              <Input
                id="contractorPhone"
                value={invoiceData.contractor.phone || ''}
                onChange={(e) => updateField('contractor', 'phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contractorAddress">Address</Label>
            <Textarea
              id="contractorAddress"
              value={invoiceData.contractor.address}
              onChange={(e) => updateField('contractor', 'address', e.target.value)}
              placeholder="123 Main St, City, State 12345"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Contact Name</Label>
              <Input
                id="clientName"
                value={invoiceData.client.name}
                onChange={(e) => updateField('client', 'name', e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <Label htmlFor="clientCompany">Company Name</Label>
              <Input
                id="clientCompany"
                value={invoiceData.client.company}
                onChange={(e) => updateField('client', 'company', e.target.value)}
                placeholder="Client Company Inc"
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={invoiceData.client.email}
                onChange={(e) => updateField('client', 'email', e.target.value)}
                placeholder="jane@client.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clientAddress">Address</Label>
            <Textarea
              id="clientAddress"
              value={invoiceData.client.address}
              onChange={(e) => updateField('client', 'address', e.target.value)}
              placeholder="456 Business Ave, City, State 54321"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Services/Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoiceData.lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-12 md:col-span-6">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Input
                  id={`description-${index}`}
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  placeholder="Web development services"
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <Label htmlFor={`rate-${index}`}>Rate ($)</Label>
                <Input
                  id={`rate-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-12 md:col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeLineItem(index)}
                  disabled={invoiceData.lineItems.length === 1}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addLineItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tax">Tax Amount ($)</Label>
                <Input
                  id="tax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoiceData.tax}
                  onChange={(e) => updateTax(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select onValueChange={(value) => updateField('root', 'paymentMethod', value)}>
              <SelectTrigger>
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
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
