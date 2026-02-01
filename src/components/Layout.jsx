import Sidebar from './Sidebar'
import Canvas from './Canvas'

export default function Layout() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <Canvas />
    </div>
  )
}
