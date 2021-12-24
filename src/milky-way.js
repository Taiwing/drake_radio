/*
import * as THREE from 'https://cdn.skypack.dev/three'
import {
  OrbitControls
} from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js'
*/

export const milkyWay = () => {
  const container = document.querySelector('#scene-container')
  const { clientWidth: width, clientHeight: height } = container
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  
  const renderer = new THREE.WebGLRenderer()
  const geometry = new THREE.BoxGeometry()
  //const geometry = new THREE.SphereGeometry()
  //const geometry = new THREE.TorusGeometry()
  const material = new THREE.MeshBasicMaterial({
    color: 'cyan',
    transparent: true,
    opacity: 0.5,
    wireframe: true,
    wireframeLinewidth: 2,
  });
  const prop = new THREE.Mesh(geometry, material)
  
  scene.add(prop)
  renderer.setSize(width, height)
  camera.position.z = 5
  container.appendChild(renderer.domElement)

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
  
  setInterval(() => {
  	prop.rotation.x += 0.01
  	prop.rotation.y += 0.01
  }, 5)
}
