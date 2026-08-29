import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-gradient-accent text-white shadow-lg shadow-accent-600/20 hover:shadow-accent-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100",
  secondary:
    "border border-surface-border bg-surface text-ink-900 backdrop-blur-[16px] hover:border-surface-border-hover hover:bg-surface-hover disabled:opacity-40 disabled:hover:bg-surface disabled:hover:border-surface-border",
};

/** Shared class string so Link elements can match <Button> styling exactly. */
export function buttonClass(variant: Variant = "primary", className = "") {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
