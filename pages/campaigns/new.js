import React from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from 'components/Layout';
import factory from 'ethereum/factory';
import web3 from 'ethereum/web3';

function NewCampaigns(props) {
  const [minContribution, setMinContribution] = React.useState(0);
  const [errMsg, setErrMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  function handleAmountChange(e) {
    setMinContribution(e.target.value);
  }

  function handleDismissError() {
    setErrMsg('');
  }

  async function handleSubmitCampaign(e) {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContribution).send({
        from: accounts[0],
        //value: minContribution
      })
      setLoading(false);
      router.push('/');
    }
    catch (ex) {
      setLoading(false);
      setErrMsg(ex.message);
    }
  }
  return (
    <Layout>
      <h3>Create a Campaign</h3>

      <Form onSubmit={handleSubmitCampaign} error={!!errMsg.length}>
        <Message
          error
          onDismiss={handleDismissError}
          content={errMsg}
          header='There was some errors with your submission'
          list={[
            'You must include both a upper and lower case letters in your password.',
            'You need to select your home country.',
          ]}
        />
        <Form.Field>
          <Input
            value={minContribution}
            label='Wei'
            labelPosition='right'
            placeholder='Minimum Amount'
            onChange={handleAmountChange}
          />
        </Form.Field>
        <Button
          type="submit"
          primary
          loading={loading}
          content='Create'
        //icon='add circle'
        //label={{ as: 'a', basic: true, pointing: 'right', content: '2,048' }}
        //labelPosition='left'
        />
      </Form>


    </Layout>
  )
}
export default NewCampaigns;