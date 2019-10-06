import { window } from "@ephox/dom-globals"
import { callBackendClean, callBackendNotify } from "./CallBackend"

export const handlePaste = (event: any, editor: any) => {
  cancelBubble(event)
  handlePasteHtml(event, editor)
  handlePasteText(event, editor)
  handlePasteImage(event, editor)
}

export const handlePasteHtml = (event: any, editor: any) => {
  const htmlRaw = getHtmlFromClipboard(event)
  const textRaw = getTextFromClipboard(event)

  if (htmlRaw && textRaw != htmlRaw) {
    cleanHtmlOnBackend(
      htmlRaw,
      htmlCleaned => {
        replaceImagesWithDataUri(editor, htmlCleaned)
      },
      () => {
        replaceImagesWithDataUri(editor, htmlRaw)
        //display warning message overlay, 2s display
      }
    )
  }
}

export const handlePasteText = (event: any, editor: any) => {
  const htmlRaw = getHtmlFromClipboard(event)
  const textRaw = getTextFromClipboard(event)

  if (textRaw && (!htmlRaw || textRaw === htmlRaw)) {
    replaceSelection(editor, textRaw)
    callBackendNotify("text")
  }
}

export const handlePasteImage = (event: any, editor: any) => {
  const htmlRaw = getHtmlFromClipboard(event)
  const textRaw = getTextFromClipboard(event)

  if (!htmlRaw && !textRaw) {
    getImageFromClipboard(event, imgTag => {
      replaceSelection(editor, imgTag)
      callBackendNotify("image")
    })
  }
}

const getClipboardData = (event: any) => {
  const data =
    event.clipboardData ||
    (window as any).clipboardData ||
    event.originalEvent.clipboardData

  return data
}

const getHtmlFromClipboard = (event: any) => {
  const data = getClipboardData(event)
  const pasteAsHtml = data.getData("text/html")

  return pasteAsHtml
}

const getTextFromClipboard = (event: any) => {
  const data = getClipboardData(event)
  const pasteAsText = data.getData("text")

  return pasteAsText
}

const getImageFromClipboard = (event: any, cb: (imgTag: string) => void) => {
  const data = getClipboardData(event)

  for (var index in data.items) {
    var item = data.items[index]

    if (item.kind === "file") {
      var blob = item.getAsFile()
      var reader = new FileReader()

      reader.onload = function(event) {
        var imageData = event.target.result as string
        var imgTag = `<img src="${imageData}" />`

        cb(imgTag)
      }

      reader.readAsDataURL(blob)
    }
  }
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

const replaceImagesWithDataUri = (editor: any, htmlCleaned: string) => {
  const toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
      )

  toDataURL(
    "https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0"
  ).then(dataUrl => {
    console.log("RESULT:", dataUrl)
    const htmlWithImageUri = htmlCleaned
    replaceSelection(editor, htmlWithImageUri)
  })
}
