

export function createWorker() {
  const w = new Worker('/Worker.js')
  w.postMessage({ subject: "a", data: [1, 2, 3] })
  //w.onmessage = (m) => { console.log(m) }
  return w
}
