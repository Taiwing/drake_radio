import StatsModule from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/stats.module"

export class Stats {
  constructor() {
    this._stats = StatsModule()
    this.dom = this._stats.dom
  }

  tick() {
    this._stats.update()
  }
}
