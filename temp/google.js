var config = require('./config');
var responses = {};

responses.quickReplies  = function(sessionId, content, params){
	console.log(content,incidentParams[sessionId]['recentInput']);
	  /*appHandler.ask(appHandler.buildRichResponse()
		.addSimpleResponse({speech: 'Please select option from '+contentType,
		  displayText: 'Please select option from '+contentType})
		.addSuggestions(content)			
	  );*/	
	  //return true;
	  var chips = [];		
		content.forEach(function(key){
			chips.push({'title':key});
		});
		/*intentContextParams ={};
		var paramsKeys = Object.keys(params);		
		paramsKeys.forEach(function(key){
			if(params[key].length>0){
				intentContextParams[key] = params[key];
			}
		});	*/				
		return {			
			"speech": "",
			"contextOut": [{
				 "name":"e0e440c1-adc7-4b94-b9cb-a22a5629d79d_id_dialog_context", 
				 "lifespan":2, 
				 "parameters":params
			}],
			"messages": [{
				"type": "simple_response",
				"platform": "google",
				"textToSpeech": "Please select option from "+incidentParams[sessionId]['recentInput'],
				"displayText": "Please select option from "+incidentParams[sessionId]['recentInput']
			},
			{
			  "type": "suggestion_chips",
			  "platform": "google",
			  "suggestions":chips
			},
			{
			  "type": 0,
			  "speech": ""
			}
			]
		};
	  //console.log('hari');
	//return true;
}
responses.simpleText = function (sessionId, promptMsg, params){
	return {			
			"speech": "",
			"contextOut": [{
				 "name":"b015d80c-f1a5-40e2-911c-fba5be4d1ae6_id_dialog_context", 
				 "lifespan":2, 
				 "parameters":params
			}],
			"messages": [{
				"type": "simple_response",
				"platform": "google",
				"textToSpeech": "Please enter "+incidentParams[sessionId]['recentInput'],
				"displayText": "Please enter "+incidentParams[sessionId]['recentInput']
			},			
			{
			  "type": 0,
			  "speech": ""
			}
			]
		};
}

responses.getFinalCardResponse = function(textMsg, callBackIntent, params){
	return new Promise(function(resolve, reject){
		var data = textMsg.split(';');		
		
		var rsp ={
			"speech": "",
			"messages": [
				 {
					"platform": "google",
					"type": "simple_response",
					"displayText": data[2], 
					"textToSpeech": data[2], 
				},
				{
				"type": "basic_card",
				"platform": "google",
				"title": data[0],
				"subtitle": data[1],
				"formattedText": "Thank you for using me, I can help you please choose any one option",
				"image": {
							  "url":"https://raw.githubusercontent.com/39781/incidentMG/master/images/incidentMG.jpg",
							  "accessibilityText":"serviceNow"
							},
				"buttons": [{
								"title":"ServiceNow",
								"openUrlAction":{
								  "url":"dev18442.service-now.com"
								}
							  }]
			},
			{
			  "type": "suggestion_chips",
			  "platform": "google",
			  "suggestions": [
				{
				  "title": "Create Incident"
				},
				{
				  "title": "Track Incident"
				}
			  ]
			},
			{
			  "type": 0,
			  "speech": ""
			}]
		};
		if(callBackIntent){
			rsp.followupEvent ={
				name:callBackIntent,
				data:params,
			}
		}			
		resolve(rsp);
	});
}
		
responses.getFinalSimpleResponse = function(txtMsg, callBackIntent, params){
	return new Promise(function(resolve, reject){	
		var data = textMsg.split(';');			
		
		var rsp ={			
				"speech": "",					
				"messages": [{
					"type": "simple_response",
					"platform": "google",						
					displayText :data[2]+" "+data[1]+" "+data[0]+"\n Thank you for using me, I can help you please choose any one option",
					textToSpeech :data[2]+" "+data[1]+" "+data[0]+"\n Thank you for using me, I can help you please choose any one option"
				},
				{
				  "type": "suggestion_chips",
				  "platform": "google",
				  "suggestions":[{title:"Create Incident"},
								 {title:"Track Incident"}
								]
				},{
				  "type": 0,
				  "speech": ""
				}]
			};
		if(callBackIntent){
			rsp.followupEvent ={
				name:callBackIntent,
				data:params,
			}
		}			
		resolve(rsp);
	});
}


responses.generateQuickReplyResponseOld = function(responseContent, responseViewModel){
}
module.exports = responses;