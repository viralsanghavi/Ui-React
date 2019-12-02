import React from "react"
import * as NeoVis from 'neovis.js/dist/neovis.js'

class Visualization extends React.Component {
	// constructor(props) {
	// 	super(props)
	// }

	componentDidMount() {
		var config = {
			container_id: this.props.id,
			server_url: "bolt://localhost:7687",
			server_user: "neo4j",
			server_password: "12345",
			initial_cypher: this.props.query,
			labels: {
                "Client_profile": {
                    "caption": "first_name",    
                },
                "Brokerage_Members": {
                    "caption": "name",    
                },
                "Authorized_Person": {
                    "caption": "first_name",    
                },
                "Acc_summary": {
                    "caption": "Bal",    
                },
                "address": {
                    "caption": "street",    
                },
                "PAN": {
                    "caption": "PAN_no",    
                },
                "phone": {
                    "caption": "phone_number",    
                },
                "email": {
                    "caption": "email_id",    
                },
                "Blacklist": {
                    "caption": "type",    
                },
            },
            relationships: {
                "HAS_PAN": {
                    "caption": false,
                },
                "HAS_EMAILID": {
                    "caption": false,
                },
                "HASEMAIL_ID": {
                    "caption": false,
                },
                "HAS_ADDRESS": {
                   "caption": false,
                },
                "HAS_PHONE_NUMBER": {
                    "caption": false,
                },
                "WORKS_FOR": {
                    "caption": false,
                },
                "EMPLOYEE": {
                    "caption": false,
                },
                "Acc_Sum": {
                    "caption": false,
                },
                "CLIENT": {
                    "caption": false,
                },
                "HAS_PHONENo": {
                    "caption": false,
                },
                "Is_BlackListed": {
                    "caption": false,
                },
            },
		}
		var viz = new NeoVis.default(config);
    	viz.render();
	}

    componentDidUpdate(prevProps) {
        if (this.props.query !== prevProps.query) {
            var config = {
            container_id: this.props.id,
            server_url: "bolt://localhost:7687",
            server_user: "neo4j",
            server_password: "12345",
            initial_cypher: this.props.query,
            labels: {
                "Client_profile": {
                    "caption": "first_name",    
                },
                "Brokerage_Members": {
                    "caption": "name",    
                },
                "Authorized_Person": {
                    "caption": "first_name",    
                },
                "Acc_summary": {
                    "caption": "Bal",    
                },
                "address": {
                    "caption": "street",    
                },
                "PAN": {
                    "caption": "PAN_no",    
                },
                "phone": {
                    "caption": "phone_number",    
                },
                "email": {
                    "caption": "email_id",    
                },
                "Blacklist": {
                    "caption": "type",    
                },
                "AccountHolder": {
                    "caption": "FirstName",    
                },
                
            },
            relationships: {
                "HAS_PAN": {
                    "caption": false,
                },
                "HAS_EMAILID": {
                    "caption": false,
                },
                "HASEMAIL_ID": {
                    "caption": false,
                },
                "HAS_ADDRESS": {
                   "caption": false,
                },
                "HAS_PHONE_NUMBER": {
                    "caption": false,
                },
                "WORKS_FOR": {
                    "caption": false,
                },
                "EMPLOYEE": {
                    "caption": false,
                },
                "Acc_Sum": {
                    "caption": false,
                },
                "CLIENT": {
                    "caption": false,
                },
                "HAS_PHONENo": {
                    "caption": false,
                },
                "Is_BlackListed": {
                    "caption": false,
                },
                "BUY_ORDER": {
                    "caption": true,
                },
                "SELL_ORDER": {
                    "caption": true,
                },
                // "Is_BlackListed": {
                //     "caption": false,
                // },
                
            },
        }
        var viz = new NeoVis.default(config);
        viz.render();
        }
    }


    render() {
        const style = {
            width: "500px",
            height: "400px",
            border: "2px solid lightgray",
            font: "22pt Montserrat",
        }

        return (
            <div
                id={this.props.id}
                style={style}
            />

        )
    }
}

export default Visualization

