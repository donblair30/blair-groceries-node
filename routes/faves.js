
/*
 * /notification page
 */

var express = require('express');
var router = express.Router();

router.get('/faves', function(req, res) {

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

		</head>
		<body>
			<ul class="menu-ul">
			    <li class="menu-li"><a id="bbslogo" href="/main">
			    	<img src="./static/images/bbs sm don blair copyrighted.jpg">
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

			<DIV class="pagetitle">Favorites</DIV>
			<DIV STYLE="color: #2479f7; margin: 10px 10px 0px 10px;font-size: 24px; text-align: center;"> 
			* * * This page is under construction * * * 
			</DIV>
		</body>
		</html>
	
	`); // End of the template literal. 
});

module.exports = router;
