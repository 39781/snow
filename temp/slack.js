var config = require('./config');
var responses = {};

quickReplies  = function(sessionId, content, params){
	console.log(content,incidentParams[sessionId]['recentInput']);	  
	return {			
		"speech": "",
		"contextOut": [{
			 "name":"e0e440c1-adc7-4b94-b9cb-a22a5629d79d_id_dialog_context", 
			 "lifespan":2, 
			 "parameters":params
		}],
		"messages": [{
			  "type": 2,
			  "platform": "slack",
			  "title": "Please select option from "+incidentParams[sessionId]['recentInput'],
			  "replies": content
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

responses.inputPrompts = function(sessionId,  req, res){
	
	return new Promise(function(resolve, reject){	
		try{
						
			console.log('input prompting started');
			if(req.body.result.parameters[incidentParams[sessionId]['recentInput']].length<=0){				
				resolve(quickReplies(sessionId, config.serviceNow[incidentParams[sessionId]['recentInput']], req.body.result.parameters));
			}else{
				resolve(true);
			}
		}catch(err){console.log('error',err);reject(err);}	
		
	});	
}
responses.getFinalCardResponse = function(textMsg, callBackIntent, params){
	return new Promise(function(resolve, reject){
		var data = textMsg.split(';');		
		
		var rsp ={
			"speech": "",
			"messages": [{
				  "type": 1,
				  "platform": "slack",
				  "title": data[2]+"\n"+data[0],
				  "subtitle": data[1]+"\nThank you for using me, I can help you please choose any one option",
				  "imageUrl": "https://raw.githubusercontent.com/39781/incidentMG/master/images/incidentMG.jpg",
				  "buttons": [
					{
					  "text": "Create Incident",
					  "postback": "Create Incident"
					},
					{
					  "text": "Track Incident",
					  "postback": ""
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
		var data = txtMsg.split(';');			
		
	var rsp ={			
				"speech": "",					
				"messages": [{
				  "type": 0,
				  "platform": "slack",
				  "speech": data[2]+"\n"+data[0]+"\n"+data[1]+"\n Thank you for using me\nI can help you"
				},
				{
				  "type": 2,
				  "platform": "slack",
				  "title": "Please select option",
				  "replies": ["Create Incident","Track Incident"]
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


responses.generateQuickReplyResponseOld = function(responseContent, responseViewModel){
}
module.exports = responses;