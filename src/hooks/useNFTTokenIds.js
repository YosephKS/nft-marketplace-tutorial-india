import { useCallback, useEffect, useState } from "react";
import {
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
  useChain,
} from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = (addr) => {
  const { token } = useMoralisWeb3Api();
  const { chainId } = useChain();
  const { resolveLink } = useIPFS();
  const [NFTTokenIds, setNFTTokenIds] = useState([]);
  const [totalNFTs, setTotalNFTs] = useState();
  const [fetchSuccess, setFetchSuccess] = useState(true);
  const {
    fetch: getNFTTokenIds,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(token.getAllTokenIds, {
    chain: chainId,
    address: addr,
    limit: 10,
  });

  const handleFetchTokenIds = useCallback(async () => {
    const NFTs = data?.result ?? [];
    setTotalNFTs(data?.total);
    setFetchSuccess(true);
    for (let NFT of NFTs) {
      if (NFT?.metadata) {
        NFT.metadata = JSON.parse(NFT.metadata);
        NFT.image = resolveLink(NFT.metadata?.image);
      } else if (NFT?.token_uri) {
        try {
          await fetch(NFT.token_uri)
            .then((response) => response.json())
            .then((data) => {
              NFT.image = resolveLink(data.image);
            });
        } catch (error) {
          setFetchSuccess(false);
        }
      }
    }
    setNFTTokenIds(NFTs);
  }, [data, resolveLink]);

  useEffect(() => {
    if (data?.result) {
      handleFetchTokenIds();
    }
  }, [data, handleFetchTokenIds]);

  useEffect(() => {
    if (addr !== "explore") {
      getNFTTokenIds();
    }
  }, [getNFTTokenIds, addr]);

  return {
    getNFTTokenIds,
    NFTTokenIds,
    totalNFTs,
    fetchSuccess,
    error,
    isLoading,
  };
};
