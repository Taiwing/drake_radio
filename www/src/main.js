import { World } from './world/world.js'
import { Controls } from './controls.js'
import { starPoints } from './simulation/stars.js'
import { galaxySpec } from './simulation/constants.js'
import { setupDrakeConfig, setupDrakeDialog } from './drake.js'

const main = () => {
  setupDrakeConfig()
  const container = document.querySelector('#scene-container')
  const stars = starPoints({
    centerRadius: galaxySpec.CENTER_DIAMETER / 2,
    radius: galaxySpec.DIAMETER / 2,
    height: galaxySpec.HEIGHT,
  })
  const world = new World({ container, stars, galaxySpec })
  const controls = new Controls({ world })
  setupDrakeDialog({ controls })
  world.render()
}

main()
