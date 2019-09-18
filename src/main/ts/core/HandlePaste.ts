import { window } from "@ephox/dom-globals"

export const handlePaste = (event: any, editor: any) => {
  const html = getHtmlFromClipboard(event)
  const htmlCleaned = cleanHtmlOnBackend(html)

  // add backend response handling, errors, etc. paste default when backend fails... display warning message overlay
  cancelBubble(event)
  replaceSelection(editor, htmlCleaned)
}

const getHtmlFromClipboard = (event: any) => {
  let pasteAsHtml = (
    event.clipboardData || (window as any).clipboardData
  ).getData("text/html")

  return pasteAsHtml
}

const cleanHtmlOnBackend = (html: string) => {
  return "<p>Cleaneeddd from backend !!</p>" + html
}

const replaceSelection = (editor: any, htmlCleaned: string) => {
  editor.execCommand("mceInsertContent", false, htmlCleaned)
}

const cancelBubble = (event: any) => {
  event.preventDefault()
}
