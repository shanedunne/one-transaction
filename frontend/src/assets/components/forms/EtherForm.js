import React, { useState } from "react";
import { BigNumber, ethers } from "ethers";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import ABI from "./abi.json";
import WalletHeader from "../WalletHeader";

const Title = styled.h1`
  font-family: "Kdam Thmor Pro", sans-serif;
  font-weight: normal;
  font-size: 1.5rem;
  text-align: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  margin: 0 auto;
  padding-top: 10rem;
  justify-content: center;
  text-align: center;
`;
const InputContainer = styled.div``;

const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const AddressInput = styled.input`
  width: 26rem;
  font-size: 15px;
  padding: 10px;
  margin: 10px;
  border: solid 1px;
  ::placeholder {
    color: palevioletred;
  }
`;

const AmountInput = styled.input`
  width: 10rem;
  font-size: 14px;
  padding: 10px;
  margin: 10px;
  border: solid 1px;
  text-align: center;
  ::placeholder {
    color: palevioletred;
  }
`;

var etherAmount;
var etherRecipients = [];

// test addresses
// 0xBEE2e019E38032fAF6D89548c3BB3671E5D91237
// 0x1Cf9d9f7cb3Be5Be4fe755Fc108114dD1579fBA3

// ether information
const contractAddress = "0x17fA1a1B1814958f32aCcFA2695396860C1e93A1";

let contract;

// gas margin increaser function

function gasMargin(estimate, addition) {
  return estimate * addition;
}

export default function EtherForm() {
  const [recipients, setRecipients] = useState([{ id: uuidv4(), address: "" }]);

  const [formData, setFormData] = useState({
    amount: "",
  });

  // handles changes to form fields except recipients
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(typeof formData.amount);
  };

  // handles changes to the recipient fields

  const handleRecipientChangeInput = (id, event) => {
    const newRecipients = recipients.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
      console.log(newRecipients);
    });

    setRecipients(newRecipients);
  };

  const handleAddRecipients = () => {
    setRecipients([...recipients, { id: uuidv4(), address: "" }]);
  };

  const handleRemoveRecipients = (id) => {
    const values = [...recipients];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setRecipients(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(recipients);

    // extract addresses from recipients and push into a etherRecipients array
    recipients.map((x) => etherRecipients.push(x.address));

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await signer;

    contract = new ethers.Contract(contractAddress, ABI, signer);

    etherAmount = ethers.utils.parseUnits(formData.amount, "ether");

    // handle gas estimation
    const gasEstimated = await contract.estimateGas.sendEther(
      etherRecipients,
      etherAmount
    );

    // call the contract
    const tx = await contract.sendEther(etherRecipients, etherAmount, {
      gasLimit: Math.ceil(gasMargin(gasEstimated, 1.1)),
    });

    await tx.wait();
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="SendForm">
        <Title>Send Ether to Multiple Addresses</Title>
        <InputContainer>
          {recipients.map((recipient, i) => (
            <div key={i}>
              <AddressInput
                placeholder="Recipient Address"
                name="address"
                value={recipient.address}
                onChange={(event) =>
                  handleRecipientChangeInput(recipient.id, event)
                }
              />
              <IconButton
                disabled={recipients.length === 1}
                onClick={() => handleRemoveRecipients(recipient.id)}
              >
                <RemoveIcon />
              </IconButton>
              <IconButton
                disabled={recipients.length === 10}
                onClick={handleAddRecipients}
              >
                <AddIcon />
              </IconButton>
            </div>
          ))}
          <AmountInput
            placeholder="Ether Amount"
            name="amount"
            value={formData.amount}
            onChange={handleFormChange}
          />
        </InputContainer>
        <Button type="submit" onClick={handleSubmit}>
          Send ETH
        </Button>
      </form>
    </FormContainer>
  );
}
