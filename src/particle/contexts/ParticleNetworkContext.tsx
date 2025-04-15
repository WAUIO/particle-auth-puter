import React from 'react';
import { isAddress } from '@ethersproject/address';
import { Web3Provider } from '@ethersproject/providers';
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
    () => (particleProvider ? new Web3Provider(particleProvider, 'any') : null),
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

  const deactivate = () => {
    disconnect({ connector });
  };

  const active = React.useMemo(() => !!(account && library), [library, account]);

  React.useEffect(() => {
    if (!active) {
      setParticleProvider(null);
    }
  }, [active]);

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
