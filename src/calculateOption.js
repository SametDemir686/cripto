function Round6(n) {
    X = n * 1000000;
    X = Math.round(X);
    return X / 1000000;
}

function NormDist(x) {
    var
        d1 = 0.0498673470,
        d2 = 0.0211410061,
        d3 = 0.0032776263,
        d4 = 0.0000380036,
        d5 = 0.0000488906,
        d6 = 0.0000053830;

    var a = Math.abs(x);
    var t = 1.0 + a * (d1 + a * (d2 + a * (d3 + a * (d4 + a * (d5 + a * d6)))));

    t *= t;
    t *= t;
    t *= t;
    t *= t;
    t = 1.0 / (t + t);

    if (x >= 0) t = 1 - t;
    return t;
}

function calculateOption(exitPrice, callStrike, expiresIn, interestRate, callRT_IV) {
    var S = exitPrice;
    var X = callStrike;
    var T = expiresIn / 365;
    var Rf = interestRate / 100;
    var sigma = callRT_IV / 100;

    let d1 = Round6((Math.log(S / X) + (Rf + Math.pow(sigma, 2) / 2) * T) / (sigma * Math.sqrt(T)));
    let d2 = Round6(d1 - (sigma * Math.sqrt(T)));
    let callPreFuture = Round6(exitPrice * NormDist(d1) - callStrike * Math.exp(-(interestRate * expiresIn)) * NormDist(d2));
    let putPreFuture = Round6(callStrike * Math.exp(-(interestRate * expiresIn)) * NormDist(-d2) - exitPrice * NormDist(-d1));

    return {d1: d1, d2: d2, callPreFuture: callPreFuture, putPreFuture: putPreFuture}
}
