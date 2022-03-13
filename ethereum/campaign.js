import web3 from 'ethereum/web3';
import compiledCampaign from 'ethereum/build/Campaign.json';

export default (address) => {
    const campaign = new web3.eth.Contract(compiledCampaign.abi, address)
    return campaign;
};