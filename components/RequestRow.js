import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Table, Button } from 'semantic-ui-react';
import getCampaign from 'ethereum/campaign';
import web3 from 'ethereum/web3';

export default (props) => {
    const [loading, setLoading] = React.useState(false);
    //   const [errMsg, setErrMsg] = React.useState('');
    const id = props.id;
    const cID = props.cID;
    const contributorsCount = props.contributorsCount;
    const request = props.request;
    const router = useRouter();
    console.log('id =>', id, typeof(id) );

    async function approveRequest() {   
        console.log('Inside approveRequest');
        const cId = router.query.id;
        setLoading(true);
        try {
            const campaign = getCampaign(cId);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(props.id).send({
                from: accounts[0]
            });
            setLoading(false);
        }
        catch (e) {
            //setErrMsg(e.message);
            console.log(e)
            console.log(e.message)
            setLoading(false);
        }
    }

    async function finalizeRequest() {
        console.log('Inside finalizeRequest');
        const cId = router.query.id;
        setLoading(true);
        try {
            const campaign = getCampaign(cId);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(props.id).send({
                from: accounts[0]
            });
            setLoading(false);
        }
        catch (e) {
            //setErrMsg(e.message);
            console.log(e)
            console.log(e.message)
            setLoading(false);
        }
    }
    //<Link href={`/campaigns/${cID}/requests/${id}`}>{id}</Link>
    return (
        <Table.Row disabled={request.complete}>
            <Table.Cell><Link href={`/campaigns/${cID}/requests/${id}`} >{id.toString()}</Link></Table.Cell>
            <Table.Cell>{request.description}</Table.Cell>
            <Table.Cell>{request.value}</Table.Cell>
            <Table.Cell>{request.recipient}</Table.Cell>
            <Table.Cell>{request.approvalsCount}/{contributorsCount}</Table.Cell>
            <Table.Cell>
                {
                    (!request.complete && (request.approvalsCount < props.contributorsCount))
                    &&
                    <Button basic color="green" onClick={approveRequest} loading={loading}>Approve</Button>
                }
            </Table.Cell>
            <Table.Cell>
                {
                    (!request.complete && (request.approvalsCount > props.contributorsCount/2) )
                    &&
                    <Button basic color="blue" onClick={finalizeRequest} loading={loading}>Finalize</Button>
                }
            </Table.Cell>
        </Table.Row>
    )
}