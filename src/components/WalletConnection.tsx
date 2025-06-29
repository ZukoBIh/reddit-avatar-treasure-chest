
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

interface WalletConnectionProps {
  onConnect: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect }) => {
  return (
    <div className="space-y-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full"
      >
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            React.useEffect(() => {
              if (connected) {
                onConnect();
              }
            }, [connected]);

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>🦊</span>
                          <span>Connect Wallet</span>
                        </span>
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl"
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div className="flex gap-3">
                      <button
                        onClick={openChainModal}
                        className="bg-green-600/20 border border-green-400 text-green-300 px-4 py-2 rounded-lg"
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                              display: 'inline-block',
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </motion.div>
      
      <div className="text-center">
        <p className="text-sm text-green-300">
          Don't have a wallet? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">Download MetaMask</a>
        </p>
      </div>
    </div>
  );
};

export default WalletConnection;
