import React from "react";

type InputProps = {
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name: string;
  error?: string;
  icon?: React.ReactNode;
};

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  label,
  name,
  error,
  icon,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative mt-1">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            icon ? "pl-10" : ""
          } ${error ? "border-red-500" : ""}`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
