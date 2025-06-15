
import { useEffect } from 'react';
import { InvoiceData } from '@/types/invoice';

export const useAutoSave = (invoiceData: InvoiceData) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [invoiceData]);

  const loadSavedData = (): InvoiceData | null => {
    try {
      const saved = localStorage.getItem('invoiceData');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const clearSavedData = () => {
    localStorage.removeItem('invoiceData');
  };

  return { loadSavedData, clearSavedData };
};
