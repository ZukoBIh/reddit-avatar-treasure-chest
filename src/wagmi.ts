
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Mushroom Forage Chests',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});
