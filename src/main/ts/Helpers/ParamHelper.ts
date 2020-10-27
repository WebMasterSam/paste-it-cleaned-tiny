export function getParamValueOrDefault(qsParamName: string, editorParamName: string, editor: any, defaultValue: string) {
    var qsValue = getQueryStringParamValue(qsParamName)
    var editorValue = getEditorParamValue(editorParamName, editor)

    if (qsValue != 'undefined' && qsValue != undefined && qsValue != null && qsValue != '') {
        console.debug('(QueryString) ' + qsParamName, qsValue)
        return qsValue
    }

    if (editorValue != 'undefined' && editorValue != undefined && editorValue != null && editorValue != '') {
        console.debug('(Param) ' + editorParamName, editorValue)
        return editorValue
    }

    console.debug('(Default) ' + qsParamName, defaultValue)
    return defaultValue
}

export function getEditorParamValue(paramName: string, editor: any) {
    var value = '' + editor.getParam(paramName)

    if (value != undefined && value != null && value != '') {
        return value
    }

    if (editor.settings) {
        value = '' + editor.settings[paramName]

        if (value != undefined && value != null && value != '') {
            return value
        }
    }

    return ''
}

export function getQueryStringParamValue(paramName: string) {
    var scripts = document.getElementsByTagName('script')

    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf('pasteitcleaned.js') > -1 || scripts[i].src.indexOf('pasteitcleaned.min.js') > -1) {
            var pa = scripts[i].src.split('?').pop().split('&')
            var p = {}

            for (var j = 0; j < pa.length; j++) {
                var kv = pa[j].split('=')
                p[kv[0]] = kv[1]
            }

            return p[paramName]
        }
    }

    return ''
}

export function getExternalPluginUrlParam(editor: any, paramName: string) {
    if (editor && editor.settings && editor.settings.external_plugins) {
        for (var url in editor.settings.external_plugins) {
            //console.debug(url, editor.settings.external_plugins[url])

            var value = editor.settings.external_plugins[url]

            if (url.indexOf('paste-it-cleaned') > -1 || value.indexOf('pasteitcleaned.js') > -1 || value.indexOf('pasteitcleaned.min.js') > -1) {
                var pa = value.split('?').pop().split('&')
                var p = {}

                for (var j = 0; j < pa.length; j++) {
                    var kv = pa[j].split('=')
                    p[kv[0]] = kv[1]
                }

                return p[paramName]
            }
        }
    }

    return ''
}
