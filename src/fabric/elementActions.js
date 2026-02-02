import { Textbox, Image as FabricImage } from 'fabric'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './initFabric'

/**
 * Add a text element to the center of the canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 */
export function addTextElement(canvas) {
  const text = new Textbox('Double-click to edit', {
    left: CANVAS_WIDTH / 2,
    top: CANVAS_HEIGHT / 2,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#000000',
    textAlign: 'center',
    editable: true,
  })

  canvas.add(text)
  canvas.setActiveObject(text)
}

/**
 * Add an image element from a File object
 * Scales the image down if it exceeds 50% of canvas dimensions
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {File} file - Image file from file input
 * @returns {Promise<void>}
 */
export function addImageFromFile(canvas, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      FabricImage.fromURL(e.target.result, (img) => {
        if (!img) {
          reject(new Error('Failed to load image'))
          return
        }

        // Scale down if larger than 50% of canvas
        const maxWidth = CANVAS_WIDTH * 0.5
        const maxHeight = CANVAS_HEIGHT * 0.5

        if (img.width > maxWidth || img.height > maxHeight) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
          img.scale(scale)
        }

        img.set({
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          originX: 'center',
          originY: 'center',
        })

        canvas.add(img)
        canvas.setActiveObject(img)
        resolve()
      })
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Delete the currently selected object from the canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 */
export function deleteSelectedElement(canvas) {
  const active = canvas.getActiveObject()

  if (active) {
    canvas.remove(active)
    canvas.discardActiveObject()
  }
}
