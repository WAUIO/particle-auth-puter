import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ConnectBtn from './particle/components/ConnectBtn'
import TransactionComponent from './particle/components/TransactionComponent'

function App() {
  return (
    <div className="app-container">
      <div className="logo-container">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <h1>Blockchain Demo</h1>
      
      <div className="card wallet-card">
        <ConnectBtn />
      </div>
      
      <div className="card transaction-card">
        <TransactionComponent />
      </div>
      
      <p className="read-the-docs">
        Connect your wallet and try signing messages or making ERC20 transfers
      </p>
    </div>
  )
}

export default App
