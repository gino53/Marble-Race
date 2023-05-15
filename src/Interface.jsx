import { useKeyboardControls } from "@react-three/drei"
import { useState, useEffect, useRef } from "react"
import { addEffect } from "@react-three/fiber"
import useGame from "./stores/useGame.jsx"

export default function Interface() {
    const time = useRef()
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState()

            let elapsedTime = 0

            if (state.phase === 'playing') {
                elapsedTime = Date.now() - state.startTime
            } else if (state.phase === 'ended') {
                elapsedTime = state.endTime - state.startTime
            }

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            if (time.current) {
                time.current.textContent = elapsedTime
            }
        })

        return () => {
            unsubscribeEffect()
        }
    }, [])

    const [music] = useState(() => new Audio('./music.mp3'))

    let isPlaying = false;

    const musicPlayer = () => {
        if (isPlaying) {
            var songPlayer = document.querySelector('.songPlayer');
            songPlayer.classList.remove('active');
            music.pause();
            isPlaying = false;
        } else {
            var songPlayer = document.querySelector('.songPlayer');
            songPlayer.classList.add('active');
            music.play();
            isPlaying = true;
        }
    }

    return <div className="interface">
        <div ref={time} className="time">0.00</div>
        {phase === 'ended' && <div className="restart" onClick={restart}>WIN !</div>}
        <div className="controls">
            <div className="raw">
                <div className={`key ${forward ? 'active' : ''}`}></div>
            </div>
            <div className="raw">
                <div className={`key ${leftward ? 'active' : ''}`}></div>
                <div className={`key ${backward ? 'active' : ''}`}></div>
                <div className={`key ${rightward ? 'active' : ''}`}></div>
            </div>
            <div className="raw">
                <div className={`key large ${jump ? 'active' : ''}`}></div>
            </div>
            <div className="raw">
                <div className="songPlayer" onClick={musicPlayer}>Song</div>
                <div className="restartBtn" onClick={restart}>Restart</div>
            </div>
        </div>
    </div>
}