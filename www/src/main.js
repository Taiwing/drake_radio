import { World } from './World/World.js'
import initDrakeForm from './drake.js'

const keyboardControls = ({ world }) => {
  let loop = false

  window.addEventListener('keydown', (key) => {
    switch (key.code) {
      case "Space":
        if (loop) {
          world.stop()
        } else {
          world.start()
        }
        loop = !loop
        break
      default:
        return
    }
    key.preventDefault()
  })
}

const main = () => {
  initDrakeForm()
  const container = document.querySelector('#scene-container')
  const world = new World({ container })
  keyboardControls({ world })
  world.render()
}

main()
