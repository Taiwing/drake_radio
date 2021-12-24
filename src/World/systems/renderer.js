import { WebGLRenderer } from '../vendor/three.js'

export const createRenderer = () => {
  const renderer = new WebGLRenderer({ antialias: true })
  return renderer
}
