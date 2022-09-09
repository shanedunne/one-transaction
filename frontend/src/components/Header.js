import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./styled/Button.styled";
import { BiWalletAlt } from "react-icons/bi";
import { SiEthereum } from "react-icons/si";
import { BsPerson } from "react-icons/bs";
import { Colors } from "../Theme";

const Title = styled.h1`
  font-family: "Kdam Thmor Pro", sans-serif;
  font-weight: normal;
  font-size: 1.5rem;
  text-align: center;
  justify-content: center;
`;

const WalletContainer = styled.div`
  display: flex;
  background-color: ${Colors.Background};
  height: 6vh;
  font-size: 1.7rem;
  padding-top: 5px;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: center;
  vertical-align: middle;
`;
const WalletIconContainer = styled.span``;

const HeaderAddress = styled.span`
  padding-right: 1rem;
`;

export default function WalletHeader() {
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
  let addressShort = address.slice(0, 7);

  if (address) {
    return (
      <WalletContainer>
        <Title>Authentic</Title>
        <HeaderAddress>{addressShort}</HeaderAddress>
        <SiEthereum
          style={{ marginRight: "1.5rem", verticalAlign: "middle" }}
        />
        <BsPerson style={{ verticalAlign: "middle" }} />
      </WalletContainer>
    );
  } else {
    return (
      <WalletContainer>
        <Title>Authentic</Title>
        <Button
          onClick={handleLinkWallet}
          style={{ justifyContent: "center", cursor: "pointer" }}
        >
          Connect
          <BiWalletAlt />
        </Button>
      </WalletContainer>
    );
  }
}
