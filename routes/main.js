
/*
 * GET /main page
 */

var express = require('express');
var router = express.Router();

router.get('/main', function(req, res) {
	var portnum = req.app.get('port');
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
			<!-- <script type="text/javascript" src="./static/jquery-1.11.1.js"></script> -->
			<script type="text/javascript" src="./static/jquery.dropmenu-1.1.4.js"></script>
			<script type="text/javascript" src="./static/menu.js"></script>


			<script type="text/javascript"> 
				var userEnteredItem = false;
				var userEnteredComment = false;
				var numitems = 0;
		
				$("document").ready(function() {

//					$.ajax("http://localhost:3000/curitems", 
					$.ajax("/curitems", 
							{ success: setContent, type: "GET", dataType: "json" });
					
					$("#itemnameinput").val("Enter item name").css("color","lightgray");
					$("#qtyinput").val("1").css("color","lightgray");					
					$("#commentinput").val("Optional comments").css("color","lightgray");					
					$("#addbutton").click(additem);
					$("#clearlist").click(clearlist);
					$("#itemnameinput").keypress(function(event) {
						/* 
						 * On first character entered, set field color to black and 
						 * enter default quantity of "1".  However, if the character
						 * entered is <CR>, do nothing. 
						 */
						if (!userEnteredItem && (event.keyCode !== 13)) {
							$("#itemnameinput").val("").css("color","black");
							userEnteredItem = true; 
							$("#qtyinput").val("1").css("color","black");
						}
					})
					$("#itemnameinput").focus();
					$("#commentinput").keypress(function() {
						if (!userEnteredComment) {
							$("#commentinput").val("").css("color","black");
							userEnteredComment = true; 
						}
					});
					/* 
					 * If user enters <CR>, treat it as if they hit Add Item button
					 * unless there's nothing been entered to be added.
					 */
					$("#itemnameinput").keyup(function(event){
						if ((event.keyCode === 13) && userEnteredItem)
						{
							$("#addbutton").click();
						}
					});
					$("#qtyinput").keyup(function(event){
						if ((event.keyCode === 13) && userEnteredItem)
						{
							$("#addbutton").click();
						}
					});
					$("#commentinput").keyup(function(event){
						if ((event.keyCode === 13) && userEnteredItem)
						{
							$("#addbutton").click();
						}
					});
				});
		
				function setContent(data, status, jqxhr) {
					console.log(data.allitems);
					var curitems = data.allitems;
					for (i=0; i<curitems.length; i++) {
						$(".itemtable").append('<TR class=\"itemrow\"><TD>' + curitems[i].item + "</TD><TD>" + curitems[i].quantity + "</TD><TD>" + curitems[i].comments + "</TD></TR>");            	
						numitems += 1;
					}
					if (numitems === 0) { 
						$(".itemtable").append('<TR class=\"itemrow\"><TD>Empty List</TD></TR>'); 
					}
				}

				function additem(data, status, jqxhr) {
					var userinput = $("#itemnameinput").val();
					if (!userEnteredItem) {
						$("#itemnameinput").css("color","red")
					} else {
						var newItemName = $("#itemnameinput").val();
						var newQty = $("#qtyinput").val();
						var newComment;
						if (userEnteredComment) {
							newComment = $("#commentinput").val();
						} else {
							newComment = "";
						}
						if (numitems === 0) {
							$(".itemrow").remove();
						}
						$(".itemtable").append('<TR class=\"itemrow\"><TD>' + newItemName + "</TD><TD>" + newQty + "</TD><TD>" + newComment + "</TD></TR>");
						$("#itemnameinput").val("Enter item name").css("color","lightgray");
						userEnteredItem=false;
						$("#qtyinput").val("1").css("color","lightgray");
						$("#commentinput").val("Optional comments").css("color","lightgray");
						userEnteredComment=false;
						numitems += 1; 
						$("#itemnameinput").focus();
					}
				} 
				
				function clearlist(data, status, jqxhr) {
					$(".itemrow").remove();
					numitems = 0; 
					$(".itemtable").append('<TR class=\"itemrow\"><TD>Empty List</TD></TR>'); 
					$("#itemnameinput").focus();
				}			

			</script>

		</head>
		<body>
		<div class="page">
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

			<DIV class="pagetitle">Current Grocery List</DIV>
			<TABLE id="mainitemtable">
			<TBODY class="itemtable">
			<TR class="itemcolumnheader">
				<TD class="itemcolumnheader">Item</TD> 
				<TD class="itemcolumnheader">Qty</TD> 
				<TD class="itemcolumnheader">Notes</TD>
			</TR>
			</TBODY>
			</TABLE>

			<DIV class="buttonbar">
				<button id="addbutton" class="btn btn-sm btn-success">Add Item</button>
				<input type="text" id="itemnameinput" class="input-sm" value="">
				<input type="text" id="qtyinput" class="input-sm" size="2" value="">
				<input type="text" id="commentinput" class="input-sm" value="">
				<p>
				<button id="clearlist" class="btn btn-sm btn-success">Clear List</button>
			</DIV>
		</div>
		</body>
		</html>
	
	`); // End of the template literal. 
});

router.get('/main/:pebble', function(req, res) {
	var portnum = req.app.get('port');
	console.log('hostname ', req.hostname);
	console.log('ip ', req.ip);
	console.log('method ', req.method);
	console.log('originalUrl', req.originalUrl);
	console.log('params', req.params);
	res.send('hello world00');
});

module.exports = router;
