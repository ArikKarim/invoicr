
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import ColorController from '@/components/ColorController';
import { InvoiceData } from '@/types/invoice';
import { generateInvoiceNumber } from '@/utils/invoiceUtils';
import { useAutoSave } from '@/hooks/useAutoSave';

const Index = () => {
  const [buttonColor, setButtonColor] = useState('#2563eb');
  const [invoiceBackgroundColor, setInvoiceBackgroundColor] = useState('#ffffff');
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 font-inter">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                Invoicr
              </h1>
              <p className="text-xl text-gray-500 font-normal max-w-md">
                Create professional invoices with ease and style.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={handleClearData}
                className="px-6 py-2.5 text-sm font-medium border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ColorController
              buttonColor={buttonColor}
              invoiceBackgroundColor={invoiceBackgroundColor}
              onButtonColorChange={setButtonColor}
              onInvoiceBackgroundColorChange={setInvoiceBackgroundColor}
            />
            <InvoiceForm 
              invoiceData={invoiceData} 
              setInvoiceData={setInvoiceData} 
            />
          </div>
          
          <div className="lg:sticky lg:top-8 h-fit">
            <InvoicePreview 
              invoiceData={invoiceData}
              buttonColor={buttonColor}
              invoiceBackgroundColor={invoiceBackgroundColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
