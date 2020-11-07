function onEdit(e) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var activeCell = spreadsheet.getActiveCell();
    if (spreadsheet.getActiveSheet().getName() === "Sheet1") {
        let cellName = activeCell.getA1Notation();

        if (cellName === callStrikeCell) {
            let firstEmptyCell = getFirstEmptyCell(selectedCallInstrumentColumn, selectedCallInstrumentRow);
            writeDataTo(firstEmptyCell, e.value)
        } else if (cellName === putStrikeCell) {
            let firstEmptyCell = getFirstEmptyCell(selectedPutInstrumentColumn, selectedPutInstrumentRow);
            writeDataTo(firstEmptyCell, e.value)
        }
    }
}

function getFirstEmptyCell(columnName, startIndex) {
    var spr = SpreadsheetApp.getActiveSpreadsheet();
    var column = spr.getRange(columnName + ':' + columnName);
    var values = column.getValues(); // get all data in one call
    var ct = startIndex - 1;
    while (values[ct] && values[ct][0] !== "") {
        ct++;
    }
    return columnName + (ct + 1);
}