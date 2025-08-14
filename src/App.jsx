import './App.css'
import { TokenLaunchpad } from './components/TokenLaunchpad'
import { MintToken } from "./components/mintToken";
import { CreateCpPool } from "./components/CreateCpPool";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(null);
  const [mintDone, setMintDone] = useState(false);

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: 'linear-gradient(120deg, #6366f1 0%, #60a5fa 50%, #f0fdfa 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative blurred circles for glassmorphism */}
            <div style={{
              position: 'absolute',
              top: 80,
              left: -120,
              width: 300,
              height: 300,
              background: 'radial-gradient(circle, #a5b4fc88 0%, #6366f100 80%)',
              filter: 'blur(60px)',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: -100,
              width: 260,
              height: 260,
              background: 'radial-gradient(circle, #f472b688 0%, #f0fdfa00 80%)',
              filter: 'blur(60px)',
              zIndex: 0
            }} />

            <header style={{
              width: '100%',
              padding: '32px 0 16px 0',
              background: 'rgba(99,102,241,0.85)',
              color: 'white',
              textAlign: 'center',
              marginBottom: 40,
              boxShadow: '0 2px 16px #0002',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              position: 'relative',
              zIndex: 1
            }}>
              <h1 style={{
                margin: 0,
                fontWeight: 900,
                fontSize: 40,
                letterSpacing: 1,
                textShadow: '0 2px 8px #0004'
              }}>
                🚀 Solana Token Launchpad
              </h1>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                marginTop: 18
              }}>
                <WalletMultiButton style={{
                  background: 'linear-gradient(90deg, #818cf8 0%, #38bdf8 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0002'
                }} />
                <WalletDisconnectButton style={{
                  background: '#f472b6',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0002'
                }} />
              </div>
            </header>

            <main style={{
              width: '100%',
              maxWidth: 520,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 24,
              boxShadow: '0 8px 40px #6366f133, 0 1.5px 8px #0001',
              padding: 40,
              marginBottom: 40,
              marginTop: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(8px)',
              zIndex: 1,
              animation: 'fadeIn 0.7s'
            }}>
              {!token && (
                <>
                  <h2 style={{
                    marginBottom: 20,
                    fontWeight: 700,
                    color: '#6366f1',
                    letterSpacing: 0.5
                  }}>Step 1: Create Your Token</h2>
                  <TokenLaunchpad onTokenCreate={setToken} />
                </>
              )}

              {token && !mintDone && (
                <>
                  <h2 style={{
                    marginBottom: 20,
                    fontWeight: 700,
                    color: '#60a5fa'
                  }}>Step 2: Mint Your Token</h2>
                  <div style={{
                    marginBottom: 20,
                    wordBreak: 'break-all',
                    color: '#6366f1',
                    background: '#f1f5f9',
                    borderRadius: 8,
                    padding: '10px 16px',
                    fontSize: 15,
                    boxShadow: '0 1px 4px #0001'
                  }}>
                    <strong>Token Mint Address:</strong><br />
                    {token.toBase58()}
                  </div>
                  <MintToken onDone={() => setMintDone(true)} mintaddress={token} />
                </>
              )}

              {token && mintDone && (
                <>
                  <h2 style={{
                    marginBottom: 20,
                    fontWeight: 700,
                    color: '#f472b6'
                  }}>Step 3: Create a Liquidity Pool</h2>
                  <div style={{
                    marginBottom: 20,
                    wordBreak: 'break-all',
                    color: '#6366f1',
                    background: '#f1f5f9',
                    borderRadius: 8,
                    padding: '10px 16px',
                    fontSize: 15,
                    boxShadow: '0 1px 4px #0001'
                  }}>
                    <strong>Token Mint Address:</strong><br />
                    {token.toBase58()}
                  </div>
                  <CreateCpPool token={token} />
                </>
              )}
            </main>

            <footer style={{
              marginTop: 'auto',
              padding: 24,
              color: '#64748b',
              fontSize: 16,
              letterSpacing: 0.5,
              background: 'rgba(255,255,255,0.7)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              boxShadow: '0 -2px 16px #0001',
              zIndex: 1
            }}>
              &copy; {new Date().getFullYear()} <span style={{ color: "#6366f1", fontWeight: 600 }}>Solana Token Launchpad</span>
            </footer>
            {/* Simple fade-in animation */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(32px);}
                to { opacity: 1; transform: translateY(0);}
              }
            `}</style>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App