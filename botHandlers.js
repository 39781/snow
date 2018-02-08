var DialogflowApp	=	require('actions-on-google').DialogflowApp;
var request			=	require('request');
var serviceNowApi 	=	require('./serviceNow');
var sNow 	= 	require('./config');

var botHandlers = {};
//var botResponses = require('./facebook.js');
botHandlers.processRequest = function(req, res){
	return new Promise(function(resolve, reject){
		
		console.log('Process request started');
		let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters		
		let parameters = req.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters		
		let inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts
		let requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;	
		let payloadText = '';						
		var sessionId = (req.body.sessionId)?req.body.sessionId:'';		
		var facebook = require('./'+requestSource.toLowerCase());	
		
		if(req.body.originalRequest.data.message){
			if(req.body.originalRequest.data.message.quick_reply){
				payloadText = req.body.originalRequest.data.message.quick_reply.payload;
			}else{
				payloadText = req.body.originalRequest.data.message.text;
			}
		}else if(req.body.originalRequest.data.postback){
			payloadText = req.body.originalRequest.data.postback.payload;
		}
		
		//const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests		
		//const app = new DialogflowApp({request: req, response: res});
		console.log(sessionId);
		//consoe.log(req.session);
		if(typeof(incidentTickets[sessionId])=='undefined') {			
			incidentTickets[sessionId] = {};
			//req.session[sessionId]= {};
			console.log(incidentTickets[sessionId]);
		}else{
			console.log(incidentTickets[sessionId]);
		}
		switch(action){
			case 'emailIntent'	:	incidentTickets[sessionId]['email'] = inputContexts[0].parameters.email;
								action = inputContexts[0].parameters.action;
								break;
								
			default			:	if(payloadText.indexOf('-')){
									var nextOptions = payloadText.split('-');		
									nextOptions[1] = nextOptions[1].trim();
									nextOptions[2] = nextOptions[2].trim();
									action = nextOptions[1];
									incidentTickets[sessionId][nextOptions[1]] = nextOptions[2];	
									payloadText = nextOptions[2];
								}
								break;
		}
			
		console.log(payloadText);
	
		generateResponse(action, sessionId, payloadText)
		.then(function(responseJson){
			console.log(responseJson);
			if(responseJson.action == 'create')	{			
				return serviceNowApi.createIncident(responseJson.sessionId);
			}if(responseJson.action == 'track'){
				return serviceNowApi.trackIncident(responseJson.incNum,responseJson.sessionId);
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

function generateResponse(action, sessId, actionValue){
	return new Promise(function(resolve, reject){
		console.log('generate Response started');
		var responseContent={
			title :"",
			subtitle:"",
			imgUrl:"http://www.cromacampus.com/wp-content/uploads/2017/05/servicenow-tool-training.png",
			data:""	
		};						
		if(/(creation|create|creat)/ig.test(action)){			
			console.log(action);
			responseContent.title = "please select caller";	
			responseContent.subTitle = 'caller';	
			responseContent.data = sNow.serviceNow.caller;				
		}else if(action == "caller"){				
			responseContent.title = "please select category";
			responseContent.subTitle = 'category';				
			responseContent.data = sNow.serviceNow.category;				
		}else if(action == "category"){					
			responseContent.title = "please select sub category"						
			responseContent.data = sNow.serviceNow.subCategory;
			responseContent.subTitle = 'subCategory';				
		}else if(action == "subCategory"){				
			responseContent.title = "please select sub contactType"						
			responseContent.data = sNow.serviceNow.contactType;
			responseContent.subTitle = 'contactType';				
		}else if(action == "contactType"){				
			responseContent.title = "please select impact"						
			responseContent.data = sNow.serviceNow.impact;
			responseContent.subTitle = 'impact';								
		}else if(action == "impact"){				
			responseContent.title = "please select urgency"						
			responseContent.data = sNow.serviceNow.urgency;
			responseContent.subTitle = 'urgency';				
		}
		if(action == "urgency"){
			resolve({action:"create",sessionId:sessId});
		}else if(/(track|status)/ig.test(action)){
			resolve({  
					"speech":"",
					"displayText":"",
					"followupEvent":{
						"name":"trackIntent",
						"data":{  }
					}					
				});
		}else if(actionValue.toLowerCase().indexOf('inc')==0){
			console.log('tracking');
			resolve({action:"track",incNum:actionValue, sessionId:sessId});
		}else{
			if(responseContent.title.length==0){	
				responseContent.title = "Invalid Input,\nHi, I am ServiceNow, I can help u to create or track incidents. please select an option from below menu, so I can help u";	
				responseContent.subTitle = 'menu';	
				responseContent.data = sNow.serviceNow.menu;
			}
						
		}
		
		facebook.generateResponseTemplate(responseContent, 'quickreply')
		.then((resp)=>{ 					
			return facebook[resp.templateGenerateFunc](resp.responseContent);
		})
		.then((resp)=>{
			resolve(resp); 
		})					
		.catch((err)=>{ reject(err) });
	});
}


module.exports = botHandlers;