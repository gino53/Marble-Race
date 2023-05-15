import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles, Float, Text, useGLTF } from '@react-three/drei'
import useGame from "./stores/useGame.jsx"

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0, roughness: 0 })
const floor2Material = new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0, roughness: 0 })
const floor3Material = new THREE.MeshStandardMaterial({ color: '#870a24', metalness: 0, roughness: 0 })
const obstacleMaterial = new THREE.MeshNormalMaterial({ flatShading: true })
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#887777', metalness: 0, roughness: 0 })

function BlockStart({ position = [0, 0, 0] }) {
    return <group position={position}>
        <Float floatIntensity={0.5} rotationIntensity={0.5}>
            <Text
                font="./bebas-neue-v9-latin-regular.woff"
                scale={0.5}
                maxWidth={0.25}
                lineHeight={0.75}
                textAlign="right"
                position={[0.75, 0.65, 0]}
                rotation-y={- 0.25}
            >
                Marble Race
                <meshBasicMaterial toneMapped={false} />
            </Text>
        </Float>
        {/* Floor */}
        <mesh geometry={boxGeometry} material={floor1Material} position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
    </group>
}

function BlockEnd({ position = [0, 0, 0] }) {
    const ruby = useGLTF('./ruby.gltf')
    ruby.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })

    const phase = useGame((state) => state.phase)
    const [success] = useState(() => new Audio('./success.mp3'))

    if (phase === 'ended') {
        success.play();
        success.currentTime = 0
    }

    return <group position={position}>
        <Text
            font="./bebas-neue-v9-latin-regular.woff"
            position={[0, 2, 0]}
        >
            Finish
            <meshBasicMaterial toneMapped={false} />
        </Text>
        {/* Object */}
        <Float floatIntensity={1} rotationIntensity={1}>
            <RigidBody type='fixed' colliders='hull' position={[0, 1, 0]} restitution={0.2} friction={0}>
                <primitive object={ruby.scene} scale={1} />
            </RigidBody>
        </Float>
        <Sparkles count={100} scale={1 * 2} size={10} position-y={1} speed={0.4} />
        {/* Floor */}
        <mesh geometry={boxGeometry} material={floor3Material} position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
    </group>
}

function BlockSpinner({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? - 1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position={position}>
        {/* Obstacle */}
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>
        {/* Floor */}
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
    </group>
}

function BlockLimbo({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })

    return <group position={position}>
        {/* Obstacle */}
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>
        {/* Floor */}
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
    </group>
}

function BlockAxe({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    })

    return <group position={position}>
        {/* Obstacle */}
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.4, 1.4, 0.3]} castShadow receiveShadow />
        </RigidBody>
        {/* Floor */}
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
    </group>
}

function BlockTorus({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })

    return <group position={position}>
        {/* Obstacle */}
        <RigidBody ref={obstacle} type='kinematicPosition' colliders='trimesh' position={[0, 1.8, 0]} restitution={0.2} friction={0}>
            <mesh material={obstacleMaterial} scale={[1.35, 1.35, 1]} castShadow receiveShadow>
                <torusGeometry />
            </mesh>
        </RigidBody>
        {/* Floor */}
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
    </group>
}

function Bounds({ length = 1 }) {
    return <>
        <RigidBody type='fixed' restitution={0.2} friction={0}>
            {/* Right Walls */}
            <mesh position={[2.15, 0.75, - (length * 2) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[0.5, 1.5, 4 * length]} castShadow />
            {/* Left Walls */}
            <mesh position={[- 2.15, 0.75, - (length * 2) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[0.5, 1.5, 4 * length]} receiveShadow />
            {/* Back Walls */}
            <mesh position={[0, 0.75, - (length * 4) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[4, 1.5, 0.3]} receiveShadow />
            <CuboidCollider args={[2, 0.1, 2 * length]} position={[0, - 0.1, - (length * 2) + 2]} restitution={0.2} friction={1} />
        </RigidBody>
    </>
}

export function Level({ count = 2, types = [BlockSpinner, BlockAxe, BlockLimbo, BlockTorus], seed = 0 }) {
    const blocks = useMemo(() => {
        const blocks = []

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }

        return blocks
    }, [count, types, seed])

    return <>

        <BlockStart position={[0, 0, 0]} />

        {blocks.map((Block, index) => <Block key={index} position={[0, 0, - (index + 1) * 4]} />)}

        <BlockEnd position={[0, 0, - (count + 1) * 4]} />

        <Bounds length={count + 2} />

    </>
}