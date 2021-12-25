import { Clock } from '../vendor/three.js'

export class Loop {
  constructor({ camera, scene, renderer }) {
    this._camera = camera
    this._scene = scene 
    this._renderer = renderer
    this._clock = new Clock()
    this.updatables = []
  }

  start() {
    this._renderer.setAnimationLoop(() => {
      this.tick()
      this._renderer.render(this._scene, this._camera)
    })
  }

  stop() {
    this._renderer.setAnimationLoop(null)
  }

  tick () {
    const delta = this._clock.getDelta()
    for (const object of this.updatables) {
      object.tick({ delta })
    }
  }
}
