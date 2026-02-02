import { useRef, useState } from 'react'
import { useCanvasContext } from '../context/CanvasContext'

const SHAPES = [
  { type: 'rectangle', label: 'Rectangle' },
  { type: 'circle', label: 'Circle' },
  { type: 'triangle', label: 'Triangle' },
  { type: 'line', label: 'Line' },
]

export default function Sidebar() {
  const fileInputRef = useRef(null)
  const [showShapes, setShowShapes] = useState(false)
  const { activeObject, addText, addShape, addImage, deleteSelected } =
    useCanvasContext()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await addImage(file)
      // Reset so selecting the same file again fires onChange
      e.target.value = ''
    }
  }

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

          <button
            onClick={addText}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Text
          </button>

          {/* Shapes toggle + collapsible sub-menu */}
          <div>
            <button
              onClick={() => setShowShapes((s) => !s)}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Shapes
            </button>

            {showShapes && (
              <div className="ml-6 mt-1 space-y-1">
                {SHAPES.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      addShape(type)
                      setShowShapes(false)
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm rounded text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Images
          </button>

          {/* Hidden file input — triggered by the Images button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </nav>

        {/* Delete button — only visible when an object is selected */}
        {activeObject && (
          <div className="px-4 pt-2">
            <button
              onClick={deleteSelected}
              className="w-full text-left px-4 py-2 rounded bg-red-900 hover:bg-red-800 transition-colors text-red-200"
            >
              Delete selected
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
          Export
        </button>
      </div>
    </aside>
  )
}
