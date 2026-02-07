import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleDetail from "../components/ArticleDetail";
import CitationList from "../components/CitationList";
import Modal from "../components/ui/Modal";
import ArticleForm from "../components/ArticleForm";
import { Quote } from "lucide-react";
import { useArticles } from "../hooks/useArticles";

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {
    currentArticle,
    citations,
    detailLoading,
    detailError,
    loadArticleDetails,
    clearCurrentArticle,
    initEdit,
  } = useArticles();

  useEffect(() => {
    if (id) {
      loadArticleDetails(id);
    }
    return () => {
      clearCurrentArticle();
    };
  }, [id, loadArticleDetails, clearCurrentArticle]);

  const handleEdit = () => {
    if (currentArticle) {
      initEdit(currentArticle);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateSuccess = async () => {
    setIsEditModalOpen(false);
  };

  const handleAddCitation = () => {
    // TODO: Open Add Citation Modal or Form
    console.log("Add citation to", currentArticle?.id);
  };

  if (detailLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  if (detailError || !currentArticle) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg font-medium">
          Error loading article
        </div>
        <p className="text-slate-500">{detailError || "Article not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ArticleDetail
        article={currentArticle}
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
        <ArticleForm
          onSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ArticleDetailPage;
