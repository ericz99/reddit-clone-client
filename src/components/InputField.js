import React from 'react';

export default function InputField({
  type,
  name,
  placeholder,
  className,
  onChange,
  hasError,
  ...props
}) {
  return (
    <div className="w-full my-2">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className={className}
        required
        {...props}
      />
      {hasError && <p className="text-xs text-red-600">{hasError}</p>}
    </div>
  );
}
