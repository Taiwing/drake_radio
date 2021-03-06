import { Clock } from '../vendor/three.js'

export class Loop {
  constructor({ camera, scene, renderer }) {
    this._camera = camera
    this._scene = scene 
    this._renderer = renderer
    this._clock = new Clock()
    this._delta = this._clock.getDelta()
    this.updatables = []
  }

  start() {
    this._delta = this._clock.getDelta()
    this._renderer.setAnimationLoop(() => {
      this._tick()
      this._renderer._render(this._scene, this._camera)
    })
  }

  stop() {
    this._renderer.setAnimationLoop(null)
  }

  _tick () {
    this._delta = this._clock.getDelta()
    for (const object of this.updatables) {
      object.tick({ delta: this._delta })
    }
  }
}
