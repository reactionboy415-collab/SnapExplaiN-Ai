import React, { useState } from "react";
import { FileText, Pill, Cpu, GraduationCap, Leaf, Sparkles, ChevronRight } from "lucide-react";
import { USE_CASES } from "../constants";
import { motion, AnimatePresence } from "motion/react";

// Icon mapper helper
const IconComponent: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case "FileText":
      return <FileText className={className} />;
    case "Pill":
      return <Pill className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "Leaf":
      return <Leaf className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

// Mock explanations matching the samples
const SAMPLE_EXPLANATIONS: Record<string, string> = {
  docs: `### 📄 Analysis Results: Government Utility Bill

**Primary Subject:** Official Electric Utility Invoice Detail  
**Entity:** City Grid Power Corp  
**Confidence Score:** 98.6%

#### 💡 Contextual Explanation & Vital Information:
1. **Urgent Action Due:** Your total balance of **$214.35** is due on **August 5, 2026**. Payment received after this date incurs an immediate **$15.00 late charge**.
2. **Usage Surge:** Consumption rose by **18%** this month. This corresponds to the historical temperature peak in early July, which likely drove intensive HVAC usage.
3. **Optimized Tip:** Enabling **EcoSave Scheduling** on your smart thermostat could reduce your baseline cooling consumption by approximately **11-14%** next month.

*Analysis generated automatically via SnapExplaiN AI. Re-scan at any time to parse changes.*`,

  medical: `### 💊 Analysis Results: Medical Prescription Label

**Primary Subject:** Prescription Warning & Label Parser  
**Drug Name:** Amoxicillin (500mg capsules)  
**Confidence Score:** 99.1%

#### 💡 Contextual Explanation & Vital Information:
1. **Instructions:** Take **1 capsule by mouth every 8 hours** (3 times daily) for a complete duration of **10 consecutive days**.
2. **Critical Warning:** **Finish the entire course** of this antibiotic even if you feel completely healthy. Stopping early may allow remaining bacteria to build antibiotic resistance.
3. **Safety Advice:** May cause mild stomach sensitivity. It is highly recommended to take each capsule with a meal or a glass of milk to soothe digestion.

*Analysis generated automatically via SnapExplaiN AI. Re-scan at any time to parse changes.*`,

  tech: `### 🚗 Analysis Results: Vehicle Instrument Cluster

**Primary Subject:** Automobile Warning Indicator  
**Identified Symbol:** Engine Coolant Temperature Warning Light (Thermometer with fluid waves)  
**Confidence Score:** 97.4%

#### 💡 Contextual Explanation & Vital Information:
1. **Meaning:** This indicator warns that the **engine is running dangerously close to overheating**.
2. **Urgent Action:** **Pull over safely immediately**. Leaving the engine running in this state can warp cylinder heads or cause catastrophic, irreversible engine block damage.
3. **Troubleshooting Steps:** Shut off the engine, open the hood to let heat escape, and inspect the coolant reservoir *only* once the engine has completely cooled. Do not unscrew the hot radiator cap!

*Analysis generated automatically via SnapExplaiN AI. Re-scan at any time to parse changes.*`,

  edu: `### 📊 Analysis Results: Photosynthesis Process Diagram

**Primary Subject:** Academic Biology Diagram (Photosynthesis Loop)  
**Confidence Score:** 96.2%

#### 💡 Contextual Explanation & Vital Information:
1. **Process Summary:** A visual overview showing how plants convert solar light energy, carbon dioxide ($CO_2$), and water ($H_2O$) into glucose (chemical food) and oxygen ($O_2$).
2. **Key Formulas:** Light energy drives the chemical reaction:  
   $$6CO_2 + 6H_2O \\xrightarrow{\\text{Light}} C_6H_{12}O_6 + 6O_2$$
3. **Key Structures:** The chloroplast, filled with chlorophyll pigment, is the cellular engine absorbing solar radiation in green plant cells.

*Analysis generated automatically via SnapExplaiN AI. Re-scan at any time to parse changes.*`,

  nature: `### 🌿 Analysis Results: Garden Plant Identifier

**Primary Subject:** Monstera Deliciosa (Swiss Cheese Plant)  
**Confidence Score:** 99.4%

#### 💡 Contextual Explanation & Vital Information:
1. **Species Details:** Fast-growing tropical evergreen climbing vine native to southern Mexican rainforests.
2. **Unique Feature:** The natural holes or splits in its wide leaves (fenestrations) allow forest winds to pass through safely and help sunlight reach lower leaves.
3. **Care Parameters:**
   - **Light:** Thrives in bright, indirect sunlight. Direct harsh rays will scorch leaves.
   - **Watering:** Water thoroughly only when the top 2 inches of potting mix feel dry. Requires excellent drainage.

*Analysis generated automatically via SnapExplaiN AI. Re-scan at any time to parse changes.*`
};

interface InteractiveShowcaseProps {
  onSelectExample: (base64Url: string) => void;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({ onSelectExample }) => {
  const [activeTab, setActiveTab] = useState<string>("docs");
  const activeCase = USE_CASES.find(c => c.id === activeTab) || USE_CASES[0];

  return (
    <div className="w-full" id="interactive-showcase-section">
      <div className="flex flex-col gap-6 lg:gap-10">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 max-w-3xl mx-auto">
          {USE_CASES.map(uc => {
            const isActive = activeTab === uc.id;
            return (
              <button
                key={uc.id}
                onClick={() => setActiveTab(uc.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-white dark:bg-zinc-950 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                }`}
                id={`tab-${uc.id}`}
              >
                <IconComponent name={uc.iconName} className="w-4 h-4" />
                <span>{uc.title.split(" & ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Demo Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto w-full">
          {/* Image & Preview Side */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-100 dark:bg-zinc-900 group">
              <img
                src={activeCase.exampleImage}
                alt={activeCase.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-1">
                  Ready Sample
                </span>
                <h4 className="text-lg font-bold text-white leading-tight">{activeCase.title}</h4>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/30 flex items-start gap-3">
              <IconComponent name={activeCase.iconName} className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {activeCase.description}
              </p>
            </div>
          </div>

          {/* AI Answer Sandbox Preview */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md p-6 lg:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                    Interactive Sandbox Demo
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400">Mode: Auto-Recognition</div>
              </div>

              {/* simulated markdown render */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-zinc dark:prose-invert max-w-none text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3"
                >
                  {/* format the sample markdown output manually so it looks gorgeous even without react-markdown in this mock */}
                  <div className="font-sans space-y-4 whitespace-pre-wrap">
                    {SAMPLE_EXPLANATIONS[activeTab]}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Live Upload pre-populate CTA */}
            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
                Want to test this model with your own live files instead?
              </p>
              <button
                onClick={() => {
                  // Pre-populate with standard sample base64 placeholder or use standard URL proxy
                  onSelectExample(activeCase.exampleImage);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group"
                id={`run-example-${activeTab}`}
              >
                <span>Run Interactive Demo</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
