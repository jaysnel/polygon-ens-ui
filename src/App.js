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
  const tld = '.ghost';

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
    console.log('ContractABI: ', contractAbi)
    console.log('ethers.js object: ', ethers) 
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
            <div className='domain-input'><input type="text" maxLength="20" placeholder='Domain Name'/><p className='tld'> {tld} </p></div>
            <div><input type="text" placeholder='Record'/></div>
            <div className='text-center'><Button buttonText='Mint' buttonFunction={mintDomain}/></div>
          </div>}
      </div>
    </>
  );
}

export default App;
