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
    mode: "cors", // no-cors, cors, *same-origin
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

export function endpointClean() {
  return backend.endPoint
}
