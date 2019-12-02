from flask import url_for, redirect, render_template, Flask, session, flash, request, jsonify
from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, DateField, SelectField, SubmitField
from datetime import datetime
from neo4j import GraphDatabase
import json

app = Flask(__name__, template_folder="../static")
app.config['SECRET_KEY'] = "Gw3OaETFyB"
driver = GraphDatabase.driver("bolt://localhost:7687",auth=("neo4j","password"))

class QueryForm
	# user input - goes to user input page at '/'
    query_entity = SelectField(choices=[('indi','Individual'),('bro_member','Brokerage Member')])
    query_field = SelectField(choices=[('name','Name'),('pan','PAN'),('location','Location'),('phone','Phone Number'),('email','Email ID'),('sebi','SEBI No.')])
    input_text = StringField(label="Search text")
    def validate(self):
        if not super().validate():
            return False
        result = True
        if (self.query_entity.data == 'bro_member') and (self.query_field.data not in ['name','sebi']):
            self.query_field.errors.append('Please only select Name or SEBI No to search for Brokerage Members')
            result = False
        return result

@app.route('/', methods=['GET','POST'])
def get_input():
    form = QueryForm()
    gotocreate_form = GoToCreateForm()
    query_entity_choices = {'bro_member': 'Brokerage Member', 'indi': 'Individual'} # need to declare this dict to show choice in results
    # create variables that can be shared across the app (session['variable'] in Flask can be accessed throughout the application)
    session['entity'] = form.query_entity.data
    session['query_field'] = form.query_field.data
    session['input_text'] = form.input_text.data
    response = dict() # initialize JSON response sent to React as empty dict
    # create query to send to neo4j based on user input, string interpolation happening based on user input from form.input_text.data
    if (form.validate_on_submit()):
        flash("Query successfully entered! Retrieving results...")
        if (form.query_entity.data == 'indi') and (form.query_field.data == 'name'):
            session['query'] = queries['q1']%((form.input_text.data, form.input_text.data))
        elif (form.query_entity.data == 'indi') and (form.query_field.data == 'pan'):
            session['query'] = queries['q2']%((form.input_text.data, form.input_text.data))
        elif (form.query_entity.data == 'indi') and (form.query_field.data == 'location'):
            session['query'] = queries['q3']%((form.input_text.data, form.input_text.data, form.input_text.data, form.input_text.data, form.input_text.data, form.input_text.data))
        elif (form.query_entity.data == 'indi') and (form.query_field.data == 'phone'):
            session['query'] = queries['q4']%((form.input_text.data, form.input_text.data))
        elif (form.query_entity.data == 'indi') and (form.query_field.data == 'email'):
            session['query'] = queries['q5']%((form.input_text.data, form.input_text.data))
        elif (form.query_entity.data == 'bro_member') and (form.query_field.data == 'name'):
            session['query'] = queries['q6']%((form.input_text.data, form.input_text.data))
        elif (form.query_entity.data == 'bro_member') and (form.query_field.data == 'sebi'):
            session['query'] = queries['q7']%((form.input_text.data, form.input_text.data))

        #session['query_results'] = make_query(session['entity'], session['search_by'], session['input_text']) 
        
        # redirect to results page at '/results' if user input form is successfully entered
        return redirect(url_for('results'))

    # button that should go to create page when implemented
    if gotocreate_form.validate_on_submit():
        return redirect(url_for('creation'))

    # render input page by default 
    return render_template('index.html')









if __name__ == "__main__":
	app.run(debug=True)


queries = {
    # individual by name (2 string interpolations)
    'q1': """MATCH (a) WHERE (a:Client_profile OR a:Authorized_Person) AND (a.first_name CONTAINS '%s' OR a.last_name CONTAINS '%s') WITH a 
            OPTIONAL MATCH (a)-[r1:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
            OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) 
            OPTIONAL MATCH (a)-[r4:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r5:Is_BlackListed]-(bl:Blacklist) 
            OPTIONAL MATCH (a)<-[r6:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7""",
    # individual by PAN (2 string interpolations)
    'q2': """MATCH (pan:PAN)<-[r1:HAS_PAN]-(a:Authorized_Person) WHERE (pan.PAN_no CONTAINS '%s') WITH a, pan, r1 
            OPTIONAL MATCH (a)-[r2:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8 
            UNION MATCH (pan:PAN)<-[r1:HAS_PAN]-(a:Client_profile) WHERE (pan.PAN_no CONTAINS '%s') WITH a, pan, r1
            OPTIONAL MATCH (a)-[r2:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8""",
    # individual by location (6 string interpolations)
    'q3': """MATCH (add:address)<-[r1:HAS_ADDRESS]-(a:Authorized_Person) WHERE (add.city CONTAINS '%s' OR add.state CONTAINS '%s' OR add.street contains '%s') WITH a, add, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8
            UNION MATCH (add:address)<-[r1:HAS_ADDRESS]-(a:Client_profile) WHERE (add.city CONTAINS '%s' OR add.state CONTAINS '%s' OR add.street contains '%s') WITH a, add, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8""",
    # individual by phone number (2 string interpolations)
    'q4': """MATCH (p:phone)<-[r1:HAS_PHONENo]-(a:Authorized_Person) WHERE (p.phone_number = toInteger('%s')) WITH a, p, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8 
            UNION MATCH (p:phone)<-[r1:HAS_PHONENo]-(a:Client_profile) WHERE (p.phone_number = toInteger('%s')) WITH a, p, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) 
            OPTIONAL MATCH (a)-[r4:HAS_EMAILID]->(e:email) OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) 
            OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) OPTIONAL MATCH (a)<-[r7:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            OPTIONAL MATCH (a)<-[r8:EMPLOYEE]-(br_e:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8""",
    # individual by email_id (2 string interpolations)
    'q5': """MATCH (e:email)<-[r1:HAS_EMAILID]-(a:Authorized_Person) WHERE (e.email_id CONTAINS '%s') WITH a, e, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
            OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r4:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) 
            OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8
            UNION MATCH (e:email)<-[r1:HAS_EMAILID]-(a:Client_profile) WHERE (e.email_id CONTAINS '%s') WITH a, e, r1
            OPTIONAL MATCH (a)-[r2:HAS_PAN]->(pan:PAN) 
            OPTIONAL MATCH (a)-[r3:HAS_ADDRESS]->(add:address) OPTIONAL MATCH (a)-[r4:HAS_PHONENo]->(p:phone) 
            OPTIONAL MATCH (a)-[r5:Acc_Sum]->(acc:Acc_summary) OPTIONAL MATCH (a)<-[r6:Is_BlackListed]-(bl:Blacklist) 
            OPTIONAL MATCH (a)<-[r7:EMPLOYEE]-(br_e:Brokerage_Members) OPTIONAL MATCH (a)<-[r8:CLIENT]-()<-[:EMPLOYEE]-(br:Brokerage_Members) 
            RETURN labels(a) as label, a.first_name as first_name, a.last_name as last_name, a, add, pan, p, e, acc, bl, br, br_e, r1, r2, r3, r4, r5, r6, r7, r8""",
    # brokerage by name (2 string interpolations)
    'q6': """MATCH (b:Brokerage_Members)-[r1:EMPLOYEE]->(a:Authorized_Person) WHERE b.name CONTAINS '%s' WITH a, b, r1
            OPTIONAL MATCH (b)-[r2:WORKS_FOR]->(c:Client_profile) WHERE b.name CONTAINS '%s' RETURN a, b, c, r1, r2""",
    # brokerage by SEBI (2 string interpolations)
    'q7': """MATCH (b:Brokerage_Members)-[r1:EMPLOYEE]->(a:Authorized_Person) WHERE b.SEBI_NO CONTAINS '%s' WITH a, b, r1
            OPTIONAL MATCH (b)-[r2:WORKS_FOR]->(c:Client_profile) WHERE b.SEBI_NO CONTAINS '%s' RETURN a, b, c, r1, r2""",
    }

