import { window } from "@ephox/dom-globals"
import { displayKeepStylesConfirm } from "../Helpers/ConfirmHelper"
import { callBackendClean, callBackendNotify } from "./CallBackend"
import * as overlayHelper from "../Helpers/OverlayHelper"
import * as alertHelper from "../Helpers/AlertHelper"
import * as textHelper from "../Helpers/TextHelper"

export const handlePaste = (event: any, editor: any) => {
  cancelBubble(event)
  handlePasteImage(event, editor)
  handlePasteHtml(event, editor)
  handlePasteText(event, editor)
}

export const handlePasteHtml = (event: any, editor: any) => {
  const htmlRaw = getHtmlFromClipboard(event)
  const textRaw = getTextFromClipboard(event)
  const rtfRaw = getRtfFromClipboard(event)
  const culture = textHelper.getLocale(editor)

  if (htmlRaw && textRaw != htmlRaw) {
    displayKeepStylesConfirm(editor, (editor, keepStyles) => {
      alertHelper.hideAlert(editor)
      overlayHelper.displayWaitingOverlay(editor)
      cleanHtmlOnBackend(
        htmlRaw,
        rtfRaw,
        culture,
        keepStyles,
        (htmlCleaned, exception) => {
          replaceSelection(editor, htmlCleaned)
          overlayHelper.hideWaitingOverlay(editor)
          if (exception != "" && exception != undefined && exception != null) {
            alertHelper.displayAlert(editor, exception)
          }
        },
        () => {
          replaceSelection(editor, htmlRaw)
          overlayHelper.hideWaitingOverlay(editor)
          alertHelper.displayFailureAlert(editor)
        }
      )
    })
  }
}

export const handlePasteText = (event: any, editor: any) => {
  const htmlRaw = getHtmlFromClipboard(event)
  const textRaw = getTextFromClipboard(event)
  const culture = textHelper.getLocale(editor)

  if (textRaw && (!htmlRaw || textRaw === htmlRaw)) {
    replaceSelection(editor, textRaw)
    callBackendNotify("text", textRaw, culture)
  }
}

export const handlePasteImage = (event: any, editor: any) => {
  const htmlRaw = getHtmlFromClipboard(event)
  const textRaw = getTextFromClipboard(event)
  const culture = textHelper.getLocale(editor)

  if (!htmlRaw && !textRaw) {
    getImageFromClipboard(event, imgTag => {
      replaceSelection(editor, imgTag)
      callBackendNotify("image", imgTag, culture)
    })
  }
}

const getClipboardData = (event: any) => {
  const data = event.clipboardData || (window as any).clipboardData || event.originalEvent.clipboardData

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

const getRtfFromClipboard = (event: any) => {
  const data = getClipboardData(event)
  const pasteAsRtf = data.getData("text/rtf")

  return pasteAsRtf
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

const cleanHtmlOnBackend = (html: string, rtf: string, culture: string, keepStyles: boolean, success: (htmlCleaned: string, exception: string) => void, error: () => void) => {
  return callBackendClean(html, rtf, keepStyles, culture, success, error)
}

const replaceSelection = (editor: any, htmlCleaned: string) => {
  editor.execCommand("mceInsertContent", false, htmlCleaned)
}

const cancelBubble = (event: any) => {
  event.preventDefault()
}
