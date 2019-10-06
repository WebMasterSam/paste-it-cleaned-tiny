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
      "Access-Control-Allow-Origin": "*"
    },
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify({ value: input })
  })
    .then(res => res.text())
    .then(t => {
      success(t)
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
      "Access-Control-Allow-Origin": "*"
    },
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify({ pasteType: pasteType })
  })
    .then(res => res.text())
    .then()
    .catch()
}

export function endpointClean() {
  return backend.endPointClean
}

export function endpointNotify() {
  return backend.endPointNotify
}
