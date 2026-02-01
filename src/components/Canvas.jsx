export default function Canvas() {
  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
      <div
        className="bg-white shadow-2xl"
        style={{ width: '800px', height: '600px' }}
      >
        <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-gray-400 text-lg">Canvas Area</p>
        </div>
      </div>
    </div>
  )
}
