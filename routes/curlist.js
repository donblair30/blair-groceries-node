
/*
 * GET /curlist page
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var currentList = fs.readFileSync('data/current_list.json', 'utf8'); // String format
var defaultList = fs.readFileSync('data/default_list.json', 'utf8'); // String format

router.get('/curlist', function(req, res) {
	res.send(`  <!-- This is a template literal containing much of the page. -->  
	
	<!DOCTYPE HTML>
	<html>
	<head>
		<title>Blairs' Groceries</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" type="text/css" href="./static/css/menu.css" />
		<link rel="stylesheet" type="text/css" href="./static/css/main.css" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		<link rel="icon" href="./static/images/favicon.png"> 
		<script type="text/javascript" src="./static/jquery-1.7.1.min.js"></script>

		<script type="text/javascript"> 
			var userEnteredItem = false;
			var userEnteredComment = false;
			var numitems = 0;
			var curListObj = {};
			var curListArray = [];
	
			$("document").ready(function() {
				$.ajax("/curlist-data", 
						{ success: getContent, type: "GET", dataType: "json" });
				
				$("#itemnameinput").val("Enter item name").css("color","lightgray");
				$("#qtyinput").val("1").css("color","lightgray");					
				$("#commentinput").val("Optional comments").css("color","lightgray");					
				$("#addbutton").click(additem);
				$("#clearlist").click(clearlist);
				$("#resetlist").click(resetlist);
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
				$("#itemnameinput").keyup(impliedAdd);
				$("#qtyinput").keyup(impliedAdd);
				$("#commentinput").keyup(impliedAdd);
			});
	
			function htmlEncode(value){
			    //create a in-memory div, set its inner text (which jQuery automatically encodes)
			    //then grab the encoded contents back out.  The div never exists on the page.
			    //Thanks to http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
			    return $('<div/>').text(value).html();
			}

			function htmlDecode(value){
			    return $('<div/>').html(value).text();
			}

			function getContent(data, status, jqxhr) {
				curListObj = JSON.parse(data);
				curListArray = curListObj.allitems;
				$(".itemrow").remove();
				numitems = 0; 
				var i = 0;
				for (i = 0; i < curListArray.length; i++) {
					$(".itemtable").append('<TR class=\"itemrow\"><TD class=\"txtfield\">' + curListArray[i].item + '</TD><TD class=\"qtyfield\">' + curListArray[i].quantity + '</TD><TD class=\"txtfield\">' + curListArray[i].comments + '</TD></TR>');            	
					numitems += 1;
				}
				if (numitems === 0) { 
					$(".itemtable").append('<TR class=\"itemrow\"><TD>Empty List</TD><TD></TD><TD></TD></TR>'); 
				}
				$("#itemnameinput").focus();
			}

			/* 
			 * If user enters <CR>, treat it as if they hit Add Item button
			 * unless there's nothing been entered to be added.
			 */
			function impliedAdd (event) {
				if ((event.keyCode === 13) && userEnteredItem)
				{
					$("#addbutton").click();
				}
			}
				
			function additem(data, status, jqxhr) {
				var userinput = $("#itemnameinput").val();
				if (!userEnteredItem) {
					$("#itemnameinput").css("color","red")
				} else {
					var newItemName = $("#itemnameinput").val();
					newItemName = htmlEncode(newItemName);
					
					var newQty = $("#qtyinput").val();
					if (isNaN(newQty)) {
						newQty = 1;
					}
					
					var newComment;
					if (userEnteredComment) {
						newComment = $("#commentinput").val();
					} else {
						newComment = "";
					}
					newComment = htmlEncode(newComment);					

					if (numitems === 0) {
						$(".itemrow").remove();
					}
					var newItem = {
						item: newItemName,
						quantity: newQty,
						comments: newComment
					};
					curListArray[curListArray.length] = newItem;
					$(".itemtable").append('<TR class=\"itemrow\"><TD class=\"txtfield\">' + newItemName + '</TD><TD class=\"qtyfield\">' + newQty + '</TD><TD  class=\"txtfield\">' + newComment + '</TD></TR>');
					$("#itemnameinput").val("Enter item name").css("color","lightgray");
					userEnteredItem=false;
					$("#qtyinput").val("1").css("color","lightgray");
					$("#commentinput").val("Optional comments").css("color","lightgray");
					userEnteredComment=false;
					numitems += 1; 
					$("#itemnameinput").focus();
					
					var curListString = JSON.stringify(curListObj);
					$.ajax( { url: "/curlist",
							  type: "POST", 
							  data: {str1: curListString},
							  success: function() { console.log('added item') },
							  error: function() { console.log('failure added item') }, 
							}
					);
				}
			} 
			
			function clearlist(data, status, jqxhr) {
				$(".itemrow").remove();
				numitems = 0; 
				$(".itemtable").append('<TR class=\"itemrow\"><TD>Empty List</TD><TD></TD><TD></TD></TR>'); 
				$("#itemnameinput").focus();

				curListStr1 = '{"allitems": []}';
				curListObj = JSON.parse(curListStr1);
				curListArray = curListObj.allitems;

				$.ajax( { url: "/curlist",
						  type: "POST", 
						  data: {str1: curListStr1},
						  success: function() { console.log('cleared list') },
						  error: function() { console.log('failure clearing list') }, 
						}
				);
			}			

			function resetlist(data, status, jqxhr) {
				$.ajax("/curlist-default", 
						{ success: getContent, type: "GET", dataType: "json" });
			}			

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
		<div class="pagetitle">Current List</DIV>
		<table id="mainitemtable">
		<tbody class="itemtable">
		<tr class="itemcolumnheader">
			<td class="itemcolumnheader">Item</td> 
			<td class="itemcolumnheader">Qty</td> 
			<td class="itemcolumnheader">Notes</td>
		</tr>
		</tbody>
		</table>

		<div class="buttonbar">
			<button id="addbutton" class="btn btn-sm btn-success">Add Item</button>
			<input type="text" id="itemnameinput" class="input-sm" value="">
			<input type="text" id="qtyinput" class="input-sm" size="2" value="">
			<input type="text" id="commentinput" class="input-sm" value="">
		</div>		
		<div class="buttonbar">
			<button id="clearlist" class="btn btn-sm btn-success">Clear List</button>
			<button id="resetlist" class="btn btn-sm btn-success">Reset to Default List</button>
		</div>
	</div>
	</body>
	</html>
	
	`); // End of the template literal. 
});

router.get('/curlist-data', function(req, res) {
	res.status(200).json(currentList);
});

router.get('/curlist-default', function(req, res) {
	currentList = defaultList;
	fs.writeFileSync('data/current_list.json', JSON.stringify(currentList), 'utf8');
	res.status(200).json(currentList);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false })); 

router.post('/curlist', function(req, res) {
	currentList = req.body.str1;
	fs.writeFileSync('data/current_list.json', currentList, 'utf8');
	res.status(200).send("success!");	
});

module.exports = router;
