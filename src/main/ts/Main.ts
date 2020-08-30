import 'promise-polyfill/src/polyfill'

import Plugin from './Plugin'

Plugin()

/*******
 * DO NOT EXPORT ANYTHING
 *
 * IF YOU DO ROLLUP WILL LEAVE A `paste-it-cleaned-tiny` GLOBAL ON THE PAGE
 *******/
