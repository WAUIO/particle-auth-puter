import { ConnectButton, useAccount } from "@particle-network/connectkit";
import React from "react";

const ConnectBtn = () => {
  const { address, isConnected, chainId } = useAccount();

  return (
    <div className="connect-btn-container">
      <h2>Wallet Connection</h2>
      
      <div className="connect-button-wrapper">
        <ConnectButton />
      </div>
      
      {isConnected && (
        <div className="wallet-info">
          <div className="info-item">
            <span className="info-label">Address:</span>
            <span className="info-value">{address}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Chain ID:</span>
            <span className="info-value">{chainId}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectBtn;
