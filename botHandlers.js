var DialogflowApp	=	require('actions-on-google').DialogflowApp;
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
		
		var botResponses = require('./'+requestSource.toLowerCase());		
		//const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests		
		//const app = new DialogflowApp({request: req, response: res});
						
	
		botResponses.generateResponse(action, requestText)
		.then(function(responseJson){
			//responseJson.contextOut = inputContexts;			
			console.log(responseJson);
			resolve(responseJson);
		})
		.catch(function(err){
			reject(err);
		})	
		
			
	});
}


module.exports = botHandlers;