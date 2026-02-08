import React, { useState } from "react";
import type { Citation } from "../types";

interface CitationFormProps {
  onSuccess: (citation: Citation) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CitationForm: React.FC<CitationFormProps> = ({
  onSuccess,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: "",
    doi: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.title ||
      !formData.authors ||
      !formData.year ||
      !formData.doi
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const yearNum = parseInt(formData.year, 10);
    if (isNaN(yearNum)) {
      setError("Year must be a valid number.");
      return;
    }

    const citation: Citation = {
      title: formData.title,
      authors: formData.authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      year: yearNum,
      doi: formData.doi,
    };

    onSuccess(citation);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
          placeholder="Paper Title"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="authors"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Authors (comma separated)
        </label>
        <input
          id="authors"
          type="text"
          value={formData.authors}
          onChange={(e) =>
            setFormData({ ...formData, authors: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
          placeholder="Author One, Author Two"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Year
          </label>
          <input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            placeholder="2024"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="doi"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            DOI
          </label>
          <input
            id="doi"
            type="text"
            value={formData.doi}
            onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            placeholder="10.1000/xyz.123"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors cursor-pointer"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Citation"}
        </button>
      </div>
    </form>
  );
};

export default CitationForm;
