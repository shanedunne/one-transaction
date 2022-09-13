import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { instance } from "../../../utils/axiosConfig";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";

var etherAmount, etherRecipients;

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

const Input = styled.input`
  font-size: 18px;
  padding: 10px;
  margin: 10px;
  border: solid 1px;
  ::placeholder {
    color: palevioletred;
  }
`;

export default function EtherForm() {
  const [recipients, setRecipients] = useState([{ id: uuidv4(), address: "" }]);

  const [formData, setFormData] = useState({
    amount: "",
    sender: "",
  });

  // handles changes to form fields except recipients
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    // daoOwner = e.target.etherAmount.value;
    // tName = e.target.etherRecipients.value;

    const res = await axios
      .post("/server/generate-dao", {
        etherAmount,
        etherRecipients,
      })
      .then((result) => {
        console.log(result);
      });
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="SendForm">
        <Title>Send Ether to Multiple Addresses</Title>
        <InputContainer>
          {recipients.map((recipient, i) => (
            <div key={i}>
              <Input
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
          <Input
            placeholder="Ether Amount"
            name="amount"
            value={formData.etherAmount}
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
