import axios from "axios";
import type {
  Article,
  ArticleFilters,
  Citation,
  PaginatedResponse,
} from "../types";

// Initial Mock Data
const MOCK_ARTICLES: Article[] = Array.from({ length: 50 }).map((_, i) => ({
  id: (i + 1).toString(),
  title: `Academic Paper Title ${i + 1}: Advances in Computing`,
  authors: [`Author A${i}`, `Author B${i}`],
  abstract: `This is the abstract for paper ${i + 1}. It discusses various topics in computer science and software engineering.`,
  publicationDate: new Date(2020 + (i % 5), i % 12, (i % 28) + 1)
    .toISOString()
    .split("T")[0],
  doi: `10.1000/xyz.${i + 1}`,
}));

const MOCK_CITATIONS: Citation[] = [
  {
    id: "c1",
    title: "Previous Work on X",
    authors: ["Old Guy"],
    year: 2018,
    doi: "10.1000/old.1",
  },
  { id: "c2", title: "Foundational Theory", authors: ["Turing"], year: 1936 },
];

// Simulation helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const apiClient = axios.create({
  baseURL: "/api", // This will be intercepted
});

// Mocking logic
apiClient.interceptors.request.use(async (config) => {
  await delay(600); // Simulate network latency
  return config;
});

// Mock Adapter Interceptor
apiClient.interceptors.response.use(undefined, async (error) => {
  const { config } = error;
  if (!config) return Promise.reject(error);

  // GET /articles
  if (config.url === "/articles" && config.method === "get") {
    const params = config.params as ArticleFilters;
    let filtered = [...MOCK_ARTICLES];

    // Search
    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.abstract.toLowerCase().includes(q),
      );
    }

    // Author
    if (params.author) {
      const q = params.author.toLowerCase();
      filtered = filtered.filter((a) =>
        a.authors.some((auth) => auth.toLowerCase().includes(q)),
      );
    }

    // Date Range
    if (params.fromDate) {
      filtered = filtered.filter((a) => a.publicationDate >= params.fromDate!);
    }
    if (params.toDate) {
      filtered = filtered.filter((a) => a.publicationDate <= params.toDate!);
    }

    // Sort
    if (params.sort) {
      filtered.sort((a, b) => {
        const fieldA = params.sort === "date" ? a.publicationDate : a.title;
        const fieldB = params.sort === "date" ? b.publicationDate : b.title;
        return params.order === "desc"
          ? fieldB.localeCompare(fieldA)
          : fieldA.localeCompare(fieldB);
      });
    }

    // Pagination
    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 10;
    const totalItems = filtered.length;
    const start = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(start, start + pageSize);

    return {
      data: {
        data: paginatedItems,
        meta: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      },
      status: 200,
      headers: {},
      config,
    };
  }

  // GET /articles/:id
  const articleMatch = config.url.match(/\/articles\/(\d+)/);
  if (articleMatch && config.method === "get") {
    const id = articleMatch[1];
    const article = MOCK_ARTICLES.find((a) => a.id === id);
    if (article) {
      return {
        data: article,
        status: 200,
        headers: {},
        config,
      };
    } else {
      return Promise.reject({ response: { status: 404 } });
    }
  }

  // GET /articles/:id/citations
  const citationMatch = config.url.match(/\/articles\/(\d+)\/citations/);
  if (citationMatch && config.method === "get") {
    return {
      data: MOCK_CITATIONS,
      status: 200,
      headers: {},
      config,
    };
  }

  // POST /articles (Create) - simplified
  if (config.url === "/articles" && config.method === "post") {
    const newArticle = JSON.parse(config.data);
    newArticle.id = (MOCK_ARTICLES.length + 1).toString();
    MOCK_ARTICLES.unshift(newArticle);
    return {
      data: newArticle,
      status: 201,
      headers: {},
      config,
    };
  }

  // PUT /articles/:id (Update)
  if (articleMatch && config.method === "put") {
    const id = articleMatch[1];
    const index = MOCK_ARTICLES.findIndex((a) => a.id === id);
    if (index !== -1) {
      const updated = JSON.parse(config.data);
      MOCK_ARTICLES[index] = { ...MOCK_ARTICLES[index], ...updated };
      return {
        data: MOCK_ARTICLES[index],
        status: 200,
        headers: {},
        config,
      };
    }
  }

  return Promise.reject(error);
});

export const getArticles = (params: ArticleFilters) =>
  apiClient.get<PaginatedResponse<Article>>("/articles", { params });

export const getArticleById = (id: string) =>
  apiClient.get<Article>(`/articles/${id}`);

export const getArticleCitations = (id: string) =>
  apiClient.get<Citation[]>(`/articles/${id}/citations`);

export const createArticle = (article: Omit<Article, "id">) =>
  apiClient.post<Article>("/articles", article);

export const updateArticle = (id: string, article: Partial<Article>) =>
  apiClient.put<Article>(`/articles/${id}`, article);

export default apiClient;
