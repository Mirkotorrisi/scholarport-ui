import React from "react";
import { FileText } from "lucide-react";
import type { Article, PaginationMeta } from "../types";
import Loader from "./ui/Loader";
import ArticleRow from "./ArticleRow";
import Pagination from "./ui/Pagination";

interface ArticleListProps {
  articles: Article[];
  meta: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  meta,
  loading,
  onPageChange,
}) => {
  if (loading) {
    return <Loader />;
  }

  if (!articles?.length) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
          <FileText className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-900">
          No articles found
        </h3>
        <p className="text-slate-500 mt-1">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {articles?.map((article) => (
          <ArticleRow key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
};

export default ArticleList;
