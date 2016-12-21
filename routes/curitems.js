
/*
 * GET /curitems page
 */

var express = require('express');
var router = express.Router();

router.get('/curitems', function(req, res) {
	res.send(`  
	{
		"allitems": [

		{"item": "almond milk",
		"quantity": 1,
		"comments": ""},

		{"item": "tostitos",
		"quantity": 3,
		"comments": "Not market basket brand, please"},

		{"item": "shredded cheese",
		"quantity": 1,
		"comments": ""},

		{"item": "organic apples",
		"quantity": 10,
		"comments": ""},

		{"item": "bananas",
		"quantity": 1,
		"comments": ""}
		]
	}	
	`);
});

module.exports = router;
