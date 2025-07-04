
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
  totalOwned?: number;
}

// Known Actrule collection contract addresses
const ACTRULE_CONTRACTS = [
  '0xA63EfDE7Cb14DD537b7e61a3087aE9B8A7849eE2',
  '0xe364d16731579078afa1195630e4035657ef9d1a',
  '0x97386b7fae8bc384afa1af14b6dd96d9123f762f',
  '0x9c92b882ac7aeff58414d874de60d30381991bad',
  '0xbd24e412d8eb0bca223ad87869374d97cede3424'
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

const extractTokenNumber = (tokenId: string): number => {
  // Extract numeric value from token ID
  const num = parseInt(tokenId, 10);
  return isNaN(num) ? 0 : num;
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

    // Group NFTs by contract address to find the highest numbered one for each collection
    const nftsByContract = new Map<string, AlchemyNft[]>();
    
    data.ownedNfts.forEach((nft: AlchemyNft) => {
      const contractAddress = nft.contract.address;
      if (!nftsByContract.has(contractAddress)) {
        nftsByContract.set(contractAddress, []);
      }
      nftsByContract.get(contractAddress)!.push(nft);
    });

    const avatars: Avatar[] = [];

    // For each contract, find the lowest numbered NFT
    nftsByContract.forEach((nfts, contractAddress) => {
      const lowestNft = nfts.reduce((lowest, current) => {
        const currentNum = extractTokenNumber(current.tokenId);
        const lowestNum = extractTokenNumber(lowest.tokenId);
        return currentNum < lowestNum ? current : lowest;
      });

      const metadata = lowestNft.raw?.metadata;
      const attributes = metadata?.attributes || [];
      const rarity = getRarityFromTraits(attributes);
      
      avatars.push({
        id: `${lowestNft.contract.address}-${lowestNft.tokenId}`,
        name: lowestNft.title || metadata?.name || `Actrule #${lowestNft.tokenId}`,
        collection: lowestNft.contract.name || 'Actrule Collection',
        rarity,
        image: lowestNft.image?.cachedUrl || lowestNft.image?.thumbnailUrl || metadata?.image || '🍄',
        traits: attributes.map(attr => `${attr.trait_type}: ${attr.value}`),
        lootBoxesAvailable: getLootBoxCount(rarity),
        contractAddress: lowestNft.contract.address,
        tokenId: lowestNft.tokenId,
        totalOwned: nfts.length
      });
    });

    console.log('Processed avatars (lowest numbered only):', avatars);
    return avatars;
  } catch (error) {
    console.error('Error fetching Actrule NFTs:', error);
    return [];
  }
};
