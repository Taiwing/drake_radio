import { MathUtils } from '../world/vendor/three.js'

export const config = {
  // Simulation parameters
  'time': 10_000,
  'spawn-rate': 0.01,
  get 'N'() { return this['time'] * this['spawn-rate'] },
  'speed': 1000,
  // Graphics parameters
  'points-count': 200_000,
  'cube-side': 50_000,
  'visual-unit': 10_000,
  get 'visual-light-year'() { return 1 / this['visual-unit'] },
  'rotation': 10,
  get 'rotation-per-sec'() { return MathUtils.degToRad(this['rotation']) },
  'live-color': 0x66acdc,
  'dead-color': 0xbf1111,
  'live-signal': false,
  'dead-signal': false,
  'kdtree-search': 1,
}
