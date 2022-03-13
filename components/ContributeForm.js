import React from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import {useRouter} from 'next/router';
import web3 from 'ethereum/web3';
import getCampaign from 'ethereum/campaign';

export default (props) => {
    //State variables
    const [amount, setAmount] = React.useState(0);
    const [errMsg, setErrMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    

    function handleAmountChange(e) {
        setAmount(e.target.value);
    }

    function handleDismissError() {
        setErrMsg('');
    }

    async function handleContributeToCampaign(e) {
        e.preventDefault();
        setErrMsg('');
        if(amount < props.minContribution) {
            setErrMsg(`Contribution amount must be at least ${props.minContribution} Wei`);
            return;
        }
        setLoading(true);
        try {
            const campaign = getCampaign(props.cID);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: amount
            })
            setLoading(false);
            router.replace(`/campaigns/${props.cID}`)
        }
        catch(e) {
            setErrMsg(e.message);
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleContributeToCampaign} error={!!errMsg.length}>
            <Message
                error
                onDismiss={handleDismissError}
                content={errMsg}
                header='There was some errors with your submission'
            />
            <Form.Field>
                <Input
                    value={amount}
                    label='Wei'
                    labelPosition='right'
                    placeholder='Amount To Contribute'
                    onChange={handleAmountChange}
                />
                <label>Min. contribution {props.minContribution} Wei</label>
            </Form.Field>
            <Button
                type="submit"
                primary
                loading={loading}
                content='Contribute'
            />
        </Form>
    )
}