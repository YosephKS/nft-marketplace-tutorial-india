import { Select } from "antd";
import { useChain } from "react-moralis";
import { getCollectionsByChain } from "helpers/collections";
const { Option } = Select;

function SearchCollections({ setInputValue }) {
  const { chainId } = useChain();
  const NFTCollections = getCollectionsByChain(chainId);

  function onChange(value) {
    setInputValue(value);
  }

  return (
    <>
      <Select
        showSearch
        style={{ width: "1000px", marginLeft: "20px" }}
        placeholder="Find a Collection"
        optionFilterProp="children"
        onChange={onChange}
      >
        {NFTCollections &&
          NFTCollections.map((collection, i) => (
            <Option value={collection.addrs} key={i}>
              {collection.name}
            </Option>
          ))}
      </Select>
    </>
  );
}
export default SearchCollections;
