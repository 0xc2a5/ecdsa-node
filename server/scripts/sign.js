const { signMessage } = require("../utils");
const accounts = require("../privateAccounts.json");

const ADDRESS = "0x08ed5062298791fecab6e00a01cda59464879410";
const PRIVATE_KEY = accounts[ADDRESS].privateKey;

const MESSAGE = `{"amount":"10","nonce":"abc123","recipient":"0x00484f7c1694bab5a953b771569c88953e1f86f8"}`;
// {"signature":"0x304502210088c616ed07af0a67992d3b3ce305c9cff764a523d5f40a027a3b44b11722f072022074496b07a4ce61d9cedf18e38589beae7f55e4f4c3d1e5007332da2fac4341b0","recoveryBit":0}

// const MESSAGE = `{"amount":"1000","nonce":"abc123","recipient":"0x00484f7c1694bab5a953b771569c88953e1f86f8"}`;
// {"signature":"0x304402202b155bf367ae429ff181269cf2ca09cfc52630f1313b8d23f0498621032b712602201ac35c12773f9545db3d39979133f1551276502bd7bb29f7b53d390e354a70b1","recoveryBit":1}

async function sign() {
  const signedMessage = await signMessage(MESSAGE, PRIVATE_KEY);
  console.log(JSON.stringify(signedMessage));
}

sign();