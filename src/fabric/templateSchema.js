/**
 * Certificate Template JSON Schema
 *
 * This file defines the structure for certificate templates.
 * Templates are JSON files that define the layout, styling, and content
 * of certificates that can be loaded into the Fabric.js canvas.
 */

/**
 * Template Schema Structure:
 *
 * {
 *   id: string              - Unique template identifier
 *   name: string            - Human-readable template name
 *   description: string     - Template description
 *   version: string         - Template version (semantic versioning)
 *   canvas: {
 *     width: number         - Canvas width in pixels
 *     height: number        - Canvas height in pixels
 *   },
 *   background: {
 *     type: 'color' | 'image' | 'gradient'
 *     value: string         - Color hex, image URL, or gradient definition
 *   },
 *   elements: [             - Array of canvas elements
 *     {
 *       type: 'text' | 'image' | 'shape'
 *       id: string          - Unique element identifier
 *       // ... type-specific properties
 *     }
 *   ]
 * }
 */

/**
 * Validate template structure
 * @param {object} template - Template object to validate
 * @returns {boolean} True if valid
 * @throws {Error} If template is invalid
 */
export function validateTemplate(template) {
  // Required top-level fields
  const requiredFields = ['id', 'name', 'version', 'canvas', 'elements']
  for (const field of requiredFields) {
    if (!template[field]) {
      throw new Error(`Template missing required field: ${field}`)
    }
  }

  // Validate canvas
  if (!template.canvas.width || !template.canvas.height) {
    throw new Error('Canvas must have width and height')
  }

  // Validate elements
  if (!Array.isArray(template.elements)) {
    throw new Error('Elements must be an array')
  }

  for (const element of template.elements) {
    if (!element.type || !element.id) {
      throw new Error('Each element must have type and id')
    }
  }

  return true
}

/**
 * Create an empty template
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {object} Empty template object
 */
export function createEmptyTemplate(width = 1000, height = 707) {
  return {
    id: `template-${Date.now()}`,
    name: 'Untitled Template',
    description: '',
    version: '1.0.0',
    canvas: {
      width,
      height,
    },
    background: {
      type: 'color',
      value: '#ffffff',
    },
    elements: [],
  }
}

/**
 * Text element schema
 * @typedef {object} TextElement
 * @property {'text'} type
 * @property {string} id - Unique identifier
 * @property {string} content - Text content (can include {{placeholders}})
 * @property {boolean} editable - Whether user can edit this element
 * @property {object} position - Element position
 * @property {number} position.left - X coordinate
 * @property {number} position.top - Y coordinate
 * @property {object} style - Text styling
 * @property {string} style.fontFamily - Font family name
 * @property {number} style.fontSize - Font size in pixels
 * @property {string} style.fontWeight - 'normal' | 'bold'
 * @property {string} style.fontStyle - 'normal' | 'italic'
 * @property {string} style.fill - Text color (hex)
 * @property {string} style.textAlign - 'left' | 'center' | 'right'
 * @property {number} [style.opacity] - Opacity (0-1)
 * @property {number} [style.angle] - Rotation angle in degrees
 */

/**
 * Image element schema
 * @typedef {object} ImageElement
 * @property {'image'} type
 * @property {string} id - Unique identifier
 * @property {string} src - Image URL or data URI
 * @property {object} position - Element position
 * @property {number} position.left - X coordinate
 * @property {number} position.top - Y coordinate
 * @property {object} size - Image dimensions
 * @property {number} [size.width] - Width (optional, maintains aspect ratio)
 * @property {number} [size.height] - Height (optional, maintains aspect ratio)
 * @property {number} [size.scaleX] - Scale factor X
 * @property {number} [size.scaleY] - Scale factor Y
 * @property {number} [opacity] - Opacity (0-1)
 * @property {number} [angle] - Rotation angle in degrees
 */

/**
 * Shape element schema
 * @typedef {object} ShapeElement
 * @property {'shape'} type
 * @property {string} id - Unique identifier
 * @property {string} shape - 'rectangle' | 'circle' | 'line'
 * @property {object} position - Element position
 * @property {number} position.left - X coordinate
 * @property {number} position.top - Y coordinate
 * @property {object} size - Shape dimensions
 * @property {number} size.width - Width
 * @property {number} size.height - Height (for circle, this is radius)
 * @property {object} style - Shape styling
 * @property {string} [style.fill] - Fill color (hex)
 * @property {string} [style.stroke] - Stroke color (hex)
 * @property {number} [style.strokeWidth] - Stroke width in pixels
 * @property {number} [style.opacity] - Opacity (0-1)
 * @property {number} [style.angle] - Rotation angle in degrees
 */

/**
 * Extract placeholders from text
 * @param {string} text - Text that may contain {{placeholders}}
 * @returns {string[]} Array of placeholder names
 */
export function extractPlaceholders(text) {
  const regex = /\{\{([^}]+)\}\}/g
  const matches = []
  let match

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim())
  }

  return matches
}

/**
 * Replace placeholders in text with values
 * @param {string} text - Text containing {{placeholders}}
 * @param {object} values - Object with placeholder values
 * @returns {string} Text with placeholders replaced
 */
export function replacePlaceholders(text, values) {
  let result = text

  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{{${key}}}`
    result = result.replace(new RegExp(placeholder, 'g'), value)
  }

  return result
}
