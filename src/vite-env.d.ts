/// <reference types="vite/client" />

interface HTMLVideoElement {
  captureStream(frameRate?: number): MediaStream
}
