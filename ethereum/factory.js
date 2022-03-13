import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(
    compiledFactory.abi,
    //'0xa2022FeBeeeE698610f1ac955Bfdd7D08B63a661'
    '0x846586d66419e1E6E7Cec18D6539e21925958A87'
);

export default factory;