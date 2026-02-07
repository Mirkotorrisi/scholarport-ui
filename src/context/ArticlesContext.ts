import { createContext } from "react";
import type {
  Article,
  ArticleFilters as FilterType,
  PaginationMeta,
  Citation,
} from "../types";

export interface ArticleFormData {
  title: string;
  authors: string;
  abstract: string;
  publicationDate: string;
  doi: string;
}

export interface ArticlesContextType {
  articles: Article[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  filters: FilterType;
  updateFilters: (newFilters: FilterType) => void;
  updatePage: (page: number) => void;
  // Form State
  formData: ArticleFormData;
  isSubmitting: boolean;
  formError: string | null;

  // Form Actions
  setFormData: (data: ArticleFormData) => void;
  resetForm: () => void;
  submitForm: () => Promise<boolean>;
  initCreate: () => void;
  initEdit: (article: Article) => void;

  // Data Actions
  createArticle: (data: Omit<Article, "id">) => Promise<void>;
  updateArticle: (id: string, data: Omit<Article, "id">) => Promise<Article>;
  refresh: () => void;

  // Detail State
  currentArticle: Article | null;
  citations: Citation[];
  detailLoading: boolean;
  detailError: string | null;

  // Detail Actions
  loadArticleDetails: (id: string) => Promise<void>;
  clearCurrentArticle: () => void;
}

export const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined,
);
