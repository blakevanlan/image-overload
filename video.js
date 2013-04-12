var ffmpeg = require("fluent-ffmpeg");
var filename = __dirname + "/video.mp4";

var proc = new ffmpeg({ source: __dirname + "/images/frame%04d.jpg" })
.withSize("612x612")
.withFps(6)
.addInput(__dirname + "/music/track.mp3")
.saveToFile(filename, function (stdout, stderr) {
   // console.log(stdout);
   console.log(stderr);
   console.log("Video crafted.");
});