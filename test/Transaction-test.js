const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const provider = ethers.provider;

describe("This is our main transaction testing scope", function () {
  let onetransaction, testtoken, contractOwner, addr1, addr2, addr3;

  before("deploy the contract instance first", async function () {
    // deploy the one transaction contract
    const OneTransaction = await ethers.getContractFactory("oneTransaction");
    onetransaction = await OneTransaction.deploy();
    await onetransaction.deployed({
      value: ethers.utils.parseUnits("10", "ether"),
    });

    // deploy the ERC20 test token
    const TestToken = await ethers.getContractFactory("TestToken");
    testtoken = await TestToken.deploy();

    [contractOwner, addr1, addr2, addr3] = await ethers.getSigners();

    const ownerBalance = await provider.getBalance(contractOwner.address);

    // send ether to the contract

    const transactionHash = await contractOwner.sendTransaction({
      to: onetransaction.address,
      value: ethers.utils.parseEther("1.0"),
    });
  });

  it("it should set the owner to be the deployer of the contract", async function () {
    // assert.equal(await onetransaction.owner(), contractOwner);
    expect(await onetransaction.owner()).to.equal(contractOwner.address);
  });

  it("should ensure only the owner can empty the smart contract", async function () {
    await expect(onetransaction.connect(addr1).emptyContract()).to.be.reverted;
  });

  it("should transfer ether to the selected recipients", async function () {
    console.log("before" + (await provider.getBalance(addr1.address)));
    await onetransaction.sendEther(
      [addr1.address, addr2.address, addr3.address],
      ethers.utils.parseUnits("0.5", "ether"),
      { value: ethers.utils.parseUnits("1.5", "ether") }
    );
    console.log(
      "contract balance" + (await provider.getBalance(onetransaction.address))
    );
    let initialBalance = await provider.getBalance(addr1.address);
    console.log("initial" + initialBalance);
    let newBalance = initialBalance + ethers.utils.parseUnits("1", "ether");
    console.log("new-balance" + newBalance);
    // expect(await provider.getBalance(addr1.address)).to.equal(newBalance);
    console.log("after" + (await provider.getBalance(addr1.address)));
  });

  // tests related to the sendToken function
  it("should ensure the balance of the test token was sent to the deployer", async function () {
    const ownerBalance = await testtoken.balanceOf(contractOwner.address);
    expect(await testtoken.totalSupply()).to.equal(ownerBalance);
    console.log("token balance" + ownerBalance.toString());
  });

  // test the send token function
  it("should sent the test token to the supplied addresses", async function () {
    var numberOfDecimals = 18;
    var numberOfTokens = ethers.utils.parseUnits("1.0", numberOfDecimals);
    var allowanceAmount = ethers.utils.parseUnits("10.0", numberOfDecimals);

    await testtoken.approve(onetransaction.address, allowanceAmount);
    await onetransaction.sendToken(
      testtoken.address,
      [addr1.address, addr2.address],
      numberOfTokens
    );
    expect(await testtoken.balanceOf(addr1.address)).to.equal(
      ethers.utils.parseUnits("1.0", numberOfDecimals)
    );
  });
});
