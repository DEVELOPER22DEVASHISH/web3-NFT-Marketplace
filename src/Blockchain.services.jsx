import Web3 from 'web3'; // connecting smart conract to metamask then frontend
import { setGlobalState, getGlobalState,setAlert } from './store';

import abi from './abis/TimelessNFT.json';


const {ethereum} = window
window.web3 = new Web3(ethereum);
window.web3 = new Web3(window.web3.currentProvider)

const getEthereumContract = async () => {
    const connectedAcoount = getGlobalState('connectedAccount')

    if (connectedAcoount) {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = abi.networks[networkId]

        if(networkData) {
            const contract = new web3.eth.contract(abi.abi , networkData.address)
             return contract
        }else {
            return null
        }
    }
    else{
        return getGlobalState('contract')
    }

}

const connectWallet = async () => {
    try {
        if(!ethereum) return alert('please install Metamask')
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        setGlobalState('connectedAccount', accounts[0].toLowerCase()) // for making uniformity to not to work diffrently
        
    } catch (error) {
        reportError(error)
        
    }
}


const isWalletConnected = async () => {
    try {
        if(!ethereum) return alert('please install Metamask')
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})

        window.ethereum.on('chainChanged', async (chainId) =>{  // example - sepolia georli
           window.location.reload()

        })


        window.ethereum.on('accountsChanged', async () =>{  // this is for checking  for an account change // hence this is an event
            setGlobalState('connectedAccount', accounts[0].toLowerCase())
            await isWalletConnected()
        })

        if(accounts.length) {
            setGlobalState('connectedAccount', accounts[0].toLowerCase())
        } else{
            alert('Please connect wallet')
            console.log('No accounts found')
        }

    } catch (error) {
        
    }
}




// const getAllNFTs = async () => {
//   try {
//     if (!ethereum) return reportError('Please install Metamask')

//     const contract = await getEtheriumContract()
//     const nfts = await contract.methods.getAllNFTs().call()
//     const transactions = await contract.methods.getAllTransactions().call()

//     setGlobalState('nfts', structuredNfts(nfts))
//     setGlobalState('transactions', structuredNfts(transactions))
//   } catch (error) {
//     reportError(error)
//   }
// }



// const structuredNfts = (nfts) => {
//   return nfts
//     .map((nft) => ({
//       id: Number(nft.id),
//       owner: nft.owner.toLowerCase(),
//       cost: window.web3.utils.fromWei(nft.cost),
//       title: nft.title,
//       description: nft.description,
//       metadataURI: nft.metadataURI,
//       timestamp: nft.timestamp,
//     }))
//     .reverse()
// }

const mintNFT = async ({ title, description, metadataURI, price }) => {
    try {
      price = window.web3.utils.toWei(price.toString(), 'ether')
      const contract = await getEthereumContract()
      const account = getGlobalState('connectedAccount')
      const mintPrice = window.web3.utils.toWei('0.01', 'ether')
  
      await contract.methods
        .payToMint(title, description, metadataURI, price)
        .send({ from: account, value: mintPrice }) // it is payable function
  
      return true
    } catch (error) {
      reportError(error)
    }
  }
  
  const buyNFT = async ({ id, cost }) => {
    try {
      cost = window.web3.utils.toWei(cost.toString(), 'ether')
      const contract = await getEtheriumContract()
      const buyer = getGlobalState('connectedAccount')
  
      await contract.methods
        .payToBuy(Number(id))
        .send({ from: buyer, value: cost })
  
      return true
    } catch (error) {
      reportError(error)
    }
  }
  
  const updateNFT = async ({ id, cost }) => {
    try {
      cost = window.web3.utils.toWei(cost.toString(), 'ether')
      const contract = await getEtheriumContract()
      const buyer = getGlobalState('connectedAccount')
  
      await contract.methods.changePrice(Number(id), cost).send({ from: buyer })
    } catch (error) {
      reportError(error)
    }
  }
const reportError = (error) =>  {
    setAlert(JSON.stringify(error), 'red')
    throw new Error('No Ethereum Object.')
}

export {connectWallet, isWalletConnected,  mintNFT, buyNFT, updateNFT}
    



