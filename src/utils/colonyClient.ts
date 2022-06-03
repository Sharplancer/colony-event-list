import { getColonyNetworkClient, Network, ColonyClient, ColonyRole } from '@colony/colony-js';
import { Wallet } from 'ethers';
import { InfuraProvider } from 'ethers/providers';

// Don't worry too much about them, just use them as-is
const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;
// Get a new Infura provider (don't worry too much about this)
export const provider = new InfuraProvider();

const getColonyClient = async () => {
  // Get a random wallet
  // You don't really need control over it, since you won't be firing any trasactions out of it
  const wallet = Wallet.createRandom();
  // Connect your wallet to the provider
  const connectedWallet = wallet.connect(provider);
  // Get a network client instance
  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    {
        networkAddress: MAINNET_NETWORK_ADDRESS
    },
  );

  // Get the colony client instance for the betacolony
  const colonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);
  return colonyClient;
}

export default getColonyClient;