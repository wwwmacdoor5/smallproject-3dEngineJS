class Point {
	constructor (po) {
		this.po = po;
	}


	AddVectorToPoint (vector) {
		vector = vector.getVector;

		this.po =  [this.po[0] + vector[0], this.po[1] + vector[1], this.po[2] + vector[2]];
	}
	
	SubtractVectorFromPoint (vector) {
		vector = vector.getVector;
		this.po = [this.po[0] - vector[0], this.po[1] - vector[1], this.po[2] - vector[2]];
	}  
	SubtractPointFromPoint (point) {
		point = point.getPoint; 	
		return [this.po[0] - point[0], this.po[1] - point[1], this.po[2] - point[2]];
	}

	get getPoint() {
		return this.po;
	} 

	set setPoint (value) {
		this.po = value;
	}

	drawPoint(ctx) {
		ctx.fillStyle = "white";
		let x = this.po[0];
		let y = this.po[1];
		
		ctx.fillRect(x, y, 1,1);
	}
}


class Vector {
	constructor (vec) {
		this.vec = vec;
	}

	AddVectorToVector(vector) {
		vector = vector.getVector
		return [this.vec[0] + vector[0], this.vec[1] + vector[1], this.vec[2] + vector[2]];
	}

	SubtractVectorFromVector (vector) {
		return [this.vec[0] - vector[0], this.vec[1] - vector[1], this.vec[2] - vector[2]];
	}

	RotateVectorXY (alpha) {
		alpha = degToRad(alpha);

		return [
			Number((Math.cos(alpha)*this.vec[0] - Math.sin(alpha)*this.vec[1]).toFixed(3)),
			Number((Math.sin(alpha)*this.vec[0] + Math.cos(alpha)*this.vec[1]).toFixed(3)),
			Number((this.vec[2]).toFixed(3))
		]
	}
	RotateVectorYZ (alpha) {
		alpha = degToRad(alpha);
		return [
			Number((this.vec[0]).toFixed(3)),
			Number((Math.cos(alpha)*this.vec[1] - Math.sin(alpha)*this.vec[2]).toFixed(3)),
			Number((Math.sin(alpha)*this.vec[1] + Math.cos(alpha)*this.vec[2]).toFixed(3))
		]
	}
	RotateVectorXZ (alpha) {
		alpha = degToRad(alpha);
		return [
			Number((Math.cos(alpha)*this.vec[0] + Math.sin(alpha)*this.vec[2]).toFixed(3)),
			Number((this.vec[1]).toFixed(3)),
			Number((-Math.sin(alpha)*this.vec[0] + Math.cos(alpha)*this.vec[2]).toFixed(3))
		]
	}
	ScaleVector (scale) {
		return [
			this.vec[0]*scale[0],
			this.vec[1]*scale[1],
			this.vec[2]*scale[2],
		];
	}
	get getVector() {
		return this.vec;
	} 

	set setVector (value) {
		this.vec = value;
	}

} 

class Camera {
	minX = 0; maxX = cvs.width;
	minY = 0; maxY = cvs.height;
	minZ = 0; maxZ = 100;

	objectsInWord = [];

	renderedObjects = 0;

	constructor () {

	}

	drawScene(ctx) {
		reloadScreen (ctx);

		for (var i in this.objectsInWord) {

			let obj = this.objectsInWord[i];

			if (obj instanceof Point) {

				obj.drawPoint(ctx);

			} else if(obj instanceof LineSegment) {

				var segmentArray = obj.points;

				for (var i in segmentArray) {
					segmentArray[i].drawPoint(ctx);
				}

			} else if(obj instanceof Circle)	{

				var circleArray = obj.points
				
				for (var i in circleArray) {
					circleArray[i].drawPoint(ctx);
				}
			}

		}		
	}
}

class LineSegment {
	x0 = 0; y0 = 0;
	x1 = 0; y1 = 0;

	z0 = 0; // нигде не используется,  нужно только для того что бы работала функция создания точки

	points = new Array();

	constructor (x0, y0, x1, y1) {
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;

		this.points = this.returnPoints();
	}
	returnPoints () {	
		var pointArray = new Array();
		
		var x0 = Math.round(this.x0);
		var y0 = Math.round(this.y0);
		var x1 = Math.round(this.x1);
		var y1 = Math.round(this.y1);
		var z0 = Math.round(this.z0);

		var dx = Math.abs(x1-x0);
		var dy = Math.abs(y1-y0);
		var sx = (x0 <= x1) ? 1 : -1; //шаг по x
		var sy = (y0 <= y1) ? 1 : -1; //шаг по y
		var err = dx-dy; 
		pointArray.push(new Point([x0,y0,z0]));

		
		while( !((x0 == x1) && (y0 == y1)) )
		{	
			var e2 = err * 2; 

			if (e2 >= -dy) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0 += sy;
			}

			
			pointArray.push(new Point([x0, y0, z0]));
		}
		return pointArray;	
	}
}
class Circle {
	r = 0;
	x0 = 0;
	y0 = 0;

	z0 = 0; // нигде не используется,  нужно только для того что бы работала функция создания точки

	points = new Array();
	
	constructor (x0,y0,r) {
		this.r = r;
		this.x0 = x0;
		this.y0 = y0;

		this.points = this.returnPoints();
	}

	returnPoints () {

		var pointArray = new Array();
		var f = 1 - this.r; 
		var ddFx = 1; 
		var ddFy = -2 * this.r; 
		var x = 0;
		var y = this.r;

		pointArray.push(new Point([this.x0, this.y0 + this.r, this.z0]));
		pointArray.push(new Point([this.x0, this.y0 - this.r, this.z0]));
		pointArray.push(new Point([this.x0 + this.r, this.y0, this.z0]));
		pointArray.push(new Point([this.x0 - this.r, this.y0, this.z0]));

		while(x < y) {
		 	if(f >= 0) {
				y--;
				ddFy += 2;
				f += ddFy;
			}
			x++;
			ddFx += 2;
			f += ddFx;

			pointArray.push(new Point([this.x0 + x, this.y0 + y, this.z0]));
			pointArray.push(new Point([this.x0 - x, this.y0 + y, this.z0]));
			pointArray.push(new Point([this.x0 + x, this.y0 - y, this.z0]));
			pointArray.push(new Point([this.x0 - x, this.y0 - y, this.z0]));
			pointArray.push(new Point([this.x0 + y, this.y0 + x, this.z0]));
			pointArray.push(new Point([this.x0 - y, this.y0 + x, this.z0]));
			pointArray.push(new Point([this.x0 + y, this.y0 - x, this.z0]));
			pointArray.push(new Point([this.x0 - y, this.y0 - x, this.z0]));

		}

		return pointArray;
	}
}

function degToRad(deg)
{
  return deg * (Math.PI/180);
}


