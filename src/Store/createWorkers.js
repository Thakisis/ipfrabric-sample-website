
import { SVGLoader } from 'three-stdlib'

export function createWorker() {
  const w = new Worker('/Worker.js')
  w.postMessage({ subject: "a", data: { SVGLoader, } })
  w.onmessage = (m) => { console.log(m) }
  return w
}
