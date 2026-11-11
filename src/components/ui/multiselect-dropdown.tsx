
import React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = { label: string; value: string };

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between border rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          open && "ring-2 ring-ring",
        )}
        onClick={toggleDropdown}
      >
        <span className={selected.length === 0 ? "text-muted-foreground" : ""}>
          {selected.length === 0
            ? placeholder
            : options
                .filter((opt) => selected.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")}
        </span>
        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
      </button>
      {open && (
        <div
          className="z-50 absolute left-0 mt-2 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-y-auto"
          tabIndex={-1}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                "w-full flex items-center px-3 py-2 text-sm hover:bg-accent transition ",
                selected.includes(opt.value) && "bg-accent"
              )}
              onClick={() => handleSelect(opt.value)}
            >
              <span className="flex items-center">
                {selected.includes(opt.value) && (
                  <Check className="w-4 h-4 mr-2 text-primary" />
                )}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
