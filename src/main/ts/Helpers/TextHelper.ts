import * as frCa from '../../i18n/fr-CA'
import * as frFr from '../../i18n/fr-FR'
import * as enUs from '../../i18n/en-US'

const labels = [frCa, frFr, enUs]

export function getLocale(editor: any) {
    if (editor.settings.language == '' || editor.settings.language == undefined || editor.settings.language == null) {
        return 'en-US'
    }

    return editor.settings.language.replace('_', '-')
}

export function getText(editor: any, selector: string) {
    return t(getLocale(editor), selector)
}

function t(locale: string, selector: string) {
    var label = ''

    labels.forEach(l => {
        if (l.t.locale.toLowerCase().trim() == locale.toLowerCase().trim()) {
            if (selector in l.t.resources) {
                label = l.t.resources[selector]
            }
        }
    })

    if (label != '') {
        return label
    }

    if (locale != 'en-US') {
        return t('en-US', selector)
    }

    return selector
}
