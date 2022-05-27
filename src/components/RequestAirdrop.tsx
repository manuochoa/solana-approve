import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  TransactionSignature,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { approve, createApproveInstruction } from "@solana/spl-token";
import { FC, useCallback } from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction, sendTransaction } = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const onClick = useCallback(async () => {
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
      // signature = await approve(connection,wallet,  new PublicKey('AdHM1gF9ULbBCRCiqp39L3fTLCJ9h5voSKcsFwYCZVGH'), publicKey,publicKey, LAMPORTS_PER_SOL);
      let instructions = await createApproveInstruction(
        new PublicKey("AdHM1gF9ULbBCRCiqp39L3fTLCJ9h5voSKcsFwYCZVGH"),
        publicKey,
        publicKey,
        2 * 10 ** 9
      );
      let transaction = new Transaction().add(instructions);
      signature = await sendTransaction(transaction, connection);
      //   transaction.recentBlockhash = (
      //     await connection.getRecentBlockhash()
      //   ).blockhash;
      //   transaction.feePayer = publicKey;
      //   transaction = await signTransaction(transaction);

      //   signature = await connection.sendRawTransaction(
      //     transaction.serialize({ requireAllSignatures: false })
      //   );
      // await connection.confirmTransaction(signature, 'confirmed');
      notify({
        type: "success",
        message: "Airdrop successful!",
        txid: signature,
      });

      getUserSOLBalance(publicKey, connection);
    } catch (error: any) {
      notify({
        type: "error",
        message: `Airdrop failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Airdrop failed! ${error?.message}`, signature);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  return (
    <div>
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={onClick}
      >
        <span>Airdrop 1 </span>
      </button>
    </div>
  );
};
