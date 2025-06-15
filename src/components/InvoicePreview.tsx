
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { InvoiceData } from '@/types/invoice';
import { calculateLineTotal, downloadInvoiceAsPDF } from '@/utils/invoiceUtils';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

const InvoicePreview = ({ invoiceData }: InvoicePreviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadPDF = () => {
    downloadInvoiceAsPDF(invoiceData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Invoice Preview</h3>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div id="invoice-preview" className="bg-white p-8 text-sm">
            {/* Header */}
            <div className="border-b-2 border-gray-200 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                  <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {invoiceData.contractor.company || invoiceData.contractor.name}
                  </div>
                  {invoiceData.contractor.name && invoiceData.contractor.company && (
                    <div className="text-gray-600">{invoiceData.contractor.name}</div>
                  )}
                  {invoiceData.contractor.email && (
                    <div className="text-gray-600">{invoiceData.contractor.email}</div>
                  )}
                  {invoiceData.contractor.phone && (
                    <div className="text-gray-600">{invoiceData.contractor.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Dates and Client Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="space-y-1">
                  <div className="font-medium">{invoiceData.client.company || invoiceData.client.name}</div>
                  {invoiceData.client.name && invoiceData.client.company && (
                    <div className="text-gray-600">{invoiceData.client.name}</div>
                  )}
                  {invoiceData.client.email && (
                    <div className="text-gray-600">{invoiceData.client.email}</div>
                  )}
                  {invoiceData.client.address && (
                    <div className="text-gray-600 whitespace-pre-line">{invoiceData.client.address}</div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Issue Date:</span>
                    <span>{formatDate(invoiceData.issueDate)}</span>
                  </div>
                  {invoiceData.dueDate && (
                    <div className="flex justify-between">
                      <span className="font-medium">Due Date:</span>
                      <span>{formatDate(invoiceData.dueDate)}</span>
                    </div>
                  )}
                  {invoiceData.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="font-medium">Payment Method:</span>
                      <span className="capitalize">{invoiceData.paymentMethod.replace('-', ' ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold w-20">Qty</th>
                    <th className="text-right py-3 font-semibold w-24">Rate</th>
                    <th className="text-right py-3 font-semibold w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.lineItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">{item.description || 'Service'}</td>
                      <td className="text-center py-3">{item.quantity}</td>
                      <td className="text-right py-3">{formatCurrency(item.rate)}</td>
                      <td className="text-right py-3 font-medium">{formatCurrency(calculateLineTotal(item))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoiceData.subtotal)}</span>
                  </div>
                  {invoiceData.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatCurrency(invoiceData.tax)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(invoiceData.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contractor Address */}
            {invoiceData.contractor.address && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">From:</h4>
                <div className="text-gray-600 whitespace-pre-line">{invoiceData.contractor.address}</div>
              </div>
            )}

            {/* Notes */}
            {invoiceData.notes && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                <div className="text-gray-600 whitespace-pre-line">{invoiceData.notes}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePreview;
