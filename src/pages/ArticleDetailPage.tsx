import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getArticleById,
  getArticleCitations,
  updateArticle,
} from "../api/client";
import ArticleDetail from "../components/ArticleDetail";
import CitationList from "../components/CitationList";
import Modal from "../components/ui/Modal";
import ArticleForm from "../components/ArticleForm";
import type { Article, Citation } from "../types";
import { Quote } from "lucide-react";

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [articleRes, citationsRes] = await Promise.all([
          getArticleById(id),
          getArticleCitations(id),
        ]);
        setArticle(articleRes.data);
        setCitations(citationsRes.data);
      } catch (err) {
        setError("Failed to load article details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateArticle = async (data: Omit<Article, "id">) => {
    if (!article) return;
    try {
      const response = await updateArticle(article.id, data);
      setArticle(response.data);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update article", err);
      // Ideally show error toast here
    }
  };

  const handleAddCitation = () => {
    // TODO: Open Add Citation Modal or Form
    console.log("Add citation to", article?.id);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg font-medium">
          Error loading article
        </div>
        <p className="text-slate-500">{error || "Article not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ArticleDetail
        article={article}
        onEdit={handleEdit}
        onAddCitation={handleAddCitation}
      />

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Quote className="text-brand-500" size={24} />
          Citations ({citations.length})
        </h3>
        <CitationList citations={citations} />
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Article"
      >
        {article && (
          <ArticleForm
            initialData={article}
            onSubmit={handleUpdateArticle}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ArticleDetailPage;
