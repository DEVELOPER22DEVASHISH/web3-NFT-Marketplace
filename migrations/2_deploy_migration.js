
const TimelessNFT = artifacts.require('TimelessNFT')

module.exports = async (deployer) => {
  const accounts = await web3.eth.getAccounts()

  //  TNT for synbol , 10 for royalty fee then artist accounts
  await deployer.deploy(TimelessNFT, 'Timeless NFTs', 'TNT', 10, accounts[1])
}
