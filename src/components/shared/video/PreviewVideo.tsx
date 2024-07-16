import { formatActions, formatTime } from "@/lib/utils"
import useEditorStore from "@/store/editor.store"
import { FormattedVideoAction } from "@/types"
import React, { useRef, useEffect, useState } from "react"
import { FaPlay } from "react-icons/fa"
import { IoVolumeHigh } from "react-icons/io5"
import { TbPlayerPauseFilled } from "react-icons/tb"

interface PreviewVideoProps {
  videoSrc: string
}

const PreviewVideo: React.FC<PreviewVideoProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const animationFrameRef = useRef<number>()
  const { actionData, maxDuration, crop } = useEditorStore()
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [x, setX] = useState<number>(actionData[0].coordinates[0])

  const formattedActions: FormattedVideoAction[] = formatActions(actionData)
  const width = crop.width
  const height = crop.height

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const checkActions = () => {
      const currentTime = videoElement.currentTime

      const relevantAction = formattedActions.find(
        (action) => Math.abs(action.timeStamp - currentTime) < 0.5
      )

      if (relevantAction) {
        switch (relevantAction.action) {
          case "pause":
            videoElement.pause()
            break
          case "seek":
            if (relevantAction.targetTimestamp !== undefined) {
              videoElement.currentTime = relevantAction.targetTimestamp
            }
            break
          case "play":
            videoElement.play()
            break
          case "volumeChange":
            videoElement.volume = relevantAction.volume
            break
          case "cropChange":
            if (relevantAction.coordinates) {
              setX(relevantAction.coordinates[0])
            }
            break
          case "rateChange":
            if (relevantAction.playbackRate) {
              videoElement.playbackRate = relevantAction.playbackRate
            }
            break
        }
      }

      animationFrameRef.current = requestAnimationFrame(checkActions)
    }

    animationFrameRef.current = requestAnimationFrame(checkActions)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [formattedActions])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
      if (videoElement.currentTime >= maxDuration) {
        videoElement.pause()
        videoElement.currentTime = maxDuration
      }
    }

    videoElement.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

  const handlePlayPause = () => {
    const video = videoRef.current

    if (video) {
      if (video.paused) {
        video.play()
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value)
    if (videoRef.current) {
      videoRef.current.volume = volume
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(event.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return (
    <>
      <div className="w-[460px] m-auto">
        <div className="flex flex-col">
          <div
            className="rounded-lg overflow-clip m-auto relative"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              className="min-w-[460px] min-h-[307px] absolute top-0 left-0 object-fill"
              style={{
                marginLeft: `-${x}px`,
              }}
            />
          </div>
          <div className="mt-3">
            <div className="flex gap-2 items-center">
              {!isPlaying ? (
                <FaPlay className="text-white" onClick={handlePlayPause} />
              ) : (
                <TbPlayerPauseFilled
                  className="text-white"
                  onClick={handlePlayPause}
                />
              )}

              <input
                type="range"
                min="0"
                max={maxDuration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleTimeChange}
                className="h-1 w-full bg-transparent pointer-events-auto cursor-pointer"
              />
            </div>

            <div className="flex justify-between mb-2 mt-2">
              <div className="text-xs text-gray-400">
                {formatTime(Math.floor(currentTime))} |{" "}
                {formatTime(Math.floor(maxDuration || 0))}
              </div>

              {/* <div className="flex items-center gap-1">
                <IoVolumeHigh className="text-white" size={18} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  onChange={handleVolumeChange}
                  className="h-1 w-full bg-transparent pointer-events-auto cursor-pointer"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PreviewVideo
