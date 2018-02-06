var sNow 	= 	require('./config');
var responses = {};

responses.generateResponse = function(action,requestText, payloadText){
	return new Promise(function(resolve, reject){
		console.log('generate Response started');
		var responseContent={
			title :"",
			subtitle:"",
			imgUrl:"http://www.cromacampus.com/wp-content/uploads/2017/05/servicenow-tool-training.png",
			data:""	
		};	
		if(action == "createIncident"){
			responseContent.title = "please select caller";	
			responseContent.subTitle = 'caller';	
			responseContent.data = sNow.caller;	
			////responseContent.nextIntent = 'caller';	
		}else {
			console.log('action default')			
			var nextOptions =payloadText.split('-')[1].trim();
			
			if(nextOptions == "caller"){
				responseContent.title = "please select category";						
				responseContent.data = sNow.category;
				////responseContent.nextIntent = 'category';
			}else if(nextOptions == "category"){			
				responseContent.title = "please select sub category"						
				responseContent.data = sNow.subCategory;
				////responseContent.nextIntent = 'subCategory';
			}else if(nextOptions == "subCategory"){
				responseContent.title = "please select sub contactType"						
				responseContent.data = sNow.contactType;
				//responseContent.nextIntent = 'contactType';
			}else if(nextOptions == "contactType"){
				responseContent.title = "please select Incident state"						
				responseContent.data = sNow.incidentState;
				//responseContent.nextIntent = 'incidentState';
			}else if(nextOptions == "incidentState"){
				responseContent.title = "please select  state"						
				responseContent.data = sNow.state;
				//responseContent.nextIntent = 'state';
			}else if(nextOptions == "state"){
				responseContent.title = "please select impact"						
				responseContent.data = sNow.impact;
				//responseContent.nextIntent = 'impact';
			}else if(nextOptions == "impact"){
				responseContent.title = "please select urgency"						
				responseContent.data = sNow.urgency;
				//responseContent.nextIntent = 'urgency';
			}else if(nextOptions == "urgency"){
				responseContent.title = "please select priority"						
				responseContent.data = sNow.priority;
				//responseContent.nextIntent = 'priority';
			}else if(nextOptions == "priority"){
				responseContent.title = "please select working group"						
				responseContent.data = sNow.workingGroup;
				//responseContent.nextIntent = 'workingGroup';
			}else if(nextOptions == "workingGroup"){
				responseContent.title = "please select assignedTo"						
				responseContent.data = sNow.assignedTo;
				//responseContent.nextIntent = 'assignedTo';
			}else if(nextOptions == "assignedTo"){
				responseContent.title = "Incident created"						
				responseContent.data = "";
			}
		}		
		generateResponseTemplate(responseContent, 'quickreply')
		.then((resp)=>{ 			
			//console.log(responseContent, responseViewModel);			
			return resp.templateGenerateFunc(resp.responseContent);
		})
		.then((resp)=>{
			resolve(resp); 
		})					
		.catch((err)=>{ reject(err) });		
	});
}

var generateResponseTemplate = function(responseContent, responseViewModel){
		console.log(responseViewModel);
	return new Promise(function(resolve, reject){		
		switch(responseViewModel.toLowerCase()){
			case "quickreply": resolve({"templateGenerateFunc":generateQuickReplyResponseOld,"responseContent":responseContent});break;
			case "card": resolve({"templateGenerateFunc":generateCardResponse,"responseContent":responseContent});break;
		}
	});
}

var generateQuickReplyResponse = function(responseContent){
	return new Promise(function(resolve, reject){
		console.log('generating quick reply Started');				
		let responseTemplate = {};		
		responseTemplate.displayText = "";
		responseTemplate.speech = "";
		/*responseTemplate.followupEvent= {
			"name": //responseContent.nextIntent,
			"data": {}
		}*/	 
		responseTemplate.messages = [{
			'title': responseContent.title,
			'replies':responseContent.data,
			'type':2
		}];
		responseTemplate.source='servNow';
		resolve(responseTemplate);
	});
}

var generateQuickReplyResponseOld = function(responseContent, responseViewModel){
	return new Promise(function(resolve, reject){
		console.log('generating quick reply Started');				
		let responseTemplate = {};
		responseTemplate.displayText = "";
		responseTemplate.data = {
			'facebook': {
				"text": responseContent.title,
				"quick_replies": []
			}
		};	
		console.log('loop started',responseContent.title);
		responseContent.data.forEach(function(resp){			
			responseTemplate.data.facebook.quick_replies.push({			
				"content_type":"text",
				"title": resp,
				"payload": " you selected option - "+responseContent.subTitle+" - "+resp
			});			
		})		
		console.log(responseTemplate);
		resolve(responseTemplate);
	});
}

var generateCardResponse = function(responseContent){	
	return new Promise(function(resolve, reject){
		console.log('generating card reply Started');
		let responseTemplate = {};
		responseTemplate.displayText = "";
		responseTemplate.speech = "";
		responseTemplate.data = {
			'facebook': {				
				"attachment":{
					"type":"template",
					"payload":{
						"template_type":"generic",
						"elements":[]
					}
				}
			}
		};
		if(responseContent.data.length<=2){
			responseTemplate.data.facebook.attachment.payload.elements[0]={			
								'title': responseContent.title,
								'subtitle': responseContent.subtitle,
								'image_url': responseContent.imgUrl,
								'buttons': []							
			};
			responseContent.data.forEach(function(resp){
				responseTemplate.data.facebook.attachment.payload.elements[0].buttons.push({
					"type":"postback",
					"title":resp,
					"payload":resp
				});
			});
		}else{
			responseContent.data.forEach(function(resp){		
				responseTemplate.data.facebook.attachment.payload.elements.push({					
					'title': responseContent.title,
					'subtitle': responseContent.subtitle,
					'image_url': responseContent.imgUrl,
					'buttons': [
						{
							"type":"postback",
							"title":resp,
							"payload":resp
						}									
					]
				})	
			})			
		}
		console.log(responseTemplate);
		resolve(responseTemplate);					
	});
}
module.exports = responses;