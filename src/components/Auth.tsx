import { useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MANAGE_LOCATION } from '../types';

export function Auth({ wsTarget, setWsTarget }: { wsTarget: string | null; setWsTarget: (s: string | null) => void; }) {
    const locE = useRef(null as HTMLInputElement | null);
    const pwE = useRef(null as HTMLInputElement | null);
    const triedAuth = useRef(false);
    const { sendMessage, readyState } = useWebSocket(wsTarget, { share: true });
    useEffect(() => {
        if (readyState === ReadyState.CLOSED) {
            setWsTarget(null);
            triedAuth.current = false;
        }
        else if (readyState === ReadyState.OPEN && !triedAuth.current) {
            const pw = pwE.current?.value;
            pw && sendMessage(JSON.stringify({ type: "auth", pw }));
            triedAuth.current = true;
        }
    }, [readyState, setWsTarget, sendMessage]);
    return <>
        <form method='post' onSubmit={(e) => {
            e.preventDefault();
            const loc = locE.current?.value;
            const pw = pwE.current?.value;
            if (loc && pw) {
                setWsTarget(`wss:${loc}`);
            }
        }}>
            <label>location: <input ref={locE} name="loc" defaultValue={MANAGE_LOCATION} /></label>
            <br />
            <label>password: <input ref={pwE} name="pw" type="password" /></label>
            <br />
            <button type="submit" disabled={!(readyState === ReadyState.UNINSTANTIATED || readyState === ReadyState.CLOSED)}>connect</button>
        </form></>;
}
