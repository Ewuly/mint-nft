"use client";

import { useState } from "react";
import { createPublicClient, createWalletClient, custom, http, type Address } from "viem";
import contractData from "@/utils/contract.json";
import { sepolia } from "viem/chains";

export default function Home() {
  const [account, setAccount] = useState<Address>();

  async function connect() {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    const [address] = await walletClient.requestAddresses();
    setAccount(address);
  }

  async function mintNft() {
    console.log("contract", contractData);
    if (!account) return;

    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    const { request } = await publicClient.simulateContract({
      account,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x`,
      abi: contractData.abi,
      functionName: "safeMint",
      args: [],
    });

    const res = await walletClient.writeContract(request);
    alert(res);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      {account ? (
        <>
          <div>Connected: {account}</div>
          
          <button
            className="border border-black rounded-md p-2"
            onClick={mintNft}
          >
            Mint NFT
          </button>
        </>
      ) : (
        <button
          className="border border-black rounded-md p-2"
          onClick={connect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
