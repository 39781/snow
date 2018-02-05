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
	if (req.body.result||req.body.queryResult) {
		return botHandler.processRequest(req, res)
		.then(function(responseJson){
			//console.log(JSON.stringify(responseJson));
				res.status(200);
			res.json({
	
	"data": {
		"facebook": {
			"text": "",
			"quick_replies": [{
				"content_type": "text",
				"title": "Hariprasad",
				"payload": "Hariprasad"
			}, {
				"content_type": "text",
				"title": "Harikrishna",
				"payload": "Harikrishna"
			}]
		}
	}
}).end();	
		
			//res.json(responseJson).end();
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

