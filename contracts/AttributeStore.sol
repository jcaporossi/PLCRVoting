pragma solidity^0.8.0;

library AttributeStore {

    struct Data {
        mapping(bytes32 => uint) store;
    }

    function getAttribute(Data storage self, bytes32 UUID, string calldata attrName) external view returns (uint) {
        bytes32 key = keccak256(abi.encodePacked(UUID, attrName));
        return self.store[key];
    }

    function setAttribute(Data storage self, bytes32 UUID, string calldata attrName, uint attrVal) external {
        bytes32 key = keccak256(abi.encodePacked(UUID, attrName));
        self.store[key] = attrVal;
    }
}