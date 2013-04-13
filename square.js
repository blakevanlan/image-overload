var ffmpeg = require("fluent-ffmpeg");
var filename = __dirname + "/video/square.mp4";

var proc = new ffmpeg({ source: __dirname + "/instagram/frame%04d.jpg" })
.withSize("612x612")
.withFps(6)
.addInput(__dirname + "/music/track.mp3")
.saveToFile(filename, function (stdout, stderr) {
   if (stdout) console.log(stdout);
   if (stderr) console.log(stderr);
   console.log("Video crafted.");
});