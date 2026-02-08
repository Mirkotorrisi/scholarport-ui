import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ArticlesProvider } from "./ArticlesProvider";
import { ArticlesContext } from "./ArticlesContext";
import { useContext, useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import * as apiClient from "../api/client";
import type { Article } from "../types";

// Mock API client
vi.mock("../api/client", () => ({
  getArticles: vi.fn(),
  getArticleById: vi.fn(),
  createArticle: vi.fn(),
  updateArticle: vi.fn(),
  addCitation: vi.fn(),
}));

const mockArticle: Article = {
  _id: "1",
  title: "Test Article",
  authors: ["Author A"],
  abstract: "Test Abstract",
  publicationDate: "2024-01-01",
  doi: "10.1000/1",
  citations: [],
};

const mockArticlesResponse = {
  data: {
    items: [mockArticle],
    page: 1,
    pageSize: 10,
    totalItems: 1,
    totalPages: 1,
  },
};

// Helper component to consume context
const TestComponent = () => {
  const context = useContext(ArticlesContext);
  if (!context) throw new Error("ArticlesContext not found");

  const {
    articles,
    loadArticleDetails,
    currentArticle,
    addCitation,
    initCreate,
    formData,
    createArticle,
  } = context;

  useEffect(() => {
    // Trigger initial fetch if needed, though provider does it on mount
  }, []);

  return (
    <div>
      <div data-testid="articles-count">{articles.length}</div>
      <div data-testid="current-article-title">{currentArticle?.title}</div>
      <button onClick={() => loadArticleDetails("1")}>Load Details</button>
      <button
        onClick={() =>
          addCitation("1", {
            title: "Cit Title",
            authors: ["Cit Author"],
            year: 2024,
            doi: "10.1000/cit",
          })
        }
      >
        Add Citation
      </button>
      <button onClick={initCreate}>Init Create</button>
      <div data-testid="form-title">{formData.title}</div>
      <button
        onClick={() =>
          createArticle({
            title: "New Article",
            authors: ["New Author"],
            abstract: "New Abstract",
            publicationDate: "2024-02-02",
            doi: "10.1000/new",
            citations: [],
          })
        }
      >
        Create Article
      </button>
    </div>
  );
};

describe("ArticlesProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.getArticles as Mock).mockResolvedValue(mockArticlesResponse);
  });

  it("initializes with articles", async () => {
    render(
      <MemoryRouter>
        <ArticlesProvider>
          <TestComponent />
        </ArticlesProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("articles-count")).toHaveTextContent("1");
    });
    expect(apiClient.getArticles).toHaveBeenCalled();
  });

  it("loads article details", async () => {
    (apiClient.getArticleById as Mock).mockResolvedValue({ data: mockArticle });

    render(
      <MemoryRouter>
        <ArticlesProvider>
          <TestComponent />
        </ArticlesProvider>
      </MemoryRouter>,
    );

    const button = screen.getByText("Load Details");
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("current-article-title")).toHaveTextContent(
        "Test Article",
      );
    });
    expect(apiClient.getArticleById).toHaveBeenCalledWith("1");
  });

  it("adds citation and updates current article", async () => {
    const updatedArticle = {
      ...mockArticle,
      citations: [
        {
          title: "Cit Title",
          authors: ["Cit Author"],
          year: 2024,
          doi: "10.1000/cit",
        },
      ],
    };
    (apiClient.addCitation as Mock).mockResolvedValue({ data: updatedArticle });
    (apiClient.getArticleById as Mock).mockResolvedValue({ data: mockArticle }); // Setup initial state if needed

    render(
      <MemoryRouter>
        <ArticlesProvider>
          <TestComponent />
        </ArticlesProvider>
      </MemoryRouter>,
    );

    // Simulate being on detail page
    act(() => {
      screen.getByText("Load Details").click();
    });
    await waitFor(() => {}); // Wait for load

    const button = screen.getByText("Add Citation");
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(apiClient.addCitation).toHaveBeenCalled();
      // Verify state update logic if observable through component
      // Here we rely on the mock return value being used by provider
    });
  });

  it("initializes create form correctly", () => {
    render(
      <MemoryRouter>
        <ArticlesProvider>
          <TestComponent />
        </ArticlesProvider>
      </MemoryRouter>,
    );

    const button = screen.getByText("Init Create");
    act(() => {
      button.click();
    });

    expect(screen.getByTestId("form-title")).toHaveTextContent("");
  });
});
