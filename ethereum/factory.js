import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(
    compiledFactory.abi,
    '0x2d4c7408cBdac6aAfeE31c5A193Ff6A78B6cb979'
);

export default factory;