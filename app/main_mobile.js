
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
var prev_kp = null;
var prev_dec = null;

//main flow constants
var cur_point = null;
let FPS = 30
var isFollow = false

//loading opencv.js
var scr  = document.createElement('script'),
    head = document.head || document.getElementsByTagName('head')[0];
    scr.src = 'assets/opencv.js';
    scr.async = false; // optionally

head.insertBefore(scr, head.firstChild);

scr.onload = function() { 
	console.log('ready');

}

function cameraStart() {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function(stream) {
		video.srcObject = stream;
		video.play();
		processVideo()
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

function processVideo() {

	let begin = Date.now();
	var src = new cv.Mat(640, 480, cv.CV_8UC4);

	cap.read(src);

	cur_keypoints = new cv.KeyPointVector();
	cur_desriptors = new cv.Mat();
	orb.detectAndCompute(src, mask, cur_keypoints, cur_desriptors);

	if ( prev_kp == null ){
		if (cur_desriptors.rows > 0){
			prev_kp = cur_keypoints
			prev_dec = cur_desriptors
		}
	} else {
		let cur_matches = match_descriptors(prev_dec, cur_desriptors)
		let cur_corresp_points = get_corresp_points(cur_matches, prev_kp, cur_keypoints)
		let array_from = cur_corresp_points["from"]
		let array_to = cur_corresp_points["to"]
		let cur_H = getHomography(array_from, array_to)

		if ( (cur_keypoints.size() > 150) && (isFollow) ){
			if ( cur_point == null ){
				cur_point = cv.matFromArray(1, 1, cv.CV_32FC2, [240, 320]);
			} else {
				cur_point = point_perspective_transform(cur_point, cur_H)
			}
			prev_kp = cur_keypoints
			prev_dec = cur_desriptors
		}
	}
	
	cv.drawKeypoints(src, cur_keypoints, img_mat_output_with_kp);

	if ( cur_point == null ){
		let center = new cv.Point(240, 320);
		cv.circle(src, center, 5, color, -1);
	} else {
		let center = new cv.Point(cur_point.data32F[0], cur_point.data32F[1]);
		cv.circle(src, center, 5, color, -1);
	}
	

	let script_time = Date.now() - begin
	cv.imshow("image_canvas", src);
	let delay =Math.max(1000/FPS - (script_time), 0);
	setTimeout(processVideo, delay);	
}

var start = function () {
	if (orb === null ){
		init_opencv()
	}
	cameraStart()
}

var place = function () {
	isFollow = true	
}
