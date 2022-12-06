import React, {useEffect, useState} from 'react'
import './App.css';
import contractAbi from './utils/contractAbi.json';
import Button from './components/Button'

function App() {
  const {ethers} = require('ethers');
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const [walletConnected, setWalletConnected] = useState(false)
  const noWalletFound = "Get MetaMask -> https://metamask.io/";
  const [currentAccount, setCurrentAccount] = useState('')
  const [domainName, setDomainName] = useState('');
  const [domainRecord, setDomainRecord] = useState('')
  const contractAddress = '0x72096923Abfa6C0C491A392b84ded12C9246748e'
  const tld = '.ghost';

  const setDomain = (e) => {
    setDomainName(e.target.value);
  }

  const setRecord = (e) => {
    setDomainRecord(e.target.value);
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const {ethereum} = window
      if(!ethereum) {
        setIsError(true)
        setErrorMessage('No wallet found. Connect to a wallet');
        return;
      }

      const accounts = await ethereum.request({method: 'eth_accounts'});
      if(accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        setWalletConnected(true);
      } else {
        setIsError(true)
        setErrorMessage('No wallet found. Connect to a wallet');
      }

    } catch (err) {
      setErrorMessage(`${err.data.origin}: ${err.message}`);
      console.log(err)  
    }
  }

  const connectWallet = async () => {
    setIsError(false)
    try {
      const {ethereum} = window
      if (!ethereum) {
        setIsError(true)
        return;
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log("Connected: ", accounts);
      setCurrentAccount(accounts);
      setWalletConnected(true);

    } catch (err) {
      console.log(err)
      setIsError(true)
      setErrorMessage(err.message);
    }
  }

  const mintDomain = async () => {
    try {
      const {ethereum} = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        await provider.send("eth_requestAccounts", []);
    
        const signer = provider.getSigner();
        console.log('Signer: ', signer);
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)
        console.log('Contract: ',contract)

        const price = domainName.length <= 3 ? '0.5' : domainName.length <= 6 ? '0.3' : '0.1';
	      console.log("Minting domain", domainName, "with price", price);

        let registerDomainName = await contract.register(domainName, {value: ethers.utils.parseEther(price)})
        registerDomainName.wait();
        console.log('Domain name registered!')

        // let getDomainName = await contract.getAddress(domainName)
        // console.log('Domain Name: ', getDomainName)

        
      }
    } catch (err) {
      console.log(err.message);
    }
    // console.log('Domain Name: ', domainName);
    // console.log('Domain Name Record: ', domainRecord);
    // console.log('ContractABI: ', contractAbi)
    // console.log('ethers.js object: ', ethers) 
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <>
      <div className='grid justify-center content-center w-screen h-screen bg-gradient-to-r from-slate-600 to-orange-900'>
        <h1 className=''>Ghost ENS Service</h1>
        {currentAccount !== '' && <div>Account: {currentAccount}</div>}
        {isError && <div>{errorMessage || noWalletFound}</div>}
        {!walletConnected && <button onClick={() => {connectWallet()}}>Connect Wallet</button>}
        {walletConnected && 
          <div>
            <div className='domain-input'><input type="text" maxLength="20" placeholder='Domain Name' onChange={setDomain}/><p className='tld'> {tld} </p></div>
            <div><input type="text" placeholder='Record' onChange={setRecord}/></div>
            <div className='text-center'><Button buttonText='Mint' buttonFunction={mintDomain} buttonStyles='bg-slate-600 hover:bg-orange-900 duration-100 border-0 rounded-xl transition duration-500 ease-in-out'/></div>
          </div>}
      </div>
    </>
  );
}

export default App;
