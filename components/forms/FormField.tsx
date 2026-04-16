import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function FormField({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label>
      <span className="small">{label}</span>
      <input {...props} />
    </label>
  );
}

export function TextAreaField({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label style={{ gridColumn: '1 / -1' }}>
      <span className="small">{label}</span>
      <textarea rows={3} {...props} />
    </label>
  );
}
