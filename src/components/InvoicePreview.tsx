
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceData } from '@/types/invoice';
import { calculateLineTotal, downloadInvoiceAsPDF, formatCurrency } from '@/utils/invoiceUtils';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

const InvoicePreview = ({ invoiceData }: InvoicePreviewProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await downloadInvoiceAsPDF(invoiceData);
      toast.success("PDF generated successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getTemplateStyles = () => {
    switch (invoiceData.template) {
      case 'classic':
        return {
          headerBg: 'bg-gray-800 text-white',
          accent: 'text-gray-800',
          border: 'border-gray-300'
        };
      case 'minimal':
        return {
          headerBg: 'bg-white border-b-2 border-gray-900',
          accent: 'text-gray-900',
          border: 'border-gray-200'
        };
      default: // modern
        return {
          headerBg: 'bg-gradient-to-r from-primary to-blue-600 text-white',
          accent: 'text-primary',
          border: 'border-primary/20'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Invoice Preview</h3>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
        >
          {isGeneratingPDF ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>

      <Card className="overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div id="invoice-preview" className="bg-white p-8 text-sm">
            {/* Header */}
            <div className={`${styles.headerBg} -m-8 mb-6 p-8`}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                  <p className="opacity-90">#{invoiceData.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {invoiceData.contractor.company || invoiceData.contractor.name}
                  </div>
                  {invoiceData.contractor.name && invoiceData.contractor.company && (
                    <div className="opacity-80">{invoiceData.contractor.name}</div>
                  )}
                  {invoiceData.contractor.email && (
                    <div className="opacity-80">{invoiceData.contractor.email}</div>
                  )}
                  {invoiceData.contractor.phone && (
                    <div className="opacity-80">{invoiceData.contractor.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Dates and Client Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className={`font-semibold ${styles.accent} mb-3`}>Bill To:</h3>
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
                  <div className="flex justify-between">
                    <span className="font-medium">Currency:</span>
                    <span>{invoiceData.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className={`border-b-2 ${styles.border}`}>
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
                      <td className="text-right py-3">{formatCurrency(item.rate, invoiceData.currency)}</td>
                      <td className="text-right py-3 font-medium">{formatCurrency(calculateLineTotal(item), invoiceData.currency)}</td>
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
                    <span>{formatCurrency(invoiceData.subtotal, invoiceData.currency)}</span>
                  </div>
                  {(invoiceData.tax > 0 || invoiceData.taxRate > 0) && (
                    <div className="flex justify-between">
                      <span>
                        Tax {invoiceData.taxType === 'percentage' ? `(${invoiceData.taxRate}%)` : ''}:
                      </span>
                      <span>
                        {invoiceData.taxType === 'percentage' 
                          ? formatCurrency((invoiceData.subtotal * invoiceData.taxRate) / 100, invoiceData.currency)
                          : formatCurrency(invoiceData.tax, invoiceData.currency)
                        }
                      </span>
                    </div>
                  )}
                  <div className={`border-t pt-2 flex justify-between font-bold text-lg ${styles.accent}`}>
                    <span>Total:</span>
                    <span>{formatCurrency(invoiceData.total, invoiceData.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contractor Address */}
            {invoiceData.contractor.address && (
              <div className="mb-6">
                <h4 className={`font-semibold ${styles.accent} mb-2`}>From:</h4>
                <div className="text-gray-600 whitespace-pre-line">{invoiceData.contractor.address}</div>
              </div>
            )}

            {/* Notes */}
            {invoiceData.notes && (
              <div className="border-t pt-6">
                <h4 className={`font-semibold ${styles.accent} mb-2`}>Notes:</h4>
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
