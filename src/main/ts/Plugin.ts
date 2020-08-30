import { handlePaste, handleBeforePaste } from './core/HandlePaste'

declare const tinymce: any

// Create the DIV that will receive the HTML paste for IE

const createIePasteDiv = editor => {
    var div = document.createElement('div')

    div.contentEditable = 'true'
    div.style.width = '0'
    div.style.height = '0'

    div.onpaste = event => {
        setTimeout(function () {
            console.log('Clipboard HTML: ' + editor.iePasteDiv.innerHTML)
            editor.lastIeHtmlPasted = editor.iePasteDiv.innerHTML
            editor.iePasteDiv.innerHTML = ''
            editor.fire('paste')
        }, 0)
    }

    document.body.appendChild(div)

    editor.iePasteDiv = div
}

// Setup the editor to handle paste event

const setup = (editor, url) => {
    const agent = navigator.userAgent.toLowerCase()
    const edge = agent.match(/edge[ \/](\d+.?\d*)/)
    const trident = agent.indexOf('trident/') > -1
    const ie = !!(edge || trident)

    editor.isIE = ie

    if (editor.isIE) {
        createIePasteDiv(editor)
        editor.on('beforepaste', event => {
            handleBeforePaste(event, editor)
        })
    }

    editor.on('paste', event => {
        handlePaste(event, editor)
    })
}

export default () => {
    tinymce.PluginManager.add('paste-it-cleaned-tiny', setup)
}
