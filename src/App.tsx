import React from 'react';
import './App.css';
import { useModal } from '@particle-network/connectkit';
import { useParticleNetwork } from './particle/hooks/useParticleNetwork';


function App() {
  const { setOpen } = useModal();
  const { active } = useParticleNetwork();
  React.useEffect(() => {
    if(!active) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [setOpen, active]);
  return <></>;
}

export default App;
