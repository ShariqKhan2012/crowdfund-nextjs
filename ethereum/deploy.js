const hdWallet = require('@truffle/hdwallet-provider');
const provider = new hdWallet(
    'horror edit wine magnet forward skill stable hill pyramid domain quarter pledge',
    'https://rinkeby.infura.io/v3/d5a59a5f9b804981a1547791c8abb69a'
);
const Web3 = require('web3');
const web3 = new Web3(provider);
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const deployContract = async() => {
    const accounts = await web3.eth.getAccounts();
    const factory = await new web3.eth.Contract(
            compiledFactory.abi
        )
        .deploy({
            data: compiledFactory.evm.bytecode.object
        })
        .send({
            from: accounts[0],
            gas: 2000000
        });
    console.log('Factory deployed at => ', factory.options.address);
    provider.engine.stop();
}

deployContract();