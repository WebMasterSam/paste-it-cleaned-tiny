import { displayKeepStylesConfirm } from '../Helpers/ConfirmHelper'
import { callBackendClean, callBackendNotify } from './CallBackend'
import * as overlayHelper from '../Helpers/OverlayHelper'
import * as alertHelper from '../Helpers/AlertHelper'
import * as textHelper from '../Helpers/TextHelper'
import * as paramHelper from '../Helpers/ParamHelper'

const MAX_REQUEST_SIZE = 5 * 1024 * 1024 // 5 MB

export const focusHiddenArea = div => {
    div.innerHTML = ''
    div.focus()
}

export const handleBeforePaste = (event: any, editor: any) => {
    editor.lastIeHtmlPasted = ''
    focusHiddenArea(editor.iePasteDiv)
}

export const handlePaste = (event: any, editor: any) => {
    cancelBubble(event)
    handlePasteImage(event, editor)
    handlePasteHtmlRtf(event, editor)
    handlePasteText(event, editor)
}

export const handlePasteHtmlRtf = (event: any, editor: any) => {
    const htmlRaw = getHtmlFromClipboard(event, editor)
    const textRaw = getTextFromClipboard(event, editor)
    const rtfRaw = getRtfFromClipboard(event, editor)
    const culture = textHelper.getLocale(editor)

    if ((htmlRaw && textRaw != htmlRaw) || rtfRaw) {
        if (rtfRaw.length + htmlRaw.length > MAX_REQUEST_SIZE) {
            alertHelper.displayRequestTooLongAlert(editor)
            console.error('Clipboard request size: ' + (rtfRaw.length + htmlRaw.length) + ' > ' + MAX_REQUEST_SIZE + ' (' + MAX_REQUEST_SIZE / 1024 / 1024 + 'MB)')
        } else {
            console.debug('Clipboard request size: ' + (rtfRaw.length + htmlRaw.length) / 1024 + 'KB')
            displayKeepStylesConfirm(editor, (editor, keepStyles) => {
                alertHelper.hideAlert(editor)
                overlayHelper.displayProcessingMessage(editor)
                cleanHtmlOnBackend(
                    editor,
                    htmlRaw,
                    rtfRaw,
                    culture,
                    keepStyles,
                    (htmlCleaned, exception) => {
                        replaceSelection(editor, htmlCleaned)
                        overlayHelper.hideMessage(editor)
                        if (exception != '' && exception != undefined && exception != null) {
                            alertHelper.displayAlert(editor, exception)
                        }
                    },
                    () => {
                        replaceSelection(editor, htmlRaw)
                        overlayHelper.hideMessage(editor)
                        alertHelper.displayFailureAlert(editor)
                    }
                )
            })
        }
    }
}

export const handlePasteText = (event: any, editor: any) => {
    const htmlRaw = getHtmlFromClipboard(event, editor)
    const textRaw = getTextFromClipboard(event, editor)
    const rtfRaw = getRtfFromClipboard(event, editor)
    const culture = textHelper.getLocale(editor)
    const hasNotify = paramHelper.getParamValueOrDefault('notify', 'paste_it_cleaned_notify', editor, 'true')

    if (textRaw && (!htmlRaw || textRaw === htmlRaw) && (!rtfRaw || textRaw === rtfRaw)) {
        replaceSelection(editor, textRaw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\r\n/g, '<br />').replace(/\r/g, '<br />').replace(/\n/g, '<br />'))

        if (hasNotify == 'true') {
            callBackendNotify(editor, 'text', textRaw, culture)
        }
    }
}

export const handlePasteImage = (event: any, editor: any) => {
    const hasHandleImages = paramHelper.getParamValueOrDefault('handleImages', 'paste_it_cleaned_handle_images', editor, 'true')

    if (hasHandleImages == 'true') {
        const htmlRaw = getHtmlFromClipboard(event, editor)
        const textRaw = getTextFromClipboard(event, editor)
        const rtfRaw = getRtfFromClipboard(event, editor)
        const culture = textHelper.getLocale(editor)
        const hasNotify = paramHelper.getParamValueOrDefault('notify', 'paste_it_cleaned_notify', editor, 'true')

        if (!htmlRaw && !rtfRaw && !textRaw) {
            getImageFromClipboard(event, imgTag => {
                replaceSelection(editor, imgTag)
                if (hasNotify == 'true') {
                    callBackendNotify(editor, 'image', imgTag, culture)
                }
            })
        }
    }
}

const getClipboardData = (event: any) => {
    const data = event.clipboardData || (window as any).clipboardData || event.originalEvent.clipboardData

    return data
}

const getHtmlFromClipboard = (event: any, editor: any) => {
    const data = getClipboardData(event)

    if (editor.lastIeHtmlPasted != '' && editor.lastIeHtmlPasted != undefined) {
        return editor.lastIeHtmlPasted
    }

    try {
        return data.getData('text/html') || ''
    } catch {
        return ''
    }
}

const getTextFromClipboard = (event: any, editor: any) => {
    const data = getClipboardData(event)

    try {
        return data.getData('text') || ''
    } catch {
        try {
            return data.getData('text/plain') || ''
        } catch {
            return ''
        }
    }
}

const getRtfFromClipboard = (event: any, editor: any) => {
    const data = getClipboardData(event)

    try {
        return data.getData('text/rtf') || ''
    } catch {
        return ''
    }
}

const getImageFromClipboard = (event: any, cb: (imgTag: string) => void) => {
    const data = getClipboardData(event)

    for (var index in data.items) {
        var item = data.items[index]

        if (item.kind === 'file') {
            var blob = item.getAsFile()
            var reader = new FileReader()

            reader.onload = function (event) {
                var imageData = event.target.result as string
                var imgTag = `<img src="${imageData}" />`

                cb(imgTag)
            }

            reader.readAsDataURL(blob)
        }
    }
}

const cleanHtmlOnBackend = (editor: any, html: string, rtf: string, culture: string, keepStyles: boolean, success: (htmlCleaned: string, exception: string) => void, error: () => void) => {
    return callBackendClean(editor, html, rtf, keepStyles, culture, success, error)
}

const replaceSelection = (editor: any, htmlCleaned: string) => {
    editor.execCommand('mceInsertContent', false, htmlCleaned)
}

const cancelBubble = (event: any) => {
    event.preventDefault()
}
