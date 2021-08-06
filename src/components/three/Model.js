import { useTexture } from "@react-three/drei"
import { useLoader, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { a } from "react-spring/three"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import useStore from "../../states/modelState"
import Decals, { createDecal } from "./Decals"

const Model = ({ url, rotation, setModelRayData }) => {
    // REF
    const modelRef = useRef()

    const { gl } = useThree()

    // GLOBAL STATE
    const {
        decals,
        addDecal,
        decalPath,
        decalSize,
        initialDecalSize,
        modelColor,
        setDecalPath,
        addDecalImages,
        setDecalSize,
    } = useStore()

    // STATE
    const timestamp = useRef(window.performance.now())

    // LOAD MODEL
    const gltf = useLoader(GLTFLoader, url)

    // LOAD MORMAL MAP
    const normalTexture = useTexture("/normal.jpg")
    useEffect(() => {
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping
        normalTexture.repeat = new THREE.Vector2(8, 8)
        normalTexture.anisotropy = 16
    }, [])

    // ADD DECAL TO ARRAY
    const handleDecal = (e) => {
        console.log(gl.getPixelRatio())
        // Get texture
        new THREE.TextureLoader().load(decalPath, (decalTexture) => {
            // Check for active decal
            const { decal, key } = createDecal(
                modelRef.current, // Geometry
                e.intersections[0].point, // Position
                modelRef.current.localToWorld(e.intersections[0].face.normal), // Normal
                decalTexture, // Texture
                decalSize // Size of longest side
            )

            // Add decal to decal manager
            addDecalImages({ path: decalPath, key: key })

            // Add decal to state
            addDecal({ mesh: decal, key: key })

            // Remove decal for one time use
            setDecalPath(null)

            // Reset decal size
            setDecalSize(initialDecalSize)
        })
    }

    // PASS RAYCAST
    const passRaycast = (e) => {
        // Only submit while decal is active
        if (decalPath) {
            if (timestamp.current + 16 <= window.performance.now()) {
                // DEBOUNCE: Update timestamp for new interval
                timestamp.current = window.performance.now()

                // Get position
                const posV = e.point.clone()

                // Get world normal
                const n = e.face.normal.clone()
                const nWorld = modelRef.current.localToWorld(n)

                // Set pos and normal
                setModelRayData({ position: posV, normalWorld: nWorld })
            }
        }
    }

    // RESET RAYCAST POS AND NORMAL
    const removeRaycast = () => setModelRayData(null)

    return (
        <a.group rotation={rotation} castShadow>
            <mesh
                ref={modelRef}
                onPointerMove={passRaycast}
                onPointerOut={removeRaycast}
                onPointerDown={handleDecal}
                geometry={gltf.scene.children[0].geometry}
                castShadow
            >
                <meshStandardMaterial
                    normalMap={normalTexture}
                    color={modelColor}
                />
            </mesh>
            <Decals decals={decals} />
        </a.group>
    )
}

export default Model
