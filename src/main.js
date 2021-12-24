/*
import { milkyWay } from './milky-way.js'

milkyWay()
*/
import { World } from './World/World.js'

const main = () => {
  const container = document.querySelector('#scene-container')
  const world = new World({ container })
  world.render()
}

main()
