var express = require('express');
var rawjs = require('raw.js');
var reddit = new rawjs('redup v1');
var request = require('request');
var fs = require('fs');
var session = require('express-session');
var config = require(__dirname+'/credentials.json');
var image_downloader = require('image-downloader');
fs.mkdir(__dirname+'/pics/'+process.argv[2],function(){
reddit.setupOAuth2(config.redditApp.redditID,config.redditApp.redditSecret);

reddit.auth({"username": config.redditApp.user, "password": config.redditApp.pass}, function(err, response) {
    if(err) {
        console.log("Unable to authenticate user: " + err);
    } else {
        console.log('Successfully Authenticated');
        var options = {
            r:process.argv[2],
            limit:process.argv[3]
        }
        reddit.hot(options,function(error,res1){
            console.log(res1);
            for(var i in res1.children){
                //console.log(res1.children[i].data);
                
                    //console.log(res1.children[i].data.url);
                var imgOptions = {
                    url:res1.children[i].data.url,
                    dest:__dirname+'/pics/'+res1.children[i].data.subreddit,
                    done:function(err,filename,image){
                        if(err){
                            console.log(err);
                        }
                        console.log('file saved to'+filename);
                    }
                    
                };
                image_downloader(imgOptions);
                
                
            }
        })
        // The user is now authenticated. If you want the temporary bearer token, it's available as response.access_token
        // and will be valid for response.expires_in seconds.
        // raw.js will automatically refresh the bearer token as it expires. Unlike web apps, no refresh tokens are available.
    }
});
});