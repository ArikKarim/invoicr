
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Palette } from 'lucide-react';

interface ColorControllerProps {
  buttonColor: string;
  invoiceBackgroundColor: string;
  onButtonColorChange: (color: string) => void;
  onInvoiceBackgroundColorChange: (color: string) => void;
}

const ColorController = ({
  buttonColor,
  invoiceBackgroundColor,
  onButtonColorChange,
  onInvoiceBackgroundColorChange
}: ColorControllerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    { name: 'Primary Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Gray', value: '#6b7280' }
  ];

  const backgroundColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f9fafb' },
    { name: 'Light Blue', value: '#eff6ff' },
    { name: 'Light Green', value: '#f0fdf4' },
    { name: 'Light Purple', value: '#faf5ff' },
    { name: 'Light Pink', value: '#fdf2f8' }
  ];

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center gap-2 text-lg">
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <Palette className="h-5 w-5" />
              Color Customization
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Button Color */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Download Button Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {presetColors.map((color) => (
                  <Button
                    key={color.value}
                    variant="outline"
                    size="sm"
                    className="h-10 p-2 border-2"
                    style={{ 
                      backgroundColor: buttonColor === color.value ? color.value : 'transparent',
                      borderColor: buttonColor === color.value ? color.value : '#e5e7eb',
                      color: buttonColor === color.value ? 'white' : 'inherit'
                    }}
                    onClick={() => onButtonColorChange(color.value)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.value }}
                    />
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => onButtonColorChange(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Custom color</span>
              </div>
            </div>

            {/* Invoice Background Color */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Invoice Background Color</Label>
              <div className="grid grid-cols-3 gap-2">
                {backgroundColors.map((color) => (
                  <Button
                    key={color.value}
                    variant="outline"
                    size="sm"
                    className="h-10 p-2 border-2 justify-start"
                    style={{ 
                      backgroundColor: invoiceBackgroundColor === color.value ? color.value : 'transparent',
                      borderColor: invoiceBackgroundColor === color.value ? '#2563eb' : '#e5e7eb'
                    }}
                    onClick={() => onInvoiceBackgroundColorChange(color.value)}
                  >
                    <div 
                      className="w-4 h-4 rounded border border-gray-300 mr-2"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={invoiceBackgroundColor}
                  onChange={(e) => onInvoiceBackgroundColorChange(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Custom background color</span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ColorController;
