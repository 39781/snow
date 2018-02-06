var DialogflowApp	=	require('actions-on-google').DialogflowApp;
var request			=	require('request');
var botHandlers = {};
//var botResponses = require('./facebook.js');
botHandlers.processRequest = function(req, res){
	return new Promise(function(resolve, reject){
		console.log('Process request started');
		let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters		
		let parameters = req.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters		
		let inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts
		let requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;	
		let requestText = (req.body.originalRequest.data.message)?req.body.originalRequest.data.message.text:'';				
		let payloadText = (req.body.originalRequest.data.message.quick_reply)?req.body.originalRequest.data.message.quick_reply.payload:'';		
		var sessionId = (req.body.sessionId)?req.body.sessionId:'';		
		var botResponses = require('./'+requestSource.toLowerCase());		
		
		//const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests		
		//const app = new DialogflowApp({request: req, response: res});
		console.log(sessionId);
		var actionValue = "";
		//consoe.log(req.session);
		if(typeof(incidentTickets[sessionId])=='undefined') {			
			incidentTickets[sessionId] = {};
			//req.session[sessionId]= {};
			console.log(incidentTickets[sessionId]);
		}else{
			console.log(incidentTickets[sessionId]);
		}
		if(action !='greeting'){
			var nextOptions = payloadText.split('-');		
			nextOptions[1] = nextOptions[1].trim();
			nextOptions[2] = nextOptions[2].trim();
			action = nextOptions[1];
			incidentTickets[sessionId][nextOptions[1]] = nextOptions[2];	
			actionValue = nextOptions[2]
		}					
		botResponses.generateResponse(action, requestText, sessionId, actionValue)
		.then(function(responseJson){
			console.log(responseJson);
			if(responseJson.action == 'create')	{			
				return createIncident(responseJson.sessionId);
			}else{
				return responseJson;
			}
			//responseJson.contextOut = inputContexts;						
		})
		.then(function(resp){
			resolve(resp);
		})
		.catch(function(err){
			reject(err);
		})	
		
			
	});
}

function createIncident(sessId){
	console.log('creation started',incidentTickets[sessId]);		
	return new Promise(function(resolve,reject){
		var options = { 
			method: 'POST',
			url: 'https://dev18442.service-now.com/api/now/v1/table/incident',
			headers:{ 
				'postman-token': 'd6253bf3-ff31-fb21-7741-3dd02c84e8bb',
				'cache-control': 'no-cache',
				authorization: 'Basic MzMyMzg6YWJjMTIz',
				'content-type': 'application/json' 
			},
			body:{ 
				short_description	: 	'testing incident',
				caller_id			: 	'TST',
				Caller				:	incidentTickets[sessId].caller,
				urgency				: 	incidentTickets[sessId].urgency,
				state				:	incidentTickets[sessId].state,
				incident_state		:	incidentTickets[sessId].incidentState,
				category			:	incidentTickets[sessId].category,
				subcategory			:	incidentTickets[sessId].subCategory,
				//workingGroup		:	incidentTickets[sessId].workingGroup,
				impact				:	incidentTickets[sessId].impact,
				priority			:	incidentTickets[sessId].priority,
				contact_type		:	incidentTickets[sessId].contactType,
				comments			: 	'Chatbot Testing',
				Assigned_to			:	incidentTickets[sessId].assignedTo		
			},			
			json: true 
		}; 
		console.log(options);
		request(options, function (error, response, body) {
			if (error) {
				console.log('error',error);
				reject (error);
			}else{
				console.log('ticket created',body);				
				resolve({
					speech:"",
					text:"Incident Created Ur Incident Number <div style='border:1px solid red'>: "+body.result.number+"<div>\n please Not for future reference" 
				});
			}          
		});
		
	})
}

module.exports = botHandlers;