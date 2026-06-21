import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export function Card({ children, className, title, action }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="text-sm font-semibold text-slate-300">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}