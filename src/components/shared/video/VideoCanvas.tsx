import React, { useEffect, useRef } from "react"

interface VideoCanvasProps {
  videoElement: HTMLVideoElement | null
  crop: { width: number; x: number; y: number; height: number }
}

const VideoCanvas: React.FC<VideoCanvasProps> = ({ videoElement, crop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const updateCanvas = () => {
      const canvas = canvasRef.current
      if (canvas && videoElement && videoElement.readyState >= 2) {
        const scaleX = videoElement.videoWidth / videoElement.clientWidth
        const scaleY = videoElement.videoHeight / videoElement.clientHeight

        canvas.width = crop.width
        canvas.height = crop.height

        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(
            videoElement,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
          )
        }
      }
    }

    const fps = 32
    const interval = setInterval(() => {
      updateCanvas()
    }, 1000 / fps)

    return () => clearInterval(interval)
  }, [videoElement, crop])

  return (
    <div className="">
      <canvas ref={canvasRef} className="border-none border-gray-400"></canvas>
    </div>
  )
}

export default VideoCanvas
