import React from "react";
import { Calendar, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article } from "../types";

interface ArticleRowProps {
  article: Article;
}

const ArticleRow: React.FC<ArticleRowProps> = ({ article }) => {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-200 hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h3>
        <span className="shrink-0 text-slate-400 group-hover:text-brand-400 group-hover:translate-x-1 transition-all">
          <ChevronRight size={20} />
        </span>
      </div>

      <p className="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed">
        {article.abstract}
      </p>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
          <Calendar size={14} className="text-brand-500" />
          <span>{new Date(article.publicationDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
          <Users size={14} className="text-brand-500" />
          <span className="truncate max-w-[200px]">
            {article.authors.join(", ")}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 ml-auto font-mono text-slate-400">
          DOI: {article.doi}
        </div>
      </div>
    </Link>
  );
};

export default ArticleRow;
