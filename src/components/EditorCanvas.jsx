import { useEffect, useRef } from 'react'
import {
  initializeFabricCanvas,
  disposeFabricCanvas,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../fabric/initFabric'

export default function EditorCanvas() {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)

  useEffect(() => {
    // Initialize Fabric.js canvas on mount
    if (canvasRef.current && !fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current = initializeFabricCanvas(canvasRef.current)
        console.log('Fabric.js canvas initialized')
      } catch (error) {
        console.error('Failed to initialize Fabric.js canvas:', error)
      }
    }

    // Cleanup on unmount
    return () => {
      if (fabricCanvasRef.current) {
        disposeFabricCanvas(fabricCanvasRef.current)
        fabricCanvasRef.current = null
        console.log('Fabric.js canvas disposed')
      }
    }
  }, [])

  return (
    <div className="relative">
      {/* Fabric.js canvas element */}
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-lg"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      />

      {/* Canvas info overlay */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        A4 Landscape ({CANVAS_WIDTH} × {CANVAS_HEIGHT}px) • Scroll to zoom
      </div>
    </div>
  )
}
