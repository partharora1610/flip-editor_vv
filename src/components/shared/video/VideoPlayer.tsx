import React, { useState, useRef, useEffect } from "react"
import { IoVolumeHigh } from "react-icons/io5"
import { FaPlay } from "react-icons/fa"
import { TbPlayerPauseFilled } from "react-icons/tb"

import VideoCropper from "./VideoCropper"
import VideoCanvas from "./VideoCanvas"
import PlaybackRateDropdown from "./PlaybackRateDropdown"
import AspectRatioSelector from "./AspectRatioSelector"
import NoSessionFallback from "./NoSessionFallback"

import { VideoAction } from "@/types"
import useEditorStore from "@/store/editor.store"
import { formatTime } from "@/lib/utils"

const VideoPlayer: React.FC = () => {
  const {
    croppingSession,
    addVideoAction,
    sessionAspectRatios,
    crop,
    setCrop,
  } = useEditorStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerWrapperRef = useRef<HTMLDivElement>(null)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [volume, setVolume] = useState<number>(1)

  useEffect(() => {
    const containerWidth = 460
    const containerHeight = 307

    const width = containerHeight * sessionAspectRatios.value
    const newX = (containerWidth - width) / 2

    setCrop({ width, height: containerHeight, x: newX, y: 0 })
  }, [sessionAspectRatios, setCrop])

  // For playback rate
  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.playbackRate = playbackRate
    }
  }, [playbackRate])

  // initial load adding event listeners
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const updateCurrentTime = () => {
        setCurrentTime(video.currentTime)
      }
      video.addEventListener("timeupdate", updateCurrentTime)
      return () => {
        video.removeEventListener("timeupdate", updateCurrentTime)
      }
    }
  }, [])

  // record actionn function
  const recordAction = (
    action: VideoAction["action"],

    coordinates: [number, number, number, number] = [
      crop.x,
      crop.y,
      crop.width,
      crop.height,
    ],
    volume: number = videoRef.current?.volume || 0,
    playbackRate: number = videoRef.current?.playbackRate || 1
  ) => {
    const newAction: VideoAction = {
      timeStamp: videoRef.current?.currentTime || 0,
      coordinates,
      volume,
      playbackRate,
      action,
    }

    // adding action data
    addVideoAction(newAction)
  }

  // Player events
  const handlePlayPause = () => {
    const video = videoRef.current

    if (video) {
      if (video.paused) {
        video.play()
        recordAction("play")
        setIsPlaying(true)
      } else {
        video.pause()
        recordAction("pause")
        setIsPlaying(false)
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    e.target.style.background = `linear-gradient(to right, ${"white"} ${newValue}%, ${"black"} ${newValue}%)`

    const volume = parseFloat(e.target.value)

    if (videoRef.current) {
      videoRef.current.volume = volume
      setVolume(volume)
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(event.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleTimeMouseDown = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      recordAction(
        "seek_start",
        [crop.x, crop.y, crop.width, crop.height],
        videoRef.current.volume,
        videoRef.current.playbackRate
      )
      setIsPlaying(false)
    }
  }

  const handleTimeMouseUp = () => {
    if (videoRef.current) {
      recordAction(
        "seek_end",
        [crop.x, crop.y, crop.width, crop.height],
        videoRef.current.volume,
        videoRef.current.playbackRate
      )
      if (!videoRef.current.paused) {
        setIsPlaying(true)
      }
    }
  }

  const handleVolumeMouseUp = () => {
    if (videoRef.current) {
      recordAction(
        "volumeChange",
        [crop.x, crop.y, crop.width, crop.height],
        videoRef.current.volume,
        videoRef.current.playbackRate
      )
    }
  }

  const playbackChange = (playback: number) => {
    if (videoRef.current) {
      recordAction(
        "rateChange",
        [crop.x, crop.y, crop.width, crop.height],
        videoRef.current.volume,
        (videoRef.current.playbackRate = playback)
      )
    }
  }

  return (
    <>
      <div className="flex gap-24">
        <div>
          <div className="">
            <div
              ref={playerWrapperRef}
              className="bg-white w-[460px] h-[307px] rounded-lg overflow-hidden"
            >
              <video
                ref={videoRef}
                src="virat.mp4"
                className="w-full h-full object-fill "
              />

              {croppingSession && <VideoCropper recordAction={recordAction} />}
            </div>
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
                max={videoRef.current?.duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleTimeChange}
                onMouseDown={handleTimeMouseDown}
                onMouseUp={handleTimeMouseUp}
                className="h-1.5 rounded-xl w-full appearance-none bg-transparent cursor-pointer custom-range"
                style={{
                  background: `linear-gradient(to right, white ${(currentTime / (videoRef.current?.duration || 100)) * 100}%, gray ${(currentTime / (videoRef.current?.duration || 100)) * 100}%)`,
                }}
              />
            </div>

            <div className="flex justify-between mb-2 mt-2">
              <div className="text-xs text-gray-400">
                {formatTime(Math.floor(currentTime))} |{" "}
                {formatTime(Math.floor(videoRef.current?.duration || 0))}
              </div>

              <div className="flex items-center gap-1">
                <IoVolumeHigh className="text-white" size={18} />

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onMouseUp={handleVolumeMouseUp}
                  onChange={handleVolumeChange}
                  className="h-1 w-full appearance-none bg-transparent cursor-pointer custom-range volume-range"
                  style={{
                    background: `linear-gradient(to right, white ${volume * 100}%, gray ${volume * 100}%)`,
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <PlaybackRateDropdown
                setPlaybackRate={setPlaybackRate}
                playbackChange={playbackChange}
              />
              {croppingSession && <AspectRatioSelector />}
            </div>
          </div>
        </div>

        <div className="">
          <p className="text-center text-sm mb-2 text-gray-400">Preview</p>
          <div className="w-[460px] h-[307px] flex items-center justify-center">
            {croppingSession ? (
              <VideoCanvas videoElement={videoRef.current} crop={crop} />
            ) : (
              <NoSessionFallback />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoPlayer
