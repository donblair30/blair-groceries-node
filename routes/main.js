
/*
 * /main page
 */

var express = require('express');
var router = express.Router();

router.get('/main', function(req, res) {

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
		<link rel="icon" href="./static/images/favicon.png"> 

		<script type="text/javascript" src="./static/jquery-1.7.1.min.js"></script>
		<!-- <script type="text/javascript" src="./static/jquery.dropmenu-1.1.4.js"></script> -->
		<!-- <script type="text/javascript" src="./static/menu.js"></script> --> 

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
		<h1>Blair's Grocery Shopping List</h1>
		
		<div class="bluetitle">
		A web app to help families collaboratively manage the family grocery shopping list.  
		</div>

		<p>Features:
		<ul class="main-ul">
		<li class="main-li">Easy to create and update the family grocery shopping list.</li>
		<li class="main-li">All family members can see & update the list from anywhere, anytime.</li>
		<li class="main-li">Works on laptops or mobile devices.</li>					
		<li class="main-li">Runs in the cloud, nothing installed on the client.</li>					
		<li class="main-li">Kids can send Mom & Dad text messages & emails directly from the app
			to let them know of latebreaking changes</li>
		</ul>
		</p>
	
		<p>Technologies: 
		<ul class="main-ul">
		<li class="main-li">App hosted in the cloud on Amazon Linux EC2 instance. </li>
		<li class="main-li">Back end using NodeJS, ExpressJS and JSON. </li>
		<li class="main-li">SMS Text messages and emails using AWS Simple Notification Service (SNS)</li>					
		<li class="main-li">Front end using	HTML5, CSS, JavaScript, jQuery, and Google's customizable icon library.</li>
		<li class="main-li">Dynamic drop-down menus using CSS</li>
		<li class="main-li">Awesome Boulder Brook Software graphic by Jeb Blair!</li>
		</ul>
		</p>

		<p>Limitations:
		<ul class="main-ul">
		<li class="main-li">No authentication yet, anyone can access the app.</li>
		<li class="main-li">Works on mobile, but doesn't look good yet.</li>
		<li class="main-li">Only one favorites page implemented, the rest coming soon!</li>
		</ul>
		</p>

		<p style="background-color:yellow;">How to begin:
		<ul class="main-ul">
		<li class="main-li">Click on Current List in the navigation bar at the top of the page and go from there.</li>
		</ul>
		</p>
	</div>
	</body>
	</html>
	
	`); // End of the template literal. 
});

module.exports = router;
