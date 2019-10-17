import * as textHelper from "../Helpers/TextHelper"

let overlayDiv = document.createElement("div")
let overlayDivAppended = false
let overlayDivVisible = false

export const displayWaitingOverlay = (editor: any) => {
  var rect = editor.editorContainer.getBoundingClientRect()
  var processing = textHelper.getText(editor, "editor.overlay.processing")
  var processingIcon =
    "https://icon-library.net/images/spinner-icon-gif/spinner-icon-gif-24.jpg"

  if (!overlayDivAppended) {
    editor.editorContainer.parentNode.appendChild(overlayDiv)
    overlayDivAppended = true
  }

  overlayDiv.style.textAlign = "center"
  overlayDiv.style.verticalAlign = "middle"
  overlayDiv.style.display = "none"
  overlayDiv.style.position = "absolute"
  overlayDiv.style.backgroundColor = "#ffffff"
  overlayDiv.style.zIndex = (
    parseInt(editor.editorContainer.style.zIndex) + 1
  ).toString()

  overlayDiv.style.top = rect.top
  overlayDiv.style.right = rect.right
  overlayDiv.style.bottom = rect.bottom
  overlayDiv.style.left = rect.left

  overlayDiv.style.width = rect.right - rect.left + "px"
  overlayDiv.style.height = rect.height + "px"

  overlayDiv.style.opacity = "0.94"

  overlayDiv.innerHTML = `<table style='height: 100%; width: 100%;'><tr><td style='vertical-align: middle; text-align: center;'><span style='font-weight: bold; font-size: 18px; font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0 0 20px 0; display: block;'>${processing}</span><img src='${processingIcon}' style='height: 250px;' /></td></tr></table>`

  overlayDivVisible = true

  setTimeout(() => {
    if (overlayDivVisible === true) overlayDiv.style.display = "block"
  }, 1000)
}

export const hideWaitingOverlay = (editor: any) => {
  overlayDiv.style.display = "none"
  overlayDivVisible = false
}
