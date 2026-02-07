import React from "react";
import { Calendar } from "lucide-react";
import type { Citation } from "../types";

interface CitationListProps {
  citations: Citation[];
}

const CitationList: React.FC<CitationListProps> = ({ citations }) => {
  if (citations.length === 0) {
    return (
      <div className="text-slate-500 italic text-sm">No citations found.</div>
    );
  }

  return (
    <div className="space-y-4">
      {citations.map((citation) => (
        <div
          key={citation.id}
          className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:bg-white hover:shadow-sm transition-all"
        >
          <h4 className="font-medium text-slate-900 mb-1">{citation.title}</h4>
          <p className="text-sm text-slate-600 mb-2">
            {citation.authors.join(", ")}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{citation.year}</span>
            </div>
            {citation.doi && (
              <div className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                DOI: {citation.doi}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CitationList;
