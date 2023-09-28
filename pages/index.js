import { useMoralis } from "react-moralis";
import GET_ACTIVE_ITEM from "../subgraphQueries";
import { useQuery } from "@apollo/client";
import networkMapping from "../constants/networkMapping.json";
import NFTBox from "../components/NFTBox";

export default function Home() {
  //how do we shoe recently listed NFT?
  //We will index the events off-chain and ten read from our DB
  //Setup a server to listen for those events to be fired and we will add tem to aDV to query
  //Isnt that centralised?
  //Moralis -> centralised
  //Graph
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainIdString = parseInt(chainId).toString();
  const marketplaceAddress = chainId
    ? networkMapping[chainIdString]["NftMarketplace"][0]
    : null;

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEM);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          <div>
            {loading ? (
              <div>Loading... </div>
            ) : (
              listedNfts.activeItems.map((nft) => {
                const { seller, nftAddress, tokenId, price } = nft;
                console.log("seller: ", seller);
                return (
                  <NFTBox
                    seller={seller}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    marketplaceAddress={marketplaceAddress}
                    key={`${nftAddress}${tokenId}`}
                  ></NFTBox>
                );
              })
            )}
          </div>
        ) : (
          <div>Web3 Currently not enabled</div>
        )}
      </div>
    </div>
  );
}
