import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CustomCheckbox({
  checked,
  onChange,
}: CustomCheckboxProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
        checked
          ? "bg-blue-600 border-blue-600"
          : "border-gray-300 hover:border-blue-400"
      }`}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </button>
  );
}
