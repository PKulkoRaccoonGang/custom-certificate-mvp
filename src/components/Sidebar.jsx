export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Certificate Editor</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Templates
          </button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Text
          </button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Shapes
          </button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Images
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
          Export
        </button>
      </div>
    </aside>
  )
}
