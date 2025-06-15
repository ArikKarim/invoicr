
import { useMemo } from 'react';
import { InvoiceData, LineItem } from '@/types/invoice';
import { calculateSubtotal, calculateTotal, calculateLineTotal } from '@/utils/invoiceUtils';

export const useInvoiceCalculations = (invoiceData: InvoiceData) => {
  const subtotal = useMemo(() => calculateSubtotal(invoiceData.lineItems), [invoiceData.lineItems]);
  
  const total = useMemo(() => {
    if (invoiceData.taxType === 'percentage') {
      const taxAmount = (subtotal * invoiceData.taxRate) / 100;
      return calculateTotal(subtotal, taxAmount);
    }
    return calculateTotal(subtotal, invoiceData.tax);
  }, [subtotal, invoiceData.tax, invoiceData.taxType, invoiceData.taxRate]);

  const taxAmount = useMemo(() => {
    if (invoiceData.taxType === 'percentage') {
      return (subtotal * invoiceData.taxRate) / 100;
    }
    return invoiceData.tax;
  }, [subtotal, invoiceData.tax, invoiceData.taxType, invoiceData.taxRate]);

  return { subtotal, total, taxAmount, calculateLineTotal };
};
