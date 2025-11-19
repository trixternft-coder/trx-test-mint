
import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT = '0x8963a229A573dC75ec5963e78E33732C6BE92C25';
const PRICE = ethers.utils.parseEther('0.004');           // 0.004 MATIC
const CHAIN_ID = 137;                                     // Polygon Mainnet

const ABI = [
  "function mint(uint256 quantity) public payable",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)"
];

export default function Home() {
  const [status, setStatus] = useState('Connect Wallet');

  const connectAndMint = async () => {
    if (!window.ethereum) return setStatus('Install MetaMask');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const { chainId } = await provider.getNetwork();
      if (chainId !== CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // 0x89 = 137
        });
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT, ABI, signer);

      setStatus('Minting…');
      const tx = await contract.mint(1, { value: PRICE });
      await tx.wait();

      setStatus(`Minted! Tx: ${tx.hash.substring(0, 10)}...`);
    } catch (e) {
      setStatus(e.message || 'Error');
    }
  };

  };

  return (
    <div style={{
      background: '#0f0f0f',
      color: '#fff',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#00ff99', fontSize: '3rem' }}>TRXTESTB</h1>
      <img src="https://via.placeholder.com/400x400/00ff99/000000?text=TRXTESTB" alt="logo" style={{ borderRadius: '20px' }} />
      <p style={{ fontSize: '1.5rem', margin: '30px' }}>Price: 0.004 MATIC</p>
      <button onClick={connectAndMint} style={{
        background: '#00ff99',
        color: '#000',
        fontSize: '1.5rem',
        padding: '15px 40px',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer'
      }}>
        {status}
      </button>
      <p style={{ marginTop: '30px' }}>{status}</p>
    </div>
  );
}
Add pages/index.js – working mint page
