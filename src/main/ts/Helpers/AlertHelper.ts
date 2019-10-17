import * as textHelper from "./TextHelper"

let alertDiv = document.createElement("div")
let alertDivAppended = false

export const displayFailureAlert = (editor: any) => {
  displayAlert(editor, "editor.alert.failure")
}

export const displayAlert = (editor: any, code: string) => {
  var rect = editor.editorContainer.getBoundingClientRect()
  var rectInner = editor.editorContainer
    .getElementsByClassName("tox-sidebar-wrap")[0]
    .getBoundingClientRect()
  var message = textHelper.getText(editor, code)

  if (!alertDivAppended) {
    editor.editorContainer.parentNode.appendChild(alertDiv)
    alertDivAppended = true
  }

  alertDiv.style.textAlign = "center"
  alertDiv.style.verticalAlign = "middle"
  alertDiv.style.display = "none"
  alertDiv.style.position = "absolute"
  alertDiv.style.backgroundColor = "#fff1f0"
  alertDiv.style.border = "1px solid #ffa39e"
  alertDiv.style.borderRadius = "5px"

  alertDiv.style.top = rectInner.top - rect.top + 10 + "px"
  alertDiv.style.left = "15px"

  alertDiv.style.width = rect.right - rect.left - 20 + "px"
  alertDiv.style.minHeight = "35px"

  alertDiv.innerHTML = `<table style='height: 100%; width: 100%;'><tr><td style='vertical-align: middle; text-align: center; font-size: 16px; font-family: Arial, sans-serif; color: #000; margin: 0; padding: 10px 0;'>${message}</td></tr></table>`

  alertDiv.style.display = "block"
  alertDiv.style.zIndex = (
    parseInt(editor.editorContainer.style.zIndex) + 1
  ).toString()

  setTimeout(editor => hideAlert(editor), 4000)
}

export const hideAlert = (editor: any) => {
  alertDiv.style.display = "none"
}
