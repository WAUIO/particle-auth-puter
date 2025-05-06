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
import { defineChain } from '@particle-network/connectkit/chains';
import { authWalletConnectors } from '@particle-network/connectkit/auth';
import { evmWalletConnectors, walletConnect } from '@particle-network/connectkit/evm';
import { injected } from '../connectors/injected';
import elastosLogo from '../../assets/Elastos_Logo_Dark_-_1.svg';
import './style.css';

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
  elastos,
];

/**
 * Creates the configuration for Particle Network ConnectKit
 * @param theme - Material UI theme object for consistent styling
 * @returns ConnectKit configuration object
 */
const config = createConfig({
  // Project configuration from environment variables
  projectId: import.meta.env.VITE_PARTICLE_PROJECT_ID as string,
  clientKey: import.meta.env.VITE_PARTICLE_CLIENT_KEY as string,
  appId: import.meta.env.VITE_PARTICLE_APP_ID as string,

  // Appearance configuration including theme integration
  appearance: {
    // Configure recommended wallets and their display
    recommendedWallets: [
      { walletId: (window as any)?.elastos ? 'essentialWallet' : 'metaMask', label: 'Recommended' },
      { walletId: 'walletConnect', label: 'none' },
    ],
    // UI configuration options
    splitEmailAndPhone: false,
    isDismissable: false,
    collapseWalletList: false,
    hideContinueButton: true,
    // Order of connection methods
    connectorsOrder: ['email', 'phone', 'social', 'wallet'],
    logo: elastosLogo,
    language: 'en-US',
    theme: {
      '--pcm-font-family': '-apple-system,"Proxima Nova",Arial,sans-serif',
      '--pcm-rounded-sm': '4px',
      '--pcm-rounded-md': '8px',
      '--pcm-rounded-lg': '11px',
      '--pcm-rounded-xl': '22px',
      // '--pcm-body-action-color': 'var(--pcm-body-color)',
      '--pcm-overlay-background': '#161616',
      "--pcm-body-background":"#1C1D22",
      "--pcm-body-background-secondary":"#41424A",
      "--pcm-body-background-tertiary":"#232529",
      "--pcm-body-color":"#ffffff",
      "--pcm-body-color-secondary":"#8B8EA1",
      "--pcm-body-color-tertiary":"#42444B",
      "--pcm-primary-button-bankground":"#F59E0B",
      "--pcm-primary-button-color":"#5c2e00",
      "--pcm-primary-button-hover-background":"#cf7c00",
      "--pcm-secondary-button-color":"#361900",
      "--pcm-secondary-button-bankground":"#ffbb33",
      "--pcm-secondary-button-hover-background":"#ffce5c",
      "--pcm-body-action-color":"#808080",
      "--pcm-button-border-color":"#292B36",
      "--pcm-accent-color":"#F59E0B",
      "--pcm-button-font-weight":"500",
      "--pcm-modal-box-shadow":"0px 2px 4px rgba(0, 0, 0, 0.02)",
    },
    // inlineSelectorId: "__particle_custom_selector_id"
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
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string,
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
            enableExplorer: true,
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

// List of connector IDs to filter out
const filteredConnectorIds = ['io.metamask'];

/**
* Helper function to deep clone objects while preserving descriptors
* This is necessary for proper handling of connector configurations
* @param obj - Object to clone
*/
const cloneWithDescriptors = (obj: any) => {
  const clone = Object.create(Object.getPrototypeOf(obj));
  const descriptors = Object.getOwnPropertyDescriptors(obj);

  // Special handling for connectors array
  if (descriptors.connectors) {
    const originalGet = descriptors.connectors.get;
    descriptors.connectors = {
      ...descriptors.connectors,
      get() {
        const connectors = originalGet?.call(this);
        return connectors.filter((c: any) => !filteredConnectorIds.includes(c.id));
      },
    };
  }

  Object.defineProperties(clone, descriptors);
  return clone;
};


/**
 * Context for sharing Particle Network ConnectKit configuration
 */
// eslint-disable-next-line react-refresh/only-export-components
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
  const clonedConfig = cloneWithDescriptors(config);
  return (
    <ParticleConnectkitContext.Provider
      value={{
        config: clonedConfig,
      }}
    >
      <ConnectKitProvider config={clonedConfig} reconnectOnMount>{children}</ConnectKitProvider>
    </ParticleConnectkitContext.Provider>
  );
};

/**
 * Hook to access the Particle Network ConnectKit configuration
 * @returns ConnectKit configuration context
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useConnectkitConfig = () => React.useContext(ParticleConnectkitContext);

// Export memoized component to prevent unnecessary re-renders
export default React.memo(ParticleConnectkit);
