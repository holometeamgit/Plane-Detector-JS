function point_perspective_transform(point, H){
	var dest_per = new cv.Mat();
	cv.perspectiveTransform(point, dest_per, H)
	return dest_per
}

var get_corresp_points = function (cur_matches, kp1, kp2) {
	var points_from_array = []
	var points_to_array = []
	for (i = 0; i < cur_matches.size(); i++) {
		let cur_match = cur_matches.get(i)
		let cur_point_from = kp1.get(cur_match.queryIdx).pt
		let cur_point_to = kp2.get(cur_match.trainIdx).pt

		points_from_array.push(cur_point_from.x)
		points_from_array.push(cur_point_from.y)

		points_to_array.push(cur_point_to.x)
		points_to_array.push(cur_point_to.y)
	}

	return {from:points_from_array, 
		to:points_to_array}
}

function match_descriptors(desriptors1, desriptors2){
	
	let matcher = new cv.BFMatcher(); //, cv.NORM_HAMMING crossCheck=true
	let dm = new cv.DMatchVector();
	matcher.match(desriptors1, desriptors2, dm);
	return dm
}

var getHomography = function (points_from_array, points_to_array){

	var H = new cv.Mat();
	var from = new cv.matFromArray(points_from_array.length/2, 2, cv.CV_64FC1, points_from_array)
	var to   = new cv.matFromArray(points_to_array.length/2, 2, cv.CV_64FC1, points_to_array)
	
	H = cv.findHomography(from, to, cv.RANSAC, 5);

	return H
}