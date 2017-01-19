
/*
 * /faves page
 */

var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var fs = require('fs');
var dadsFaves = fs.readFileSync('data/dads_faves.json', 'utf8'); // String format

router.get('/faves', function(req, res) {

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
			$("document").ready(function() {
				$.ajax("/faves-data", 
						{ success: getContent, type: "GET", dataType: "json" });
				$("#selectall").change(selectAllItems);    
				$("#addselected").click(addItems);

			});
    
			function getContent(data, status, jqxhr) {
				curListObj = JSON.parse(data);
				curListArray = curListObj.allitems;
				numitems = 0; 
				var i = 0;
				for (i = 0; i < curListArray.length; i++) {
					$(".itemtable").append('<tr class=\"itemrow\"><td style="width:12px;"><input type="checkbox" class=\"checkboxfield\"></td><td class="itemclass">' + curListArray[i].item + '</td></tr>');            	
					numitems += 1;
				}
				if (numitems === 0) { 
					$(".itemtable").append('<tr class=\"itemrow\"><td>Empty List</td><td></td><td></td></tr>'); 
				}
				$(".itemclass").click(selectItem);
			}

			/* 
			 * If user clicks on name of item, check the checkbox preceding it 
			 */
			function selectItem(event) {
				var checkbox1 = this.previousSibling.childNodes[0];
				checkbox1.checked = true; 
			}
			/* 
			 * If the user checks the checkbox in top row, check all the items in the list
			 */
			function selectAllItems(event) {
				$(".checkboxfield").attr("checked", this.checked);
			}

			/* 
			 * Find all the checked items and add them to the current list.  
			 */
			function addItems(event) {
				var allCheckboxes = document.getElementsByClassName("checkboxfield");
				var allItems = document.getElementsByClassName("itemclass");
				var newItems = []; // Array of faves to be added to the current list
				var n = 0;
				for (n = 0; n < allCheckboxes.length; n++) {
					if (allCheckboxes[n].checked) {
						newItems[newItems.length] = {						
							item: allItems[n].innerHTML,
							quantity: 1,
							comments: ""
						};						
					};
				};
				if (newItems.length > 0) {
					var newItemsString = JSON.stringify(newItems);
					$.ajax( { url: "/curlist-append",
							  type: "POST", 
							  data: {str1: newItemsString},
							  success: function(data, textStatus) {
									if (data.redirect) {
										// redirect browser to the Current List page. 
										window.location.href = data.redirect;
									}
							  },
							  error: function() { console.log('failure added fave') }, 
							}
					);
				}
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
		<h1>Dad's Favorites</h1>
		<table id="mainitemtable">
		<tbody class="itemtable">
		<tr class="itemcolumnheader">
			<td class="itemcolumnheader"><input type="checkbox" id="selectall"></td> 
			<td class="itemcolumnheader">Item</td> 
		</tr>
		
		</tbody>
		</table>

		<div class="buttonbar">
			<button id="addselected" class="btn btn-sm btn-success">Add Selected Items to Current List</button>
		</div>		
	</div>

	</body>
	</html>
	
	`); // End of the template literal. 
});

router.get('/faves-data', function(req, res) {
	res.status(200).json(dadsFaves);
});

module.exports = router;
