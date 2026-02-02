import { useEffect, useRef } from 'react'
import {
  initializeFabricCanvas,
  disposeFabricCanvas,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../fabric/initFabric'
import { deleteSelectedElement } from '../fabric/elementActions'
import { useCanvasContext } from '../context/CanvasContext'

export default function EditorCanvas() {
  const htmlCanvasRef = useRef(null)
  const { canvasRef, setActiveObject } = useCanvasContext()

  // Initialize Fabric canvas and bind selection events
  useEffect(() => {
    if (!htmlCanvasRef.current || canvasRef.current) return

    try {
      const canvas = initializeFabricCanvas(htmlCanvasRef.current)
      canvasRef.current = canvas

      // Fabric fires these three events for all selection changes.
      // We read the active object directly from the canvas rather than
      // trusting e.selected, which can be stale in rapid sequences.
      const onSelection = () => setActiveObject(canvas.getActiveObject())
      const onCleared = () => setActiveObject(null)

      canvas.on('selection:created', onSelection)
      canvas.on('selection:updated', onSelection)
      canvas.on('selection:cleared', onCleared)
    } catch (error) {
      console.error('Failed to initialize Fabric.js canvas:', error)
    }

    return () => {
      if (canvasRef.current) {
        disposeFabricCanvas(canvasRef.current)
        canvasRef.current = null
        setActiveObject(null)
      }
    }
  }, [canvasRef, setActiveObject])

  // Global keyboard handler for Delete / Backspace
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return

      // Let native inputs handle their own keys
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const canvas = canvasRef.current
      if (!canvas) return

      const active = canvas.getActiveObject()
      if (!active) return

      // A Textbox in editing mode owns Backspace/Delete for its own text
      if (active.isEditing) return

      e.preventDefault()
      deleteSelectedElement(canvas)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvasRef])

  return (
    <div className="relative">
      <canvas
        ref={htmlCanvasRef}
        className="border border-gray-300 shadow-lg"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      />

      <div className="mt-2 text-xs text-gray-500 text-center">
        A4 Landscape ({CANVAS_WIDTH} × {CANVAS_HEIGHT}px) • Scroll to zoom •
        Delete to remove
      </div>
    </div>
  )
}
