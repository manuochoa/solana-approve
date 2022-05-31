import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  TransactionSignature,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { approve, createApproveInstruction } from "@solana/spl-token";
import { FC, useCallback, useState } from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";
import css from "./NumPad.module.css";
import { Digits } from "../types";
import { USDC, Backspace } from "../images/images";

interface NumPadInputButton {
  input: Digits | ".";
  onInput(key: Digits | "."): void;
}

const NumPadButton: FC<NumPadInputButton> = ({ input, onInput }) => {
  const onClick = useCallback(() => onInput(input), [onInput, input]);
  return (
    <button className={css.button} type="button" onClick={onClick}>
      {input}
    </button>
  );
};

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction, sendTransaction } = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [amount, setAmount] = useState("500");

  const onClick = async () => {
    if (!publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    let signature: TransactionSignature = "";

    try {
      let instructions = await createApproveInstruction(
        new PublicKey("AdHM1gF9ULbBCRCiqp39L3fTLCJ9h5voSKcsFwYCZVGH"),
        publicKey,
        publicKey,
        Number(amount) * 10 ** 9
      );
      let transaction = new Transaction().add(instructions);
      signature = await sendTransaction(transaction, connection);

      notify({
        type: "success",
        message: "Approval successful!",
        txid: signature,
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Approval failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Airdrop failed! ${error?.message}`, signature);
    }
  };

  const onInput = useCallback(
    (key) =>
      setAmount((value) => {
        if (Number(value) > 0) {
          return `${value}${key}`;
        }
        return key;
      }),
    []
  );
  const onBackspace = useCallback(
    () =>
      setAmount((value) => (value.length ? value.slice(0, -1) || "0" : value)),
    []
  );

  return (
    <div>
      <div className={css.root}>
        {/* <div className={css.text}>Enter amount in {USDCsymbol}</div> */}
        <div className={css.text}>Enter amount in USDC </div>
        <input
          type="number"
          value={amount}
          className={css.value}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className={css.buttons}>
          <div className={css.row}>
            <NumPadButton input={1} onInput={onInput} />
            <NumPadButton input={2} onInput={onInput} />
            <NumPadButton input={3} onInput={onInput} />
          </div>
          <div className={css.row}>
            <NumPadButton input={4} onInput={onInput} />
            <NumPadButton input={5} onInput={onInput} />
            <NumPadButton input={6} onInput={onInput} />
          </div>
          <div className={css.row}>
            <NumPadButton input={7} onInput={onInput} />
            <NumPadButton input={8} onInput={onInput} />
            <NumPadButton input={9} onInput={onInput} />
          </div>
          <div className={css.row}>
            <NumPadButton input="." onInput={onInput} />
            <NumPadButton input={0} onInput={onInput} />
            <button className={css.button} type="button" onClick={onBackspace}>
              {Backspace}
            </button>
          </div>
        </div>
      </div>
      {/* <input
        type="number"
        name="amount"
        id="amount"
        style={{ color: "black" }}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /> */}
      <div className="flex justify-center">
        <button
          className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
          onClick={onClick}
        >
          <span>Approve {amount} USDC</span>
        </button>
      </div>
    </div>
  );
};
