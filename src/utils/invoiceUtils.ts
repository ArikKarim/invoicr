
import html2pdf from 'html2pdf.js';
import { InvoiceData, LineItem } from '@/types/invoice';

export const generateInvoiceNumber = (pattern: string = 'default'): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  switch (pattern) {
    case 'monthly':
      return `INV-${year}${month}-${random}`;
    case 'yearly':
      return `INV-${year}-${random}`;
    case 'simple':
      return `${random}`;
    default:
      return `INV-${year}${month}-${random}`;
  }
};

export const calculateLineTotal = (item: LineItem): number => {
  return item.quantity * item.rate;
};

export const calculateSubtotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((sum, item) => sum + calculateLineTotal(item), 0);
};

export const calculateTotal = (subtotal: number, tax: number): number => {
  return subtotal + tax;
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  const currencyMap = {
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    CAD: { locale: 'en-CA', currency: 'CAD' }
  };

  const config = currencyMap[currency as keyof typeof currencyMap] || currencyMap.USD;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency
  }).format(amount);
};

export const getDateHelpers = () => {
  const today = new Date();
  
  return {
    net15: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    net30: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    net60: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
};

export const downloadInvoiceAsPDF = (invoiceData: InvoiceData) => {
  const element = document.getElementById('invoice-preview');
  if (!element) return;

  const opt = {
    margin: 0.5,
    filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};

export const duplicateLineItem = (item: LineItem): LineItem => {
  return { ...item };
};
