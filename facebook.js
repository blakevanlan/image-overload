#! /usr/bin/env node

var fs = require("fs");
var path = require("path");
var request = require("request");
var async = require("async");
var gm = require("gm");
var exec = require("child_process").exec;

var images = []

// Go here to get access_token: https://developers.facebook.com/tools/explorer/490956187613410
var access_token = "blah"

getImages = function (url, cb) {
   request({
      url: url,
      method: "GET"
   }, function (err, resp, body) {
      if (err) throw err;

      body = JSON.parse(body);

      if (!(body.data ? (body.data.length) : null)) return cb();

      for (var i = 0; i < body.data.length; i++) {
         images.push(body.data[i].images[0]);
      };

      console.log("\033[1A\033[KFound:", images.length);

      // cb();
      if (body.paging ? body.paging.next : null) {
         getImages(body.paging.next, cb);
      } else {
         cb();
      }
   });
};

cropImage = function (image, cb) {  
   var cmd = "gm composite -size 720x540 -resize 720x540 "
      + image.path +" xc:black -gravity center -quality 92 " + image.path

   exec(cmd, function (err, stdout, stderr) {
      if (err) console.log("ERR:", err);
      if (stdout) console.log("stdout:", stdout);
      if (stderr) console.log("stderr:", stderr);
      cb(); 
   });
};

downloadImages = function (cb) {
   var q = async.queue(function (image, callback) {
      
      var stream = fs.createWriteStream(image.path);
      request(image.source).pipe(stream);
      stream.on("close", function () {
         cropImage(image, callback);
      });
   }, 25);
   
   for (var i = 0; i < images.length; i++) {
      var image = images[i]
      image.name = i.toString()

      while (image.name.length < 4) image.name = "0" + image.name;
      image.name = "frame" + image.name + ".jpg";
      image.path = __dirname + "/facebook/" + image.name;
      
      q.push(image);
   };

   q.drain = cb;
};

console.log("Starting...")
getImages("https://graph.facebook.com/me/photos?fields=images&access_token="+access_token, function () {
   images.reverse();
   downloadImages(process.exit);
});


