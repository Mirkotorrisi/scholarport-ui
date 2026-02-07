import React from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-600 p-2 rounded-lg text-white group-hover:bg-brand-700 transition-colors">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent">
              ScholarPort
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-2"
            >
              <BookOpen size={18} />
              Browse Articles
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} ScholarPort. Academic Portfolio
          Manager.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
