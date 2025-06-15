
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceData } from '@/types/invoice';
import { calculateLineTotal, downloadInvoiceAsPDF, formatCurrency } from '@/utils/invoiceUtils';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  buttonColor?: string;
  invoiceBackgroundColor?: string;
}

const InvoicePreview = ({ 
  invoiceData, 
  buttonColor = '#2563eb',
  invoiceBackgroundColor = '#ffffff'
}: InvoicePreviewProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // Parse the date string directly to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    return date.toLocaleDateString('en-US', {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Invoice Preview</h3>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isGeneratingPDF}
          className="flex items-center gap-2"
          style={{ 
            backgroundColor: buttonColor,
            borderColor: buttonColor
          }}
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
          <div 
            id="invoice-preview" 
            className="p-8 text-sm"
            style={{ backgroundColor: invoiceBackgroundColor }}
          >
            {/* Header */}
            <div 
              className="text-white -m-8 mb-6 p-8"
              style={{ 
                background: `linear-gradient(to right, ${buttonColor}, ${buttonColor}dd)`
              }}
            >
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
                <h3 className="font-semibold text-primary mb-3">Bill To:</h3>
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
                  <tr className="border-b-2" style={{ borderColor: `${buttonColor}33` }}>
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
                  {(invoiceData.tax > 0 || invoiceData.taxRate > 0) && (
                    <div className="flex justify-between">
                      <span>
                        Tax {invoiceData.taxType === 'percentage' ? `(${invoiceData.taxRate}%)` : ''}:
                      </span>
                      <span>
                        {invoiceData.taxType === 'percentage' 
                          ? formatCurrency((invoiceData.subtotal * invoiceData.taxRate) / 100)
                          : formatCurrency(invoiceData.tax)
                        }
                      </span>
                    </div>
                  )}
                  <div 
                    className="border-t pt-2 flex justify-between font-bold text-lg"
                    style={{ color: buttonColor }}
                  >
                    <span>Total:</span>
                    <span>{formatCurrency(invoiceData.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contractor Address */}
            {invoiceData.contractor.address && (
              <div className="mb-6">
                <h4 className="font-semibold text-primary mb-2">From:</h4>
                <div className="text-gray-600 whitespace-pre-line">{invoiceData.contractor.address}</div>
              </div>
            )}

            {/* Notes */}
            {invoiceData.notes && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-primary mb-2">Notes:</h4>
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
