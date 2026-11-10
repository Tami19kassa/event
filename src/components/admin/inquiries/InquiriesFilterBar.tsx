import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}

export function InquiriesFilterBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company, contact name, email, phone, booth or tier..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
        />
      </div>

      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm cursor-pointer"
      >
        <option value="ALL">All Lead Types</option>
        <option value="EXHIBITOR">Exhibitors Only</option>
        <option value="SPONSOR">Sponsors Only</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm cursor-pointer"
      >
        <option value="ALL">All Statuses</option>
        <option value="NEW">New Leads</option>
        <option value="CONTACTED">Contacted</option>
        <option value="QUALIFIED">Qualified</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </div>
  );
}
