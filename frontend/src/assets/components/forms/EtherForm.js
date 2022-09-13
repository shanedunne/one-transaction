import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { instance } from "../../../utils/axiosConfig";
import style from "./Form.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";

var etherAmount, etherRecipients;

export default function EtherForm() {
  const [recipients, setRecipients] = useState([{ id: uuidv4(), address: "" }]);

  const [formData, setFormData] = useState({
    amount: "",
    sender: "",
  });

  const handleInputChange = (e) => {
    setRecipients({ ...recipients, [e.target.name]: e.target.value });
  };

  const handleAddRecipients = () => {
    setRecipients([...recipients, { address: "" }]);
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
    <form onSubmit={handleSubmit} className="SendForm">
      <h1>Send Ether to Multiple Addresses</h1>
      {recipients.map((recipient, i) => (
        <div key={i}>
          <TextField
            type="text"
            placeholder="Recipient Address"
            name="owner"
            value={recipient.address}
          />
          <IconButton
            disabled={recipients.length === 1}
            onClick={() => handleRemoveRecipients(recipient.id)}
          >
            <RemoveIcon />
          </IconButton>
          <IconButton onClick={handleAddRecipients}>
            <AddIcon />
          </IconButton>
        </div>
      ))}
      <TextField
        type="text"
        placeholder="Amount to send"
        name="owner"
        value={formData.etherAmount}
        onChange={handleInputChange}
      />
      <input type="submit" />
    </form>
  );
}
