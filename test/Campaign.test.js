const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(
            compiledFactory.abi
        )
        .deploy({
            data: compiledFactory.evm.bytecode.object,
            //arguments: []
        })
        .send({
            from: accounts[0],
            gas: 2000000
        });

    await factory.methods.createCampaign(15).send({
        from: accounts[1],
        gas: 2000000
    });
    [campaignAddress] = await factory.methods.getdeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi, 
        campaignAddress
    );
});

describe('Campaign tests', () => {
    it('Factory is created', () => {
        assert.ok(factory.options.address);
    });

    it('Campaign is created', () => {
        assert.ok(campaign.options.address);
    })
    it('Get a list of campaigns', async () => {
        const campaigns = await factory.methods.getdeployedCampaigns().call();
        assert.ok(campaigns);
        console.log(campaigns);
    })
    it('Manager is assigned to the campaign', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[1]);
        console.log(manager, accounts);
    })
    it('Min contribution assigned to campaign', async() => {
        const minAmt = await campaign.methods.getMinContribution().call();
        assert.equal(minAmt, 15);
        console.log(minAmt)
    })
    it('People can contribute', async() => {
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: 17,
            gas: 2000000
        })
        const balance = await web3.eth.getBalance(campaignAddress);
        assert.ok(balance);
        console.log(balance);
        const hasContributed = await campaign.methods.contributors(accounts[2]).call();
        assert.ok(hasContributed);
        console.log(hasContributed);
    })
    it('People can NOT contribute less than the minimum Amount', async() => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[2],
                value: 9,
                gas: 2000000
            });
            throw(false);
        }
        catch(e) {
            console.log(e);
            assert.ok(e);
        }
    })
    it('Manager can create a request', async() => {

    })
    it('Non-managers can NOT create a request', async() => {

    })
    it('Contributors can approve a request', async() => {

    })
    it('Cobtributors can NOT approve the same request twice', async() => {

    })
    it('Non-contributors can NOT approve a request', async() => {

    })    
    it('Manager can finalize a request', async() => {

    })
    it('Non-Manager can NOT finalize a request', async() => {

    })
    it('Balance gets transferred to the request recipient', async() => {

    })
    it('Contributos can NOT approve a completed request', async() => {

    })

});