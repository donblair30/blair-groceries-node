blair-groceries-node
================

This Node.js sample application is designed to allow families to collaboratively manage the grocery list, and to SMS Dad & Mom to give them a heads up.   

This is designed to run with NodeJS 4.5.0 and Express 4.14.   This may not work with earlier versions of Node. 

You will need to create the following files in the root folder for the app.  These are not included in github.  

## app_config.json
{ 
  "AWS_REGION": "enter-aws-region-here", e.g. "us-west-2",
  "STARTUP_SIGNUP_TABLE": "this-can-be-empty-for-now",
  "NEW_SIGNUP_TOPIC": "enter-arn-for-topic-here"
}

## iam_policy.json
Create a policy that gives the app rights to publish to the topic.  

After installing NodeJS on your Linux box or Mac, you can run it as follows: 

> node server.js

And you can test it by taking your browser to: 

http://localhost:3000/main

Voila!  Have fun. 
