import { createCamera } from './components/camera.js'
import { createScene } from './components/scene.js'
import { createCube } from './components/cube.js'
import { createLights } from './components/lights.js'
import { createControls } from './systems/controls.js'
import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'

export class World {
  constructor({ container }) {
    this._container = container
    this._camera = createCamera()
    this._scene = createScene()
    this._renderer = createRenderer()
    this._container.append(this._renderer.domElement)

    this._controls = createControls({
      camera: this._camera,
      canvas: this._renderer.domElement,
    })
    this._controls.addEventListener('change', () => this.render())
    this._loop = new Loop({
      camera: this._camera,
      scene: this._scene,
      renderer: this._renderer,
    })

    const cube = createCube()
    const light = createLights()
    this._loop.updatables.push(cube)
    this._loop.updatables.push(this._camera)
    this._loop.updatables.push(this._controls)
    this._scene.add(cube, light)
    const resizer = new Resizer({
      container: this._container, 
      camera: this._camera, 
      renderer: this._renderer, 
    })
  }

  render() {
    this._renderer.render(this._scene, this._camera)
  }

  start() {
    this._loop.start()
  }

  stop() {
    this._loop.stop()
  }
}
