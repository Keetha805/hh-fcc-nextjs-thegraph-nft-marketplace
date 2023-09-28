const Moralis = require("moralis");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");

const chainId = 11155111; //process.env.chainId || 31337;
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];
console.log("contractAddress: ", contractAddress);

let moralisChainId = chainId == "31337" ? "0xaa36a7" : chainId;
console.log("moralisChainId: ", moralisChainId);

const api_key = process.env.API_KEY_MORALIS;

const main = async () => {
  await Moralis.default.start({ apiKey: api_key });

  let itemListedOpts = {
    address: contractAddress,
    chain: moralisChainId,
    topic: "ItemListed(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
  };

  let itemBoughtOpts = {
    address: contractAddress,
    chain: moralisChainId,
    topic: "NFTBought(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "NFTBought",
      type: "event",
    },
  };

  let itemCanceledOpts = {
    address: contractAddress,
    chain: moralisChainId,
    topic: "ItemCanceled(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCanceled",
      type: "event",
    },
  };

  const listedResponse = await Moralis.default.EvmApi.events.getContractEvents(
    itemListedOpts
  );

  const boughtResponse = await Moralis.default.EvmApi.events.getContractEvents(
    itemBoughtOpts
  );

  const canceledResponse =
    await Moralis.default.EvmApi.events.getContractEvents(itemCanceledOpts);

  console.log(listedResponse.toJSON());
  console.log(boughtResponse.toJSON());
  console.log(canceledResponse.toJSON());
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
