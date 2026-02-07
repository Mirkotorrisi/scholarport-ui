import React from "react";
import { Calendar, Users, FileText, Edit, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article } from "../types";

interface ArticleDetailProps {
  article: Article;
  onEdit: () => void;
  onAddCitation: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onEdit,
  onAddCitation,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Articles
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap gap-6 mb-8 text-sm text-slate-600 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2">
            <Calendar className="text-brand-500" size={18} />
            <span>
              Published on
              <span className="font-medium text-slate-900">
                {new Date(article.publicationDate).toLocaleDateString()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="text-brand-500" size={18} />
            <span>
              By
              <span className="font-medium text-slate-900">
                {article.authors.join(", ")}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400">DOI:</span>
            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
              {article.doi}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FileText size={20} className="text-slate-400" /> Abstract
          </h2>
          <p className="text-slate-700 leading-relaxed text-lg">
            {article.abstract}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
          >
            <Edit size={18} /> Edit Article
          </button>
          <button
            onClick={onAddCitation}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <Plus size={18} /> Add Citation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
