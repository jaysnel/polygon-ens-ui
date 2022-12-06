import React, {useEffect, useState} from 'react'
import './App.css';

function App() {
  const [isWalletError, setIsWalletError] = useState(false)
  const [walletErrorMessage, setWalletErrorMessage] = useState('');
  const noWalletFound = "Get MetaMask -> https://metamask.io/";
  const [currentAccount, setCurrentAccount] = useState('')
  
  const checkIfWalletIsConnected = async () => {
    try {
      const {ethereum} = window
      if(!ethereum) {
        setIsWalletError(true)
        setWalletErrorMessage('No wallet found. Connect to a wallet');
        return;
      }

      const accounts = await ethereum.request({method: 'eth_accounts'});
      
      if(accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
      } else {
        setIsWalletError(true)
        setWalletErrorMessage('No wallet found. Connect to a wallet');
      }

    } catch (err) {
      setWalletErrorMessage(`${err.data.origin}: ${err.message}`);
      console.log(err)  
    }
  }

  const connectWallet = async () => {
    setIsWalletError(false)
    try {
      const {ethereum} = window
      if (!ethereum) {
        setIsWalletError(true)
        return;
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log("Connected: ", accounts);
      setCurrentAccount(accounts);

    } catch (err) {
      console.log(err)
      setIsWalletError(true)
      setWalletErrorMessage(err.message);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <>
      <div>
        <h1>Ghost ENS Service</h1>
        {currentAccount !== '' && <div>Current Connected Account: {currentAccount}</div>}
        {isWalletError && <div>{walletErrorMessage || noWalletFound}</div>}
        <button onClick={() => {connectWallet()}}>Connect Wallet</button>
      </div>
    </>
  );
}

export default App;
