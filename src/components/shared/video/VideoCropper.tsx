import useEditorStore from "@/store/editor.store"
import React, { useCallback } from "react"
import { Rnd, DraggableData } from "react-rnd"

interface VideoCropperProps {
  recordAction: (
    action: "cropChange",
    coordinates?: [number, number, number, number],
    volume?: number,
    playbackRate?: number
  ) => void
}

const VideoCropper: React.FC<VideoCropperProps> = ({ recordAction }) => {
  const { crop, setCrop } = useEditorStore()

  const gridStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    pointerEvents: "none" as const,
  }

  const gridLineStyle = {
    border: "1px dashed white",
  }

  // fix type here
  const handleDragStop = useCallback(
    (__: any, d: DraggableData) => {
      const newCrop = { ...crop, x: d.x, y: d.y }
      setCrop(newCrop)
      recordAction("cropChange", [d.x, d.y, crop.width, crop.height])
    },
    [crop, setCrop, recordAction]
  )

  return (
    <Rnd
      className="absolute border-2 border-white"
      enableResizing={false}
      bounds="parent"
      size={{ width: crop.width, height: crop.height }}
      position={{ x: crop.x, y: crop.y }}
      onDragStop={handleDragStop}
    >
      <div style={gridStyle}>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
        <div style={gridLineStyle}></div>
      </div>
    </Rnd>
  )
}

export default VideoCropper
