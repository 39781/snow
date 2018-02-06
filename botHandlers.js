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
		if(typeof(intentTickets[sessionId])=='undefined') {			
			intentTickets[sessionId] = {};
			//req.session[sessionId]= {};
			console.log(intentTickets[sessionId]);
		}else{
			console.log(intentTickets[sessionId]);
		}
		if(action !='greeting'){
			var nextOptions = payloadText.split('-');		
			nextOptions[1] = nextOptions[1].trim();
			nextOptions[2] = nextOptions[2].trim();
			action = nextOptions[1];
			intentTickets[sessionId][nextOptions[1]] = nextOptions[2];	
			actionValue = nextOptions[2]
		}			

		botResponses.generateResponse(action, requestText, sessionId, actionValue)
		.then(function(responseJson){
			if(responseJson.action == 'create'){
				return createIncident(sessId);
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
	return new Promise(function(resolve,reject){
		var options = { method: 'POST',
			url: 'https://dev18442.service-now.com/api/now/v1/table/incident',
			headers:{ 
				'postman-token': 'd6253bf3-ff31-fb21-7741-3dd02c84e8bb',
				'cache-control': 'no-cache',
				'authorization': 'Basic MzMyMzg6YWJjMTIz',
				'content-type': 'application/json' 
			},
			body:{ 
				short_description	: 	'testing incident',
				caller_id			: 	'TST'+Math.rand(),
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

		request(options, function (error, response, body) {
			if (error) {
				reject (error);
			}else{
				resolve(body);
			}          
		});
		
	})
}

module.exports = botHandlers;