import axios from "axios";
import type {
  Article,
  ArticleFilters,
  PaginatedResponse,
  Citation,
} from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
});

apiClient.interceptors.request.use(async (config) => {
  return config;
});

apiClient.interceptors.response.use(undefined, async (error) => {
  const { config } = error;
  if (!config) return Promise.reject(error);
});

export const getArticles = (params: ArticleFilters) =>
  apiClient.get<PaginatedResponse<Article>>("/articles", { params });

export const getArticleById = (id: string) =>
  apiClient.get<Article>(`/articles/${id}`);

export const createArticle = (article: Partial<Article>) =>
  apiClient.post<Article>("/articles", article);

export const updateArticle = (id: string, article: Partial<Article>) =>
  apiClient.put<Article>(`/articles/${id}`, article);

export const addCitation = (id: string, citation: Citation) =>
  apiClient.post<Article>(`/articles/${id}/citations`, citation);

export default apiClient;
