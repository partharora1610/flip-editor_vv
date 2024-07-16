export interface AspectRatio {
  name: string
  value: number
}

export interface VideoAction {
  timeStamp: number
  coordinates: [number, number, number, number]
  volume: number
  playbackRate: number
  action:
    | "play"
    | "pause"
    | "volumeChange"
    | "rateChange"
    | "cropChange"
    | "seek_start"
    | "seek_end"
}

export interface Playback {
  name: string
  value: number
}

export interface Crop {
  width: number
  x: number
  y: number
  height: number
}

export interface FormattedVideoAction {
  timeStamp: number
  coordinates: [number, number, number, number]
  volume: number
  playbackRate: number
  action:
    | "pause"
    | "seek"
    | "play"
    | "volumeChange"
    | "cropChange"
    | "rateChange"
  targetTimestamp?: number
}
