var ffmpeg = require("fluent-ffmpeg");
var filename = __dirname + "/video/widescreen.mp4";

var proc = new ffmpeg({ source: __dirname + "/facebook/frame%04d.jpg" })
// .withAspect("16:9")
// .withSize("720×540")
.withFps(6)
.addInput(__dirname + "/music/track.mp3")
.saveToFile(filename, function (stdout, stderr) {
   if (stdout) console.log(stdout);
   if (stderr) console.log(stderr);
   console.log("Video crafted.");
});