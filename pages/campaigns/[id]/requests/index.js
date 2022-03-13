import React from 'react';
import Link from 'next/link';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import Layout from 'components/Layout';
import getCampaign from 'ethereum/campaign';

function Home(props) {
  //const [campaignRequests, setDeployedCampaigns] = React.useState(props.campaigns);
  const campaignRequests = props.requests;

  function renderRequests() {
    const items = campaignRequests.map(c => (
      {
        header: c.description,
        description: <Link href={`/campaigns/${c}`}>View Request</Link>,
        //fluid: true
      }
    ))
    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <h3>Requests List</h3>
      {renderRequests()}
      <Link href={`/campaigns/${props.cID}/requests/new`}>
        <Button
          floated='right'
          primary
          content='New Request'
          icon='add circle'
          //label={{ as: 'a', basic: true, pointing: 'right', content: '2,048' }}
          labelPosition='left'
        />
      </Link>
      {//renderRequests()
      }
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
  const requests = [];
  for (let i = 0; i < requestsCount; i++) {
    const request = await campaign.methods.requests(i).call();
    requests.push(request);
  }
  console.log(requests);
  return {
    props: {
      cID: context.params.id,
      requests: requests
    }
  }
}
export default Home;