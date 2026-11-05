import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  optional?: boolean;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { textarea?: false };
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { textarea: true };

export function FormField(props: InputProps | TextareaProps) {
  const { label, error, optional, textarea, ...fieldProps } = props;
  const id = fieldProps.id || fieldProps.name;
  const descriptionId = error ? `${id}-error` : undefined;
  const shared = {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": descriptionId,
    className: `text-field ${error ? "border-[#9d291f]" : ""}`,
  };

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {optional ? <span className="font-normal normal-case tracking-normal text-muted">(optional)</span> : <span className="text-muted">*</span>}
      </label>
      {textarea ? (
        <textarea {...shared} {...(fieldProps as TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={4} />
      ) : (
        <input {...shared} {...(fieldProps as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error && <p id={descriptionId} className="mt-2 text-[11px] leading-relaxed text-[#9d291f]" role="alert">{error}</p>}
    </div>
  );
}
