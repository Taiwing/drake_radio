export class Resizer {
  constructor({ container, camera, renderer }) {
    const { clientWidth, clientHeight } = container

    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
  }
}
