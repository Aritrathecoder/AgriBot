"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Leaf,
  Sun,
  Bug,
  FlaskConical,
  TrendingUp,
  Sprout,
  Lightbulb,
} from "lucide-react";

interface CropData {
  id: string;
  name: string;
  hindi_name: string;
  emoji: string;
  description: string;
  soil: { type: string; ph: string };
  water: { needs: string; irrigation: string };
  seasons: { sowing: string; harvest: string; duration: string };
  growth_stages: { stage: string; duration: string; notes: string }[];
  common_pests: { name: string; hindi: string; symptoms: string; solution: string }[];
  fertilizers: { nitrogen: string; phosphorus: string; potash: string };
  yield: { average: string; potential: string };
  varieties: string[];
  tips: string[];
}

interface CropDetailPanelProps {
  crop: CropData;
}

export default function CropDetailPanel({ crop }: CropDetailPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Leaf },
    { id: "stages", label: "Growth", icon: Sprout },
    { id: "pests", label: "Pests", icon: Bug },
    { id: "tips", label: "Tips", icon: Lightbulb },
  ];

  return (
    <div
      className="animate-fade-up my-2 rounded-2xl border border-border overflow-hidden bg-surface shadow-sm"
      id={`crop-detail-${crop.id}`}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{crop.emoji}</span>
          <div className="text-left">
            <h3 className="font-semibold text-sm text-foreground">
              {crop.name}
            </h3>
            <p className="text-xs text-muted">{crop.hindi_name} • {crop.seasons.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full">
            Yield: {crop.yield.average}
          </span>
          {isExpanded ? (
            <ChevronUp size={18} className="text-muted" />
          ) : (
            <ChevronDown size={18} className="text-muted" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="border-t border-border animate-fade-up">
          {/* Tab navigation */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4">
            {activeTab === "overview" && (
              <div className="space-y-3">
                <p className="text-xs text-muted leading-relaxed">{crop.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard icon={Leaf} label="Soil" value={`${crop.soil.type}, pH ${crop.soil.ph}`} />
                  <InfoCard icon={Droplets} label="Water" value={crop.water.needs} />
                  <InfoCard icon={Sun} label="Sowing" value={crop.seasons.sowing} />
                  <InfoCard icon={TrendingUp} label="Harvest" value={crop.seasons.harvest} />
                  <InfoCard icon={FlaskConical} label="N-P-K" value={`${crop.fertilizers.nitrogen} | ${crop.fertilizers.phosphorus} | ${crop.fertilizers.potash}`} />
                  <InfoCard icon={TrendingUp} label="Potential Yield" value={crop.yield.potential} />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">Varieties</p>
                  <div className="flex flex-wrap gap-1.5">
                    {crop.varieties.map((v) => (
                      <span key={v} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "stages" && (
              <div className="space-y-2">
                {crop.growth_stages.map((stage, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {i + 1}
                      </div>
                      {i < crop.growth_stages.length - 1 && (
                        <div className="w-0.5 h-6 bg-primary/20 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-foreground">{stage.stage}</p>
                        <span className="text-[10px] text-muted bg-surface-elevated px-1.5 py-0.5 rounded">
                          {stage.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">{stage.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pests" && (
              <div className="space-y-3">
                {crop.common_pests.map((pest, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-elevated/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Bug size={13} className="text-red-500" />
                      <p className="text-xs font-semibold text-foreground">
                        {pest.name} <span className="text-muted font-normal">({pest.hindi})</span>
                      </p>
                    </div>
                    <p className="text-[11px] text-muted mb-1">
                      <strong>Symptoms:</strong> {pest.symptoms}
                    </p>
                    <p className="text-[11px] text-primary">
                      <strong>Solution:</strong> {pest.solution}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tips" && (
              <div className="space-y-2">
                {crop.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Lightbulb size={13} className="text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="p-2.5 rounded-xl bg-surface-elevated/50 border border-border/50">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className="text-primary" />
        <p className="text-[10px] font-medium text-muted uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-[11px] text-foreground leading-tight">{value}</p>
    </div>
  );
}
