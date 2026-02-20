import * as React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>;
}

export function Card({ children, className="" }: { children: React.ReactNode; className?: string }) {
  return <div className={"glass glow p-5 " + className}>{children}</div>;
}

export function Button({
  children,
  className="",
  variant="primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"secondary"|"ghost" }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-50";
  const styles = variant === "primary"
    ? "bg-violet-600 hover:bg-violet-500"
    : variant === "secondary"
      ? "bg-white/10 hover:bg-white/15 border border-white/10"
      : "bg-transparent hover:bg-white/10";
  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-600/60 " + (props.className ?? "")} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={"w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-600/60 " + (props.className ?? "")} />;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-xs">{children}</span>;
}
