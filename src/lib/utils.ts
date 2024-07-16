import { FormattedVideoAction, VideoAction } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatActions(actions: VideoAction[]): FormattedVideoAction[] {
  const formattedActions: FormattedVideoAction[] = []

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    if (action.action === "seek_start") {
      const nextAction = actions[i + 1]
      if (nextAction && nextAction.action === "seek_end") {
        formattedActions.push({
          ...action,
          action: "seek",
          targetTimestamp: nextAction.timeStamp,
        })
      } else {
        formattedActions.push(action as FormattedVideoAction)
      }
      i++
    } else if (action.action != "pause") {
      formattedActions.push(action as FormattedVideoAction)
    }
  }

  return formattedActions
}

export function formatTime(seconds: number): string {
  const pad = (num: number): string => num.toString().padStart(2, "0")
  const hours = pad(Math.floor(seconds / 3600))
  const minutes = pad(Math.floor((seconds % 3600) / 60))
  const secs = pad(Math.floor(seconds % 60))

  return `${hours}:${minutes}:${secs}`
}
