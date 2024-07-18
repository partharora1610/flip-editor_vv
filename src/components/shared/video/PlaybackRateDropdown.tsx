import React, { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { playbackRates } from "@/constants"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PlaybackRateDropdownProps {
  setPlaybackRate: (value: number) => void
  playbackChange: (playback: number) => void
}

const PlaybackRateDropdown: React.FC<PlaybackRateDropdownProps> = ({
  setPlaybackRate,
  playbackChange,
}) => {
  const [position, setPosition] = useState<string>("1x")

  useEffect(() => {
    const initialRate =
      playbackRates.find((rate) => rate.name === "1x")?.value || 1
    setPlaybackRate(initialRate)
  }, [setPlaybackRate])

  const handleValueChange = (name: string) => {
    const selectedRate = playbackRates.find((rate) => rate.name === name)
    setPosition(name)
    if (selectedRate) {
      setPlaybackRate(selectedRate.value)
      // Record the playback rate change
      playbackChange(selectedRate.value)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border border-white/20 rounded-[6px] text-white font-normal text-xs hover:text-white px-2 py-2">
          Playback Speed: <span className="ml-1 text-gray-400">{position}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#37393F] rounded-[6px] px-0 py-0 border-white/10">
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={handleValueChange}
        >
          <ScrollArea className="h-[100px] w-[132px] rounded-[6px]">
            <div className="flex flex-col ">
              {playbackRates.map((rate) => (
                <div
                  className="hover:text-white text-white hover:bg-gray-700"
                  key={rate.name}
                >
                  <DropdownMenuRadioItem value={rate.name}>
                    {rate.name}
                  </DropdownMenuRadioItem>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PlaybackRateDropdown
