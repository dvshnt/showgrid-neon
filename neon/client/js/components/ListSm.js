import React from 'react';
import moment from 'moment';

import ListItemSm from './ListItemSm';

var DateManager = require('util/DateManager');


export default class ListSm extends React.Component {
    createItemsMarkup(items, extra) {

        var markupItems = items.map((item) => {  
            return (
                <li className="list-item" key={ item.id }>
                    <ListItemSm data={ item } extra={ extra }/>
                </li>
            );
        });

        if (extra.header_recent) {
            markupItems.unshift(<h3 key = {'listsm-recent'}>Recently Added</h3>);
        }
        else if (extra.header_onsale) {
            markupItems.unshift(<h3 key={'listsm-sale'}>On Sale Soon</h3>);
        }

        return markupItems;
    }

    render() {
        const items = this.props.items || [];
        const extra = this.props.extra || {};
        
        var markupItems = this.createItemsMarkup(items, extra);

        return (<ul className="list">{ markupItems }</ul>);
    }
};