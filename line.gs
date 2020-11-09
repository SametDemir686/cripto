function intersect(x1, y1, x2, y2, x3, y3, x4, y4){
    var a1, a2, b1, b2, c1, c2;
    var r1, r2 , r3, r4;
    var denom;
    a1 = y2 - y1;
    b1 = x1 - x2;
    c1 = (x2 * y1) - (x1 * y2);

    r3 = ((a1 * x3) + (b1 * y3) + c1);
    r4 = ((a1 * x4) + (b1 * y4) + c1);
    if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)){
        return 0;
    }
    a2 = y4 - y3;
    b2 = x3 - x4;
    c2 = (x4 * y3) - (x3 * y4);
    r1 = (a2 * x1) + (b2 * y1) + c2;
    r2 = (a2 * x2) + (b2 * y2) + c2;
    if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))){
        return 0;
    }
    denom = (a1 * b2) - (a2 * b1);
    if (denom === 0) {
        return 1;
    }
    return 1;
}

function sameSign(a,b){
    return Math.sign(a)===Math.sign(b);
}