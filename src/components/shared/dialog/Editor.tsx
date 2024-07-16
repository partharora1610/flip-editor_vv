import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import VideoPlayer from "../video/VideoPlayer"
import useEditorStore from "@/store/editor.store"
import { useState } from "react"
import PreviewVideo from "../video/PreviewVideo"
import { toast } from "react-toastify"

type Session = "preview" | "generate"

const Editor = () => {
  const [session, setSession] = useState<Session>("preview")
  return (
    <>
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="max-w-[1080px] bg-light-bg border-none ">
          <div className="py-4 px-5">
            <div className="flex justify-between items-center">
              <div className="text-white font-bold text-base">Cropper</div>
              <ModeToggleComponent session={session} setSession={setSession} />
              <div></div>
            </div>
          </div>
          {session === "preview" ? (
            <>
              <div className="mt-5 px-5">
                <VideoPlayer />
              </div>
              <ActionBarBottom />
            </>
          ) : (
            <div className="mt-5 px-5">
              <PreviewVideo videoSrc="try.mp4" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

const ActionBarBottom = () => {
  const {
    startCroppingSession,
    endCroppingSession,
    croppingSession,
    resetStore,
    actionData,
  } = useEditorStore()

  const downloadJson = () => {
    const dataStr = JSON.stringify(actionData, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "videoActions.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="mt-24">
      <div className="w-full h-[1px] bg-gray-50/20 mb-5"></div>
      <div className="flex justify-between px-5 pb-6">
        <div className="flex gap-4 ">
          <Button
            onClick={startCroppingSession}
            className={`bg-primary-600  rounded-xl text-white hover:bg-primary-600/90`}
          >
            Start Cropper
          </Button>

          <Button
            disabled={!croppingSession}
            onClick={endCroppingSession}
            className={`bg-primary-600  rounded-xl text-white hover:bg-primary-600/90`}
          >
            Remove Cropper
          </Button>
          <Button
            disabled={!croppingSession || actionData.length == 0}
            className={`bg-primary-600  rounded-xl text-white hover:bg-primary-600/90`}
            onClick={downloadJson}
          >
            Download JSON
          </Button>
        </div>
        <div>
          {croppingSession && (
            <Button
              onClick={resetStore}
              className={`rounded-xl text-white bg-gray-500`}
            >
              Reset Cropping Session
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface ModeToggleProps {
  session: Session
  setSession: (session: Session) => void
}

const ModeToggleComponent: React.FC<ModeToggleProps> = ({
  session,
  setSession,
}) => {
  const { actionData } = useEditorStore()

  return (
    <div className="bg-[#45474E] rounded-[6px] px-1 py-1 text-white">
      <Button
        onClick={() => setSession("preview")}
        className={`${session == "preview" && "bg-[#37393F] hover:bg-[#37393F]"} rounded-xl`}
      >
        Preview Session
      </Button>
      <Button
        className={`${session == "generate" && "bg-[#37393F] hover:bg-[#37393F]"} rounded-xl`}
        onClick={() => {
          if (actionData.length == 0) {
            toast.info("Please start cropping session")
            return
          }

          setSession("generate")
        }}
      >
        Generate Session
      </Button>
    </div>
  )
}

export default Editor
