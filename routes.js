var express 		= require('express');
var router			= express.Router();	 
var botHandler		= require('./botHandlers');	

router.get('/',function(req, res){
	console.log('req received');
	res.send("req received");
	res.end();
})
router.post('/botHandler',function(req, res){
	//console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(req.body));	
	/*console.log({speech:"",
	text:"Incident Created Ur Incident Number <div style='border:1px solid red'>: INC0011025 please Not for future reference"
	});
	res.status(200);
	res.json({speech:"",
	text:"Incident Created Ur Incident Number <div style='border:1px solid red'>: INC0011025 please Not for future reference"
	}).end();*/
			
	if (req.body.result||req.body.queryResult) {
		return botHandler.processRequest(req, res)
		.then(function(responseJson){
			console.log(JSON.stringify(responseJson));
				res.status(200);
			res.json(responseJson).end();
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


module.exports = router;

