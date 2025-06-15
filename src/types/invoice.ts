
export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  company: string;
  address: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  contractor: ContactInfo;
  client: ContactInfo;
  lineItems: LineItem[];
  paymentMethod: string;
  notes: string;
  subtotal: number;
  tax: number;
  taxType: 'fixed' | 'percentage';
  taxRate: number;
  total: number;
  currency: string;
  template: string;
  logo?: string;
}

export type TaxType = 'fixed' | 'percentage';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';
export type InvoiceTemplate = 'modern' | 'classic' | 'minimal';
