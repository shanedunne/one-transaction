require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: `${process.env.ALCHEMY_GOERLI_URL}`,
      accounts: [`0x${process.env.GOERLI_PRIVATE_KEY}`],
    },
  },
  defaultNetwork: "goerli",
  etherscan: {
    apiKey: "3F8MYM7X3V38SQPT4NCSV61ZZHVYT3NDCI",
  },
};
