export interface Article {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: string;
  doi: string;
}

export interface Citation {
  id: string;
  title: string;
  authors: string[];
  year: number;
  doi?: string;
}

export type SortField = "date" | "title";
export type SortOrder = "asc" | "desc";

export interface ArticleFilters {
  query?: string;
  author?: string;
  fromDate?: string;
  toDate?: string;
  sort?: SortField;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
} & PaginationMeta;
