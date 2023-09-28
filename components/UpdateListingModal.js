import { ethers } from "ethers";
import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NFTMarketplace.json";

export default function UpdateListingModal({
  //   seller,
  nftAddress,
  tokenId,
  price,
  marketplaceAddress,
  visible,
  onClose,
}) {
  const { dispatch } = useNotification();

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "listed updated",
      title: "Listing updated - refresh",
      position: "topR",
    });
    onClose && onClose();
    setPriceToUpdateListing(0);
  };

  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    },
  });

  return (
    <Modal
      isVisible={visible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onError: (error) => {
            console.log(error);
          },
          onSuccess: handleSuccess,
        });
      }}
    >
      <Input
        label="Update listing price in L1 Currency(ETH)"
        name="New listing price"
        type="number"
        onChange={(e) => {
          setPriceToUpdateListingWith(e.target.value);
        }}
        onOk={() => {}}
      ></Input>
    </Modal>
  );
}
