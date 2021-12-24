import { createCamera } from './components/camera.js'
import { createScene } from './components/scene.js'
import { createCube } from './components/cube.js'
import { createLights } from './components/lights.js'
import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'

export class World {
  constructor({ container }) {
    this._container = container
    this._camera = createCamera()
    this._scene = createScene()
    this._renderer = createRenderer()
    container.append(this._renderer.domElement)

    const cube = createCube()
    const light = createLights()
    this._scene.add(cube, light)
    const resizer = new Resizer({
      container: this._container, 
      camera: this._camera, 
      renderer: this._renderer, 
    })
    resizer.onResize = () => { this.render() }
  }

  render() {
    this._renderer.render(this._scene, this._camera)
  }
}
