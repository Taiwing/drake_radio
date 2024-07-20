import Stats from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/stats.module"

export class FrameRate {
  constructor() {
    this._stats = Stats()
    this.dom = this._stats.dom
  }

  tick() {
    this._stats.update()
  }
}
