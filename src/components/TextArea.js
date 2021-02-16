import React from 'react';

export default function TextArea({
  type,
  name,
  placeholder,
  className,
  onChange,
  hasError,
  ...props
}) {
  return (
    <div className="w-full mt-2">
      <textarea
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className={className}
        {...props}
      />
      {hasError && <p className="text-xs text-red-600">{hasError}</p>}
    </div>
  );
}
