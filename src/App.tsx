import { useEffect, useState } from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Entry } from './components/Entry';
import { Auth } from './components/Auth';
import { ManagerReport, ServerInit } from './types';

function App() {
  const [wsTarget, setWsTarget] = useState(null as string | null);
  const [items, setItems] = useState(null as string[] | null);
  const [data, setData] = useState({} as Record<string, ManagerReport>);
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(wsTarget, { share: true });

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      setItems(null);
    }
  }, [readyState])
  useEffect(() => {
    if (lastJsonMessage) {
      if (!items) {
        const init = lastJsonMessage as ServerInit;
        setItems(init.map(i => i.name));
        setData((prev) => {
          const ret = { ...prev };
          for (const datum of init) {
            ret[datum.name] = { ...ret[datum.name], ...datum };
          }
          return ret;
        });
      }
      else {
        setData((prev) => {
          const ret = { ...prev };
          const datum = lastJsonMessage as ManagerReport;
          ret[datum.name] = { ...ret[datum.name], ...datum };
          console.log(ret);
          return ret;
        });
      }
    }
  }, [lastJsonMessage, items]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return <>
    <span>The WebSocket is currently {connectionStatus}</span>
    {(items && readyState === ReadyState.OPEN && (
      <div>
        <ul>
          {items.map(item => <li key={item}>
            <Entry
              name={data[item].name}
              detail={data[item].detail}
              status={data[item].status}
              data={data[item].data}
              send={sendMessage} /></li>)}
        </ul>
      </div>
    )) || <Auth wsTarget={wsTarget} setWsTarget={setWsTarget} />}</>
}

export default App
