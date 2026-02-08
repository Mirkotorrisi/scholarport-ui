import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import { ArticlesProvider } from "./context/ArticlesProvider";

function App() {
  return (
    <BrowserRouter>
      <ArticlesProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ArticlesPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            {/* Redirect generic 404s to home for now */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ArticlesProvider>
    </BrowserRouter>
  );
}

export default App;
