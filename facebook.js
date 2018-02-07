var sNow 	= 	require('./config');
var responses = {};

responses.generateResponse = function(action, sessId, actionValue){
	return new Promise(function(resolve, reject){
		console.log('generate Response started');
		var responseContent={
			title :"",
			subtitle:"",
			imgUrl:"http://www.cromacampus.com/wp-content/uploads/2017/05/servicenow-tool-training.png",
			data:""	
		};				
		actionValue = actionValue.toLowerCase();
		if(action == 'greeting'){
			responseContent.title = "Hi, I am ServiceNow, I can help u to create or track incidents. please select an option from below menu, so I can help u";	
			responseContent.subTitle = 'menu';	
			responseContent.data = sNow.serviceNow.menu;
		}else if(/create/ig.test(actionValue)){			
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
			responseContent.title = "please select Incident state"						
			responseContent.subTitle = 'incidentState';
			responseContent.data = sNow.serviceNow.incidentState;				
		}else if(action == "incidentState"){
			responseContent.title = "please select  state"						
			responseContent.data = sNow.serviceNow.state;
			responseContent.subTitle = 'state';				
		}else if(action == "state"){				
			responseContent.title = "please select impact"						
			responseContent.data = sNow.serviceNow.impact;
			responseContent.subTitle = 'impact';				
		}else if(action == "impact"){				
			responseContent.title = "please select urgency"						
			responseContent.data = sNow.serviceNow.urgency;
			responseContent.subTitle = 'urgency';				
		}else if(action == "urgency"){
			responseContent.title = "please select priority"						
			responseContent.data = sNow.serviceNow.priority;
			responseContent.subTitle = 'priority';				
		}else if(action == "priority"){				
			responseContent.title = "please select working group"						
			responseContent.data = sNow.serviceNow.workingGroup;				
			responseContent.subTitle = 'workingGroup';
		}else if(action == "workingGroup"){				
			responseContent.title = "please select assignedTo"						
			responseContent.data = sNow.serviceNow.assignedTo;	
			responseContent.subTitle = 'assignedTo';				
		}
		if(action == "assignedTo"){
			resolve({action:"create",sessionId:sessId});
		}else if(/track/ig.test(actionValue)){
			resolve({  
					"speech":"",
					"displayText":"",
					"data":{  
						"facebook":{  
							"text":	"Please enter incident number"
						}
					}
				});
		}else if(actionValue.indexOf('inc')>=0||incidentTickets[sessId].menu == 'Track'){
			console.log('tracking');
			resolve({action:"track",incNum:actionValue, sessionId:sessId});
		}else{
			if(responseContent.title.length==0){	
				responseContent.title = "Invalid Input,\nHi, I am ServiceNow, I can help u to create or track incidents. please select an option from below menu, so I can help u";	
				responseContent.subTitle = 'menu';	
				responseContent.data = sNow.serviceNow.menu;
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
						
		}
	});
}

var generateResponseTemplate = function(responseContent, responseViewModel){
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