var request			=	require('request');
var serviceNowApi = {
	createIncident:function (incidentParams){
		//console.log('creation started',incidentTickets[sessId]);		
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
					short_description	: 	incidentParams.sdec,
					caller_id			: 	'TST',					
					urgency				: 	incidentParams.urgency,
					category			:	incidentParams.category,
					//subcategory			:	incidentParams.subCategory,
					//workingGroup		:	incidentTickets[sessId].workingGroup,
					impact				:	incidentParams.impact,					
					contact_type		:	incidentParams.contactType,
					comments			: 	'Chatbot Testing'					
				},			
				json: true 
			}; 			
			//delete incidentTickets[sessId];		
			request(options, function (error, response, body) {				
				var txtMsg;			
				if (error) {
					if(typeof(error)=='object'){
						txtMsg = JSON.stringify(error);								
					}else{
						txtMsg = error;
					}	
						resolve(txtMsg);
				}else{					
					if(body.error){
						txtMsg = "Error in incident creation ; Try again ; Incident Created";						
					}else{						
						txtMsg = "Incident Number : "+body.result.number+"; Please note for future reference; Incident Created";
					}					
					resolve(txtMsg);
				}												
			});
		})
	},
	trackIncident:function (params){
		return new Promise(function(resolve,reject){			
			var options = { 
					method: 'GET',
					url: 'https://dev18442.service-now.com/api/now/v1/table/incident',
					qs: { 
						number: params.incidentNum.toUpperCase()
					},
					headers:{
						'postman-token': '5441f224-d11a-2f78-69cd-51e58e2fbdb6',
						'cache-control': 'no-cache',
						authorization: 'Basic MzMyMzg6YWJjMTIz' 
					},json: true  
				};
				request(options, function (error, response, body) {										
					if (error) {						
						if(typeof(error)=='object'){
							txtMsg = JSON.stringify(error);								
						}else{
							txtMsg = error;
						}	
						resolve(txtMsg);			
					}else{
						if(body.error){
							txtMsg = "no record found for incident number you entered; Try again ; Incident Tracked";							
						}else{			
							if(params.queryParam.length<=0){
								params.queryParam = 'incident_state';
							}
							var sta = body.result[0][params.queryParam];
							console.log('queryParam',body.result[0][params.queryParam]);
							if(params.queryParam == 'incident_state'||params.queryParam=='state'){
								switch(body.result[0][params.queryParam]){
									case '1':case 1: sta = "new";	break;
									case '2':case 2: sta = "in-prog";break;
									case '3':case 3: sta = "on-hold";break;
									case '6':case 6: sta = "resolved";break;
									case '7':case 7: sta = "closed";break;
									case '8':case 8: sta = "canceled";break;									
								}						
							}
							if(typeof(sta)=='undefined'){
								sta = 'sorry data unavailable; Try again; Incident Tracked ';
							}
							txtMsg = params.queryParam.replace(/_/ig,' ')+" : "+sta+";Incident number :"+body.result[0].number+"; Incident Tracked";
						}								
						resolve(txtMsg);		
					}
				});			
			
		});
	},
	validateIncidentNumber : function(incidentNumber, sessionId, params){
		return new Promise(function(resolve,reject){
			if(incidentNumber.length<=0){				
				resolve({status:false,sessId:sessionId,"params":params});
			}else{
				console.log('tracking started');		
				var txtMsg = "";
				var fstr = params.incidentNum.substring(0,3);
				var sstr = params.incidentNum.substring(3);			
				console.log(fstr == 'inc'&&!isNaN(sstr));
				if((fstr == 'inc'||fstr=='INC')&&!isNaN(sstr)){				
					resolve({status:true,sessId:sessionId,"params":params});
				}else{		
					resolve({status:false,sessId:sessionId,"params":params});
				}
			}
		});
	}
	
}







module.exports = serviceNowApi;