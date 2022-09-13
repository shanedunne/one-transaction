import React, { Component } from "react";
import styled from "styled-components";
import { Colors } from "./assets/Theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WalletHeader from "./assets/components/WalletHeader";
import EtherForm from "./assets/components/forms/EtherForm";

const AppEl = styled.div`
  display: flex;
  flex-direction: column;
  positioin: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  overfolow: hidden;
  height: 100vh;
`;

const Pages = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

function App() {
  return (
    <Router>
      <AppEl>
        <WalletHeader />
        <EtherForm />
      </AppEl>
    </Router>
  );
}

export default App;
