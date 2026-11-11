import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogoUploadSectionProps {
  onUpload: (file: File | null) => void;
  logoPreview: string | null;
}

const LogoUploadSection: React.FC<LogoUploadSectionProps> = ({ onUpload, logoPreview }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast({ title: 'Invalid logo', description: 'Choose a JPG, PNG, GIF, WebP or AVIF image up to 5 MB.', variant: 'destructive' });
      event.target.value = '';
      return;
    }
    // Only stage the file here. Upload after sign-up has established an authenticated session.
    onUpload(file);
  };
  return (
    <div className="space-y-2">
      <Label htmlFor="organization-logo" className="text-sm font-medium text-gray-700">Organization Logo (Optional)</Label>
      <input ref={inputRef} id="organization-logo" type="file" accept={allowedTypes.join(',')} onChange={handleFile} className="hidden" />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" /> Choose Logo
      </Button>
      {logoPreview && <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-cover border rounded-md" />}
      <p className="text-xs text-gray-500">Maximum 5 MB. The logo is uploaded securely after account creation. If email confirmation is required, upload it after signing in.</p>
    </div>
  );
};

export default LogoUploadSection;
