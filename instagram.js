#! /usr/bin/env node

var fs = require("fs");
var path = require("path");
var request = require("request");
var async = require("async");

var image_count = 0;
var NUM_IMAGES = 1000;

downloadImages = function (url, cb) {
   request({
      url: url,
      method: "GET"
   }, function (err, res, body) {
       if (err) throw err;

      var q = async.queue(function (data, callback) {
         var stream = fs.createWriteStream(__dirname + "/instagram/" + data.name);
         stream.on("close", callback);
         request(data.images.standard_resolution.url).pipe(stream);
      }, 100);

      body = JSON.parse(body);
      
      for (var i = body.data.length - 1; i >= 0; i--) {
         // Create image name
         image = body.data[i]
         image.name = (image_count + i).toString()

         while (image.name.length < 4) image.name = "0" + image.name

         image.name = "frame" + image.name + ".jpg"
         q.push(body.data[i]);
      };

      q.drain = function (err) {
         if (err) return cb(err);
         
         image_count += body.data.length;
         console.log("\033[1A\033[KProgress:",image_count,"-", Math.floor(image_count / NUM_IMAGES * 100) + "%");
         if (image_count < NUM_IMAGES) {
            downloadImages(body.pagination.next_url, cb);
         } else {
            cb();
         }
      };
   });
};

console.log("Starting...");
downloadImages("https://api.instagram.com/v1/tags/clouds/media/recent?client_id=9dec1443eb1649208e384cbecebd8b9a", function () {
   process.exit();
});
