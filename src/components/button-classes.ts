export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonOptions {
  variant?: ButtonVariant;
}

const BASE = "inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-colors";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-gold text-brown hover:bg-gold/90",
  secondary: "border-[1.5px] border-brown text-brown hover:bg-brown hover:text-cream",
  ghost: "text-brown hover:underline",
};

export function buttonClasses({ variant = "primary" }: ButtonOptions = {}): string {
  return `${BASE} ${VARIANTS[variant]}`;
}
