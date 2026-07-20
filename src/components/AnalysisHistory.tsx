import React, { useState } from "react";
import { Trash2, History, ArrowRight, Calendar, HardDrive, Sparkles } from "lucide-react";
import { AnalysisItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AnalysisHistoryProps {
  items: AnalysisItem[];
  onSelectItem: (item: AnalysisItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  items,
  onSelectItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  return (
    <div className="w-full flex flex-col h-full" id="history-container">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200/80 dark:border-zinc-800/80 gap-2">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-zinc-950 dark:text-zinc-50">Local Analysis History</h3>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            {showConfirmClear ? (
              <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 p-1 rounded-lg border border-rose-200/60 dark:border-rose-900/40">
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold px-1">Clear all?</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setShowConfirmClear(false);
                  }}
                  className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-2 py-0.5 rounded-md transition-all shadow-sm cursor-pointer"
                  id="confirm-clear-yes"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="text-[10px] bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer"
                  id="confirm-clear-cancel"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                title="Clear all stored items"
                id="clear-all-history-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 mb-3 text-zinc-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No scans recorded yet</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px] mt-1 leading-relaxed">
            Upload your first photo to begin building your secure local offline-first history.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-1">
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              // Create short text snippet
              const plainText = item.result.replace(/[#*`_-]/g, "");
              const snippet = plainText.length > 50 ? plainText.substring(0, 50) + "..." : plainText;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="group relative flex items-center gap-3 p-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-sm cursor-pointer transition-all duration-300"
                  onClick={() => onSelectItem(item)}
                  id={`history-item-${item.id}`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
                    <img
                      src={item.image}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                        {item.fileSize}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {snippet}
                    </p>
                  </div>

                  {/* Actions overlay on hover */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                      title="Delete scan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-1 text-zinc-400 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
