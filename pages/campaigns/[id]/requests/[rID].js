import React from 'react';
import Link from 'next/link';
import { Grid, Card } from 'semantic-ui-react';
import Layout from 'components/Layout';
import ContributeForm from 'components/ContributeForm';
import getCampaign from 'ethereum/campaign';
import web3 from 'ethereum/web3';

function CampaignDetail(props) {
    const request = JSON.parse(props.request);
    const [currentAccount, setCurrentAccount] = React.useState('');
    //const currentAccount = accounts[0];

    React.useEffect(() => {
        console.log('Inside useEffect')
        getCurrentAccount();
    },[]);

    async function getCurrentAccount() {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        setCurrentAccount(accounts[0]);
    }
    /*window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        console.log('Inside accountsChanged');
        console.log('Addr of player', accounts);
        setCurrentAccount(accounts.length ? accounts[0] : '');
      })*/
    function renderRequestSummary() {
        const items = [
            {
                header: request.description,
                meta: 'Description',
                description: 'Purpose of the Request',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: props.manager,
                meta: 'Manager',
                description: 'Manager of the campaign',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: request.value,
                meta: 'Value (in Wei)',
                description: 'Amount needed to be paid to the recepient',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: request.recipient,
                meta: 'Balance (in Ether)',
                description: `On finalizing,the amount (${props.value} Wei) will be paid to this address`,
                style: { overflowWrap: 'break-word' }
            },
            {
                header: `${request.approvalsCount}/${props.contributorsCount}`,
                meta: 'Contributors',
                description: 'Number of users who have approved this request',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: request.completed ? 'Completed' : 'Pending',
                meta: 'Status',
                description: 'Whether the request has been finalized or not',
                style: { overflowWrap: 'break-word' }
            },
        ]
        return <Card.Group items={items} />
    }

    return (
        <Layout>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <h3>Request detail for {props.cID}</h3>
                        {renderRequestSummary()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <span>Curremt Account: {currentAccount}</span>
                        {
                            (currentAccount == props.manager)
                            ?   
                            <h3>Finalize this request</h3>
                            :
                            <h3>Approve this request</h3>
                        }
                        <h1>Contributors:   </h1>
                        {
                            props.contributorsList.map(c => <p>{c}</p>)
                        }
                        
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const cID = context.params.id;
    const reqID = context.params.rID;
    const campaign = getCampaign(cID);
    const summary =  await campaign.methods.getCampaignSummary().call();
    const request =  await campaign.methods.requests(reqID).call();
    const contributorsList = await campaign.methods.getContributorsList().call();
    

    return {
        props: {
            cID: cID,
            rID: reqID,
            request: JSON.stringify(request),
            contributorsCount: summary[3],
            manager: summary[4],
            contributorsList: contributorsList,
        }
    }
}

export default CampaignDetail;