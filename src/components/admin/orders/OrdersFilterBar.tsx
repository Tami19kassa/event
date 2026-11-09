import { Search } from "lucide-react";

interface FilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function OrdersFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: FilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by order #, phone, customer name, receipt ref, or event..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm cursor-pointer"
      >
        <option value="ALL">All Payment Statuses</option>
        <option value="COMPLETED">Verified & Paid</option>
        <option value="RESERVED_PAY_AT_GATE">Pay at Gate (Door Reserved)</option>
        <option value="PENDING_VERIFICATION">Pending Bank Scraping</option>
        <option value="CHECKED_IN">Already Checked-In at Gate</option>
        <option value="UNCHECKED">Not Checked-In Yet</option>
      </select>
    </div>
  );
}
