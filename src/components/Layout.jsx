import CanvasProvider from '../context/CanvasProvider'
import Sidebar from './Sidebar'
import Canvas from './Canvas'
import PropertiesPanel from './PropertiesPanel'

export default function Layout() {
  return (
    <CanvasProvider>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
    </CanvasProvider>
  )
}
