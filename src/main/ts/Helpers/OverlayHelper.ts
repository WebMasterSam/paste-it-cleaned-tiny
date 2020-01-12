import * as textHelper from '../Helpers/TextHelper'

let overlayDiv = document.createElement('div')
let overlayDivAppended = false
let overlayDivVisible = false

export const displayWaitingOverlay = (editor: any) => {
    //var rect = editor.editorContainer.getBoundingClientRect()
    var rect = document.querySelector('.tox.tox-tinymce').getBoundingClientRect()
    var bodyRect = document.body.getBoundingClientRect()
    var offsetTop = rect.top - bodyRect.top
    var offsetLeft = rect.left - bodyRect.left

    var processing = textHelper.getText(editor, 'editor.overlay.processing')
    var processingIcon = 'https://icon-library.net/images/spinner-icon-gif/spinner-icon-gif-24.jpg'

    if (!overlayDivAppended) {
        document.querySelector('body').appendChild(overlayDiv)
        overlayDivAppended = true
    }

    overlayDiv.style.textAlign = 'center'
    overlayDiv.style.verticalAlign = 'middle'
    overlayDiv.style.display = 'none'
    overlayDiv.style.position = 'absolute'
    overlayDiv.style.backgroundColor = '#ffffff'
    overlayDiv.style.zIndex = '4'

    overlayDiv.style.top = offsetTop.toString() + 'px'
    overlayDiv.style.left = offsetLeft.toString() + 'px'
    //overlayDiv.style.right = rect.right.toString() + 'px'
    //overlayDiv.style.bottom = rect.bottom.toString()

    overlayDiv.style.width = (rect.right - rect.left).toString() + 'px'
    overlayDiv.style.height = rect.height.toString() + 'px'

    overlayDiv.style.opacity = '0.94'

    overlayDiv.innerHTML = `<table style='height: 100%; width: 100%;'><tr><td style='vertical-align: middle; text-align: center;'><span style='font-weight: bold; font-size: 18px; font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0 0 20px 0; display: block;'>${processing}</span><img src='${processingIcon}' style='height: 250px;' /></td></tr></table>`

    overlayDivVisible = true

    setTimeout(() => {
        if (overlayDivVisible === true) overlayDiv.style.display = 'block'
    }, 1000)
}

export const hideWaitingOverlay = (editor: any) => {
    overlayDiv.style.display = 'none'
    overlayDivVisible = false
}
