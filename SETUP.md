# Certificate Editor - Setup Complete

## Project Stack

- **React** 19.2.0
- **Vite** 7.2.4 (build tool)
- **Tailwind CSS** 4.1.18 (styling)
- **ESLint** (code quality)
- **Prettier** (code formatting)

## Available Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Sidebar.jsx     # Left sidebar with tools
│   └── Canvas.jsx      # Main canvas area
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration (Tailwind + Autoprefixer)
- `eslint.config.js` - ESLint rules (includes Prettier integration)
- `.prettierrc` - Prettier formatting rules
- `vite.config.js` - Vite build configuration

## Layout Components

### Sidebar (`src/components/Sidebar.jsx`)
- Fixed width (256px)
- Dark theme (gray-900)
- Tool buttons: Templates, Text, Shapes, Images
- Export button at bottom

### Canvas (`src/components/Canvas.jsx`)
- Flexible width (fills remaining space)
- Light gray background
- White canvas area (800x600px)
- Centered in viewport

### Layout (`src/components/Layout.jsx`)
- Flexbox container
- Combines Sidebar + Canvas
- Full viewport height/width

## Next Steps

The base layout is ready. You can now start adding:
- Canvas rendering logic
- State management
- Tool implementations
- Export functionality

Run `npm run dev` to start developing!
