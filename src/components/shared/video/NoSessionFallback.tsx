import { FaYoutube } from "react-icons/fa"

const NoSessionFallback = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      <FaYoutube className="text-white" size={24} />
      <p className="text-white font-semibold text-xs">Preview Not available</p>
      <p className="text-white/40 text-xs text-center">
        Please click on “Start Cropper”
        <br /> and then play video
      </p>
    </div>
  )
}

export default NoSessionFallback
