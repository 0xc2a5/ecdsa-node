const { keccak256 } = require("ethereum-cryptography/keccak");
const secp256k1 = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const fs = require("fs/promises");

function getAddress(publicKey) {
  const hash = keccak256(publicKey);
  const address = hash.slice(-20);

  return address;
}

async function createAccounts(n) {
  const privateAccounts = {};
  const publicBalances = {};

  for (let i = 0; i < n; i++) {
    const privateKey = secp256k1.utils.randomPrivateKey();
    const publicKey = secp256k1.getPublicKey(privateKey);
    const address = getAddress(publicKey);

    privateAccounts[`0x${toHex(address)}`] = {
      privateKey: `0x${toHex(privateKey)}`,
      publicKey: `0x${toHex(publicKey)}`
    };

    publicBalances[`0x${toHex(address)}`] = i * 100;
  }

  await fs.writeFile("privateAccounts.json", JSON.stringify(privateAccounts, null, 2));
  await fs.writeFile("publicBalances.json", JSON.stringify(publicBalances, null, 2));

  console.log("privateAccounts", JSON.stringify(privateAccounts, null, 2));
  console.log("publicBalances", JSON.stringify(publicBalances, null, 2));
}

createAccounts(10);