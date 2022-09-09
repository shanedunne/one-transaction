import { ethers } from "ethers";
import style from "./Header.module.css";
import React, { useState, useEffect } from "react";
import { Identicon, EthAddress } from "ethereum-react-components";

export default function App() {
  const [address, setAddress] = useState("");
  const [theProvider, setTheProvider] = useState(null);

  // get etheruem instance
  const { ethereum } = window;

  useEffect(() => {
    if (ethereum) {
      //try to connect immediatly, if that fails, address won't be set and the button to manually connect will be shown
      handleLinkWallet();
    }
  }, []);

  let provider;

  const handleLinkWallet = () => {
    console.log("Attempting to link wallet");
    provider = new ethers.providers.Web3Provider(ethereum);

    // put provider in state so we can use it later without worrying about it not being set anymore
    setTheProvider(provider);

    //provider = new ethers.providers.Web3Provider(ethereum);
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        console.log("Wallet linked successfully");
        // here we put the address details into state to use later
        getUserDetails();
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      });
  };

  async function getUserDetails() {
    //this function uses provider rather than theProvider, because handleLinkWallet has just set provider, but unless we use promises theProvider won't have been set yet
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();

    // here we set the address from the  signer
    setAddress(walletAddress);
  }

  if (address) {
    return (
      <div className={style.HeaderConnected}>
        <Identicon className={style.addressId} address={address} />
      </div>
    );
  } else {
    return (
      <div className={style.header}>
        <button className={style.button} onClick={handleLinkWallet}>
          Connect Wallet (Goerli)
        </button>
      </div>
    );
  }
}
