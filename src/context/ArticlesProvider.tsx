import React, {
  useEffect,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  getArticles,
  createArticle as apiCreateArticle,
  updateArticle as apiUpdateArticle,
  getArticleById,
  addCitation as apiAddCitation,
} from "../api/client";
import type {
  Article,
  ArticleFilters as FilterType,
  SortField,
  SortOrder,
  Citation,
  PaginationMeta,
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
        setArticles(response.data?.items);
        setMeta({
          page: response.data?.page,
          pageSize: response.data?.pageSize,
          totalItems: response.data?.totalItems,
          totalPages: response.data?.totalPages,
        });
      } catch (err) {
        setError("Failed to fetch articles. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filters, refreshKey]);

  const updateFilters = useCallback(
    (newFilters: FilterType) => {
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
    },
    [setSearchParams],
  );

  const updatePage = useCallback(
    (newPage: number) => {
      updateFilters({ ...filters, page: newPage });
    },
    [filters, updateFilters],
  );

  const createArticle = useCallback(async (data: Partial<Article>) => {
    await apiCreateArticle(data);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const updateArticle = useCallback(
    async (id: string, data: Partial<Article>) => {
      const response = await apiUpdateArticle(id, data);
      setRefreshKey((prev) => prev + 1);
      // If we are currently viewing this article, update the detail view as well
      if (currentArticle?._id === id) {
        setCurrentArticle(response.data);
      }
      return response.data;
    },
    [currentArticle],
  );

  const refresh = useCallback(() => setRefreshKey((prev) => prev + 1), []);

  // Form Actions
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFormError(null);
    setEditingId(null);
  }, []);

  const initCreate = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const initEdit = useCallback((article: Article) => {
    setFormData({
      title: article.title,
      authors: article.authors.join(", "),
      abstract: article.abstract,
      publicationDate: article.publicationDate,
      doi: article.doi,
    });
    setFormError(null);
    setEditingId(article._id);
  }, []);

  const submitForm = useCallback(async (): Promise<boolean> => {
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
  }, [formData, editingId, updateArticle, createArticle, resetForm]);

  // Detail Actions
  const loadArticleDetails = useCallback(async (id: string) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const articleRes = await getArticleById(id);
      setCurrentArticle(articleRes.data);
    } catch (err) {
      setDetailError("Failed to load article details.");
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const addCitation = useCallback(
    async (articleId: string, citation: Citation) => {
      try {
        const article = await apiAddCitation(articleId, citation);

        // Refresh article details to show new citation
        if (article) setCurrentArticle(article.data);
        return article.data;
      } catch (err) {
        console.error(err);
        setDetailError("Failed to add citation.");
        return null;
      }
    },
    [setCurrentArticle],
  );

  const clearCurrentArticle = useCallback(() => {
    setCurrentArticle(null);
    setDetailError(null);
  }, []);

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
    detailLoading,
    detailError,
    loadArticleDetails,
    addCitation,
    clearCurrentArticle,
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
};
