import { useRef, useState, useCallback } from 'react'
import { CanvasContext } from './CanvasContext'
import {
  addTextElement,
  addImageFromFile,
  deleteSelectedElement,
  addShapeElement,
} from '../fabric/elementActions'

export default function CanvasProvider({ children }) {
  // Ref holding the Fabric.js canvas instance — set by EditorCanvas on mount
  const canvasRef = useRef(null)

  // The only canvas-derived state in React: which Fabric object is selected.
  // This is a direct reference to the Fabric object, not a copy.
  // EditorCanvas updates this via selection events.
  const [activeObject, setActiveObject] = useState(null)

  const addText = useCallback(() => {
    if (canvasRef.current) {
      addTextElement(canvasRef.current)
    }
  }, [])

  const addImage = useCallback(async (file) => {
    if (canvasRef.current) {
      await addImageFromFile(canvasRef.current, file)
    }
  }, [])

  const addShape = useCallback((type) => {
    if (canvasRef.current) {
      addShapeElement(canvasRef.current, type)
    }
  }, [])

  const deleteSelected = useCallback(() => {
    if (canvasRef.current) {
      deleteSelectedElement(canvasRef.current)
    }
  }, [])

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        activeObject,
        setActiveObject,
        addText,
        addImage,
        addShape,
        deleteSelected,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}
