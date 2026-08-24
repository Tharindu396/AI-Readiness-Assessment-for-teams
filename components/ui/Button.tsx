import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-accent-600 text-white hover:bg-accent-700 disabled:bg-ink-200 disabled:text-ink-500",
  secondary:
    "border border-ink-200 text-ink-900 hover:bg-ink-50 disabled:text-ink-300 disabled:hover:bg-transparent",
};

/** Shared class string so Link elements can match <Button> styling exactly. */
export function buttonClass(variant: Variant = "primary", className = "") {
  return `inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
