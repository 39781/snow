var express 		= require('express');
var router			= express.Router();	 
var DialogflowApp	=	require('actions-on-google').DialogflowApp;

var serviceNowApi 	=	require('./serviceNow');
var sNow 			= 	require('./config');
var botResponses	=	{};
//var botResponses = require('./slack.js');
router.get('/',function(req, res){
	console.log('req received');
	res.send("req received");
	res.end();
})

router.post('/botHandler',function(req, res){
	//console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(req.body));	

	if (req.body.result||req.body.queryResult) {		
		processRequest(req, res)
		.then(function(responseJson){			
			res.status(200);
			if(typeof(responseJson)=='object'){
				console.log('responseJSON',JSON.stringify(responseJson));								
				res.json(responseJson).end();
			}else{
				res.end();
			}
		})
		.catch(function(err){
			res.status(400);
			res.json(err).end();
		})	
	} else {
		console.log('Invalid Request');
		return response.status(400).end('Invalid Webhook Request');
	}
});


processRequest = function(req, res){
	return new Promise(function(resolve, reject){		
		console.log(' process request started');		
		
		generateResponse(req, res)
		.then(function(responseJson){				
			resolve(responseJson);
		})
		.catch(function(err){
			console.log(err);
			reject(err);
		})	
		
			
	});
}

generateResponse = function(req, res){		
	return new Promise(function(resolve, reject){		
		console.log('generate response started',req.body.result.parameters);
		let requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;	
		console.log(requestSource);
		let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters			
		let inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts	
		var sessionId = (req.body.sessionId)?req.body.sessionId:'';
		var resolvedQuery = req.body.result.resolvedQuery;	
		botResponses = require('./'+requestSource);		
		if(typeof(incidentParams[sessionId]) == 'undefined'){
			incidentParams[sessionId] = {};
		}
			
		if(typeof(incidentParams[sessionId]['recentInput'])!='undefined'){
			req.body.result.parameters[incidentParams[sessionId]['recentInput']] = resolvedQuery;
		}
		
		console.log('after recentinput',req.body.result.parameters);
		var params = Object.keys(req.body.result.parameters);		
				
		for(i=0;i<params.length;i++){
			if(req.body.result.parameters[params[i]].length<=0){
				incidentParams[sessionId]['recentInput'] = 	params[i];
				break;
			}else{
				delete incidentParams[sessionId]['recentInput'];
			}				
		}
								
		console.log(incidentParams);
		var incidentParamsKeys = Object.keys(incidentParams[sessionId]);
		
		if(action == 'trackIncident'){
			func = trackIncident;
		}else{
			func = createIncident;
		}	
		
		func(sessionId, req.body.parameters)
		.then((resp)=>{
			resolve(resp);
		})
		.catch((resp)=>{reject(resp);})
	});
}

trackIncident = function(sessionId, params, errorFlag){
	if(typeof(incidentParams[sessionId]['recentInput'])=='undefined'){
		if(incidentParams[sessionId]['recentInput'] == 'incidentNum'&&params['incidentNum'].length>0){
			serviceNowApi.validateIncidentNumber(params['incidentNum'], sessionId, params)
			.then((result)=>{
				if(result.status){
					
				}else{
					delete incidentParams[sessionId]['recentInput'];
					return trackIncident(result.sessId, result.params, 1);					
				}
			})
			.then();
			.catch();
		}else{
			inputPrompts(sessionId,  params, "Please enter incident number",'simpleText')	
			.then((result)=>{
				console.log('response from inputpromt',result);
				resolve(result);
			})				
			.catch((err)=>{
				resolve(botResponses.getFinalCardResponse(err,null,null));
			});
		}
	}else{
		serviceNowApi.trackIncident(req.body.result.parameters)
		.then((result)=>{
			if(typeof(result)=='object'){	
				return botResponses.getFinalCardResponse(result.msg,'trackIncident',result.params);
			}else{
				return botResponses.getFinalCardResponse(result,null,null);
			}
		})
		.then((resp)=>{
			resolve(resp);
		})	
		.catch((err)=>{
			resolve(botResponses.getFinalCardResponse(err,null,null));				
		})
	}
}

createIncident = function(sessionId, params){
	return new Promise(function(resolve, reject){
		if(typeof(incidentParams[sessionId]['recentInput'])=='undefined'){
			serviceNowApi.createIncident(params)
			.then((result)=>{
				console.log(result);
				return botResponses.getFinalCardResponse(result,null,null);
			})
			.then((resp)=>{
				resolve(resp);
			})				
			.catch((err)=>{
				resolve(botResponses.getFinalCardResponse(err,null,null));					
			})
		}else{
			inputPrompts(sessionId,  params, null,'quickReplies')	
			.then((result)=>{
				console.log('response from inputpromt',result);
				resolve(result);
			})				
			.catch((err)=>{
				resolve(botResponses.getFinalCardResponse(err,null,null));
			});
		}		
	});
}
inputPrompts = function(sessionId,  params, promptMsg, promptType){	
	return new Promise(function(resolve, reject){	
		
		console.log('input prompting started');		
		switch(promptType){
			case 'simpleText':resolve(botResponses.simpleText(sessionId, promptMsg, params));break;
			case 'quickReplies':resolve(botResponses.quickReplies(sessionId, config.serviceNow[incidentParams[sessionId]['recentInput']], params));break;
		}					
		
	});	
}

module.exports = router;



			