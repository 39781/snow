var config ={
	
	serviceNow : {
		menu			: ['Create','Track'],	
		category 		: ['inquiry/Help','Software','Hardware','Network','Database'],
		subCategory		: ['Antivirus','Email','Internal Application'],
		contactType 	: ['Email','Phone','Self-service','Walk-in'],
		incidentState 	: ['In-progress','On-Hold','Resolved','Closed','Canceled'],
		state 			: ['In-progress','On-Hold','Resolved','Closed','Canceled'],
		impact 			: ['High','Medium','Low'],
		urgency 		: ['High','Medium','Low'],
		priority 		: ['5 - planning'],
		workingGroup	: ['CAB Approval','Change Management','Chat Support','Consumer Service Support','Database','Hardware','eCAB Approval','HR Admin','HR Support','HR VIP Watchlist','IT Finance CAB'],
		caller			: ['Hariprasad','Harikrishna'],
		assignedTo		:	['Arun','Harikrishna','sandeep','rajesh','anitha','shruthi']
	},
	incidentTicket : {
		caller			: "",
		category 		: "",
		subCategory		: "",
		contactType 	: "",
		incidentState 	: "",
		state 			: "",
		impact 			: "",
		urgency 		: "",
		priority 		: "",
		workingGroup	: "",
		caller			: ""				
	}	
}
module.exports = config;