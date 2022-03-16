import { useEffect, useState, useCallback } from "react";
import {
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
  useMoralis,
  useChain,
} from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTBalance = (options) => {
  const { isInitialized, account: walletAddress } = useMoralis();
  const { chainId } = useChain();
  const { account } = useMoralisWeb3Api();
  const { resolveLink } = useIPFS();
  const [NFTBalance, setNFTBalance] = useState([]);
  const {
    fetch: getNFTBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTs, {
    chain: chainId,
    address: walletAddress,
    ...options,
  });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  const handleFetchNFTBalance = useCallback(async () => {
    const NFTs = data?.result;
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
    setNFTBalance(NFTs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (data?.result) {
      handleFetchNFTBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isInitialized && chainId && account) {
      getNFTBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, account]);

  return { getNFTBalance, NFTBalance, fetchSuccess, error, isLoading };
};
