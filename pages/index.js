import React from 'react';
import Link from 'next/link';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import Layout from 'components/Layout';
import factory from 'ethereum/factory';

function Home(props) {
  //const [deployedCampaigns, setDeployedCampaigns] = React.useState(props.campaigns);
  const deployedCampaigns = props.campaigns;

  function renderCampaigns() {
    const items = deployedCampaigns.map(c => (
      {
        header: c,
        description: <Link href={`/campaigns/${c}`}>View Campaign</Link>,
        fluid: true
      }
    ))
    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <Link href="/campaigns/new">
        <Button
          floated='right'
          primary
          content='Add Campaign'
          icon='add circle'
          //label={{ as: 'a', basic: true, pointing: 'right', content: '2,048' }}
          labelPosition='left'
        />
      </Link>
      {renderCampaigns()}
    </Layout>
  )
}
/*
export async function getStaticProps(params) {
  const campaigns = await factory.methods.getdeployedCampaigns().call();
  return {
    props: {
      campaigns: campaigns,
    }
  }
}
*/
export async function getServerSideProps(params) {
  const campaigns = await factory.methods.getdeployedCampaigns().call();
  return {
    props: {
      campaigns: campaigns,
    }
  }
}
export default Home;