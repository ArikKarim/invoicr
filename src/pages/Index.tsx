
import { useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import { InvoiceData } from '@/types/invoice';
import { generateInvoiceNumber } from '@/utils/invoiceUtils';

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
    total: 0
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contractor Invoice Builder</h1>
          <p className="text-gray-600">Create professional invoices in minutes</p>
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
