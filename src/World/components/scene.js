import { Color, Scene } from '../vendor/three.js'

export const createScene = (opt = {}) => {
  const { color = 'black' } = opt
  const scene = new Scene()
  scene.background = new Color(color)
  return scene
}
