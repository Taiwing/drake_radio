const randomCubePoint = ({ cubeSide }) => {
  const half = cubeSide / 2
  const x = Math.random() * cubeSide - half
  const y = Math.random() * cubeSide - half
  const z = Math.random() * cubeSide - half
  return { x, y, z }
}

export const starPoints = ({ count, cubeSide }) => {
  const points = []

  // Create random points in a cube
  while (points.length < count) {
    points.push(randomCubePoint({ cubeSide }))
  }

  return points
}
