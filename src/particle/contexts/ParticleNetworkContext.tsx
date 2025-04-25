/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { isAddress } from '@ethersproject/address';
import { Web3Provider } from '../provider/web3-provider';
import { type Connector } from '@particle-network/connector-core';
import {
  useAccount,
  useDisconnect,
  useWallets,
} from '@particle-network/connectkit';

interface ConnectorContextValue {
  account?: string;
  library?: Web3Provider | null | undefined;
  chainId?: number;
  active?: boolean;
  connector?: Connector;
  deactivate: () => void;
}

export const ParticleNetworkContext = React.createContext<ConnectorContextValue>({
  deactivate: () => { },
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ParticleNetworkContextProps { }

const ParticleNetworkProvider: React.FC<React.PropsWithChildren<ParticleNetworkContextProps>> = React.memo(({
  children,
}) => {
  const {
    address: account,
    chainId,
    connector,
  } = useAccount();
  const [primaryWallet] = useWallets();
  const { disconnect } = useDisconnect();
  const [particleProvider, setParticleProvider] = React.useState<unknown>();

  const library = React.useMemo(
    () => (particleProvider ? new Web3Provider(particleProvider) : null),
    [particleProvider]
  );
  
  React.useEffect(() => {
    const getProvider = async () => {
      const provider = await primaryWallet.connector.getProvider();
      setParticleProvider(provider);
    };

    if (account && primaryWallet) {
      getProvider();

    }
  }, [primaryWallet, account]);

  const deactivate = React.useCallback(() => {
    disconnect({ connector });
  }, [disconnect, connector]);

  const active = React.useMemo(() => !!(account && library), [library, account]);

  React.useEffect(() => {
    if (!active) {
      setParticleProvider(null);
    }
  }, [active]);

  // After successful authentication with Particle Network
  const handleParticleAuthSuccess = React.useCallback(async () => {
    try {
      // Call Puter's backend to authenticate
      const response = await fetch(`http://api.puter.localhost:4100/auth/particle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: account, chainId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect back to main app
        window.location.href = `/?auth_token=${data.token}`;
      } else {
        // Show error message
        console.error('Authentication failed:', data.message);
        // Display error to user
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Display error to user
    }
  }, [account, chainId]);

  React.useEffect(() => {
    if (active) {
      handleParticleAuthSuccess();

      /* window.parent.postMessage({
        type: 'particle-auth-success',
        payload: { address: account, chainId }
      }, '*'); */
    }
  }, [active, handleParticleAuthSuccess]);

  React.useEffect(() => {
      
    // Initialize timeout ID as undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if(active) {
      const isDisconnecting = localStorage.getItem('disconnect_particle');
      if((isDisconnecting)) {
        localStorage.removeItem('disconnect_particle');
        deactivate();
      }
    }

    return () => {
      // Clean up the timeout if it exists
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [deactivate, active]);

  return (
    <ParticleNetworkContext.Provider
      value={{
        ...(isAddress(account as string) && {
          chainId,
          account,
          library,
          active,
          connector,
        }),
        deactivate,
      }}
    >
      {children}
    </ParticleNetworkContext.Provider>
  );
});

ParticleNetworkProvider.displayName = 'ParticleNetworkProviderInner';

export default ParticleNetworkProvider;
