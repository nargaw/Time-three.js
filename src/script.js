import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


//link to DOM element
const canvas = document.querySelector('.webgl')

//create scene
const scene = new THREE.Scene()

//create a test box
const testBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
)
//scene.add(testBox)



//create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100)
scene.add(camera)
camera.position.z = 10

//add controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true

//add light
const ambientLight = new THREE.AmbientLight(0xff0000, 0.5)
scene.add(ambientLight)

//create renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)
renderer.setClearColor(0xffff)

//Time

let hours, minutes, seconds
let time
const getTime = () => {
    const date = new Date()
    hours = date.getHours()
    minutes = date.getMinutes()
    seconds = date.getSeconds() 
    
    hours = (hours > 12) ? hours - 12 : hours
    hours = (hours < 10) ? '0' + hours : hours
    hours = (hours === 0) ? 12 : hours
    minutes = (minutes < 10) ? '0' + minutes : minutes
    seconds = (seconds < 10) ? '0' + seconds : seconds

    time = hours + ':' + minutes + ":" + seconds
    setTimeout(getTime, 1000)
}
getTime()



//load font
const fontLoader = new THREE.FontLoader()
const loadFont = () => {
    fontLoader.load(
        'Fredoka One_Regular.json',
        (font) => {
            const textGeometry = new THREE.TextGeometry(
                time,
                {
                    font: font,
                    size: 2.5,
                    height: 0.5,
                    curveSegments: 12,
                    bevelEnabled: false
                }
            )
            textGeometry.computeBoundingBox()
            textGeometry.center()
            const textMaterial = new THREE.MeshNormalMaterial()
            const text = new THREE.Mesh(textGeometry, textMaterial)
            scene.add(text)
        }
    )
}

//add an event listener for resize of window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

//three.js clock
const clock = new THREE.Clock()

//updater call back function
const updater = () => {
    setTimeout(updater, 1000)
    scene.clear()
    loadFont()
    controls.update()
}

const tick = () => {
    requestAnimationFrame(tick)
    renderer.render(scene,camera)
    controls.update()
}
tick()
updater()
