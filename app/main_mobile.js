
var logText = document.getElementById("textID");
var video = document.getElementById("webcam")

var constraints = { video: { facingMode: "environment" }, audio: false };

//opencv constants
var orb = null;
var keypoints = null;
var img_mat_output_with_kp = null;
var mask = null;
var desriptors = null;
var color = null;
var cap = null;

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

function init_opencv(){
	orb = new cv.ORB(500);
	keypoints = new cv.KeyPointVector();
	img_mat_output_with_kp = new cv.Mat()
	mask = new cv.Mat()
	desriptors = new cv.Mat();
	color = new cv.Scalar(255, 255, 255, 255);
	cap = new cv.VideoCapture(video);
}

var start = function () {
	if (orb === null ){
		init_opencv()
	}
	cameraStart()
}

var place = function () {

}
