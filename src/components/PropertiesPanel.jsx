import { useState, useEffect } from 'react'
import { useCanvasContext } from '../context/CanvasContext'

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Impact',
  'Trebuchet MS',
]

// Fabric fills can be a named colour (e.g. 'black') when loaded from a
// template.  <input type="color"> requires #RRGGBB, so fall back to black.
function toHex(fill) {
  return typeof fill === 'string' && fill.startsWith('#') ? fill : '#000000'
}

function TextProperties({ object, canvasRef }) {
  const [fontFamily, setFontFamily] = useState(object.fontFamily)
  const [fontSize, setFontSize] = useState(String(object.fontSize))
  const [color, setColor] = useState(toHex(object.fill))
  const [textAlign, setTextAlign] = useState(object.textAlign)

  useEffect(() => {
    setFontFamily(object.fontFamily)
    setFontSize(String(object.fontSize))
    setColor(toHex(object.fill))
    setTextAlign(object.textAlign)
  }, [object])

  const update = (prop, value) => {
    object.set(prop, value)
    canvasRef.current?.renderAll()
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Font Family</label>
        <select
          value={fontFamily}
          onChange={(e) => {
            setFontFamily(e.target.value)
            update('fontFamily', e.target.value)
          }}
          className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {(FONT_FAMILIES.includes(fontFamily)
            ? FONT_FAMILIES
            : [fontFamily, ...FONT_FAMILIES]
          ).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Font Size</label>
        <input
          type="number"
          value={fontSize}
          min={1}
          max={500}
          onChange={(e) => {
            setFontSize(e.target.value)
            const num = Number(e.target.value)
            if (num > 0) update('fontSize', num)
          }}
          className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value)
              update('fill', e.target.value)
            }}
            className="w-8 h-8 p-0 rounded cursor-pointer border border-gray-700"
          />
          <span className="text-xs text-gray-400">{color}</span>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Alignment</label>
        <div className="flex gap-1">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => {
                setTextAlign(align)
                update('textAlign', align)
              }}
              className={`flex-1 py-1.5 text-xs rounded capitalize ${
                textAlign === align
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ImageProperties({ object, canvasRef }) {
  const [scale, setScale] = useState(
    String(Math.round(object.scaleX * 100))
  )
  const [opacity, setOpacity] = useState(
    String(Math.round(object.opacity * 100))
  )

  useEffect(() => {
    setScale(String(Math.round(object.scaleX * 100)))
    setOpacity(String(Math.round(object.opacity * 100)))
  }, [object])

  const update = (props) => {
    object.set(props)
    canvasRef.current?.renderAll()
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Scale</span>
          <span>{scale}%</span>
        </label>
        <input
          type="range"
          min={1}
          max={300}
          value={scale}
          onChange={(e) => {
            setScale(e.target.value)
            const factor = Number(e.target.value) / 100
            update({ scaleX: factor, scaleY: factor })
          }}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <label className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Opacity</span>
          <span>{opacity}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity}
          onChange={(e) => {
            setOpacity(e.target.value)
            update({ opacity: Number(e.target.value) / 100 })
          }}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  )
}

export default function PropertiesPanel() {
  const { activeObject, canvasRef } = useCanvasContext()

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col border-l border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!activeObject ? (
          <p className="text-xs text-gray-500 text-center mt-8">
            Select an element to edit its properties
          </p>
        ) : activeObject.type === 'textbox' ? (
          <TextProperties object={activeObject} canvasRef={canvasRef} />
        ) : activeObject.type === 'image' ? (
          <ImageProperties object={activeObject} canvasRef={canvasRef} />
        ) : (
          <p className="text-xs text-gray-500 text-center mt-8">
            No editable properties for this element
          </p>
        )}
      </div>
    </aside>
  )
}
