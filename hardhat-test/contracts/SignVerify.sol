// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Sign & Verify - Exercise 2
/// @notice Verifies Ethereum signed messages (EIP-191 format)
contract SignVerify {
    
    string public constant MESSAGE = "Trade: BUY 1.5 BTC @ 92000";
    address public immutable expectedSigner;
    
    constructor(address _expectedSigner) {
        expectedSigner = _expectedSigner;
    }
    
    /// @notice Verify the fixed MESSAGE with the given signature
    function verifySignature(bytes memory signature) external view returns (bool) {
        bytes32 ethSignedHash = getEthSignedMessageHash(MESSAGE);
        return recoverSigner(ethSignedHash, signature) == expectedSigner;
    }
    
    /// @notice Verify any custom message
    function verifyMessage(string memory message, bytes memory signature) 
        external 
        view 
        returns (bool) 
    {
        bytes32 ethSignedHash = getEthSignedMessageHash(message);
        return recoverSigner(ethSignedHash, signature) == expectedSigner;
    }
    
    /// @notice Build the EIP-191 hash exactly like ethers.signMessage does
    function getEthSignedMessageHash(string memory message) 
        public 
        pure 
        returns (bytes32) 
    {
        // طول پیام به بایت (نه کاراکتر)
        uint256 messageLength = bytes(message).length;
        
        // فرمت EIP-191: "\x19Ethereum Signed Message:\n" + length + message
        // همه در یک مرحله هش می‌شن
        bytes memory prefix = abi.encodePacked(
            "\x19Ethereum Signed Message:\n",
            uintToString(messageLength)
        );
        
        return keccak256(abi.encodePacked(prefix, message));
    }
    
    /// @notice Recover the signer address from signature
    function recoverSigner(bytes32 ethSignedHash, bytes memory signature)
        public
        pure
        returns (address)
    {
        require(signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        // اگر v کوچک بود (0 یا 1)، تبدیل به فرمت استاندارد (27/28)
        if (v < 27) {
            v += 27;
        }
        
        return ecrecover(ethSignedHash, v, r, s);
    }
    
    /// @notice Convert uint to string
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}