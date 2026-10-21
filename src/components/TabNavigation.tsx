interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'import', label: '📁 Import Files', description: 'Load CSV data' },
    { id: 'visualization', label: '📊 Visualization', description: 'View variable data' },
    { id: 'combination', label: '🔀 Combine', description: 'Merge variables' },
    { id: 'table', label: '📋 Master Table', description: 'Combined overview' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm">{tab.label}</div>
            <div className={`text-xs mt-0.5 ${activeTab === tab.id ? 'text-blue-200' : 'text-gray-500'}`}>
              {tab.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
