const express = require("express");
const balances = require("./publicBalances.json");
const { recoverAddress } = require("./utils");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

const nonces = {}

app.post("/send", async (req, res) => {
  const { message, recoveryBit, signature } = req.body;
  const { amount, nonce, recipient } = JSON.parse(message);
  const sender = await recoverAddress(message, signature, recoveryBit);

  setInitialBalance(sender);
  setInitialNonce(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds." });
  }
  else if (nonces[sender].has(nonce)) {
    res.status(400).send({ message: "Duplicate transaction." });
  }
  else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    nonces[sender].set(nonce, true);
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function setInitialNonce(address) {
  if (!nonces[address]) {
    nonces[address] = new Map();
  }
}
