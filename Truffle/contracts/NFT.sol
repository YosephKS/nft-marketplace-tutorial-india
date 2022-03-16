// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    constructor() ERC721("Example Token", "EXMP") {
        _safeMint(0x7c470D1633711E4b77c8397EBd1dF4095A9e9E02, 0);
        _safeMint(0x7c470D1633711E4b77c8397EBd1dF4095A9e9E02, 1);
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.moralis.io:2053/ipfs/QmbNWhHYZBzhjEkU31kh46GRwCaArLcczmJYEoTxh2f9K7/metadata/";
    }
}
