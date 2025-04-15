import React, { useState } from 'react';
import { useAccount } from '@particle-network/connectkit';
import { ParticleNetworkContext } from '../contexts/ParticleNetworkContext';
import { Contract } from '@ethersproject/contracts';
import { parseUnits } from '@ethersproject/units';

// Standard ERC20 ABI for transfer function
const ERC20_ABI = [
  // Transfer function
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // BalanceOf function (for checking balance)
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const TransactionComponent: React.FC = () => {
  const { isConnected } = useAccount();
  const { library } = React.useContext(ParticleNetworkContext);
  
  const [message, setMessage] = useState('Hello, sign this message!');
  const [signature, setSignature] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Request signature from the connected wallet
  const requestSignature = async () => {
    if (!isConnected || !library) {
      setError('Wallet not connected');
      return;
    }

    try {
      setStatus('Requesting signature...');
      setError('');
      
      // Request personal signature
      const signer = library.getSigner();
      const signedMessage = await signer.signMessage(message);
      
      setSignature(signedMessage);
      setStatus('Signature successful!');
    } catch (err) {
      console.error('Signature error:', err);
      setError(`Failed to sign: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('');
    }
  };

  // Make an ERC20 token transfer
  const transferERC20 = async () => {
    if (!isConnected || !library) {
      setError('Wallet not connected');
      return;
    }

    if (!tokenAddress || !recipientAddress || !amount) {
      setError('Please fill all fields: token address, recipient address, and amount');
      return;
    }

    try {
      setStatus('Initiating transfer...');
      setError('');
      setTxHash('');
      
      // Create contract instance
      const signer = library.getSigner();
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
      
      // Convert amount to wei (assuming 18 decimals, which is standard for most ERC20 tokens)
      // For tokens with different decimals, this would need to be adjusted
      const amountInWei = parseUnits(amount, 18);
      
      // Send transaction
      const transaction = await tokenContract.transfer(recipientAddress, amountInWei);
      setTxHash(transaction.hash);
      setStatus('Transaction submitted, waiting for confirmation...');
      
      // Wait for transaction to be mined
      const receipt = await transaction.wait();
      setStatus(`Transaction confirmed in block ${receipt.blockNumber}`);
    } catch (err) {
      console.error('Transfer error:', err);
      setError(`Failed to transfer: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('');
    }
  };

  if (!isConnected) {
    return <p>Please connect your wallet first</p>;
  }

  return (
    <div className="transaction-component">
      <h2>Blockchain Interactions</h2>
      
      <div className="section">
        <h3>Request Signature</h3>
        <div>
          <label>
            Message to sign:
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to sign"
            />
          </label>
        </div>
        <button onClick={requestSignature}>Sign Message</button>
        {signature && (
          <div className="result">
            <h4>Signature:</h4>
            <p className="signature">{signature}</p>
          </div>
        )}
      </div>

      <div className="section">
        <h3>ERC20 Token Transfer</h3>
        <div>
          <label>
            Token Address:
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="ERC20 token contract address"
            />
          </label>
        </div>
        <div>
          <label>
            Recipient Address:
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Recipient wallet address"
            />
          </label>
        </div>
        <div>
          <label>
            Amount:
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to transfer"
            />
          </label>
        </div>
        <button onClick={transferERC20}>Transfer Tokens</button>
        {txHash && (
          <div className="result">
            <h4>Transaction Hash:</h4>
            <p className="tx-hash">{txHash}</p>
          </div>
        )}
      </div>

      {status && <p className="status">{status}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default TransactionComponent;
