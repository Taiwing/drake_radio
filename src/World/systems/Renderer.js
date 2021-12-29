import { WebGLRenderer } from '../vendor/three.js'

export class Renderer extends WebGLRenderer {
  constructor() {
    super({ antialias: true })
    this.updatables = []
  }

  _render(scene, camera) {
    this._onRender()
    this.render(scene, camera)
  }

  _onRender() {
    for (const object of this.updatables) {
      object.onRender()
    }
  }
}
