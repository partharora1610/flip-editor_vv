import { AspectRatio, Playback } from "@/types"

export const aspectRatios: AspectRatio[] = [
  { name: "9:18", value: 9 / 18 },
  { name: "9:16", value: 9 / 16 },
  { name: "4:3", value: 4 / 3 },
  { name: "3:4", value: 3 / 4 },
  { name: "1:1", value: 1 / 1 },
  { name: "4:5", value: 4 / 5 },
]

export const playbackRates: Playback[] = [
  { name: "0.5x", value: 0.5 },
  { name: "1x", value: 1 },
  { name: "1.5x", value: 1.5 },
  { name: "2x", value: 2 },
]
