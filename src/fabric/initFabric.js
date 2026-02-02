import { Canvas } from 'fabric'

// A4 landscape dimensions at 96 DPI (scaled for screen display)
export const CANVAS_WIDTH = 1000
export const CANVAS_HEIGHT = 707 // Maintains A4 ratio (1.414:1)

/**
 * Initialize Fabric.js canvas with default settings
 * @param {HTMLCanvasElement} canvasElement - The canvas DOM element
 * @returns {Canvas} Initialized Fabric.js canvas instance
 */
export function initializeFabricCanvas(canvasElement) {
  if (!canvasElement) {
    throw new Error('Canvas element is required')
  }

  const canvas = new Canvas(canvasElement, {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#ffffff',
    selection: true,
    preserveObjectStacking: true,
  })

  // Enable zoom with mouse wheel
  setupZoomControls(canvas)

  return canvas
}

/**
 * Set up zoom controls for the canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 */
function setupZoomControls(canvas) {
  canvas.on('mouse:wheel', function (opt) {
    const delta = opt.e.deltaY
    let zoom = canvas.getZoom()

    // Calculate new zoom level
    zoom *= 0.999 ** delta

    // Constrain zoom between 10% and 300%
    if (zoom > 3) zoom = 3
    if (zoom < 0.1) zoom = 0.1

    // Zoom to point (where the mouse is)
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)

    opt.e.preventDefault()
    opt.e.stopPropagation()
  })
}

/**
 * Clean up canvas instance and remove event listeners
 * @param {Canvas} canvas - Fabric.js canvas instance to dispose
 */
export function disposeFabricCanvas(canvas) {
  if (canvas) {
    canvas.dispose()
  }
}

/**
 * Reset canvas zoom to 100%
 * @param {Canvas} canvas - Fabric.js canvas instance
 */
export function resetZoom(canvas) {
  if (canvas) {
    canvas.setZoom(1)
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
    canvas.requestRenderAll()
  }
}

/**
 * Set canvas zoom level
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {number} zoomLevel - Zoom level (1 = 100%, 2 = 200%, etc.)
 */
export function setZoom(canvas, zoomLevel) {
  if (canvas) {
    const clampedZoom = Math.max(0.1, Math.min(3, zoomLevel))
    canvas.setZoom(clampedZoom)
    canvas.requestRenderAll()
  }
}
