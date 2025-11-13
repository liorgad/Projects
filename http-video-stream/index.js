const express = require("express");
const ffmpeg = require("node-ffmpeg-stream");
const app = express();

const { parse } = require('ffmpeg-device-list-parser');

(async () => {

    // Callback usage without option
    // parse((result) => console.log(result));

    const result = await parse()

    console.log(result);

    // Stream = require('node-ffmpeg-stream').Stream;
    // stream = new Stream({
    //     name: result.videoDevices[0].name,//name that can be used in future  
    //     url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',  //Stream URL
    //     wsPort: 7070,  //Streaming will be transferred via this port
    //     options: { // ffmpeg options 
    //         '-stats': '', // print progress report during encoding, can be no value ''
    //         '-r': 30 // frame rate (Hz value, fraction or abbreviation) - By default it set to 30 if no value specified
    //     }
    // })
})();





// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

// app.listen(8000, function () {
//     console.log("Listening on port 8000");
// })

