import {useEffect, Dispatch, SetStateAction} from "react";
import {Typography} from "@material-ui/core";
import './../styles/testStyles.css'

interface TimerProps {
    isActive: boolean,
    seconds: number,
    setSeconds: Dispatch<SetStateAction<number>>
}


export const formatSeconds = (secs: number) => {
    const pad = (n: number) => n < 10 ? `0${n}` : n;
    localStorage.setItem('testTime', secs)
    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs / 60) - (h * 60);
    const s = Math.floor(secs - h * 3600 - m * 60);

    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export const Timer = ({isActive, seconds, setSeconds}: TimerProps) => {
    useEffect(() => {
        if(isActive){
            const interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);

            return () => clearInterval(interval)
        }
    }, [isActive, setSeconds]);

    return (
        <Typography className={'timerLabel'}>Время тестирования: {formatSeconds(seconds)}</Typography>
    )
}