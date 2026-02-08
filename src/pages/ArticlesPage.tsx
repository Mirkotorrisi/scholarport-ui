import React, { useState } from "react";
import ArticleFilters from "../components/ArticleFilters";
import ArticleList from "../components/ArticleList";
import Modal from "../components/ui/Modal";
import ArticleForm from "../components/ArticleForm";
import { Plus } from "lucide-react";
import { useArticles } from "../hooks/useArticles";

const ArticlesPage: React.FC = () => {
  const { error, initCreate } = useArticles();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    initCreate();
    setIsModalOpen(true);
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
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} /> Add Article
        </button>
      </div>

      <ArticleFilters />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      <ArticleList />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Article"
      >
        <ArticleForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ArticlesPage;
