/* eslint-disable import/no-extraneous-dependencies */
import React, {
  FC, PropsWithChildren, createContext,
} from 'react';
import ParticleConnectkit from './contexts/connectkit';
import ParticleNetworkProvider from './contexts/ParticleNetworkContext';

export const ParticleProviderContext = createContext({});

interface ConnectorProviderContextProps { }

const ConnectorProvider: FC<PropsWithChildren<ConnectorProviderContextProps>> = ({ children }) => (
  <ParticleConnectkit>
    <ParticleNetworkProvider>
      {children}
    </ParticleNetworkProvider>
  </ParticleConnectkit>
);

ConnectorProvider.displayName = 'ParticleNetworkProvider';

export default ConnectorProvider;
