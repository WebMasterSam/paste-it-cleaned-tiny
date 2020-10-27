import { fetch } from 'whatwg-fetch'

import { backend } from '../../../configs/backend'

import * as paramHelper from '../Helpers/ParamHelper'

export const callBackendClean = (editor: any, html: string, rtf: string, keepStyles: boolean, culture: string, success: (html: string, exception: string) => void, error: () => void) => {
    fetch(endpointClean(editor, culture), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            ApiKey: getApiKey(editor),
            Config: getConfig(editor),
        },
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify({
            html: html,
            rtf: rtf,
            hash: getHashCode(html),
            keepStyles: keepStyles,
        }),
    })
        .then(res => res.json())
        .then(t => {
            success(t.content, t.exception)
        })
        .catch(e => {
            error()
        })
}

export const callBackendNotify = (editor: any, pasteType: string, content: string, culture: string) => {
    fetch(endpointNotify(editor, culture), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            ApiKey: getApiKey(editor),
            Config: getConfig(editor),
        },
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify({ pasteType: pasteType, hash: getHashCode(content) }),
    })
        .then(res => res.json())
        .then()
        .catch()
}

export function endpointClean(editor: any, culture: string) {
    var endpoint = paramHelper.getParamValueOrDefault('endpoint', 'paste_it_cleaned_endpoint', editor, backend.endPoint)

    if (endpoint == '/') {
        endpoint = '' // When a "/" is used as the value, it means it's a relative path
    }

    return endpoint + backend.clean + '?culture=' + culture
}

export function endpointNotify(editor: any, culture: string) {
    var endpoint = paramHelper.getParamValueOrDefault('endpoint', 'paste_it_cleaned_endpoint', editor, backend.endPoint)

    if (endpoint == '/') {
        endpoint = '' // When a "/" is used as the value, it means it's a relative path
    }

    return endpoint + backend.notify + '?culture=' + culture
}

function getApiKey(editor: any) {
    var externalPluginValue = '' + paramHelper.getExternalPluginUrlParam(editor, 'apiKey')
    var pluginValue = '' + paramHelper.getQueryStringParamValue('apiKey')

    if (externalPluginValue != 'undefined' && externalPluginValue != undefined && externalPluginValue != null && externalPluginValue != '') {
        console.debug('(ExternalPlugin) ' + 'ApiKey', externalPluginValue)
        return externalPluginValue
    }

    if (pluginValue != 'undefined' && pluginValue != undefined && pluginValue != null && pluginValue != '') {
        console.debug('(PluginScriptTag) ' + 'ApiKey', pluginValue)
        return pluginValue
    }

    return ''
}

function getConfig(editor: any) {
    var externalPluginValue = paramHelper.getExternalPluginUrlParam(editor, 'config')
    var pluginValue = paramHelper.getQueryStringParamValue('config')

    if (externalPluginValue != 'undefined' && externalPluginValue != undefined && externalPluginValue != null && externalPluginValue != '') {
        console.debug('(ExternalPlugin) ' + 'Config', externalPluginValue)
        return externalPluginValue
    }

    if (pluginValue != 'undefined' && pluginValue != undefined && pluginValue != null && pluginValue != '') {
        console.debug('(PluginScriptTag) ' + 'Config', pluginValue)
        return pluginValue
    }

    return ''
}

function getHashCode(str) {
    var hash = 0,
        i,
        chr

    if (str.length === 0) return hash.toString()

    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }

    return hash.toString()
}
