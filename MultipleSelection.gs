function onEdit(e) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var activeCell = spreadsheet.getActiveCell();
    if (spreadsheet.getActiveSheet().getName() === "Trade") {
        let cellName = activeCell.getA1Notation();

        if (cellName === callStrikeCell) {
            updateCallStrikes();
        } else if (cellName === putStrikeCell) {
            updatePutStrikes();
        } else if (cellName === instrumentNameRangeCell) {
            updateCallStrikes();
            updatePutStrikes();
        } else if (cellName === 'H1') {
            writeDataTo("H2", "heeyy");
        }
    }
}

function writeValues(transposed, selectedCallInstrumentColumn, selectedCallInstrumentRow) {
    let x = transposed.length + parseInt(selectedCallInstrumentRow) - 1;
    var range = SpreadsheetApp.getActiveSheet().getRange(selectedCallInstrumentColumn + selectedCallInstrumentRow + ":" + selectedCallInstrumentColumn + (x));
    range.setValues(transposed);
}

function getFormattedDate(current_datetime) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return (current_datetime.getDate() + 1) + months[current_datetime.getMonth()] + (current_datetime.getFullYear() - 2000);
}

function updateCallStrikes() {
    clearRow(selectedCallInstrumentColumn, selectedCallInstrumentRow);
    let instrumentNames = getInstrumentNames();
    let callStrikeDate = getDataFrom(callStrikeCell);
    let formatted_date = getFormattedDate(callStrikeDate);
    let entry = getDataFrom(resultIndexBtcDeribitCell);
    let instrumentNameRange = getDataFrom(instrumentNameRangeCell);

    let data = instrumentNames.filter(s => s[0].includes(formatted_date)
        && s[0].endsWith("-C")
        && parseInt(s[0].split('-')[2]) >= entry - instrumentNameRange
        && parseInt(s[0].split('-')[2]) <= entry + instrumentNameRange
    );

    writeValues(data, selectedCallInstrumentColumn, selectedCallInstrumentRow);
}

function updatePutStrikes() {
    clearRow(selectedPutInstrumentColumn, selectedPutInstrumentRow);
    let instrumentNames = getInstrumentNames();
    let putStrikeDate = getDataFrom(putStrikeCell);
    let formatted_date = getFormattedDate(putStrikeDate);
    let entry = getDataFrom(resultIndexBtcDeribitCell);
    let instrumentNameRange = getDataFrom(instrumentNameRangeCell);
    let data = instrumentNames.filter(s => s[0].includes(formatted_date)
        && s[0].endsWith("-P")
        && parseInt(s[0].split('-')[2]) >= entry - instrumentNameRange
        && parseInt(s[0].split('-')[2]) <= entry + instrumentNameRange
    );

    writeValues(data, selectedPutInstrumentColumn, selectedPutInstrumentRow);
}

function clearRow(startColumn, startRow) {
    let sheet = SpreadsheetApp.getActive().getSheetByName('Trade')
    let lastRow = sheet.getLastRow();
    let clear = [];
    if (lastRow <= parseInt(selectedCallInstrumentRow))
        return;
    for (let i = 2; i <= lastRow; i++) {
        clear.push([""]);
    }
    let startCell = startColumn + startRow;
    SpreadsheetApp.getActiveSheet().getRange("Trade!" + startCell + ":" + startColumn + (clear.length + 1)).setValues(clear);
}