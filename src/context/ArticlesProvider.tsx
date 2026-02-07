import React, { useEffect, useState, useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getArticles,
  createArticle as apiCreateArticle,
  updateArticle as apiUpdateArticle,
  getArticleById,
  getArticleCitations,
} from "../api/client";
import type {
  Article,
  ArticleFilters as FilterType,
  PaginationMeta,
  SortField,
  SortOrder,
  Citation,
} from "../types";

import {
  ArticlesContext,
  type ArticlesContextType,
  type ArticleFormData,
} from "./ArticlesContext";

const INITIAL_FORM_DATA: ArticleFormData = {
  title: "",
  authors: "",
  abstract: "",
  publicationDate: new Date().toISOString().split("T")[0],
  doi: "",
};

export const ArticlesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
  const [refreshKey, setRefreshKey] = useState(0);

  // Form State
  const [formData, setFormData] = useState<ArticleFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Detail State
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

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

  const updateFilters = (newFilters: FilterType) => {
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

  const updatePage = (newPage: number) => {
    updateFilters({ ...filters, page: newPage });
  };

  const createArticle = async (data: Omit<Article, "id">) => {
    await apiCreateArticle(data);
    setRefreshKey((prev) => prev + 1);
  };

  const updateArticle = async (id: string, data: Omit<Article, "id">) => {
    const response = await apiUpdateArticle(id, data);
    setRefreshKey((prev) => prev + 1);
    // If we are currently viewing this article, update the detail view as well
    if (currentArticle?.id === id) {
      setCurrentArticle(response.data);
    }
    return response.data;
  };

  const refresh = () => setRefreshKey((prev) => prev + 1);

  // Form Actions
  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setFormError(null);
    setEditingId(null);
  };

  const initCreate = () => {
    resetForm();
  };

  const initEdit = (article: Article) => {
    setFormData({
      title: article.title,
      authors: article.authors.join(", "),
      abstract: article.abstract,
      publicationDate: article.publicationDate,
      doi: article.doi,
    });
    setFormError(null);
    setEditingId(article.id);
  };

  const submitForm = async (): Promise<boolean> => {
    if (!formData.title || !formData.authors || !formData.abstract) {
      setFormError("Please fill in all required fields.");
      return false;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const articleData = {
        ...formData,
        authors: formData.authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await updateArticle(editingId, articleData);
      } else {
        await createArticle(articleData);
      }

      resetForm();
      return true;
    } catch (err) {
      console.error(err);
      setFormError("Failed to save article. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Detail Actions
  const loadArticleDetails = async (id: string) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const [articleRes, citationsRes] = await Promise.all([
        getArticleById(id),
        getArticleCitations(id),
      ]);
      setCurrentArticle(articleRes.data);
      setCitations(citationsRes.data);
    } catch (err) {
      setDetailError("Failed to load article details.");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const clearCurrentArticle = () => {
    setCurrentArticle(null);
    setCitations([]);
    setDetailError(null);
  };

  const value: ArticlesContextType = {
    articles,
    meta,
    loading,
    error,
    filters,
    updateFilters,
    updatePage,
    // Form
    formData,
    isSubmitting,
    formError,
    setFormData,
    resetForm,
    submitForm,
    initCreate,
    initEdit,
    // Data
    createArticle,
    updateArticle,
    refresh,
    // Detail
    currentArticle,
    citations,
    detailLoading,
    detailError,
    loadArticleDetails,
    clearCurrentArticle,
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
};
