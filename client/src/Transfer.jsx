import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signatureAndRecoveryBit, setSignatureAndRecoveryBit] = useState("");
  const [nonce, setNonce] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const message = JSON.stringify({
    amount: sendAmount,
    nonce,
    recipient
  });


  async function transfer(evt) {
    evt.preventDefault();

    try {
      const { recoveryBit, signature } = JSON.parse(signatureAndRecoveryBit);
      const {
        data: { balance },
      } = await server.post(`send`, {
        message,
        recoveryBit,
        signature
      });
      console.log("balance", balance);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Nonce
        <input
          placeholder="Type a random value to prevent duplicate transactions, for example: abc123"
          value={nonce}
          onChange={setValue(setNonce)}
        ></input>
      </label>

      <label>
        Message
        <pre id="message">
          {message}
        </pre>
      </label>

      <label>
        Signature & Recovery Bit
        <input
          placeholder="Sign the message above and enter the result: { signature, recoveryBit }"
          value={signatureAndRecoveryBit}
          onChange={setValue(setSignatureAndRecoveryBit)}
        ></input>

      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
