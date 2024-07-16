import { AspectRatio, Crop, VideoAction } from "@/types"
import { create } from "zustand"

type Store = {
  croppingSession: boolean
  startCroppingSession: () => void
  endCroppingSession: () => void
  sessionAspectRatios: AspectRatio
  updateSessionAspectRatios: (ratio: AspectRatio) => void

  maxDuration: number
  actionData: VideoAction[]
  addVideoAction: (action: VideoAction) => void

  crop: Crop
  setCrop: (c: Crop) => void

  resetStore: () => void
}

const useEditorStore = create<Store>()((set) => ({
  croppingSession: false,
  startCroppingSession: () => {
    set({ croppingSession: true })
    set({ actionData: [] })
  },

  updateSessionAspectRatios: (ratio: AspectRatio) => {
    if (ratio.value !== 0) {
      set({ sessionAspectRatios: ratio })
    }
  },
  crop: {
    width: 320,
    x: 50,
    y: 0,
    height: 360,
  },

  setCrop: (c) => {
    console.log("From set crop")
    console.log(c)
    set({ crop: c })
  },

  endCroppingSession: () => set({ croppingSession: false }),
  maxDuration: 0,
  sessionAspectRatios: { name: "16:9", value: 16 / 9 },

  actionData: [],
  addVideoAction: (action) => {
    set((state) => ({ actionData: [...state.actionData, action] }))
    set((state) => ({
      maxDuration: Math.max(state.maxDuration, action.timeStamp),
    }))
  },

  resetStore: () => {
    set({ croppingSession: false })
    set({ sessionAspectRatios: { name: "16:9", value: 16 / 9 } })
    set({ actionData: [] })
    set({ maxDuration: 0 })
    set({ crop: { width: 320, x: 50, y: 0, height: 360 } })
  },
}))

export default useEditorStore
