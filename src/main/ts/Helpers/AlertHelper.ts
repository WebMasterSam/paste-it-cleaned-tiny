import * as textHelper from './TextHelper'

let alertDiv = document.createElement('div')
let alertDivAppended = false

export const displayFailureAlert = (editor: any) => {
    displayAlert(editor, 'editor.alert.failure')
}

export const displayRequestTooLongAlert = (editor: any) => {
    displayAlert(editor, 'editor.alert.requesTooLong')
}

export const displayAlert = (editor: any, code: string) => {
    var rect = editor.editorContainer.getBoundingClientRect()
    var rectInner = getAbsoluteBoundingRect(editor.editorContainer.getElementsByClassName('tox-edit-area')[0])
    var message = textHelper.getText(editor, code)

    if (!alertDivAppended) {
        document.body.appendChild(alertDiv)
        alertDivAppended = true
    }

    alertDiv.style.textAlign = 'center'
    alertDiv.style.verticalAlign = 'middle'
    alertDiv.style.display = 'none'
    alertDiv.style.position = 'absolute'
    alertDiv.style.backgroundColor = '#fff1f0'
    alertDiv.style.border = '1px solid #ffa39e'
    alertDiv.style.borderRadius = '5px'

    alertDiv.style.top = rectInner.top + 10 + 'px'
    alertDiv.style.left = rectInner.left + 10 + 'px'

    alertDiv.style.width = rect.right - rect.left - 25 + 'px'
    alertDiv.style.minHeight = '35px'

    alertDiv.innerHTML = `<table style='height: 100%; width: 100%;'><tr><td style='vertical-align: middle; text-align: center; font-size: 16px; font-family: Arial, sans-serif; color: #000; margin: 0; padding: 10px 0;'>${message}</td></tr></table>`

    alertDiv.style.display = 'block'
    alertDiv.style.zIndex = (parseInt(editor.editorContainer.style.zIndex) + 1).toString()

    setTimeout(editor => hideAlert(editor), 4000)
}

export const hideAlert = (editor: any) => {
    alertDiv.style.display = 'none'
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
