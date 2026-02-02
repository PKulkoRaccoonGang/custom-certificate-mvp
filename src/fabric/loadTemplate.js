import { Textbox, Rect, Circle, Image as FabricImage } from 'fabric'
import { validateTemplate, replacePlaceholders } from './templateSchema'

/**
 * Load a certificate template into a Fabric.js canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {object} template - Template object following the schema
 * @param {object} [placeholderValues] - Optional values for placeholders
 * @returns {Promise<void>}
 */
export async function loadTemplate(canvas, template, placeholderValues = {}) {
  if (!canvas) {
    throw new Error('Canvas instance is required')
  }

  // Validate template structure
  validateTemplate(template)

  // Clear existing canvas content
  canvas.clear()

  // Set canvas dimensions
  canvas.setDimensions({
    width: template.canvas.width,
    height: template.canvas.height,
  })

  // Apply background
  await applyBackground(canvas, template.background)

  // Load all elements
  const loadPromises = template.elements.map((element) =>
    loadElement(canvas, element, placeholderValues)
  )

  await Promise.all(loadPromises)

  // Render canvas
  canvas.requestRenderAll()

  console.log('Template loaded successfully:', template.name)
}

/**
 * Apply background to canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {object} background - Background configuration
 */
async function applyBackground(canvas, background) {
  if (!background) {
    canvas.backgroundColor = '#ffffff'
    return
  }

  switch (background.type) {
    case 'color':
      canvas.backgroundColor = background.value
      break

    case 'image':
      await loadBackgroundImage(canvas, background.value)
      break

    case 'gradient':
      // TODO: Implement gradient support
      console.warn('Gradient backgrounds not yet implemented')
      canvas.backgroundColor = '#ffffff'
      break

    default:
      canvas.backgroundColor = '#ffffff'
  }
}

/**
 * Load background image
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {string} imageUrl - Image URL or data URI
 */
async function loadBackgroundImage(canvas, imageUrl) {
  return new Promise((resolve, reject) => {
    FabricImage.fromURL(
      imageUrl,
      (img) => {
        if (!img) {
          reject(new Error('Failed to load background image'))
          return
        }

        // Scale image to fit canvas
        const scaleX = canvas.width / img.width
        const scaleY = canvas.height / img.height
        const scale = Math.max(scaleX, scaleY)

        img.scale(scale)
        img.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
        })

        canvas.setBackgroundImage(img, () => {
          canvas.requestRenderAll()
          resolve()
        })
      },
      { crossOrigin: 'anonymous' }
    )
  })
}

/**
 * Load a single element into the canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {object} element - Element configuration
 * @param {object} placeholderValues - Placeholder values
 */
async function loadElement(canvas, element, placeholderValues) {
  switch (element.type) {
    case 'text':
      return loadTextElement(canvas, element, placeholderValues)

    case 'image':
      return loadImageElement(canvas, element)

    case 'shape':
      return loadShapeElement(canvas, element)

    default:
      console.warn(`Unknown element type: ${element.type}`)
  }
}

/**
 * Load text element
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {object} element - Text element configuration
 * @param {object} placeholderValues - Placeholder values
 */
function loadTextElement(canvas, element, placeholderValues) {
  // Replace placeholders in content
  const content = replacePlaceholders(element.content, placeholderValues)

  const textbox = new Textbox(content, {
    left: element.position.left,
    top: element.position.top,
    fontFamily: element.style.fontFamily || 'Arial',
    fontSize: element.style.fontSize || 20,
    fontWeight: element.style.fontWeight || 'normal',
    fontStyle: element.style.fontStyle || 'normal',
    fill: element.style.fill || '#000000',
    textAlign: element.style.textAlign || 'left',
    opacity: element.style.opacity ?? 1,
    angle: element.style.angle || 0,
    selectable: element.editable ?? true,
    editable: element.editable ?? true,
  })

  // Store element metadata
  textbox.set('elementId', element.id)
  textbox.set('isTemplateElement', true)

  canvas.add(textbox)
}

/**
 * Load image element
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {object} element - Image element configuration
 */
async function loadImageElement(canvas, element) {
  return new Promise((resolve, reject) => {
    FabricImage.fromURL(
      element.src,
      (img) => {
        if (!img) {
          reject(new Error(`Failed to load image: ${element.src}`))
          return
        }

        img.set({
          left: element.position.left,
          top: element.position.top,
          opacity: element.opacity ?? 1,
          angle: element.angle || 0,
          selectable: true,
        })

        // Apply scaling if specified
        if (element.size) {
          if (element.size.width && element.size.height) {
            img.scaleToWidth(element.size.width)
            img.scaleToHeight(element.size.height)
          } else if (element.size.width) {
            img.scaleToWidth(element.size.width)
          } else if (element.size.height) {
            img.scaleToHeight(element.size.height)
          }

          if (element.size.scaleX) img.scaleX = element.size.scaleX
          if (element.size.scaleY) img.scaleY = element.size.scaleY
        }

        // Store element metadata
        img.set('elementId', element.id)
        img.set('isTemplateElement', true)

        canvas.add(img)
        resolve()
      },
      { crossOrigin: 'anonymous' }
    )
  })
}

/**
 * Load shape element
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {object} element - Shape element configuration
 */
function loadShapeElement(canvas, element) {
  let shape

  switch (element.shape) {
    case 'rectangle':
      shape = new Rect({
        left: element.position.left,
        top: element.position.top,
        width: element.size.width,
        height: element.size.height,
        fill: element.style?.fill || 'transparent',
        stroke: element.style?.stroke || '#000000',
        strokeWidth: element.style?.strokeWidth || 1,
        opacity: element.style?.opacity ?? 1,
        angle: element.style?.angle || 0,
      })
      break

    case 'circle':
      shape = new Circle({
        left: element.position.left,
        top: element.position.top,
        radius: element.size.height / 2, // Use height as diameter
        fill: element.style?.fill || 'transparent',
        stroke: element.style?.stroke || '#000000',
        strokeWidth: element.style?.strokeWidth || 1,
        opacity: element.style?.opacity ?? 1,
        angle: element.style?.angle || 0,
      })
      break

    default:
      console.warn(`Unknown shape type: ${element.shape}`)
      return
  }

  // Store element metadata
  shape.set('elementId', element.id)
  shape.set('isTemplateElement', true)

  canvas.add(shape)
}

/**
 * Export current canvas state as a template
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {object} metadata - Template metadata (id, name, description, version)
 * @returns {object} Template object
 */
export function exportAsTemplate(canvas, metadata) {
  const template = {
    id: metadata.id || `template-${Date.now()}`,
    name: metadata.name || 'Untitled Template',
    description: metadata.description || '',
    version: metadata.version || '1.0.0',
    canvas: {
      width: canvas.width,
      height: canvas.height,
    },
    background: {
      type: 'color',
      value: canvas.backgroundColor || '#ffffff',
    },
    elements: [],
  }

  // Export all objects as elements
  canvas.getObjects().forEach((obj) => {
    if (obj.type === 'textbox') {
      template.elements.push({
        type: 'text',
        id: obj.elementId || `text-${Date.now()}-${Math.random()}`,
        content: obj.text,
        editable: obj.editable ?? true,
        position: {
          left: obj.left,
          top: obj.top,
        },
        style: {
          fontFamily: obj.fontFamily,
          fontSize: obj.fontSize,
          fontWeight: obj.fontWeight,
          fontStyle: obj.fontStyle,
          fill: obj.fill,
          textAlign: obj.textAlign,
          opacity: obj.opacity,
          angle: obj.angle,
        },
      })
    }
    // Add more object types as needed
  })

  return template
}
