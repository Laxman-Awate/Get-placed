import React from 'react';

export function FormField({ label, type = 'text', name, placeholder, required = true }) {
  return <label className="form-field"><span>{label}</span><input type={type} name={name} placeholder={placeholder} required={required} autoComplete={name} /></label>;
}
