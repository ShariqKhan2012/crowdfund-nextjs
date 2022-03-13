import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

export default () => {
    return (
        <Menu>
            <Menu.Item><Link href="/">Crowdfund</Link></Menu.Item>

            <Menu.Menu position="right">
                <Menu.Item><Link href="/">Campaigns</Link></Menu.Item>
                <Menu.Item><Link href="/campaigns/new">+</Link></Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}