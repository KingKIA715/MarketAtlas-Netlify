import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  keyExtractor: (row: T) => string;
}

export function Table<T>({ columns, data, className, keyExtractor }: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto scrollbar-hide", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
            {columns.map((c) => (
              <th key={c.key} className={cn("pb-2 pr-4 font-medium", c.className)}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
              {columns.map((c) => (
                <td key={c.key} className={cn("py-3 pr-4 text-slate-300", c.className)}>
                  {c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}