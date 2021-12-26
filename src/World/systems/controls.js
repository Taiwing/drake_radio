import { OrbitControls } from '../vendor/orbitControls.js'

export const createControls = ({ camera, canvas }) => {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enablePan = false
  controls.tick = () => controls.update()
  return controls
}
