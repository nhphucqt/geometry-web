const geo = {
    eps: 1e-6,
    lessThan: function lessThan(a, b) {
        return a + this.eps < b;
    },
    moreThan: function moreThan(a, b) {
        return this.lessThan(b, a);
    },
    equal: function equal(a, b) {
        return Math.abs(a-b) < this.eps;
    },
    lessOrEqual: function lessOrEqual(a, b) {
        return a < b + this.eps;
    },
    moreOrEqual: function moreOrEqual(a, b) {
        return this.lessOrEqual(b, a);
    },
    sqr: function sqr(x) {
        return x * x;
    },
    fixed: function fixed(x) {
        return this.lessOrEqual(x, 1e12) ? x.toFixed(6) : parseFloat(x.toFixed(6)).toExponential();
    },
    Point: class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        toArray() {
            return [this.x, this.y];
        }
        toString() {
            return `(${this.x},${this.y})`;
        }
        len() {
            return Math.sqrt(geo.sqr(this.x) + geo.sqr(this.y));
        }
        sub(p) {
            return new Point(this.x - p.x, this.y - p.y);
        }
        crossProd(p) {
            return this.x * p.y - this.y * p.x;
        }
        dist(p) {
            return Math.sqrt(geo.sqr(this.x-p.x) + geo.sqr(this.y-p.y));
        }
    },
    Polyline: class Polyline {
        constructor(points) { // points: [[x1,y1],[x2,y2],...]
            this.points = points.map(e => new geo.Point(e[0],e[1]));
        }
        toArray() {
            return this.points.map(point => point.toArray());
        }
    },
    Polygon: class Polygon { 
        constructor(points) { // points: [[x1,y1],[x2,y2],...]
            this.points = points.map(e => new geo.Point(e[0],e[1]));
        }
        toArray() {
            return this.points.map(point => point.toArray());
        }
    },
    CW: function CW(a, b, c) { // Clockwise
        return this.lessThan(b.sub(a).crossProd(c.sub(b)), 0);
    },
    CCW: function CCW(a, b, c) { // Counter Clockwise
        return this.moreThan(b.sub(a).crossProd(c.sub(b)), 0);
    },
    toPolygon: function toPolygon(points) { // points: [[x1,y1],[x2,y2]]
        // bottom left (points[0]) -> top right (points[1])
        points = [
            [points[0][0], points[0][1]],
            [points[1][0], points[0][1]],
            [points[1][0], points[1][1]],
            [points[0][0], points[1][1]]
        ];
        return points;
    },
    GrahamScan: function GrahamScan(points) { // points: [[x1,y1],[x2,y2],...]
        if (points.length == 0) return points;
        points = points.map(x => new this.Point(x[0],x[1]));
        let pivot = points[0];
        points.forEach(point => {
            if (this.moreThan(pivot.y, point.y)) 
                pivot = point;
            else if (this.equal(pivot.y, point.y) 
                    && this.moreThan(pivot.x, point.x))
                pivot = point;
        });
        points.sort((a,b) => {
            let tmpA = a.sub(pivot),
                tmpB = b.sub(pivot);
            let tmp = tmpA.crossProd(tmpB);
            return !this.equal(tmp, 0) ? tmp : tmpA.len() - tmpB.len();
        });
        return points.map(point => point.toArray());
    },
    ConvexHull: function ConvexHull(points) { // points: [[x1,y1],[x2,y2],...]
        if (points.length < 2) return points;
        points = points.map(x => new this.Point(x[0],x[1]));
        points.sort((a,b) => {
            return !this.equal(a.x,b.x) ? a.x - b.x : a.y - b.y;
        });
        let p1 = points[0], p2 = points.at(-1);
        let up = [p1], down = [p1];
        for (let i = 1, len = points.length; i < len; ++i) {
            if (i+1==len || this.CW(p1, points[i], p2)) {
                while (up.length > 1 && !this.CW(up[up.length-2], up[up.length-1], points[i])) {
                    up.pop();
                }
                up.push(points[i]);
            }
            if (i+1==len || this.CCW(p1, points[i], p2)) {
                while (down.length > 1 && !this.CCW(down[down.length-2],down[down.length-1], points[i])) {
                    down.pop();
                }
                down.push(points[i]);
            }
        }
        up.pop(); up.reverse(); up.pop();
        // console.log(down.concat(up));
        return down.concat(up).map(point => point.toArray());
    },
    Farthest: function Farthest(points) { // points: [[x1,y1],[x2,y2],...]
        points = this.ConvexHull(points);
        points = points.map(x => new this.Point(x[0],x[1]));
        let maxDist = -1;
        let pairPoint = [];
        for (let i = 0, len = points.length, j = 0; i < len; ++i) {
            while (j+1 < len && this.lessOrEqual(points[i].dist(points[j]), points[i].dist(points[j+1]))) {
                j++;
            }
            if (this.lessThan(maxDist, points[i].dist(points[j]))) {
                maxDist = points[i].dist(points[j]);
                pairPoint = [points[i], points[j]];
            }
        }
        console.log(`Farthest pair of points: ${pairPoint[0].toString()} ${pairPoint[1].toString()} (${this.fixed(pairPoint[0].dist(pairPoint[1]))})`);
        return pairPoint.map(point => point.toArray());
    },
    Area: function Area(polygon) { // polygon: [[x1,y1],[x2,y2],...]
        if (polygon.length == 0) return 0;
        polygon = new this.Polygon(polygon);
        let area = polygon.points.at(-1).crossProd(polygon.points[0]);
        for(let i = 0, len = polygon.points.length; i+1 < len; ++i) {
            area += polygon.points[i].crossProd(polygon.points[i+1])
        }
        area = Math.abs(area/2);
        return this.fixed(area);
    }
};