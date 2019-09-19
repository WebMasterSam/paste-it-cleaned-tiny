import { window } from "@ephox/dom-globals"
import { callBackendClean } from "./CallBackend"

export const handlePaste = (event: any, editor: any) => {
  const htmlRaw = getHtmlFromClipboard(event)

  cancelBubble(event)

  cleanHtmlOnBackend(
    htmlRaw,
    htmlCleaned => {
      replaceSelection(editor, htmlCleaned)
    },
    () => {
      replaceSelection(editor, htmlRaw)
      //display warning message overlay
    }
  )
}

const getHtmlFromClipboard = (event: any) => {
  const pasteAsHtml = (
    event.clipboardData || (window as any).clipboardData
  ).getData("text/html")
  const pasteAsText = (
    event.clipboardData || (window as any).clipboardData
  ).getData("text")
  return pasteAsHtml || pasteAsText
}

const cleanHtmlOnBackend = (
  html: string,
  success: (htmlCleaned: string) => void,
  error: () => void
) => {
  return callBackendClean(html, success, error)
}

const replaceSelection = (editor: any, htmlCleaned: string) => {
  editor.execCommand("mceInsertContent", false, htmlCleaned)
}

const cancelBubble = (event: any) => {
  event.preventDefault()
}
