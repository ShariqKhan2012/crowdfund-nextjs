import React from 'react';
import Link from 'next/link';
import { Table, Button } from 'semantic-ui-react';
import Layout from 'components/Layout';
import getCampaign from 'ethereum/campaign';
import RequestRow from 'components/RequestRow';

function Home(props) {
  //const [campaignRequests, setDeployedCampaigns] = React.useState(props.campaigns);
  const cID = props.cID;
  const campaignRequests = props.requests;
  const contributorsCount = props.contributorsCount;

  function renderRequests() {
    const requests = JSON.parse(props.requests);
    if (!requests.length) {
      return 'No requests yet';
    }
    console.log('requests =>', requests);

    return (
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            requests.map((r,i) => (
              <RequestRow id={i} cID={cID} request={r} key={i} contributorsCount={contributorsCount}/>
            ))
          }
        </Table.Body>
      </Table>
    )
  }

  return (
    <Layout>
      <h3>Requests List</h3>
      <Link href={`/campaigns/${props.cID}/requests/new`} style={{marginBottom: '20px'}}>
        <Button
          floated='right'
          primary
          content='New Request'
          icon='add circle'
          //label={{ as: 'a', basic: true, pointing: 'right', content: '2,048' }}
          labelPosition='left'
        />
      </Link>
      {renderRequests()}
    </Layout>
  )
}
/*
export async function getStaticProps(params) {
  const campaigns = await factory.methods.getcampaignRequests().call();
  return {
    props: {
      campaigns: campaigns,
    }
  }
}
*/
export async function getServerSideProps(context) {
  const campaign = getCampaign(context.params.id);
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const contributorsCount = await campaign.methods.contributorsCount().call();
  let requests = await Promise.all(Array(parseInt(requestsCount)).fill().map((r, index) => {
    return campaign.methods.requests(index).call();
  }))

  return {
    props: {
      cID: context.params.id,
      contributorsCount: contributorsCount,
      requests: JSON.stringify(requests),
    }
  }
}
export default Home;