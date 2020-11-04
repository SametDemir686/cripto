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
let callRT_IV;
let putRT_IV;
let expiresIn;
let interestRate;


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

function pnlFuture(exitPrice, totalCapital, leverage) {
    return (exitPrice - entry) * (totalCapital * leverage / entry);
}

function calculateExpiresIn(timeDelay_HourBased) {
    let now = new Date();
    let then = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0);
    let diffSinceMidNight = now.getTime() - then.getTime();

    let noOfMillisecondsInSec = 1000;
    let noOfMillisecondsInMin = noOfMillisecondsInSec * 60;
    let noOfMillisecondsInHour = noOfMillisecondsInMin * 60;
    let noOfMillisecondsInADay = noOfMillisecondsInHour * 24;
    let timeFromMidNightToNextday11am = noOfMillisecondsInADay + 11 * noOfMillisecondsInHour;
    let timeDelayInMilliseconds = timeDelay_HourBased * noOfMillisecondsInHour;
    return (timeFromMidNightToNextday11am - diffSinceMidNight - timeDelayInMilliseconds) / noOfMillisecondsInADay;
}

async function getBestValues() {
    await pullJSON();
    let putStrike = parseInt(document.getElementById("put").value.split("-")[2]);
    let callStrike = parseInt(document.getElementById("call").value.split("-")[2]);
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
    let timeDelay = parseFloat(document.getElementById("timeDelay").value);
    interestRate = 0;
    expiresIn = calculateExpiresIn(timeDelay);

    console.log("expiresIn:", expiresIn);
    console.log("call:", (document.getElementById("call").value));
    console.log("put:", (document.getElementById("put").value));

    let result = {
        moveNo: moveNoStart,
        callNo: callNoStart,
        putNo: putNoStart,
        totalCapital: totalCapitalStart,
        levarage: levarageStart,
        greenMax: 0,
        average: 0,
    };
    let exitSayisi = (exitEnd - exitStart) / exitIncrement + 1;
    let threshold = 0.85;

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
                        if (green / exitSayisi >= threshold) {
                            if (result.greenMax / exitSayisi < threshold || result.average < average) {
                                result = {
                                    moveNo: moveNo,
                                    callNo: callNo,
                                    putNo: putNo,
                                    totalCapital: totalCapital,
                                    levarage: levarage,
                                    greenMax: green,
                                    average: average,
                                    success: "%" + (green / exitSayisi * 100).toFixed(2),
                                    entry: entry,
                                    totalPremium: putAsk * putNo + callAsk * callNo + movePrice * moveNo
                                };
                            }
                        } else if (result.greenMax < green) {
                            result = {
                                moveNo: moveNo,
                                callNo: callNo,
                                putNo: putNo,
                                totalCapital: totalCapital,
                                levarage: levarage,
                                greenMax: green,
                                average: average,
                                success: "%" + (green / exitSayisi * 100).toFixed(2),
                                entry: entry,
                                totalPremium: putAsk * putNo + callAsk * callNo + movePrice * moveNo
                            };
                        }
                    }
                }
            }
        }
    }

    document.getElementById("resultMoveNo").innerHTML = "" + result.moveNo;
    document.getElementById("resultCallNo").innerHTML = "" + result.callNo;
    document.getElementById("resultPutNo").innerHTML = "" + result.putNo;
    document.getElementById("resultTotalCapital").innerHTML = "" + result.totalCapital;
    document.getElementById("resultLevarage").innerHTML = "" + result.levarage;
    document.getElementById("resultGreenMax").innerHTML = "" + result.greenMax;
    document.getElementById("resultAverage").innerHTML = "" + result.average.toFixed(2);
    document.getElementById("resultSuccess").innerHTML = "" + result.success;
    document.getElementById("resultEntry").innerHTML = "" + result.entry.toFixed(2);
    document.getElementById("resultTotalPremium").innerHTML = "" + result.totalPremium.toFixed(0);

    let pnlTotalHtmlElement = document.getElementById("pnlTotal");

    for (let exitPrice = entry + exitStart; exitPrice <= entry + exitEnd; exitPrice += exitIncrement) {
        let calcOptionResult = calculateOption(exitPrice, callStrike, expiresIn, interestRate, callRT_IV);
        let pnlPutResult = pnlPut(exitPrice, result.putNo, putStrike);
        let pnlMoveResult = pnlMove(exitPrice, result.moveNo);
        let pnlFutureResult = pnlFuture(exitPrice, result.totalCapital, result.levarage);
        let pnlCallResult = pnlCall(exitPrice, result.callNo, callStrike);
        let pnlTotal = pnlPutResult + pnlCallResult + pnlMoveResult + pnlFutureResult;
        let pnlCallFuture = -(callAsk - calcOptionResult.callPreFuture) * result.callNo;
        let pnlPutFuture = -(putAsk - calcOptionResult.putPreFuture) * result.putNo;
        let pnlTotalFuture = pnlCallFuture + pnlPutFuture + pnlMoveResult;
        insertToTable(pnlTotalHtmlElement, exitPrice, pnlTotal, pnlTotalFuture, calcOptionResult.callPreFuture, calcOptionResult.putPreFuture);
    }
}

function insertCell(newRow, index, data, colorful = false) {
    let newCell = newRow.insertCell(index);
    if (colorful)
        newCell.style.backgroundColor = data < 0 ? '#F00000' : '#00F000';
    else
        newCell.style.backgroundColor = '#9CE6F6';
    newCell.style.fontSize = "20";
    newCell.style.fontWeight = 'bold';
    newCell.style.textAlign = 'center';
    let newText = document.createTextNode(data);
    newCell.appendChild(newText);
}

function insertToTable(tableRef, exitPrice, pnlTotal, pnlTotalFuture, callPreFuture, putPreFuture) {
    // Insert a row at the end of the table
    let newRow = tableRef.insertRow(-1);

    // Insert a cell in the row at index 0
    insertCell(newRow, 0, exitPrice.toFixed(2));
    insertCell(newRow, 1, pnlTotal.toFixed(0), true);
    insertCell(newRow, 2, pnlTotalFuture.toFixed(0), true);
    insertCell(newRow, 3, callPreFuture.toFixed(2));
    insertCell(newRow, 4, putPreFuture.toFixed(2));
}