var serviceNowApi = {
	createIncident:function (sessId){
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
			delete incidentTickets[sessId];		
			request(options, function (error, response, body) {
				var rsp = {  
						"speech":"",
						"displayText":"",
						"data":{  
							"facebook":{  
								"text":	""
							}
						}
					}
				if (error) {
					rsp.data.facebook.text = JSON.stringify(error);
				}else{			
					rsp.data.facebook.text = "Incident Created Ur Incident Number \n"+body.result.number+"\n please Note for future reference" 	
				}
				resolve(rsp);
			});
			
		})
	},
	trackIncident:function (incNum, sessId){
		return new Promise(function(resolve,reject){
			console.log('tracking started');		
			var fstr = incNum.substring(0,3);
			var sstr = incNum.substring(3);
			var rsp = {  
						"speech":"",
						"displayText":"",
						"data":{  
							"facebook":{  
								"text":	""
							}
						}
					}
					console.log(fstr == 'inc'&&!isNaN(sstr));
			if(fstr == 'inc'&&!isNaN(sstr)){
				var options = { 
					method: 'GET',
					url: 'https://dev18442.service-now.com/api/now/v1/table/incident',
					qs: { 
						number: incNum.toUpperCase()
					},
					headers:{
						'postman-token': '5441f224-d11a-2f78-69cd-51e58e2fbdb6',
						'cache-control': 'no-cache',
						authorization: 'Basic MzMyMzg6YWJjMTIz' 
					},json: true  
				};
				request(options, function (error, response, body) {
					if (error) {
						rsp.data.facebook.text = "Incident not exist : "+JSON.stringify(error);
					}else{			
						if(body.error){
							rsp.data.facebook.text = "incident not exist\n please enter valid incident";
						}else{
							rsp.data.facebook.text = "incident exist : Incident updated on : "+body.result[0].sys_updated_on;
						}
						
						
					}
					resolve(rsp);
				});
				delete incidentTickets[sessId];
			}else{
				rsp.data.facebook.text = "Please enter valid incident number";
				resolve(rsp);
			}
			
		});
	}
}


module.exports = serviceNowApi;