import { backend } from "../../../configs/backend"

export const callBackendClean = (
  input: string,
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
    body: JSON.stringify({ value: input })
  })
    .then(res => res.json())
    .then(t => {
      success(t.content)
    })
    .catch(e => {
      console.log(e)
      error()
    })
}

export const callBackendNotify = (pasteType: string) => {
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
    body: JSON.stringify({ pasteType: pasteType })
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
