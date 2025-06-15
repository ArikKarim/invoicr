
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import { InvoiceData } from '@/types/invoice';
import { generateInvoiceNumber } from '@/utils/invoiceUtils';
import { useAutoSave } from '@/hooks/useAutoSave';

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    contractor: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: ''
    },
    client: {
      name: '',
      email: '',
      company: '',
      address: ''
    },
    lineItems: [
      { description: '', quantity: 1, rate: 0 }
    ],
    paymentMethod: '',
    notes: '',
    subtotal: 0,
    tax: 0,
    taxType: 'fixed',
    taxRate: 0,
    total: 0
  });

  const { loadSavedData, clearSavedData } = useAutoSave(invoiceData);

  useEffect(() => {
    const savedData = loadSavedData();
    if (savedData) {
      setInvoiceData(savedData);
      toast.success("Loaded saved invoice data");
    }
  }, []);

  const handleClearData = () => {
    setInvoiceData({
      invoiceNumber: generateInvoiceNumber(),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      contractor: {
        name: '',
        email: '',
        phone: '',
        company: '',
        address: ''
      },
      client: {
        name: '',
        email: '',
        company: '',
        address: ''
      },
      lineItems: [
        { description: '', quantity: 1, rate: 0 }
      ],
      paymentMethod: '',
      notes: '',
      subtotal: 0,
      tax: 0,
      taxType: 'fixed',
      taxRate: 0,
      total: 0
    });
    clearSavedData();
    toast.success("Invoice data cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-3">
            Invoicr
          </h1>
          <p className="text-gray-600 text-lg">Make a statement with Invoicr.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleClearData}
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
            >
              Clear All Data
            </Button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InvoiceForm 
              invoiceData={invoiceData} 
              setInvoiceData={setInvoiceData} 
            />
          </div>
          
          <div className="lg:sticky lg:top-8 h-fit">
            <InvoicePreview invoiceData={invoiceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
