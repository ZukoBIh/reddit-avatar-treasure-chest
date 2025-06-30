
interface AlchemyNft {
  contract: {
    address: string;
    name: string;
  };
  tokenId: string;
  tokenType: string;
  title: string;
  description?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    pngUrl?: string;
    contentType?: string;
    size?: number;
    originalUrl?: string;
  };
  raw?: {
    metadata?: {
      name?: string;
      description?: string;
      image?: string;
      attributes?: Array<{
        trait_type: string;
        value: string;
      }>;
    };
  };
}

interface Avatar {
  id: string;
  name: string;
  collection: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  image: string;
  traits: string[];
  lootBoxesAvailable: number;
  contractAddress: string;
  tokenId: string;
}

// Known Actrule collection contract addresses - you'll need to add the actual ones
const ACTRULE_CONTRACTS = [
  '0x466cfcd0525189b573e794f554b8a751279213ac', // Example - replace with actual Actrule contract addresses
  // Add more contract addresses as needed
];

const getRarityFromTraits = (attributes: Array<{ trait_type: string; value: string; }> = []): 'Common' | 'Rare' | 'Legendary' => {
  // Logic to determine rarity based on traits
  const rarityTraits = attributes.filter(attr => 
    attr.trait_type.toLowerCase().includes('rarity') || 
    attr.value.toLowerCase().includes('legendary') ||
    attr.value.toLowerCase().includes('rare')
  );
  
  if (rarityTraits.some(trait => trait.value.toLowerCase().includes('legendary'))) {
    return 'Legendary';
  }
  if (rarityTraits.some(trait => trait.value.toLowerCase().includes('rare'))) {
    return 'Rare';
  }
  return 'Common';
};

const getLootBoxCount = (rarity: 'Common' | 'Rare' | 'Legendary'): number => {
  switch (rarity) {
    case 'Legendary': return 3;
    case 'Rare': return 2;
    case 'Common': return 1;
    default: return 1;
  }
};

export const fetchActruleNFTs = async (walletAddress: string): Promise<Avatar[]> => {
  if (!walletAddress) {
    console.log('No wallet address provided');
    return [];
  }

  try {
    console.log('Fetching NFTs for address:', walletAddress);
    
    const ALCHEMY_API_KEY = 'cXg1UT8KE9odMh3FcWfpO';
    const baseURL = `https://polygon-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner`;
    
    const response = await fetch(`${baseURL}?owner=${walletAddress}&contractAddresses[]=${ACTRULE_CONTRACTS.join('&contractAddresses[]=')}&withMetadata=true&limit=100`);
    
    if (!response.ok) {
      console.error('Failed to fetch NFTs:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Raw NFT data:', data);

    if (!data.ownedNfts || data.ownedNfts.length === 0) {
      console.log('No Actrule NFTs found for this wallet');
      return [];
    }

    const avatars: Avatar[] = data.ownedNfts.map((nft: AlchemyNft) => {
      const metadata = nft.raw?.metadata;
      const attributes = metadata?.attributes || [];
      const rarity = getRarityFromTraits(attributes);
      
      return {
        id: `${nft.contract.address}-${nft.tokenId}`,
        name: nft.title || metadata?.name || `Actrule #${nft.tokenId}`,
        collection: nft.contract.name || 'Actrule Collection',
        rarity,
        image: nft.image?.cachedUrl || nft.image?.thumbnailUrl || metadata?.image || '🍄',
        traits: attributes.map(attr => `${attr.trait_type}: ${attr.value}`),
        lootBoxesAvailable: getLootBoxCount(rarity),
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId
      };
    });

    console.log('Processed avatars:', avatars);
    return avatars;
  } catch (error) {
    console.error('Error fetching Actrule NFTs:', error);
    return [];
  }
};
