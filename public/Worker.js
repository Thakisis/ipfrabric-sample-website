self.onmessage = (m) => {
  console.log(m)
  const { subject, data } = m.data
  const response = [...data, ...[4, 5, 6]]
  postMessage(response)
}
