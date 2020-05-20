var logText = document.getElementById("textID");
var video = document.getElementById("webcam")

var constraints = { video: { facingMode: "environment" }, audio: false };

function cameraStart() {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function(stream) {
		video.srcObject = stream;
		video.play();
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}

var start = function () {
	cameraStart()
}

var place = function () {

}
