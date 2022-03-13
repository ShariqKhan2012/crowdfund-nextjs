import Web3 from 'web3';

let web3;
if( typeof(window) !== 'undefined' && typeof(window.ethereum) !== 'undefined' ) {
    //We have access to Metamask
    web3 = new Web3(window.ethereum);
}
else {
    //We are on the server OR we dont have access to Metamask
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/d5a59a5f9b804981a1547791c8abb69a');
    web3 = new Web3(provider);
}

export default web3;