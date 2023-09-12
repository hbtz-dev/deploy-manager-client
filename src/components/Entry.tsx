import { useState } from 'react';
import { ManagerReport, Action, ActionSchema, ProjectStatus } from '../types';

function ActionButton(props: { data: ManagerReport; type: Action; send: (s: string) => void; }) {
    return <button className={`${props.type}button`}
        disabled={props.data.name === "" || !(BUTTON_ACTIVE_MAP[props.type][props.data.status])}
        onClick={() => {
            props.send(JSON.stringify({ type: props.type, which: props.data.name } as ActionSchema));

        }}>{props.type}</button>;
}

const BUTTON_ACTIVE_MAP = {
    "start": { "terminated": true, "failed": true, "crashed": true, "killed": true },
    "stop": { "ok": true },
    "restart": { "ok": true },
    "eradicate": { "terminated": true, "failed": true, "crashed": true, "killed": true },
    "kill": { "ok": true, "stopping": true }
} as Record<Action, Record<ProjectStatus, boolean>>

export function Entry(props: ManagerReport & { send: (s: string) => void; }) {
    const { name, status, detail, data } = { ...props };
    const [copied, setCopied] = useState(false);
    const hasProxy = data && data.proxy;
    return <span className='item'>
        <span className='itemName'>{name + (hasProxy ? " - " : "")} {hasProxy && <a href={`https://${data.proxy!.fromHost}`} target="_blank">[link]</a>}</span>
        <span className='itemStatus'>{status}</span>
        <span className='itemDetail'
            onClick={() => {
                navigator.clipboard.writeText(detail);
                setCopied(true);
            }}
            onMouseLeave={() => { setCopied(false); }}>{copied ? "(copied!)" : detail}</span>
        {(["start", "stop", "restart", "eradicate", "kill"] as const).map(
            a => <ActionButton key={a} data={props} type={a} send={props.send} />)}
    </span>;
}
