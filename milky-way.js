import * as THREE from 'https://cdn.skypack.dev/three'

const initThree = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
  	75, window.innerWidth / window.innerHeight, 0.1, 1000
  )
  
  const renderer = new THREE.WebGLRenderer()
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  
  scene.add(cube)
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.position.z = 5
  document.body.appendChild(renderer.domElement)

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
  
  setInterval(() => {
  	cube.rotation.x += 0.01
  	cube.rotation.y += 0.01
  }, 5)
}

initThree()
