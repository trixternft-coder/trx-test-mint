import { useState } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import { polygon } from 'wagmi/chains';

// Твои параметры
const CONTRACT_ADDRESS = '0x8963a229A573dC75ec5963e78E33732C6BE92C25';
const CHAIN_ID = 137; // Polygon
const BASE_URI = 'ipfs://bafybeidgvmd7adx2umg7fuz2p4kx7tppn34pitzs33ilcndjt3x5gho75e/';
const PRICE = ethers.utils.parseEther('0.004'); // 0.004 MATIC
const CONTRACT_ABI = [ // Минимальный ABI для минта (добавь полный, если нужно)
  'function mint(uint256 tokenId) public payable',
  'function totalSupply() view returns (uint256)'
];

const chains = [polygon];
const projectId = 'f52f76c4c5d5806d030b1b4e6d98626d'; // Получи бесплатно на walletconnect.com (1 мин, или используй демо: 'abc123')

const config = createConfig({
  chains,
  metadata: { name: 'TRXTESTB Mint', description: 'Test Mint', url: 'https://trx-test-mint.vercel.app' },
});
createWeb3Modal({ ethersConfig: config, projectId });

export default function Home() {
  const [status, setStatus] = useState('');
  const [tokenId, setTokenId] = useState(1); // Начать с #1 или next available

  const mint = async () => {
    try {
      setStatus('Подключение...');
      const { ethereum } = window;
      if (!ethereum) return setStatus('Установи MetaMask!');
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      setStatus('Минт...');
      const tx = await contract.mint(tokenId, { value: PRICE });
      await tx.wait();
      setStatus(`Успех! Tx: ${tx.hash}`);
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div style={{ background: '#1a1a1a', color: '#fff', padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
      <h1 style={{ color: '#00ff88' }}>TRXTESTB Test Mint</h1>
      <img src="https://via.placeholder.com/300x300/00ff88/000000?text=TRXTESTB" alt="Logo" style={{ borderRadius: '10px' }} /> {/* Заглушка */}
      <p>Цена: 0.004 MATIC | Сеть: Polygon</p>
      <p>Token ID: <input type="number" value={tokenId} onChange={(e) => setTokenId(e.target.value)} min="1" /></p>
      <button onClick={mint} style={{ background: '#00ff88', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Mint Now</button>
      <p>{status}</p>
      <footer>Base URI: {BASE_URI}</footer>
    </div>
  );
}