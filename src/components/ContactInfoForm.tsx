
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContactInfo } from '@/types/invoice';

interface ContactInfoFormProps {
  contactInfo: ContactInfo;
  onUpdate: (field: string, value: string) => void;
  title: string;
  type: 'contractor' | 'client';
}

const ContactInfoForm = ({ contactInfo, onUpdate, title, type }: ContactInfoFormProps) => {
  const getPlaceholders = () => {
    if (type === 'contractor') {
      return {
        name: 'John Doe',
        company: 'Your Company LLC',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St, City, State 12345'
      };
    } else {
      return {
        name: 'Jane Smith',
        company: 'Client Company Inc',
        email: 'jane@client.com',
        phone: '(555) 987-6543',
        address: '456 Business Ave, City, State 54321'
      };
    }
  };

  const placeholders = getPlaceholders();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${type}Name`}>
            {type === 'contractor' ? 'Full Name' : 'Contact Name'}
          </Label>
          <Input
            id={`${type}Name`}
            value={contactInfo.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder={placeholders.name}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <Label htmlFor={`${type}Company`}>Company Name</Label>
          <Input
            id={`${type}Company`}
            value={contactInfo.company}
            onChange={(e) => onUpdate('company', e.target.value)}
            placeholder={placeholders.company}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <Label htmlFor={`${type}Email`}>Email</Label>
          <Input
            id={`${type}Email`}
            type="email"
            value={contactInfo.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            placeholder={placeholders.email}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {type === 'contractor' && (
          <div>
            <Label htmlFor={`${type}Phone`}>Phone</Label>
            <Input
              id={`${type}Phone`}
              value={contactInfo.phone || ''}
              onChange={(e) => onUpdate('phone', e.target.value)}
              placeholder={placeholders.phone}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}
      </div>
      <div>
        <Label htmlFor={`${type}Address`}>Address</Label>
        <Textarea
          id={`${type}Address`}
          value={contactInfo.address}
          onChange={(e) => onUpdate('address', e.target.value)}
          placeholder={placeholders.address}
          rows={3}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
