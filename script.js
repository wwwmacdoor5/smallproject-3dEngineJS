var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");

cvs.width = 700;
cvs.height = 520;
let desiredDepth = 100;
const FPS = 30;

ctx.fillRect(0,0, cvs.width,cvs.height);


var camera = new Camera();


for (var i = 0; i < 15; i++) {
	var x = Math.floor(Math.random()*cvs.width);
	var y = Math.floor(Math.random()*cvs.height);
	var r = Math.floor(Math.random()*100);

	
	camera.objectsInWord[i] = new Circle (x,y,r);
}


function draw () {
	camera.drawScene(ctx);	
}
function reloadScreen (ctx) {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,cvs.width, cvs.height);
}

//setInterval(draw , 1000/FPS);

document.addEventListener("keydown", function (e) {
	if (e.code == "KeyD") {
		var vec = new Vector([1,0,0]);
		console.log(vec.RotateVectorXY(90));
	} 

	if (e.code == "KeyC") {
		camera.drawScene(ctx);
	}

	if (e.code == "KeyA") {
		var origin = new Point([0,0,0]);

		for (var i in camera.objectsInWord) {
			var points = camera.objectsInWord[i].points;
			for (var k in points) {
				let tempVector = new Vector(points[k].SubtractPointFromPoint(origin));
				points[k].setPoint = origin.getPoint;
				points[k].AddVectorToPoint(new Vector (tempVector.ScaleVector([0.5,0.5,0.5])));
				points[k].points = points;
			}	
			camera.objectsInWord[i].points = points;	
		}
		reloadScreen(ctx);
		camera.drawScene(ctx);
	}
	if (e.code == "KeyS") {
		var origin = new Point([0,0,0]);

		for (var i in camera.objectsInWord) {
			var points = camera.objectsInWord[i].points;
			for (var k in points) {
				let tempVector = new Vector(points[k].SubtractPointFromPoint(origin));
				points[k].setPoint = origin.getPoint;
				points[k].AddVectorToPoint(new Vector (tempVector.ScaleVector([2,2,2])));
			}

			camera.objectsInWord[i].points = points;	
		}
		reloadScreen(ctx);
		camera.drawScene(ctx);
	}
	if (e.code == "KeyR") {
		var origin = new Point([350,26,0]);	
		for (var i in camera.objectsInWord) {
			var points = camera.objectsInWord[i].points;
			for (var k in points) {

				var tempVector = new Vector(points[k].SubtractPointFromPoint(origin));
				points[k].setPoint = origin.getPoint;
				var newVector = new Vector (tempVector.RotateVectorXY(30));
				points[k].AddVectorToPoint(newVector);

			}	
			camera.objectsInWord[i].points = points;	
		}
		reloadScreen(ctx);
		camera.drawScene(ctx);
	}
});




