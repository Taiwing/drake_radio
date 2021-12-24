import { PointLight } from '../vendor/three.js'

export const createLights = (opt = {}) => {
  const {
    color = 'white',
    intensity = 1,
    distance = 100,
    decay = 1,
    x = 0,
    y = 0,
    z = 0,
  } = opt
  const light = new PointLight(color, intensity, distance, decay)
  light.position.set(x, y, z)
  return light
}
