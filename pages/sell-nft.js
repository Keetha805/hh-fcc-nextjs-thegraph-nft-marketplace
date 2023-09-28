import { ethers } from "ethers";
import { Inter } from "next/font/google";
import { title } from "process";
import { Form, Input, useNotification } from "web3uikit";
import nftAbi from "../constants/BasicNFT.json";
import marketAbi from "../constants/NFTMarketplace.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = networkMapping[chainId]["NftMarketplace"];

  const { dispatch } = useNotification();

  async function handleListSuccess(tx) {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT listing",
      title: "NFT listed",
      position: "topR",
    });
  }

  const handleApproveSuccess = async (tx, nftAddress, tokenId, price) => {
    const listParams = {
      abi: marketAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listParams,
      onError: (error) => {
        console.log(error);
      },
      onSuccess: handleListSuccess(),
    });
  };

  const { runContractFunction } = useWeb3Contract();

  const approveAndList = async (data) => {
    console.log("Approving...");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    const approveParams = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveParams,
      onSuccess: (tx) => {
        handleApproveSuccess(tx, nftAddress, tokenId, price);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (ETH)",
            type: "number",
            value: "",
            key: "price",
          },
        ]}
        title="Sell your NFT"
        id="Main Form"
      ></Form>
    </div>
  );
}
