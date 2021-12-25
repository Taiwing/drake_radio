import { PerspectiveCamera } from '../vendor/three.js'

export const createCamera = (opt = {}) => {
  const {
    fov = 35,
    aspect = 1,
    near = 0.1,
    far = 100,
    x = 0,
    y = 0,
    z = 10,
  } = opt

  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(x, y, z)
  const zoom = 10
  let direction = 1
  camera.tick = ({ delta }) => {
    const move = zoom * delta * direction
    const done = camera.position.z % zoom
    const nextPos = camera.position.z + move
    if (direction > 0 && nextPos % zoom < done)
      direction = -1
    else if (direction < 0 && nextPos % zoom > done)
      direction = 1
    else
      camera.position.z = nextPos
  }
  return camera
}
