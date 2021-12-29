import { OrbitControls } from '../vendor/orbitControls.js'

export const createControls = ({ camera, canvas, dist }) => {
  const controls = new OrbitControls(camera, canvas)
  controls.enablePan = false
  controls.maxDistance = dist
  controls.tick = () => controls.update()
  return controls
}
