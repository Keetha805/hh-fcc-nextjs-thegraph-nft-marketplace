import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftAbi from "../constants/BasicNFT.json";
import marketAbi from "../constants/NFTMarketplace.json";
import { Card, Skeleton, useNotification } from "web3uikit";
import Image from "next/image";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};
export default function NFTBox({
  seller,
  nftAddress,
  tokenId,
  price,
  marketplaceAddress,
}) {
  const { isWeb3Enabled, account } = useMoralis();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const ownedByUser = seller === account || seller === undefined;
  const formatSeller = ownedByUser ? "you" : truncateStr(seller || "", 15);

  const updateUI = async () => {
    //get tokenURI
    const tokenURI = await getTokenURI();
    console.log("tokenURI: ", tokenURI);
    if (tokenURI) {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      console.log("requestURL: ", requestURL);
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageUriUrl = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageUriUrl);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const [showModal, setShowModal] = useState(false);
  const hideModal = () => {
    setShowModal(false);
  };

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: marketAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
    msgValue: price,
  });

  const { dispatch } = useNotification();
  const handleBuyItemSuccess = async (tx) => {
    await tx.wait(1);

    dispatch({
      type: "success",
      message: "Item bough!",
      title: "Item bough!",
      position: "topR",
    });
  };

  const handleClickCard = () => {
    if (ownedByUser) {
      setShowModal(true);
    } else {
      buyItem({
        onError: (error) => console.log(error),
        onSuccess: handleBuyItemSuccess,
      });
    }
  };

  return (
    <>
      {imageURI ? (
        <div>
          <UpdateListingModal
            visible={showModal}
            marketplaceAddress={marketplaceAddress}
            tokenId={tokenId}
            nftAddress={nftAddress}
            onClose={hideModal}
          ></UpdateListingModal>
          <Card
            title={tokenName}
            description={tokenDescription}
            onClick={handleClickCard}
          >
            <div className="flex flex-col items-end gap-2">
              <div># {tokenId}</div>
              <div className="italic text-sm">Owned by {formatSeller}</div>
              <Image
                loader={() => imageURI}
                src={imageURI}
                width="200"
                height="200"
                alt="Cute pup"
              ></Image>

              <div className="font-bold">
                {ethers.utils.formatUnits(price, "ether")} ETH
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div>Hello</div>
    </>
  );
}
