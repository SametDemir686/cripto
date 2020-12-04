function onEdit(e) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var activeCell = spreadsheet.getActiveCell();
    if (spreadsheet.getActiveSheet().getName() === "Trade") {
        let cellName = activeCell.getA1Notation();

        if (cellName === callStrikeCell) {
            updateCallStrikes("Trade");
        } else if (cellName === putStrikeCell) {
            updatePutStrikes("Trade");
        } else if (cellName === instrumentNameRangeCell) {
            updateCallStrikes("Trade");
            updatePutStrikes("Trade");
        } else if (cellName === callStrike2Cell) {
            updateCallStrikes("Trade2");
        } else if (cellName === putStrike2Cell) {
            updatePutStrikes("Trade2");
        } else if (cellName === instrumentNameRange2Cell) {
            updateCallStrikes("Trade2");
            updatePutStrikes("Trade2");
        }
    }
}

function writeValues(sheetName, transposed, selectedCallInstrumentColumn, selectedCallInstrumentRow) {
    let x = transposed.length + parseInt(selectedCallInstrumentRow) - 1;
    var range = SpreadsheetApp.getActiveSheet().getRange(sheetName + "!" + selectedCallInstrumentColumn + selectedCallInstrumentRow + ":" + selectedCallInstrumentColumn + (x));
    range.setValues(transposed);
}

function getFormattedDate(current_datetime) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return (current_datetime.getDate() + 1) + months[current_datetime.getMonth()] + (current_datetime.getFullYear() - 2000);
}

function updateCallStrikes(sheetName) {
    clearRow(sheetName, selectedCallInstrumentColumn, selectedCallInstrumentRow);
    let instrumentNames = getInstrumentNames();
    let callStrikeDate = getDataFrom(sheetName + "!" + callStrikeCell);
    let formatted_date = getFormattedDate(callStrikeDate);
    let entry = getDataFrom(resultIndexBtcDeribitCell);
    let instrumentNameRange = getDataFrom(instrumentNameRangeCell);

    let data = instrumentNames.filter(s => s[0].includes(formatted_date)
        && s[0].endsWith("-C")
        && parseInt(s[0].split('-')[2]) >= entry - instrumentNameRange
        && parseInt(s[0].split('-')[2]) <= entry + instrumentNameRange
    );

    writeValues(sheetName, data, selectedCallInstrumentColumn, selectedCallInstrumentRow);
}

function updatePutStrikes(sheetName) {
    clearRow(sheetName, selectedPutInstrumentColumn, selectedPutInstrumentRow);
    let instrumentNames = getInstrumentNames();
    let putStrikeDate = getDataFrom(sheetName + "!" + putStrikeCell);
    let formatted_date = getFormattedDate(putStrikeDate);
    let entry = getDataFrom(resultIndexBtcDeribitCell);
    let instrumentNameRange = getDataFrom(instrumentNameRangeCell);
    let data = instrumentNames.filter(s => s[0].includes(formatted_date)
        && s[0].endsWith("-P")
        && parseInt(s[0].split('-')[2]) >= entry - instrumentNameRange
        && parseInt(s[0].split('-')[2]) <= entry + instrumentNameRange
    );

    writeValues(sheetName, data, selectedPutInstrumentColumn, selectedPutInstrumentRow);
}

function clearRow(sheetName, startColumn, startRow) {
    let sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
    let lastRow = sheet.getLastRow();
    let clear = [];
    if (lastRow <= parseInt(selectedCallInstrumentRow))
        return;
    for (let i = 2; i <= lastRow; i++) {
        clear.push([""]);
    }
    let startCell = startColumn + startRow;
    SpreadsheetApp.getActiveSheet().getRange(sheetName + "!" + startCell + ":" + startColumn + (clear.length + 1)).setValues(clear);
}