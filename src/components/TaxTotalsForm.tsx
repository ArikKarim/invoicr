
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/utils/invoiceUtils';
import { useState } from 'react';

interface TaxTotalsFormProps {
  tax: number;
  taxType: 'fixed' | 'percentage';
  taxRate: number;
  subtotal: number;
  total: number;
  taxAmount: number;
  onTaxUpdate: (value: string) => void;
  onTaxTypeUpdate: (type: 'fixed' | 'percentage') => void;
  onTaxRateUpdate: (rate: string) => void;
}

const TaxTotalsForm = ({ 
  tax, 
  taxType, 
  taxRate, 
  subtotal, 
  total, 
  taxAmount,
  onTaxUpdate, 
  onTaxTypeUpdate, 
  onTaxRateUpdate 
}: TaxTotalsFormProps) => {
  const [showTax, setShowTax] = useState(false);

  return (
    <div className="border-t pt-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Collapsible open={showTax} onOpenChange={setShowTax}>
            <CollapsibleTrigger className="flex items-center gap-2 text-left font-medium text-gray-700 hover:text-gray-900 transition-colors">
              {showTax ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Add Tax Information
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              <div>
                <Label htmlFor="taxType">Tax Type</Label>
                <Select value={taxType} onValueChange={onTaxTypeUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {taxType === 'fixed' ? (
                <div>
                  <Label htmlFor="tax">Tax Amount (USD)</Label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={tax}
                    onChange={(e) => onTaxUpdate(e.target.value)}
                    placeholder="0.00"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => onTaxRateUpdate(e.target.value)}
                    placeholder="0.00"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {showTax && taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Tax {taxType === 'percentage' ? `(${taxRate}%)` : ''}:
                </span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(showTax ? total : subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxTotalsForm;
