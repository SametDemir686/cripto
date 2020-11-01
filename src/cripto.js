let totalCapitalStart;
let totalCapitalEnd;
let totalCapitalIncrement;
let levarageStart;
let levarageEnd;
let levarageIncrement;
let putNoStart;
let putNoEnd;
let putNoIncrement;
let callNoStart;
let callNoEnd;
let callNoIncrement;
let moveNoStart;
let moveNoEnd;
let moveNoIncrement;
let exitStart;
let exitEnd;
let exitIncrement;
let indexBtc;
let callAsk;
let callAskPosSize;
let putAsk;
let putAskPosSize;
let moveStrikePrice;
let movePrice;
let entry;

function pnlPut(exitPrice, putNo, putStrike) {
    if (exitPrice - putStrike >= 0) {
        return -putAsk * putNo;
    } else {
        return putStrike * putNo - exitPrice * putNo - putAsk * putNo;
    }
}

function pnlCall(exitPrice, callNo, callStrike) {
    if (exitPrice - callStrike >= 0) {
        return exitPrice * callNo - callStrike * callNo - callAsk * callNo;
    } else {
        return -callAsk * callNo;
    }
}

function pnlMove(exitPrice, moveNo) {
    return moveNo * (movePrice - Math.abs(moveStrikePrice - exitPrice));
}

function pnlFuture(exitPrice, totalCapital, levarage) {
    return (exitPrice - entry) * (totalCapital * levarage / entry);
}

async function getBestValues() {
    await pullJSON();
    console.log("Hesaplama başladı");
    let putStrike = parseInt(document.getElementById("put").value.substr(11, 5));
    let callStrike = parseInt(document.getElementById("call").value.substr(11, 5));
    let totalCapitalStart = parseFloat(document.getElementById("totalCapitalStart").value);
    let totalCapitalEnd = parseFloat(document.getElementById("totalCapitalEnd").value);
    let totalCapitalIncrement = parseFloat(document.getElementById("totalCapitalIncrement").value);
    let levarageStart = parseFloat(document.getElementById("levarageStart").value);
    let levarageEnd = parseFloat(document.getElementById("levarageEnd").value);
    let levarageIncrement = parseFloat(document.getElementById("levarageIncrement").value);
    let putNoStart = parseFloat(document.getElementById("putNoStart").value);
    let putNoEnd = parseFloat(document.getElementById("putNoEnd").value);
    let putNoIncrement = parseFloat(document.getElementById("putNoIncrement").value);
    let callNoStart = parseFloat(document.getElementById("callNoStart").value);
    let callNoEnd = parseFloat(document.getElementById("callNoEnd").value);
    let callNoIncrement = parseFloat(document.getElementById("callNoIncrement").value);
    let moveNoStart = parseFloat(document.getElementById("moveNoStart").value);
    let moveNoEnd = parseFloat(document.getElementById("moveNoEnd").value);
    let moveNoIncrement = parseFloat(document.getElementById("moveNoIncrement").value);
    let exitStart = parseFloat(document.getElementById("exitStart").value);
    let exitEnd = parseFloat(document.getElementById("exitEnd").value);
    let exitIncrement = parseFloat(document.getElementById("exitIncrement").value);
    let result = {
        moveNo: moveNoStart,
        callNo: callNoStart,
        putNo: putNoStart,
        totalCapital: totalCapitalStart,
        levarage: levarageStart,
        greenMax: 0
    };
    let exitSayisi = (exitEnd + exitStart) / exitIncrement + 1;

    for (let moveNo = moveNoStart; moveNo <= moveNoEnd; moveNo += moveNoIncrement) {
        for (let callNo = callNoStart; callNo <= callNoEnd; callNo += callNoIncrement) {
            for (let putNo = putNoStart; putNo <= putNoEnd; putNo += putNoIncrement) {
                for (let totalCapital = totalCapitalStart; totalCapital <= totalCapitalEnd; totalCapital += totalCapitalIncrement) {
                    for (let levarage = levarageStart; levarage <= levarageEnd; levarage += levarageIncrement) {
                        let green = 0;
                        let average = 0;
                        for (let exitPrice = entry + exitStart; exitPrice <= entry + exitEnd; exitPrice += exitIncrement) {
                            let pnlTotal = pnlPut(exitPrice, putNo, putStrike) + pnlCall(exitPrice, callNo, callStrike) + pnlMove(exitPrice, moveNo) + pnlFuture(exitPrice, totalCapital, levarage);
                            if (pnlTotal > 0) {
                                green++;
                                average += pnlTotal / exitSayisi;
                            }
                        }
                        if (result.greenMax < green) {
                            result = {
                                moveNo: moveNo,
                                callNo: callNo,
                                putNo: putNo,
                                totalCapital: totalCapital,
                                levarage: levarage,
                                greenMax: green,
                                average: average,
                                success: "%" + green / exitSayisi * 100,
                                entry: entry,
                                totalPremium: putAsk * putNo + callAsk * callNo + movePrice * moveNo
                            };
                            console.log(result);
                            document.getElementById("resultMoveNo").innerHTML = "" + result.moveNo;
                            document.getElementById("resultCallNo").innerHTML = "" + result.callNo;
                            document.getElementById("resultPutNo").innerHTML = "" + result.putNo;
                            document.getElementById("resultTotalCapital").innerHTML = "" + result.totalCapital;
                            document.getElementById("resultLevarage").innerHTML = "" + result.levarage;
                            document.getElementById("resultGreenMax").innerHTML = "" + result.greenMax;
                            document.getElementById("resultAverage").innerHTML = "" + result.average;
                            document.getElementById("resultSuccess").innerHTML = "" + result.success;
                            document.getElementById("resultEntry").innerHTML = "" + result.entry;
                            document.getElementById("resultTotalPremium").innerHTML = "" + result.totalPremium;
                        }
                    }
                }
            }
        }
    }

    console.log("Hesaplama bitti");
    console.log(result);

    for (let exitPrice = entry + exitStart; exitPrice <= entry + exitEnd; exitPrice += exitIncrement) {
        let pnlTotal = pnlPut(exitPrice, result.putNo, putStrike) + pnlCall(exitPrice, result.callNo, callStrike) + pnlMove(exitPrice, result.moveNo) + pnlFuture(exitPrice, result.totalCapital, result.levarage);
        console.log(exitPrice + ":", {
            pnlPut: pnlPut(exitPrice, result.putNo, putStrike),
            pnlCall: pnlCall(exitPrice, result.callNo, callStrike),
            pnlMove: pnlMove(exitPrice, result.moveNo),
            pnlFuture: pnlFuture(exitPrice, result.totalCapital, result.levarage),
            pnlTotal: pnlTotal
        });
    }
}