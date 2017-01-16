
/*
 * /notification page
 */

var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');

router.get('/notification', function(req, res) {

	res.send(`  <!-- This is a template literal containing almost the whole page. -->  	
	<!DOCTYPE HTML>
	<html>
	<head>
		<title>Blairs' Groceries</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Blair's Groceries</title>
		<link rel="stylesheet" type="text/css" href="./static/css/menu.css" />
		<link rel="stylesheet" type="text/css" href="./static/css/main.css" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		<link rel="icon" href="./static/images/favicon.png"> 
		<script type="text/javascript" src="./static/jquery-1.7.1.min.js"></script>

		<script type="text/javascript"> 		
			var PROMPT_TEXT = "Enter optional message for Dad";
			var dadTextEntered = false;
			$("document").ready(function() {
				$("#dadnotifyinput").val(PROMPT_TEXT);
				$("#dadbutton").click(heydad);
				$("#dadnotifyinput").keypress(firstCharEntered);
			});
	
			function firstCharEntered() {
				if (!dadTextEntered) {
					$("#dadnotifyinput").val("").css("color","black");
					dadTextEntered = true; 
					$("#successmessage").css("display","none");
					$("#errormessage").css("display","none");
				}
			}

			function htmlEncode(value){
			    //create a in-memory div, set its inner text (which jQuery automatically encodes)
			    //then grab the encoded contents back out.  The div never exists on the page.
			    //Thanks to http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
			    return $('<div/>').text(value).html();
			}

			function heydad(data, status, jqxhr) {
				var tmpStr = "";
				kidsText = document.getElementById('dadnotifyinput').value;
				if (kidsText === PROMPT_TEXT) {
					tmpStr = 'Heads up from the kids!';
				} else {
					tmpStr = 'Heads up from the kids: \"' + htmlEncode(kidsText) + '\"';
				}
				$.ajax( { url: "/notification",
						  type: "POST", 
						  data: {
							  kidsMessage: tmpStr
						  },
						  success: dadsuccess,
						  error: dadfailure, 
						});
			} 

			function dadsuccess(data, status, jqxhr) {
				dadTextEntered = false;
				$("#dadnotifyinput").val(PROMPT_TEXT).css("color","lightgray");
				$("#successmessage").html("<p>Text msg and email successfully queued for Dad via AWS:</br>" + 
					"<i>" + data + "</i></p>").css("display","block");
			};
			
			function dadfailure(
							jqXHR, // jQuery wrapper for XML Http Request object
							status, // contains "error"
							error) { // contains "Internal Server Error" or specific error returned
				var failureMsg = "Failure: " + error + ", " + jqXHR.responseText;
				console.log(failureMsg);
				dadTextEntered = false;
				$("#dadnotifyinput").val(PROMPT_TEXT).css("color","lightgray");
				$("#errormessage").html("<p>" + failureMsg + "</p>").css("display","block");
			};
		</script>
	</head>
	
	<body>

	<!-- Main navigation bar / menu --> 
	<ul class="menu-ul">
		<li class="menu-li"><a id="bbslogo" href="/main">
			<img src="./static/images/bbs sm don blair copyrighted.jpg" style="height:50px;width:147px;" alt="sample logo">
		</a></li>
		<li class="menu-li"><a href="/main" style="padding: 13px 16px 10px;"><i class="material-icons">home</i></a></li>     
		<li class="menu-li"><a href="/curlist">Current List</a></li>
		<li class="menu-dropdown"><a href="/faves" class="dropbtn">Faves</a>
			<div class="dropdown-content">
				<a href="/faves">Master List</a>
				<a href="/faves">Dad's</a>
				<a href="/faves">Mom's</a>
				<a href="/faves">Peter's</a>
				<a href="/faves">Michael's</a>
				<a href="/faves">David's</a>
			</div>
		</li>
		<li class="menu-li"><a href="/notification">Notifications</a></li>
	</ul>

	<!-- Main page -- everything below the navigation bar --> 
	<div class="fullpage">
		<h1>Notifications</h1>
		
		<div id="errormessage"> Empty error message </div>
		<div id="successmessage"> Empty success message </div>

		<div class="buttonbar">
			<button id="dadbutton" class="btn btn-sm btn-success">Send text & email to Dad</button>
			<input type="text" id="dadnotifyinput" class="input-sm" value=""> 
		</div>

	</body>
	</html>	
	`); // End of the template literal and res.send()
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false })); 

router.post('/notification', function(req, res) {
	var config = req.app.get('config');
	var sns = new AWS.SNS({ region: config.AWS_REGION});
	var outStr = req.body.kidsMessage;
	sns.publish({ TopicArn: config.NEW_SIGNUP_TOPIC, 
				  Message: outStr }, function(err, data) {
		if (err) {
			res.status(500).send('Failure returned from AWS: err = ' + err); 
		} else {
			res.status(200).send(outStr); 
		}
	});
});

module.exports = router;
