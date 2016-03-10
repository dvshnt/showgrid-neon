import React from 'react';
import moment from 'moment';

var DateManager = require('../util/DateManager');


export default class List extends React.Component {
    createItemsMarkup(items, extra, Type) {

        var markupItems = items.map((item) => {  
            return (
                <li className="list-item" key={ item.id }>
                    <Type data={ item } extra={ extra }/>
                </li>
            );
        });

        if (extra.header_recent) {
            markupItems.unshift(<h3>Recently Added</h3>);
        }
        else if (extra.header_onsale) {
            markupItems.unshift(<h3>On Sale Soon</h3>);
        }

        return markupItems;
    }

    createItemsMarkupWithHeading(items, extra, Type) {
        var last_date = null;
        var date_header = "";

        var markupItems = items.map((item) => {
            if (!last_date || !last_date.isSame(item.date, 'days')) {

                if (extra.date_heading){
                    date_header = <h3 className="heading">{ DateManager.getUpcomingShowDate(moment(item.date)) }</h3>;
                }
                else if (extra.date_heading_front) {
                    date_header = <h3 className="heading">Shows Featured { DateManager.getUpcomingShowDate(moment(item.date)) }</h3>;
                }

                last_date = moment(item.date);
            }
            else {
                date_header = "";
            }

            return (
                <li className="list-item" key={ item.id }>
                    { date_header }
                    <Type data={ item } extra={ extra }/>
                </li>
            );
        });

        return markupItems;
    }

    render() {
        const ItemType = this.props.itemType;
        const items = this.props.items || [];
        const extra = this.props.extra || {};
        

        if (extra.date_heading || extra.date_heading_front) {
            var markupItems = this.createItemsMarkupWithHeading(items, extra, ItemType);
        }
        else {
            var markupItems = this.createItemsMarkup(items, extra, ItemType);
        }
        

        return (<ul className="list">{ markupItems }</ul>);
    }
};