import { useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { aspectRatios } from "@/constants"
import useEditorStore from "@/store/editor.store"
import { ScrollArea } from "@/components/ui/scroll-area"

const AspectRatioSelector = () => {
  const { sessionAspectRatios, updateSessionAspectRatios } = useEditorStore()

  useEffect(() => {
    const initialRatio = aspectRatios.find((ratio) => ratio.name === "9:16")
    updateSessionAspectRatios(initialRatio!)
  }, [updateSessionAspectRatios])

  const handleValueChange = (name: string) => {
    const selectedRatio = aspectRatios.find((ratio) => ratio.name === name)

    if (selectedRatio) {
      updateSessionAspectRatios(selectedRatio)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border border-white/10 rounded-[6px] text-white font-normal text-xs hover:text-white px-2 py-2">
          Cropper Aspect Ratio:{" "}
          <span className="ml-1 text-gray-400">{sessionAspectRatios.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#37393F] rounded-[6px] px-0 py-0 border-white/10">
        <DropdownMenuRadioGroup
          value={sessionAspectRatios.name}
          onValueChange={handleValueChange}
        >
          <ScrollArea className="h-[100px] w-[160px] rounded-[6px]">
            <div className="flex flex-col ">
              {aspectRatios.map((ratio) => (
                <div className="hover:text-white  text-white  hover:bg-gray-700">
                  <DropdownMenuRadioItem
                    className="cursor-pointer py-2"
                    key={ratio.name}
                    value={ratio.name}
                  >
                    {ratio.name}
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

export default AspectRatioSelector
