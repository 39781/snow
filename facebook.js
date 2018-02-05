var sNow 	= 	require('./config');
var responses = {};

responses.generateResponse = function(action,requestText){
	return new Promise(function(resolve, reject){
		console.log('generate Response started');
		var responseContent={
			title :"",
			subtitle:"",
			imgUrl:"http://www.cromacampus.com/wp-content/uploads/2017/05/servicenow-tool-training.png",
			data:""	
		};				
		if(action == "CreateIncident"){
			responseContent.title = "please select Caller";					
			responseContent.data = sNow.caller;			
		}else if(action == "Caller"){
			responseContent.title = "please select category";						
			responseContent.data = sNow.category;
		}else if(action == "Category"){			
			responseContent.title = "please select sub category"						
			responseContent.data = sNow.subCategory;
		}else if(action == "subCategory"){
			responseContent.title = "please select sub contactType"						
			responseContent.data = sNow.contactType;
		}else if(action == "contactType"){
			responseContent.title = "please select Incident state"						
			responseContent.data = sNow.incidentState;
		}else if(action == "incidentState"){
			responseContent.title = "please select  state"						
			responseContent.data = sNow.state;
		}else if(action == "state"){
			responseContent.title = "please select impact"						
			responseContent.data = sNow.impact;
		}else if(action == "impact"){
			responseContent.title = "please select urgency"						
			responseContent.data = sNow.urgency;
		}else if(action == "urgency"){
			responseContent.title = "please select priority"						
			responseContent.data = sNow.priority;
		}else if(action == "priority"){
			responseContent.title = "please select working group"						
			responseContent.data = sNow.workingGroup;
		}else if(action == "workingGroup"){
			responseContent.title = "please select assignedTo"						
			responseContent.data = sNow.assignedTo;
		}else if(action == "assignedTo"){
			responseContent.title = "Incident created"						
			responseContent.data = "";
		}
			
		console.log(responseContent);		
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
			case "quickreply": resolve({"templateGenerateFunc":generateQuickReplyResponse,"responseContent":responseContent});break;
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
		responseTemplate.messages = [{
			'title': responseContent.title,
			'replies':responseContent.data,
			'type':2
		}];
		responseTemplate.source='servNow';
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