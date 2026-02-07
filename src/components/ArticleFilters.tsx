import React, { useEffect, useState } from "react";
import { Search, User, SortAsc } from "lucide-react";
import { useArticles } from "../hooks/useArticles";
import type { SortField, SortOrder } from "../types";

const ArticleFilters: React.FC = () => {
  const { filters, updateFilters } = useArticles();
  const [localSearch, setLocalSearch] = useState(filters.query || "");
  const [localAuthor, setLocalAuthor] = useState(filters.author || "");

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.query) {
        updateFilters({ ...filters, query: localSearch || undefined, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters, updateFilters]);

  // Debounce Author
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localAuthor !== filters.author) {
        updateFilters({
          ...filters,
          author: localAuthor || undefined,
          page: 1,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localAuthor, filters, updateFilters]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({
      ...filters,
      [e.target.name]: e.target.value || undefined,
      page: 1,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [sort, order] = value.split("-") as [SortField, SortOrder];
    updateFilters({ ...filters, sort, order, page: 1 });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 transition-all hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search title or abstract..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Author */}
        <div className="relative group">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter by author..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            value={localAuthor}
            onChange={(e) => setLocalAuthor(e.target.value)}
          />
        </div>

        {/* Date Range */}
        <div className="flex gap-2">
          <div className="relative group">
            <input
              type="date"
              name="fromDate"
              className="w-full h-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
              value={filters.fromDate || ""}
              onChange={handleDateChange}
            />
          </div>
          <div className="relative group">
            <input
              type="date"
              name="toDate"
              className="w-full h-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
              value={filters.toDate || ""}
              onChange={handleDateChange}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="relative group">
          <SortAsc
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"
            size={18}
          />
          <select
            className="w-full pl-7 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer"
            value={`${filters.sort || "date"}-${filters.order || "desc"}`}
            onChange={handleSortChange}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ArticleFilters;
