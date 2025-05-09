import React from 'react';
import './App.css';
import { useModal } from '@particle-network/connectkit';
import { useParticleNetwork } from './particle/hooks/useParticleNetwork';


function App() {
  const { setOpen, isOpen } = useModal();
  const { active } = useParticleNetwork();
  React.useEffect(() => {
    if(!active) {
      setOpen(true);
    } else {
      if (isOpen && import.meta.env.VITE_DEV_SANDBOX !== 'true') {
        setOpen(false);
      }
    }
  }, [setOpen, active, isOpen]);
  
  return null;
}

export default App;
