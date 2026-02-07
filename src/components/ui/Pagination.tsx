import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../../types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  if (!meta) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 pt-6">
      <div className="text-sm text-slate-500">
        Showing
        <span className="font-medium text-slate-900">
          {(meta.page - 1) * meta.pageSize + 1}
        </span>
        to
        <span className="font-medium text-slate-900">
          {Math.min(meta.page * meta.pageSize, meta.totalItems)}
        </span>
        of <span className="font-medium text-slate-900">{meta.totalItems}</span>
        results
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page === meta.totalPages}
          className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
