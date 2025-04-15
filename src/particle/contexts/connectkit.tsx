/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @fileoverview Particle Network ConnectKit Configuration and Context Provider
 * This file sets up the configuration and context for Particle Network's ConnectKit,
 * which provides wallet connection functionality with support for various authentication methods
 * and wallet connectors. It includes custom theming that integrates with Material UI's theme system.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  ConnectKitProvider, createConfig, ConnectKitOptions,
} from '@particle-network/connectkit';
import { wallet, EntryPosition } from '@particle-network/connectkit/wallet';
import {
  arbitrumSepolia,
  defineChain,
} from '@particle-network/connectkit/chains';
import { authWalletConnectors } from '@particle-network/connectkit/auth';
import { evmWalletConnectors, walletConnect } from '@particle-network/connectkit/evm';
import { injected } from '../connectors/injected';

/**
 * Context interface for Particle Network ConnectKit configuration
 */
interface ParticleConnectkitContextProps {
  config: ReturnType<typeof createConfig>;
}

/**
 * Props interface for the ParticleConnectkit component
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ParticleConnectkitProps {}

const elastos = /* #__PURE__ */ defineChain({
  id: 20,
  name: 'Elastos Smart Chain',
  nativeCurrency: { name: 'Elastos', symbol: 'ELA', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://api.ela.city/esc',
        'https://api.elastos.io/esc',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Elastos Explorer',
      url: 'https://esc.elastos.io',
      apiUrl: 'http://esc.elastos.io/api',
    },
  },
  contracts: {
  },
});

// Configure supported chains
// @todo: MERGE <These mainnet entries are included here for testing purposes only.
// The goal is to demonstrate to the user the ability to add predefined ERC-20 tokens
// set by Particle Network in the wallet, as direct addition in the code does not work.
// Please, DO NOT MERGE THIS BRANCH without carefully considering the implications,
// as it may disrupt the current flow>.
const chains: ConnectKitOptions['chains'] = [
  arbitrumSepolia,
  // arbitrum,
  elastos,
  // base,
  // mainnet,
];

/**
 * Creates the configuration for Particle Network ConnectKit
 * @param theme - Material UI theme object for consistent styling
 * @returns ConnectKit configuration object
 */
const config = createConfig({
  // Project configuration from environment variables
  projectId: "eedd2af0-ae18-4349-9073-6c1d4c97a473" as string,
  clientKey: "cjF2ZKAikZes3X9iaMm5W8fg05y0zfOyTvcUtX2p" as string,
  appId: "ac2ed189-c6dd-4d04-be4f-fc7b65805c89" as string,

  // Appearance configuration including theme integration
  appearance: {
    // Configure recommended wallets and their display
    recommendedWallets: [
      { walletId: (window as any)?.elastos ? 'essentialWallet' : 'metaMask', label: 'Recommended' },
      { walletId: 'walletConnect', label: 'none' },
    ],
    // UI configuration options
    splitEmailAndPhone: false,
    collapseWalletList: false,
    hideContinueButton: true,
    // Order of connection methods
    connectorsOrder: ['email', 'phone', 'social', 'wallet'],
    logo: '/static/elacity/waving.png',
    language: 'en-US',
    // Theme customization using Material UI colors
    theme: {
      '--pcm-font-family': '-apple-system,"Proxima Nova",Arial,sans-serif',
      '--pcm-rounded-sm': '4px',
      '--pcm-rounded-md': '8px',
      '--pcm-rounded-lg': '11px',
      '--pcm-rounded-xl': '22px',
      '--pcm-body-action-color': 'var(--pcm-body-color)',
    },
  },

  // Configure wallet connectors
  walletConnectors: [
    // EVM wallet connectors configuration
    evmWalletConnectors({
      metadata: { name: 'Elacity' },
      connectorFns: [
        injected({
          target: 'metaMask',
        }),
        ...(window as any).elastos ? [injected({
          target: 'essentialWallet',
        })] : [],
        walletConnect({
          showQrModal: true,
          projectId: "ac2ed189-c6dd-4d04-be4f-fc7b65805c89",
          qrModalOptions: {
            themeVariables: {
              '--wcm-z-index': '2147483647',
              '--wcm-background-color': '#ffffff',
              '--wcm-accent-fill-color': '#ffffff',
              '--wcm-background-border-radius': '8px',
              '--wcm-container-border-radius': '24px',
              '--wcm-wallet-icon-border-radius': '16px',
              '--wcm-font-family': '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu',
            },
            explorerRecommendedWalletIds: 'NONE',
            enableExplorer: false,
          },
        }),
      ],
      multiInjectedProviderDiscovery: true,
    }),

    // Authentication wallet connectors configuration
    authWalletConnectors({
      fiatCoin: 'USD',
      promptSettingConfig: {
        promptMasterPasswordSettingWhenLogin: 1,
        promptPaymentPasswordSettingWhenSign: 1,
      },
    }),
  ],

  // Configure wallet plugins
  plugins: [
    wallet({
      entryPosition: EntryPosition.TR,
      visible: true,
      customStyle: {
        fiatCoin: 'USD',
      },
      widgetIntegration: 'embedded',
      walletUrl: 'https://wallet-iframe.particle.network',
    }),
  ],

  chains,
} as ConnectKitOptions);

/**
 * Context for sharing Particle Network ConnectKit configuration
 */
export const ParticleConnectkitContext = React.createContext<ParticleConnectkitContextProps>({
  // @ts-ignore
  config: null,
});

/**
 * ParticleConnectkit Component
 * Provides ConnectKit configuration and context to its children
 * @param children - Child components that will have access to ConnectKit functionality
 */
const ParticleConnectkit = ({ children }: React.PropsWithChildren<ParticleConnectkitProps>) => {
  return (
    <ParticleConnectkitContext.Provider
      value={{
        config,
      }}
    >
      <ConnectKitProvider config={config} reconnectOnMount={false}>{children}</ConnectKitProvider>
    </ParticleConnectkitContext.Provider>
  );
};

/**
 * Hook to access the Particle Network ConnectKit configuration
 * @returns ConnectKit configuration context
 */
export const useConnectkitConfig = () => React.useContext(ParticleConnectkitContext);

// Export memoized component to prevent unnecessary re-renders
export default React.memo(ParticleConnectkit);
