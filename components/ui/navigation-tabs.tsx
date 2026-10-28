"use client";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "nueva", label: "Nueva Simulación" },
  { id: "guardadas", label: "Simulaciones Guardadas" },
];

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 border-b border-white/5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-2 text-sm transition ${
                isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="uppercase tracking-[0.25em] text-xs">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-red-500 to-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
