import React, { useState, useMemo } from "react";
import { useMoralis, useChain } from "react-moralis";
import {
  Card,
  Image,
  Tooltip,
  Modal,
  Input,
  Alert,
  Spin,
  Button,
  notification,
} from "antd";
import { useNFTBalance } from "hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { abi as marketplaceABI } from "../contracts/Marketplace.json";
// import { abi as erc721ABI } from "../contracts/ERC721.json";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

function NFTBalance() {
  const { NFTBalance, fetchSuccess, getNFTBalance } = useNFTBalance();
  const { Moralis } = useMoralis();
  const { chainId } = useChain();
  const [visible, setVisibility] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [price, setPrice] = useState(1);
  const ItemImage = Moralis.Object.extend("ItemImages");

  /**
   * useWeb3ExecuteFunction - Create Market Item
   *
   * @description Lising NFT to Marketplace
   * @param {Address} nftContract - NFT Contract Address that is going to be listed
   * @param {String} tokenId - Token Id of the NFT
   * @param {String} price - Price that is going to be listed
   */
  const {
    fetch: createMarketItem,
    isFetching: createMarketItemFetching,
    isLoading: createMarketItemLoading,
  } = useWeb3ExecuteFunction({});

  /**
   * useWeb3ExecuteFunction - setApproveForAll
   *
   * @description Approve NFT to Marketplace
   * @param {Address} operator - Marketplace address
   * @param {Boolean} approved - true or false
   */
  const {
    fetch: setApproveForAll,
    isFetching: setApproveForAllFetching,
    isLoading: setApproveForAllLoading,
  } = useWeb3ExecuteFunction({});

  const loading = useMemo(
    () =>
      createMarketItemFetching ||
      createMarketItemLoading ||
      setApproveForAllFetching ||
      setApproveForAllLoading,
    [
      createMarketItemFetching,
      createMarketItemLoading,
      setApproveForAllFetching,
      setApproveForAllLoading,
    ],
  );

  const listItem = async () => {
    await createMarketItem({
      onSuccess: () => {
        setVisibility(false);
        addItemImage();
        getNFTBalance();
        notification.success({
          message: "Success!",
          description:
            "Your NFT has been successfully listed on the marketplace!",
        });
      },
      onError: () => {
        notification.error({
          message: "Error!",
          description: "There was a problem listing your NFT!",
        });
      },
    });
  };

  const approveAll = async () => {
    await setApproveForAll({
      onSuccess: () => {
        notification.success({
          message: "Success!",
          description: "Approval is now set, you may list your NFT!",
        });
      },
      onError: () => {
        notification.error({
          message: "Error!",
          description: "There was a problem with setting approval!",
        });
      },
    });
  };

  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  function addItemImage() {
    const itemImage = new ItemImage();

    itemImage.set("image", nftToSend.image);
    itemImage.set("nftContract", nftToSend.token_address);
    itemImage.set("tokenId", nftToSend.token_id);
    itemImage.set("name", nftToSend.name);

    itemImage.save();
  }

  return (
    <>
      <div style={styles.NFTs}>
        {marketplaceABI.noContractDeployed && (
          <>
            <Alert
              message="No Smart Contract Details Provided. Please deploy smart contract and provide address + ABI in the MoralisDappProvider.js file"
              type="error"
            />
            <div style={{ marginBottom: "10px" }}></div>
          </>
        )}
        {!fetchSuccess && (
          <>
            <Alert
              message="Unable to fetch all NFT metadata... We are searching for a solution, please try again later!"
              type="warning"
            />
            <div style={{ marginBottom: "10px" }}></div>
          </>
        )}
        {NFTBalance &&
          NFTBalance.map((nft, index) => (
            <Card
              hoverable
              actions={[
                <Tooltip title="View On Blockexplorer">
                  <FileSearchOutlined
                    onClick={() =>
                      window.open(
                        `${getExplorer(chainId)}address/${nft.token_address}`,
                        "_blank",
                      )
                    }
                  />
                </Tooltip>,
                <Tooltip title="List NFT for sale">
                  <ShoppingCartOutlined onClick={() => handleSellClick(nft)} />
                </Tooltip>,
              ]}
              style={{ width: 240, border: "2px solid #e7eaf3" }}
              cover={
                <Image
                  preview={false}
                  src={nft?.image || "error"}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                  alt=""
                  style={{ height: "240px" }}
                />
              }
              key={index}
            >
              <Card.Meta title={nft.name} description={nft.contract_type} />
            </Card>
          ))}
      </div>

      <Modal
        title={`List ${nftToSend?.name} #${nftToSend?.token_id} For Sale`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={() => listItem()}
        okText="List"
        footer={[
          <Button onClick={() => setVisibility(false)}>Cancel</Button>,
          <Button onClick={() => approveAll(nftToSend)} type="primary">
            Approve
          </Button>,
          <Button onClick={() => listItem()} type="primary">
            List
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <img
            src={`${nftToSend?.image}`}
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
            alt="placeholder"
          />
          <Input
            autoFocus
            placeholder="Listing Price in MATIC"
            onChange={(e) => setPrice(e.target.value)}
          />
        </Spin>
      </Modal>
    </>
  );
}

export default NFTBalance;
