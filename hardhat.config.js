require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_GOERLI_URL}`,
      accounts: [`${process.env.GOERLI_PRIVATE_KEY}`],
    },
  },
  defaultNetwork: "goerli",
  etherscan: {
    apiKey: "3F8MYM7X3V38SQPT4NCSV61ZZHVYT3NDCI",
  },
};
