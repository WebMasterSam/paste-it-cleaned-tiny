import { backend } from "../../../configs/backend"

export const callBackendClean = (
  html: string,
  rtf: string,
  keepStyles: boolean,
  success: (html: string) => void,
  error: () => void
) => {
  fetch(endpointClean(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ApiKey: getApiKey(),
      Config: getConfig()
    },
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify({
      html: html,
      rtf: rtf,
      hash: getHashCode(html),
      keepStyles: keepStyles
    })
  })
    .then(res => res.json())
    .then(t => {
      success(t.content)
    })
    .catch(e => {
      error()
    })
}

export const callBackendNotify = (pasteType: string, content: string) => {
  fetch(endpointNotify(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ApiKey: getApiKey(),
      Config: getConfig()
    },
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify({ pasteType: pasteType, hash: getHashCode(content) })
  })
    .then(res => res.json())
    .then()
    .catch()
}

export function endpointClean() {
  return backend.endPointClean
}

export function endpointNotify() {
  return backend.endPointNotify
}

function getApiKey() {
  var scripts = document.getElementsByTagName("script")
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf("pasteitcleaned") > -1) {
      var pa = scripts[i].src
        .split("?")
        .pop()
        .split("&")
      var p = {}

      for (var j = 0; j < pa.length; j++) {
        var kv = pa[j].split("=")
        p[kv[0]] = kv[1]
      }

      return p["apiKey"]
    }
  }

  return ""
}

function getConfig() {
  var scripts = document.getElementsByTagName("script")
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf("pasteitcleaned") > -1) {
      var pa = scripts[i].src
        .split("?")
        .pop()
        .split("&")
      var p = {}

      for (var j = 0; j < pa.length; j++) {
        var kv = pa[j].split("=")
        p[kv[0]] = kv[1]
      }

      return p["config"]
    }
  }

  return ""
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
