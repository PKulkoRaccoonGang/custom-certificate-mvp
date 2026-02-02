import {
  Textbox,
  Image as FabricImage,
  Rect,
  Circle,
  Polygon,
  Line,
} from 'fabric'
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

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

const SHAPE_DEFAULTS = {
  fill: '#3b82f6',
  stroke: '#1d4ed8',
  strokeWidth: 2,
}

function addRectangle(canvas) {
  const rect = new Rect({
    left: CANVAS_WIDTH / 2,
    top: CANVAS_HEIGHT / 2,
    originX: 'center',
    originY: 'center',
    width: 200,
    height: 150,
    ...SHAPE_DEFAULTS,
  })

  canvas.add(rect)
  canvas.setActiveObject(rect)
}

function addCircle(canvas) {
  const circle = new Circle({
    left: CANVAS_WIDTH / 2,
    top: CANVAS_HEIGHT / 2,
    originX: 'center',
    originY: 'center',
    radius: 75,
    ...SHAPE_DEFAULTS,
  })

  canvas.add(circle)
  canvas.setActiveObject(circle)
}

function addTriangle(canvas) {
  const width = 160
  const height = 140

  // Isosceles triangle: apex at top-centre, base at bottom.
  // Points are in the object's local coordinate system (origin at bbox top-left).
  const triangle = new Polygon(
    [
      { x: width / 2, y: 0 },
      { x: 0, y: height },
      { x: width, y: height },
    ],
    {
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: 'center',
      originY: 'center',
      ...SHAPE_DEFAULTS,
    }
  )

  canvas.add(triangle)
  canvas.setActiveObject(triangle)
}

function addLine(canvas) {
  // Endpoints are absolute canvas coordinates; the midpoint lands at centre.
  const line = new Line(
    [
      CANVAS_WIDTH / 2 - 100,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH / 2 + 100,
      CANVAS_HEIGHT / 2,
    ],
    {
      stroke: '#e74c3c',
      strokeWidth: 3,
    }
  )

  canvas.add(line)
  canvas.setActiveObject(line)
}

const SHAPE_CREATORS = {
  rectangle: addRectangle,
  circle: addCircle,
  triangle: addTriangle,
  line: addLine,
}

/**
 * Add a shape element to the centre of the canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {'rectangle'|'circle'|'triangle'|'line'} type - Shape type
 */
export function addShapeElement(canvas, type) {
  const creator = SHAPE_CREATORS[type]
  if (creator) creator(canvas)
}
