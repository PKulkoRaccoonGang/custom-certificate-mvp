import EditorCanvas from './EditorCanvas'

export default function Canvas() {
  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto p-8">
      <EditorCanvas />
    </div>
  )
}
