function onEdit(e) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var activeCell = spreadsheet.getActiveCell();
    if (spreadsheet.getActiveSheet().getName() === "Trade") {
        let cellName = activeCell.getA1Notation();

        if (cellName === callStrikeCell) {
            // updateCallStrikes("Trade");
        } else if (cellName === putStrikeCell) {
            // updatePutStrikes("Trade");
        } else if (cellName === instrumentNameRangeCell) {
            updateCallStrikes("Trade");
            updatePutStrikes("Trade");
            updateCallStrikes("Trade2");
            updatePutStrikes("Trade2");
        } else if (cellName === callStrike2Cell) {
            // updateCallStrikes("Trade2");
        } else if (cellName === putStrike2Cell) {
            // updatePutStrikes("Trade2");
        } else if (cellName === instrumentNameRange2Cell) {
            // updateCallStrikes("Trade2");
            // updatePutStrikes("Trade2");
        }
    }
}

function clearRows() {
    clearRow("Trade", selectedCallInstrumentColumn, parseInt(selectedCallInstrumentRow));
    clearRow("Trade", selectedPutInstrumentColumn, parseInt(selectedPutInstrumentRow));
    clearRow("Trade2", selectedCallInstrument2Column, parseInt(selectedCallInstrument2Row));
    clearRow("Trade2", selectedPutInstrument2Column, parseInt(selectedPutInstrument2Row));
}

function writeValues(sheetName, transposed, selectedCallInstrumentColumn, startRow) {
    let endRow = startRow + transposed.length - 1;
    let startCell = selectedCallInstrumentColumn + startRow;
    let endCell = selectedCallInstrumentColumn + endRow;
    var range = SpreadsheetApp.getActiveSheet().getRange(sheetName + "!" + startCell + ":" + endCell);
    range.setValues(transposed);
}

function getFormattedDate(current_datetime) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return (current_datetime.getDate() + 1) + months[current_datetime.getMonth()] + (current_datetime.getFullYear() - 2000);
}

function updateCallStrikes(sheetName) {
    let instrumentNames = getInstrumentNames();
    let callStrikeDate = getDataFrom(sheetName + "!" + callStrikeCell);
    let formatted_date = getFormattedDate(callStrikeDate);
    let entry = pullIndexPriceDeribit();
    let instrumentNameRange = getDataFrom(instrumentNameRangeCell);

    let data = instrumentNames.filter(s => s[0].split('-')[1] === formatted_date
        && s[0].endsWith("-C")
        && parseInt(s[0].split('-')[2]) >= entry - instrumentNameRange
        && parseInt(s[0].split('-')[2]) <= entry + instrumentNameRange
    );

    let lastCell = findLastRow(sheetName + "!", selectedCallInstrumentColumn, selectedCallInstrumentRow);
    writeValues(sheetName, data, selectedCallInstrumentColumn, lastCell + 1);
}

function updatePutStrikes(sheetName) {
    let instrumentNames = getInstrumentNames();
    let putStrikeDate = getDataFrom(sheetName + "!" + putStrikeCell);
    let formatted_date = getFormattedDate(putStrikeDate);
    let entry = pullIndexPriceDeribit();
    let instrumentNameRange = getDataFrom(instrumentNameRangeCell);
    let data = instrumentNames.filter(s => s[0].split('-')[1] === formatted_date
        && s[0].endsWith("-P")
        && parseInt(s[0].split('-')[2]) >= entry - instrumentNameRange
        && parseInt(s[0].split('-')[2]) <= entry + instrumentNameRange
    );

    let lastRow = findLastRow(sheetName + "!", selectedPutInstrumentColumn, selectedPutInstrumentRow);
    writeValues(sheetName, data, selectedPutInstrumentColumn, lastRow + 1);
}

function findLastRow(sheetName, columnName, startIndex) {
    var spr = SpreadsheetApp.getActive().getSheetByName(sheetName.substr(0, sheetName.length - 1));
    var column = spr.getRange(columnName + ':' + columnName);
    var values = column.getValues(); // get all data in one call
    var row = startIndex - 1;
    while (values[row] && values[row][0] !== "") {
        row++;
    }
    return row;
}

function clearRow(sheetName, startColumn, startRow) {
    let sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
    let lastRow = sheet.getLastRow();
    let clear = [];
    if (lastRow <= startRow)
        return;
    for (let i = 2; i <= lastRow; i++) {
        clear.push([""]);
    }
    let startCell = startColumn + startRow;
    SpreadsheetApp.getActiveSheet().getRange(sheetName + "!" + startCell + ":" + startColumn + (clear.length + 1)).setValues(clear);
}