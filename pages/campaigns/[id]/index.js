import React from 'react';
import Link from 'next/link';
import { Grid, Card } from 'semantic-ui-react';
import Layout from 'components/Layout';
import ContributeForm from 'components/ContributeForm';
import getCampaign from 'ethereum/campaign';
import web3 from 'ethereum/web3';

function CampaignDetail(props) {
    function renderCampaignSummary() {
        const items = [
            {
                header: props.manager,
                meta: 'Manager',
                description: 'The manager created this campaign and can create and finalize requests',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: props.minContribution,
                meta: 'Minimum Contribution (in Wei)',
                description: 'Contributors can approve a request',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(props.balance, 'ether'),
                meta: 'Balance (in Ether)',
                description: 'Conributions has left to spend',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: props.contributorsCount,
                meta: 'Contributors',
                description: 'Number of users who have contributed to this campaign',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: props.requestsCount,
                meta: 'Requests',
                description: 'Number of requests created by the manager',
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
                        <h3>Campaign detail for {props.cID}</h3>
                        {renderCampaignSummary()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h3>Contribute to this campaign</h3>
                        <ContributeForm cID={props.cID} minContribution={props.minContribution} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link href={`/campaigns/${props.cID}/requests/`}>View Requests</Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const cID = context.params.id;
    const campaign = getCampaign(cID);
    const summary = await campaign.methods.getCampaignSummary().call();
    return {
        props: {
            cID: cID,
            minContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            contributorsCount: summary[3],
            manager: summary[4]
        }
    }
}

export default CampaignDetail;