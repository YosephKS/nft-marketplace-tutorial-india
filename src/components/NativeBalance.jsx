import { useEffect } from "react";
import { useMoralis, useChain, useNativeBalance } from "react-moralis";

function NativeBalance(props) {
  const { isInitialized, isAuthenticated, account } = useMoralis();
  const { chainId } = useChain();
  const { getBalances, data: balance } = useNativeBalance({
    ...props,
    address: account,
    chain: chainId,
  });

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      getBalances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated, chainId, account]);

  return (
    <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
      {balance?.formatted}
    </div>
  );
}

export default NativeBalance;
