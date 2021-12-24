export class Resizer {
  constructor({ container, camera, renderer }) {
    this._setSize({ container, camera, renderer })

    window.addEventListener('resize', () => {
      this._setSize({ container, camera, renderer })
      this.onResize()
    })
  }

  _setSize({ container, camera, renderer }) {
    const { clientWidth, clientHeight } = container

    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
  }

  onResize() {}
}
