# Fabric.js Integration Guide

## Overview

Fabric.js has been integrated into the certificate editor with proper React lifecycle management, A4 landscape canvas sizing, and basic zoom controls.

## Files Created

### `src/fabric/initFabric.js`

Core canvas initialization logic extracted into a separate module.

**Exports:**
- `CANVAS_WIDTH` - Canvas width (1000px)
- `CANVAS_HEIGHT` - Canvas height (707px, maintains A4 ratio)
- `initializeFabricCanvas(element)` - Initialize Fabric canvas
- `disposeFabricCanvas(canvas)` - Clean up canvas instance
- `resetZoom(canvas)` - Reset zoom to 100%
- `setZoom(canvas, level)` - Set specific zoom level

**Features:**
- A4 landscape dimensions at 96 DPI (scaled for screen)
- Mouse wheel zoom (10% - 300%)
- Zoom constrained to prevent extreme values
- Proper event listener management

### `src/components/EditorCanvas.jsx`

React component wrapping the Fabric.js canvas.

**Features:**
- Proper mount/unmount lifecycle handling
- Canvas initialization on mount
- Cleanup on unmount (prevents memory leaks)
- Loading state indicator
- Canvas info overlay showing dimensions

**Lifecycle:**
1. Component mounts → `useEffect` initializes canvas
2. Canvas stored in `fabricCanvasRef.current`
3. Component unmounts → `disposeFabricCanvas()` cleans up

### `src/components/Canvas.jsx`

Updated to use `EditorCanvas` component instead of placeholder.

## Canvas Specifications

**Dimensions:**
- Width: 1000px
- Height: 707px
- Aspect ratio: 1.414:1 (A4 landscape)
- Background: White (#ffffff)

**Zoom Controls:**
- Method: Mouse wheel scroll
- Range: 10% - 300%
- Behavior: Zoom to cursor position

## Usage Examples

### Basic Usage (Current Implementation)

```jsx
import EditorCanvas from './components/EditorCanvas'

function Canvas() {
  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <EditorCanvas />
    </div>
  )
}
```

### Accessing Fabric Canvas Instance

To interact with the Fabric.js canvas from parent components:

```jsx
import { useRef, useEffect } from 'react'
import EditorCanvas from './components/EditorCanvas'

function CanvasContainer() {
  const fabricCanvasRef = useRef(null)

  // Option 1: Pass ref to child (requires modification to EditorCanvas)
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (canvas) {
      // Add objects, manipulate canvas, etc.
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 200,
        height: 100,
        fill: 'red'
      })
      canvas.add(rect)
    }
  }, [])

  return <EditorCanvas ref={fabricCanvasRef} />
}
```

### Using Zoom Controls

```jsx
import { resetZoom, setZoom } from '../fabric/initFabric'

function ZoomControls({ fabricCanvas }) {
  return (
    <div>
      <button onClick={() => resetZoom(fabricCanvas)}>Reset Zoom</button>
      <button onClick={() => setZoom(fabricCanvas, 1.5)}>Zoom 150%</button>
      <button onClick={() => setZoom(fabricCanvas, 0.5)}>Zoom 50%</button>
    </div>
  )
}
```

## Testing

```bash
# Build and verify integration
npm run build

# Start dev server
npm run dev
```

Visit http://localhost:5173 and:
1. Verify white canvas appears (1000×707px)
2. Use mouse wheel to zoom in/out
3. Check console for "Fabric.js canvas initialized" message
4. Verify no errors in console

## Next Steps

Ready to add:
- Canvas state management (Context API or Zustand)
- Tool implementations (text, shapes, images)
- Object manipulation (move, resize, rotate)
- Export functionality (PNG, PDF, etc.)
- Undo/redo functionality
- Canvas serialization/deserialization

## Common Issues

**Canvas not rendering:**
- Check console for errors
- Verify `canvasRef.current` is not null
- Ensure Fabric.js is properly imported

**Memory leaks:**
- Verify `disposeFabricCanvas()` is called in cleanup
- Check that canvas event listeners are removed

**Zoom not working:**
- Check browser console for errors
- Verify mouse wheel events aren't being blocked
- Test with `opt.e.preventDefault()` in place
