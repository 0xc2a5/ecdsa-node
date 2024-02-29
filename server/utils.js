const { keccak256 } = require("ethereum-cryptography/keccak");
const secp256k1 = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes, bytesToHex } = require("ethereum-cryptography/utils");

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);

  return hash;
}

async function signMessage(message, privateKey) {
  const hash = hashMessage(message);
  const [signature, recoveryBit] = await secp256k1.sign(hash, hexToBytes(privateKey.slice(2)), { recovered: true });

  return {
    signature: `0x${toHex(signature)}`,
    recoveryBit
  };
}

async function recoverAddress(message, signature, recoveryBit) {
  const messageHash = hashMessage(message);
  const publicKey = secp256k1.recoverPublicKey(messageHash, signature.slice(2), recoveryBit);
  const keyHash = keccak256(publicKey);
  const address = keyHash.slice(-20);

  return `0x${toHex(address)}`;
}

module.exports = {
  hashMessage,
  signMessage,
  recoverAddress
}