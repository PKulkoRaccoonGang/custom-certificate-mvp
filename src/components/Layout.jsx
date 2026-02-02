import CanvasProvider from '../context/CanvasProvider'
import Sidebar from './Sidebar'
import Canvas from './Canvas'

export default function Layout() {
  return (
    <CanvasProvider>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Canvas />
      </div>
    </CanvasProvider>
  )
}
