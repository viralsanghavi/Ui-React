import React, { Component } from "react";
import "./App.css"
class Form extends Component {

    constructor(props) {
      super(props)
      this.state = {
        query_entity: "indi", // default to individual name
        query_field: "name",
        query_text: "",
        graph_display_on: false,
        query_option: ""
      }
      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.visRef = React.createRef();
    }
  
    handleChange(event) {
      console.log(event.target.name);
      console.log(event.target.value);
      this.setState({ [event.target.name]: event.target.value });
    }
  
    handleSubmit(event) {
      // current_search = this.state.query_text
      event.preventDefault();
      if ((this.state.query_entity === 'indi') && (this.state.query_field === 'name')) {
        // this.setState( { query_option: true }) }
        this.setState({
          query_option: `MATCH (a) WHERE (a:Client_profile OR a:Authorized_Person) AND (a.first_name CONTAINS ${this.state.query_text} OR a.last_name CONTAINS ${this.state.query_text}) WITH a 
              OPTIONAL MATCH (a)-[r1:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
              OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) 
              OPTIONAL MATCH (a)-[r4:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r5:Is_BlackListed]-(bl:Blacklist) 
              OPTIONAL MATCH (a)<-[r6:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7` })
      }
      else if ((this.state.query_entity === 'indi') && (this.state.query_field === 'pan')) {
        this.setState({
          query_option: `MATCH (pan:PAN)<-[r1:HAS_PAN]-(a:Authorized_Person) WHERE (pan.PAN_no CONTAINS ${this.state.query_text}) WITH a, pan, r1 
              OPTIONAL MATCH (a)-[r2:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
              OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
              OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
              OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8 
              UNION MATCH (pan:PAN)<-[r1:HAS_PAN]-(a:Client_profile) WHERE (pan.PAN_no CONTAINS ${this.state.query_text}) WITH a, pan, r1
              OPTIONAL MATCH (a)-[r2:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
              OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
              OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
              OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8` })
      }
      else if ((this.state.query_entity === 'indi') && (this.state.query_field === 'location')) {
        this.setState({
          query_option: `MATCH (add:address)<-[r1:HAS_ADDRESS]-(a:Authorized_Person) WHERE (add.city CONTAINS ${this.state.query_text} OR add.state CONTAINS ${this.state.query_text} OR add.street contains ${this.state.query_text}) WITH a, add, r1
              OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
              OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
              OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
              OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8
              UNION MATCH (add:address)<-[r1:HAS_ADDRESS]-(a:Client_profile) WHERE (add.city CONTAINS ${this.state.query_text} OR add.state CONTAINS ${this.state.query_text} OR add.street contains ${this.state.query_text}) WITH a, add, r1
              OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
              OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
              OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
              OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8` })
      }
      else if ((this.state.query_entity === 'indi') && (this.state.query_field === 'phone')) {
        this.setState({
          query_option: `MATCH (p:phone)<-[r1:HAS_PHONENo]-(a:Authorized_Person) WHERE (p.phone_number = toInteger(${this.state.query_text})) WITH a, p, r1
              OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) 
              OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
              OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
              OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8 
              UNION MATCH (p:phone)<-[r1:HAS_PHONENo]-(a:Client_profile) WHERE (p.phone_number = toInteger(${this.state.query_text})) WITH a, p, r1
              OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) 
              OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
              OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              OPTIONAL MATCH (a)<-[r8:EMPLOYEE]-(br_e:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8` })
      }
      else if ((this.state.query_entity === 'indi') && (this.state.query_field === 'email')) {
        this.setState({
          query_option: `MATCH (e:email)<-[r1:HAS_EMAILID]-(a:Authorized_Person) WHERE (e.email_id CONTAINS ${this.state.query_text}) WITH a, e, r1
              OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
              OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r4:HAS_PHONENo]->(p:phone) 
              OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) 
              OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8
              UNION MATCH (e:email)<-[r1:HAS_EMAILID]-(a:Client_profile) WHERE (e.email_id CONTAINS ${this.state.query_text}) WITH a, e, r1
              OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
              OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r4:HAS_PHONENo]->(p:phone) 
              OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) 
              OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
              RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8` })
      }
      else if ((this.state.query_entity === 'bro_member') && (this.state.query_field === 'name')) {
        this.setState({
          query_option: `MATCH (b:Brokerage_Members)-[r1:EMPLOYEE]->(a:Authorized_Person) WHERE b.name CONTAINS ${this.state.query_text} WITH a, b, r1
              OPTIONAL MATCH (b)-[r2:WORKS_FOR]->(c:Client_profile) WHERE b.name CONTAINS ${this.state.query_text} RETURN a, b, c, r1, r2`
        })
      }
      else if ((this.state.query_entity === 'bro_member') && (this.state.query_field === 'sebi')) {
        this.setState({
          query_option: `MATCH (b:Brokerage_Members)-[r1:EMPLOYEE]->(a:Authorized_Person) WHERE b.SEBI_NO CONTAINS ${this.state.query_text} WITH a, b, r1
              OPTIONAL MATCH (b)-[r2:WORKS_FOR]->(c:Client_profile) WHERE b.SEBI_NO CONTAINS ${this.state.query_text} RETURN a, b, c, r1, r2`
        })
      }
      console.log(this.state);
  
    }
  
    render(){
      var valid_query = true
  
      if (this.state.query_entity === 'bro_member') {
        valid_query = false
      }
      return(
        <div className="App">
          <header className="App-header">
  
            <h1> NSE Client Profiling </h1>
  
            <p>
              Enter fields of the relationship you would like to search for.
            </p>
  
            <p><strong>Search field: </strong> {this.state.query_text} </p>
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <label>
              <input type='text' name='query_text' placeholder="Search query" value={this.setState.query_text} onChange={this.handleChange} />
            </label>
            <br />
            <label>
                Entity type:
              <select name='query_entity' value={this.setState.query_entity} onChange={this.handleChange}>
                <option value="indi">Individual</option>
                <option value="bro_member">Brokerage Member</option>
              </select>
            </label>
            <br />
            <label>
                Entity field:
                <select name='query_field' value={this.state.query_field} onChange={this.handleChange}>
                  <option value="name">Name</option>
                  <option value="pan">PAN</option>
                  <option value="location">Location</option>
                  <option value="phone">Phone Number</option>
                  <option value="email">Email ID</option>
                  <option value="sebi">SEBI No</option>
                </select>
              </label>
              <br />
              <button>Submit query</button>
            </form>
            {(valid_query === false) &&
              <p> Please only search for Brokerage Members by name or SEBI No. </p>}
          </header>
        </div>
  
      );
    }
    
    
  }
  export default Form;
  // ReactDOM.render(<Form />, document.getElementById('root'));
  