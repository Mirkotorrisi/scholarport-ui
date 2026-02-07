import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getArticles, createArticle } from "../api/client";
import ArticleFilters from "../components/ArticleFilters";
import ArticleList from "../components/ArticleList";
import Modal from "../components/ui/Modal";
import ArticleForm from "../components/ArticleForm";
import type {
  Article,
  ArticleFilters as FilterType,
  PaginationMeta,
  SortField,
  SortOrder,
} from "../types";
import { Plus } from "lucide-react";

const ArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Parse filters from URL
  const filters: FilterType = useMemo(
    () => ({
      query: searchParams.get("query") || undefined,
      author: searchParams.get("author") || undefined,
      fromDate: searchParams.get("fromDate") || undefined,
      toDate: searchParams.get("toDate") || undefined,
      sort: (searchParams.get("sort") as SortField) || undefined,
      order: (searchParams.get("order") as SortOrder) || undefined,
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
    }),
    [searchParams],
  );

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getArticles(filters);
        setArticles(response.data.data);
        setMeta(response.data.meta);
      } catch (err) {
        setError("Failed to fetch articles. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filters, refreshKey]);

  const handleFilterChange = (newFilters: FilterType) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set("query", newFilters.query);
    if (newFilters.author) params.set("author", newFilters.author);
    if (newFilters.fromDate) params.set("fromDate", newFilters.fromDate);
    if (newFilters.toDate) params.set("toDate", newFilters.toDate);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.order) params.set("order", newFilters.order);
    if (newFilters.page && newFilters.page > 1)
      params.set("page", newFilters.page.toString());

    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ ...filters, page: newPage });
  };

  const handleCreateArticle = async (data: Omit<Article, "id">) => {
    await createArticle(data);
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Academic Articles
          </h1>
          <p className="text-slate-500">
            Browse and manage your research portfolio.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} /> Add Article
        </button>
      </div>

      <ArticleFilters filters={filters} onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      <ArticleList
        articles={articles}
        meta={meta}
        loading={loading}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Article"
      >
        <ArticleForm
          onSubmit={handleCreateArticle}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ArticlesPage;
