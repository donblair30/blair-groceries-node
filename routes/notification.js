
/*
 * /notification page
 */

var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

router.get('/notification', function(req, res) {

	var portnum = req.app.get('port');
	var config = req.app.get('config');

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

			<script type="text/javascript" src="./static/jquery-1.7.1.min.js"></script>
			<script type="text/javascript" src="./static/jquery.dropmenu-1.1.4.js"></script>
			<script type="text/javascript" src="./static/menu.js"></script>

			<script type="text/javascript"> 		
				var dadTextEntered = false;
				var momTextEntered = false;
				$("document").ready(function() {
					$("#dadnotifyinput").val("Enter optional message for Dad");
					$("#momnotifyinput").val("Enter optional message for Mom");					
					$("#dadbutton").click(heydad);

					$("#dadnotifyinput").keypress(function() {
						console.log("Here!" + " " + dadTextEntered);
						if (!dadTextEntered) {
							$("#dadnotifyinput").val("").css("color","black");
							dadTextEntered = true; 
						}
					})

					$("#momnotifyinput").keypress(function() {
						if (!momTextEntered) {
							$("#momnotifyinput").val("").css("color","black");
							momTextEntered = true; 
						}
					})
				});
		
				function heydad(data, status, jqxhr) {
					$.ajax("/notification", 
							{ success: dadsuccess, type: "POST", dataType: "json" });
				} 

				function dadsuccess(data, status, jqxhr) {
					console.log("It worked!");
					$("#dadnotifyinput").val("Enter optional message for Dad").css("color","gray");
					$("#errormessage").html("<p>This is a new error message </p>").css("display","block");
				};

			</script>
		</head>
		<body>
			<ul>
			    <li><a id="bbslogo" href="http://www.linkedin.com/in/donblair10" target="_blank">
			    	<img src="./static/images/bbs sm don blair copyrighted.jpg">
			    </a></li>
			    <li><a href="/main" style="padding: 13px 16px 10px;"><i class="material-icons">home</i></a></li>     
			    <li><a href="/main">Current List</a></li>
			    <li class="dropdown"><a href="/faves" class="dropbtn">Faves</a>
			        <div class="dropdown-content">
			            <a href="/faves">Master List</a>
			            <a href="/faves">Dad's</a>
			            <a href="/faves">Mom's</a>
			            <a href="/faves">Peter's</a>
			            <a href="/faves">Michael's</a>
			            <a href="/faves">David's</a>
			        </div>
			    </li>
			    <li><a href="/notification">Notifications</a></li>
			</ul>
			<DIV class="pagetitle">Notifications</DIV>
			<DIV id="errormessage"> Initial error message </DIV>

			<DIV class="buttonbar-no-top-margin">
				<button id="dadbutton" class="btn btn-sm btn-success">Text to Dad</button>
				<input type="text" id="dadnotifyinput" class="input-sm" value="">
				<p>
				<button id="mombutton" class="btn btn-sm btn-success">Text to Mom</button>
				<input type="text" id="momnotifyinput" class="input-sm" value="">
			</DIV>

		</body>
		</html>
	
	`); // End of the template literal. 
});

router.post('/notification', function(req, res) {

	var config = req.app.get('config');

	//Create SNS client and pass in region.
	var sns = new AWS.SNS({ region: config.AWS_REGION});
	var snsMessage = 'Hey Dad! I updated the grocery list!';
	sns.publish({ TopicArn: config.NEW_SIGNUP_TOPIC, Message: snsMessage }, function(err, data) {
		if (err) {
		  console.log('Error publishing SNS message: ' + err);
		} else {
		  console.log('SNS message sent 678.');
		}
	});

	res.end('Yes');
});

module.exports = router;
