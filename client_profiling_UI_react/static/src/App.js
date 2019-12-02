import React, { Component } from 'react';
import './App.css';
import Visualization from "./Visualization.js";
// import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
// import  Sidebar  from "react-sidebar";

class App extends Component {
  constructor() {
    super()
    this.state = {
      query_entity: "indi", 
      query_field: "name", // individual, name by default
      query_text: "",
      query: "", // pass down as a prop to the Visualization component
      submission: 0 ,// count of how many times user has queried,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCircularSubmit = this.handleCircularSubmit.bind(this)
    this.handleInsiderSubmit = this.handleInsiderSubmit.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState({ [name] : value })
  }

  handleSubmit(event) {
    event.preventDefault()
    var queries = {
    	  q1: `MATCH (a) WHERE (a:Client_profile OR a:Authorized_Person) AND (a.first_name CONTAINS '${this.state.query_text}' OR a.last_name CONTAINS '${this.state.query_text}') WITH a 
            OPTIONAL MATCH (a)-[r1:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
            OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) 
            OPTIONAL MATCH (a)-[r4:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r5:Is_BlackListed]-(bl:Blacklist) 
            OPTIONAL MATCH (a)<-[r6:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7`,

        q2: `MATCH (pan:PAN)<-[r1:HAS_PAN]-(a:Authorized_Person) WHERE (pan.PAN_no CONTAINS '${this.state.query_text}') WITH a, pan, r1 
            OPTIONAL MATCH (a)-[r2:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8 
            UNION MATCH (pan:PAN)<-[r1:HAS_PAN]-(a:Client_profile) WHERE (pan.PAN_no CONTAINS '${this.state.query_text}') WITH a, pan, r1
            OPTIONAL MATCH (a)-[r2:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8`,

        q3: `MATCH (add:address)<-[r1:HAS_ADDRESS]-(a:Authorized_Person) WHERE (add.city CONTAINS '${this.state.query_text}' OR add.state CONTAINS '${this.state.query_text}' OR add.street contains '${this.state.query_text}') WITH a, add, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8
            UNION MATCH (add:address)<-[r1:HAS_ADDRESS]-(a:Client_profile) WHERE (add.city CONTAINS '${this.state.query_text}' OR add.state CONTAINS '${this.state.query_text}' OR add.street contains '${this.state.query_text}') WITH a, add, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8`  ,

        q4: `MATCH (p:phone)<-[r1:HAS_PHONENo]-(a:Authorized_Person) WHERE (p.phone_number = toInteger('${this.state.query_text}')) WITH a, p, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8 
            UNION MATCH (p:phone)<-[r1:HAS_PHONENo]-(a:Client_profile) WHERE (p.phone_number = toInteger('${this.state.query_text}')) WITH a, p, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:EMPLOYEE]-(br_e:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8`  ,

        q5: `MATCH (e:email)<-[r1:HAS_EMAILID]-(a:Authorized_Person) WHERE (e.email_id CONTAINS '${this.state.query_text}') WITH a, e, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
            OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r4:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) 
            OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8
            UNION MATCH (e:email)<-[r1:HAS_EMAILID]-(a:Client_profile) WHERE (e.email_id CONTAINS '${this.state.query_text}') WITH a, e, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
            OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r4:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) 
            OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8` ,

        q6: `MATCH (b:Brokerage_Members)-[r1:EMPLOYEE]->(a:Authorized_Person) WHERE b.name CONTAINS '${this.state.query_text}' WITH a, b, r1
            OPTIONAL MATCH (b)-[r2:WORKS_FOR]->(c:Client_profile) WHERE b.name CONTAINS '${this.state.query_text}' RETURN a, b, c, r1, r2`  ,


        q7: `MATCH (b:Brokerage_Members)-[r1:EMPLOYEE]->(a:Authorized_Person) WHERE b.SEBI_NO CONTAINS '${this.state.query_text}' WITH a, b, r1
            OPTIONAL MATCH (b)-[r2:WORKS_FOR]->(c:Client_profile) WHERE b.SEBI_NO CONTAINS '${this.state.query_text}' RETURN a, b, c, r1, r2` ,

        q9: `MATCH (n) return n`,
          }
    if (this.state.query_entity === 'indi') {
    	if (this.state.query_field === 'name') {
    		this.setState({ query: queries.q1 })
    	} else
    	if (this.state.query_field === 'pan') {
    		this.setState({ query: queries.q2 })
    	} else
    	if (this.state.query_field === 'location') {
    		this.setState({ query: queries.q3 })
    	} else
    	if (this.state.query_field === 'phone') {
    		this.setState({ query: queries.q4 })
    	} else
    	if (this.state.query_field === 'email') {
    		this.setState({ query: queries.q5 })
    	}
	} else 
   if (this.state.query_entity === 'bro') {
		  if (this.state.query_field === 'name') {
			this.setState({ query: queries.q6 })
		} else
	 if (this.state.query_field === 'sebi') {
			this.setState({ query: queries.q7 })
		}
  }
  else{
    this.setState({ query: queries.q8 })
  }

	 this.setState({ submission: this.state.submission + 1 })
  }

  handleCircularSubmit(event) {
    event.preventDefault()
    var circular_query = "MATCH (a:AccountHolder)-[:HAS_ADDRESS]->(add:Address)<-[:HAS_ADDRESS]-(b:AccountHolder) OPTIONAL MATCH (a)-[:BUY_ORDER]->(s1:ShareDetail) OPTIONAL MATCH (b)-[:SELL_ORDER]->(s2:ShareDetail) WITH a, b, s1, s2, add WHERE (s1.BuyingSharesOf = s2.SellingSharesOf) AND (5 > toInteger(split(s1.Trading_Date, '/')[0]) - toInteger(split(s2.Trading_Date,'/')[0]) > 0) RETURN a, b, s1, s2, add"
    this.setState({ query: circular_query })
    this.setState({ submission: this.state.submission + 1 })
  }

  handleInsiderSubmit(event) {
    event.preventDefault()
    var insider_query = "MATCH (to:TradeOrder)<-[t:TRADE_ON]-(acc:AccountHolder)-[id:IS_DIRECTOR]->(com:company)-[e1:HAS_EVENT]->(e:EventABC)-[e2:HAS_EVENT1]->(b:EventABC1) WHERE(t.tradedate < b.Date) RETURN acc, com, to, e, b"
    this.setState({ query: insider_query })
    this.setState({ submission: this.state.submission + 1 })
  }
    
  render() {
    var invalid_query = false // maybe could be a state variable
    if (this.state.query_entity === 'bro') {
    	if ((this.state.query_field === 'location') || (this.state.query_field === 'pan')) {
    		invalid_query = true
    	}
    }

    return (
      <div className="App">
        <header className="App-header">   
          <h1 id="head-title"> NSE Client Profiling </h1>
      </header>
      
        <div id="search-menu"> {/* search menu using parameterized query*/}
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <label>
              Entity type:  
              <select name='query_entity' value={this.state.query_entity} onChange={this.handleChange}>
                <option value="indi">Individual</option>
                <option value="bro">Brokerage Member</option>
              </select>
            </label>
            <label id="query_field_label">  
              {/* For query field */}
              Query field:
              <select name='query_field' value={this.state.query_field} onChange={this.handleChange}>
                <option value="name">Name</option>
                <option value="pan">PAN</option>
                <option value="location">Location</option>
                <option value="phone">Phone Number</option>
                <option value="email">Email ID</option>
                <option value="sebi">SEBI No</option>
              </select>
             </label>
             <label id="query-space"> 
                <input type='text' name='query_text' id="display-text" placeholder="Search query" value={this.state.query_text} onChange={this.handleChange} />
              </label> 
              <input type="submit" value="Submit query" />
            </form>
            {/* <form onSubmit={this.handleCircularSubmit} encType="multipart/form-data">
              query search code pasted up
            </form> */}
            </div>
    
        {/* <p id="p-text"><strong>Search field: </strong> {this.state.query_text} </p> */}
      <div id="stored-query">
          <form onSubmit={this.handleInsiderSubmit} encType="multipart/form-data">
            <input type="submit" value="Submit query to search for circular trading" />  <br/>
            <input type="submit" value="Submit query to search for insiders trading" />
          </form>
      </div>


          { invalid_query && <p>Please only search for Brokerage Members by Name or SEBI No.</p> }   


            <div className="Vis-container">
                {this.state.submission > 0 && <Visualization query={this.state.query} id="viz" />}
            </div>
      </div>
    ); 
  }
}

export default App;
