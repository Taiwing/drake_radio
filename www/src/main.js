import { World } from './world/world.js'
import { Controls } from './controls.js'
import initDrakeForm from './drake.js'
import { starPoints } from './simulation/stars.js'
import { galaxySpec } from './simulation/constants.js'

const main = () => {
  initDrakeForm()
  const container = document.querySelector('#scene-container')
  const stars = starPoints({
    centerRadius: galaxySpec.CENTER_DIAMETER / 2,
    radius: galaxySpec.DIAMETER / 2,
    height: galaxySpec.HEIGHT,
  })
  const world = new World({ container, stars, galaxySpec })
  new Controls({ world })
  world.render()
}

main()
