import * as textHelper from '../Helpers/TextHelper'

let messageDiv = document.createElement('div')
let messageDivAppended = false
let messageDivVisible = false

export const displayProcessingMessage = (editor: any) => {
    var processingIcon = 'https://cdn.pasteitapi.com/v1/loading.gif'
    displayMessage(editor, processingIcon, 'editor.overlay.processing')
}

export const displayMessage = (editor: any, icon: string, code: string) => {
    var rectInner = getAbsoluteBoundingRect(editor.getContentAreaContainer())
    var message = textHelper.getText(editor, code)

    if (!messageDivAppended) {
        document.body.appendChild(messageDiv)
        messageDivAppended = true
    }

    messageDiv.style.textAlign = 'center'
    messageDiv.style.verticalAlign = 'middle'
    messageDiv.style.display = 'none'
    messageDiv.style.position = 'absolute'
    messageDiv.style.backgroundColor = '#fafafa'
    messageDiv.style.border = '1px solid #eeeeee'
    messageDiv.style.borderRadius = '5px'

    messageDiv.style.top = rectInner.top + 10 + 'px'
    messageDiv.style.left = rectInner.left + 10 + 'px'

    //messageDiv.style.width = rect.right - rect.left - 25 + 'px'
    messageDiv.style.minHeight = '35px'

    messageDiv.innerHTML = `<table style='height: 100%; width: 100%;'><tr><td style='padding: 0 0 0 10px;'><img src='${icon}' style='height: 18px;' /></td><td style='vertical-align: middle; text-align: center; font-size: 16px; font-family: Arial, sans-serif; color: #555; font-weight: bold; margin: 0; padding: 5px 15px 5px 5px;'>${message}</td></tr></table>`

    messageDiv.style.zIndex = (parseInt(editor.editorContainer.style.zIndex) + 1).toString()

    messageDivVisible = true

    setTimeout(() => {
        if (messageDivVisible === true) messageDiv.style.display = 'block'
    }, 1000)
}

export const hideMessage = (editor: any) => {
    messageDiv.style.display = 'none'
    messageDivVisible = false
}

function getAbsoluteBoundingRect(el) {
    var doc = document,
        win = window,
        body = doc.body,
        // pageXOffset and pageYOffset work everywhere except IE <9.
        offsetX = win.pageXOffset !== undefined ? win.pageXOffset : ((doc.documentElement || body.parentNode || body) as any).scrollLeft,
        offsetY = win.pageYOffset !== undefined ? win.pageYOffset : ((doc.documentElement || body.parentNode || body) as any).scrollTop,
        rect = el.getBoundingClientRect()

    if (el !== body) {
        var parent = el.parentNode

        // The element's rect will be affected by the scroll positions of
        // *all* of its scrollable parents, not just the window, so we have
        // to walk up the tree and collect every scroll offset. Good times.
        while (parent !== body) {
            offsetX += parent.scrollLeft
            offsetY += parent.scrollTop
            parent = parent.parentNode
        }
    }

    return {
        bottom: rect.bottom + offsetY,
        height: rect.height,
        left: rect.left + offsetX,
        right: rect.right + offsetX,
        top: rect.top + offsetY,
        width: rect.width,
    }
}
