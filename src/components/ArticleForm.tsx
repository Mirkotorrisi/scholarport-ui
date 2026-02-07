import React from "react";
import { useArticles } from "../hooks/useArticles";

interface ArticleFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onCancel, onSuccess }) => {
  const { formData, setFormData, isSubmitting, formError, submitForm } =
    useArticles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm();
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Deep Learning in Healthcare"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Authors (comma separated) *
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          value={formData.authors}
          onChange={(e) =>
            setFormData({ ...formData, authors: e.target.value })
          }
          placeholder="e.g. John Doe, Jane Smith"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Publication Date *
        </label>
        <input
          type="date"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          value={formData.publicationDate}
          onChange={(e) =>
            setFormData({ ...formData, publicationDate: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          DOI
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          value={formData.doi}
          onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
          placeholder="e.g. 10.1000/xyz.123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Abstract *
        </label>
        <textarea
          rows={5}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          value={formData.abstract}
          onChange={(e) =>
            setFormData({ ...formData, abstract: e.target.value })
          }
          placeholder="Enter article abstract..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Article"}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;
