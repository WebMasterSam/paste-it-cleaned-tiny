import * as textHelper from "./TextHelper"

let overlayDiv = document.createElement("div")
let confirmDiv = document.createElement("div")
let stylesNode = document.createElement("style")
let overlayDivAppended = false
let actualScroll = null

const styles = `
.paste-it-cleaned-overlay {
  position: fixed;
  display: block;
  background-color: #ffffff;
  top: 0px;
  left: 0px;
  z-index: 100000000;
}
.paste-it-cleaned-section {
  padding: 12px;
  font-family: Arial, sans-serif;
}
.paste-it-cleaned-button {
  padding: 5px 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  border-radius: 4px;
}
.paste-it-cleaned-button:first-of-type {
  margin-right: 10px;
}
.paste-it-cleaned-button-normal {
  background-color: #f0f0f0;
  border: 1px solid #cccccc;
  color: #000;
}
.paste-it-cleaned-button-normal:hover {
  background-color: #e3e3e3;
}
.paste-it-cleaned-button-primary {
  background-color: #337ab7;
  border: 1px solid #204d74;
  color: #fff;
}
.paste-it-cleaned-button-primary:hover {
  background-color: #286090;
}
.paste-it-cleaned-header {
  border-bottom: 1px solid #555555;
  font-size: 20px;
}
.paste-it-cleaned-body {
  font-size: 16px;
}
.paste-it-cleaned-buttons {
  border-top: 1px solid #555555;
}
.paste-it-cleaned-alert {
  border: 1px solid #cccccc;
  border-radius: 10px;
  position: fixed;
  display: block;
  background-color: #ffffff;
  z-index: 100000001;
  -webkit-box-shadow: 10px 10px 70px -28px rgba(0,0,0,0.60);
  -moz-box-shadow: 10px 10px 70px -28px rgba(0,0,0,0.60);
  box-shadow: 10px 10px 70px -28px rgba(0,0,0,0.60);
}


`

interface Button {
  type: string
  label: string
  fn: (editor: any) => void
}

export const displayKeepStylesConfirm = (
  editor: any,
  cb: (editor, keepStyles) => void
) => {
  const buttons = [
    {
      type: "primary",
      label: "editor.confirm.keepStyles.keep",
      fn: editor => {
        hideConfirm(editor)
        cb(editor, true)
      }
    },
    {
      type: "normal",
      label: "editor.confirm.keepStyles.discard",
      fn: editor => {
        hideConfirm(editor)
        cb(editor, false)
      }
    }
  ]
  displayConfirm(
    editor,
    "editor.confirm.keepStyles.title",
    "editor.confirm.keepStyles.body",
    buttons
  )
}

export const displayConfirm = (
  editor: any,
  title: string,
  body: string,
  buttons: Button[]
) => {
  var width = window.innerWidth
  var height = window.innerHeight
  var titleText = textHelper.getText(editor, title)
  var bodyText = textHelper.getText(editor, body)
  var buttonsHtml = ""
  var fnAssigns = []

  buttons.forEach(b => {
    var text = textHelper.getText(editor, b.label)
    var type = b.type
    var className = "paste-it-cleaned-button paste-it-cleaned-button-" + type
    var id = `paste-it-cleaned-confirm-button-${b.type}-${b.label}`

    buttonsHtml =
      buttonsHtml + `<button id='${id}' class='${className}'>${text}</button>`

    fnAssigns.push(ed => {
      document.getElementById(id).onclick = () => b.fn(ed)
    })
  })

  if (!overlayDivAppended) {
    stylesNode.innerHTML = styles
    stylesNode.type = "text/css"
    window.document.head.appendChild(stylesNode)
    window.document.body.appendChild(overlayDiv)
    window.document.body.appendChild(confirmDiv)
    actualScroll = window.document.body.style.overflow
    overlayDivAppended = true
  }

  // ----------------------------------------------------------
  // Body
  // ----------------------------------------------------------
  window.document.body.style.overflow = "hidden"

  // ----------------------------------------------------------
  // Background overlay
  // ----------------------------------------------------------
  overlayDiv.className = "paste-it-cleaned-overlay"

  overlayDiv.style.display = "block"
  overlayDiv.style.width = width + "px"
  overlayDiv.style.height = height + "px"
  overlayDiv.style.opacity = `0.75`

  // ----------------------------------------------------------
  // Confirm div
  // ----------------------------------------------------------

  confirmDiv.className = "paste-it-cleaned-alert"

  confirmDiv.style.display = "block"
  confirmDiv.style.width = "500px"

  confirmDiv.innerHTML = `
  <div class="paste-it-cleaned-section paste-it-cleaned-header">${titleText}</div>
  <div class="paste-it-cleaned-section paste-it-cleaned-body">${bodyText}</div>
  <div class="paste-it-cleaned-section paste-it-cleaned-buttons">${buttonsHtml}</div>
  `

  confirmDiv.style.top = height / 2 - confirmDiv.offsetHeight / 2 + "px"
  confirmDiv.style.left = width / 2 - 250 + "px"

  fnAssigns.forEach(fn => fn(editor))
}

export const hideConfirm = (editor: any) => {
  overlayDiv.style.display = "none"
  confirmDiv.style.display = "none"
  window.document.body.style.overflow = actualScroll
}
