import React from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from 'components/Layout';
import getCampaign from 'ethereum/campaign';
import web3 from 'ethereum/web3';

function NewRequest(props) {
  const [description, setDescription] = React.useState('');
  const [value, setValue] = React.useState(0);
  const [recipient, setRecipient] = React.useState('');
  const [errMsg, setErrMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }
  function handleValueChange(e) {
    setValue(e.target.value);
  }
  function handleRecipientChange(e) {
    setRecipient(e.target.value);
  }

  function handleDismissError() {
    setErrMsg('');
  }

  async function handleCreateRequest(e) {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = getCampaign(router.query.id)
      await campaign.methods.createRequest(description, value, recipient).send({
        from: accounts[0],
        //value: description
      })
      setLoading(false);
      router.push(`/campaigns/${router.query.id}/requests`);
    }
    catch (ex) {
      setLoading(false);
      setErrMsg(ex.message);
    }
  }
  return (
    <Layout>
      <h3>Create a Request</h3>

      <Form onSubmit={handleCreateRequest} error={!!errMsg.length} size="large">
        <Message
          error
          onDismiss={handleDismissError}
          content={errMsg}
          header='There was some errors with your submission'
        />
        <Form.Group widths='equal'>
          <Form.Field>
            <Input
              value={description}
              placeholder='Description'
              onChange={handleDescriptionChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
              value={value}
              label='Wei'
              labelPosition='right'
              placeholder='Amount'
              onChange={handleValueChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
              value={recipient}
              placeholder='Address of the recipient'
              onChange={handleRecipientChange}
            />
          </Form.Field>
        </Form.Group>

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
export default NewRequest;