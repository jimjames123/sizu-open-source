
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extended country codes list with more countries
const countryCodes = [
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+27", country: "South Africa" },
  { code: "+20", country: "Egypt" },
  { code: "+212", country: "Morocco" },
  { code: "+213", country: "Algeria" },
  { code: "+216", country: "Tunisia" },
  { code: "+220", country: "Gambia" },
  { code: "+221", country: "Senegal" },
  { code: "+222", country: "Mauritania" },
  { code: "+223", country: "Mali" },
  { code: "+224", country: "Guinea" },
  { code: "+225", country: "Ivory Coast" },
  { code: "+226", country: "Burkina Faso" },
  { code: "+227", country: "Niger" },
  { code: "+228", country: "Togo" },
  { code: "+229", country: "Benin" },
  { code: "+230", country: "Mauritius" },
  { code: "+231", country: "Liberia" },
  { code: "+232", country: "Sierra Leone" },
  { code: "+233", country: "Ghana" },
  { code: "+234", country: "Nigeria" },
  { code: "+235", country: "Chad" },
  { code: "+236", country: "Central African Republic" },
  { code: "+237", country: "Cameroon" },
  { code: "+238", country: "Cape Verde" },
  { code: "+239", country: "São Tomé and Príncipe" },
  { code: "+240", country: "Equatorial Guinea" },
  { code: "+241", country: "Gabon" },
  { code: "+242", country: "Congo" },
  { code: "+243", country: "Democratic Republic of the Congo" },
  { code: "+244", country: "Angola" },
  { code: "+245", country: "Guinea-Bissau" },
  { code: "+246", country: "British Indian Ocean Territory" },
  { code: "+248", country: "Seychelles" },
  { code: "+249", country: "Sudan" },
  { code: "+250", country: "Rwanda" },
  { code: "+251", country: "Ethiopia" },
  { code: "+252", country: "Somalia" },
  { code: "+253", country: "Djibouti" },
  { code: "+254", country: "Kenya" },
  { code: "+255", country: "Tanzania" },
  { code: "+256", country: "Uganda" },
  { code: "+257", country: "Burundi" },
  { code: "+258", country: "Mozambique" },
  { code: "+260", country: "Zambia" },
  { code: "+261", country: "Madagascar" },
  { code: "+262", country: "Reunion" },
  { code: "+263", country: "Zimbabwe" },
  { code: "+264", country: "Namibia" },
  { code: "+265", country: "Malawi" },
  { code: "+266", country: "Lesotho" },
  { code: "+267", country: "Botswana" },
  { code: "+268", country: "Eswatini" },
  { code: "+269", country: "Comoros" },
  { code: "+291", country: "Eritrea" },
  { code: "+297", country: "Aruba" },
  { code: "+298", country: "Faroe Islands" },
  { code: "+299", country: "Greenland" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+33", country: "France" },
  { code: "+34", country: "Spain" },
  { code: "+36", country: "Hungary" },
  { code: "+39", country: "Italy" },
  { code: "+40", country: "Romania" },
  { code: "+41", country: "Switzerland" },
  { code: "+43", country: "Austria" },
  { code: "+45", country: "Denmark" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+48", country: "Poland" },
  { code: "+49", country: "Germany" },
  { code: "+51", country: "Peru" },
  { code: "+52", country: "Mexico" },
  { code: "+55", country: "Brazil" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "New Zealand" },
  { code: "+65", country: "Singapore" },
  { code: "+66", country: "Thailand" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+86", country: "China" },
  { code: "+90", country: "Turkey" },
  { code: "+91", country: "India" },
  { code: "+92", country: "Pakistan" },
  { code: "+93", country: "Afghanistan" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+95", country: "Myanmar" },
  { code: "+98", country: "Iran" },
  { code: "+964", country: "Iraq" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+972", country: "Israel" },
  { code: "+977", country: "Nepal" },
  { code: "+998", country: "Uzbekistan" },
];

// Sort the country codes alphabetically by country name
countryCodes.sort((a, b) => a.country.localeCompare(b.country));

interface ContactInfoSectionProps {
  phone: string;
  address: string;
  website: string;
  errors: {[key: string]: string};
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryCodeChange?: (value: string) => void;
  countryCode?: string;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  phone,
  address,
  website,
  errors,
  onChange,
  onCountryCodeChange,
  countryCode = "+256" // Default to Uganda
}) => {
  // Phone number validation
  const validatePhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validatePhoneNumber(e.target.value);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: validated,
        name: 'phone'
      }
    };
    onChange(syntheticEvent);
  };

  const handleCountryCodeSelect = (value: string) => {
    if (onCountryCodeChange) {
      onCountryCodeChange(value);
    }
  };

  return (
    <>
      {/* Phone Number with Enhanced Country Code Dropdown */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <div className="flex">
          <Select 
            value={countryCode} 
            onValueChange={handleCountryCodeSelect}
          >
            <SelectTrigger className="w-[120px] rounded-r-none border-r-0">
              <SelectValue placeholder="+256" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {countryCodes.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  <span className="flex items-center gap-2">
                    <span>{item.country}</span>
                    <span className="text-gray-500 text-xs">{item.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="tel"
            id="phone"
            name="phone"
            required
            value={phone}
            onChange={handlePhoneChange}
            className={`rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="7XX XXX XXX"
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <Input
          type="text"
          id="address"
          name="address"
          required
          value={address}
          onChange={onChange}
          className={errors.address ? 'border-red-500' : ''}
          placeholder="Enter your organization's physical address"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
          Website <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <Input
          type="url"
          id="website"
          name="website"
          value={website}
          onChange={onChange}
          placeholder="https://www.example.com"
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
