function clear() {
    let sheet = SpreadsheetApp.getActive().getSheetByName('Instruments')
    let lastRow = sheet.getLastRow();
    let clear = [];
    for (let i = 2; i <= lastRow; i++) {
        clear.push([""]);
    }
    SpreadsheetApp.getActiveSheet().getRange("Instruments!A2:A" + (clear.length + 1)).setValues(clear);
}

function write(instrumentNames) {
    let instrumentNamesArray = [instrumentNames];
    let transposed = instrumentNamesArray[0].map((_, colIndex) => instrumentNamesArray.map(row => row[colIndex]));

    var range = SpreadsheetApp.getActiveSheet().getRange("Instruments!A2:A" + (transposed.length + 1));
    range.setValues(transposed);
}

function pullInstrumentsDeribit() {
    clear();
    let instrumentNames = pullInstrumentNames();
    write(instrumentNames);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    let moveInstrumentNameFtx = "BTC-MOVE-" + mm + dd;
    writeDataTo(moveInstrumentNameFtxCell, moveInstrumentNameFtx);
}

function pullInstrumentNames() {
    var url = "https://test.deribit.com/api/v2/public/get_instruments?currency=BTC&expired=false&kind=option";
    let data = pullDataFrom(url);
    return data.result.map(s => s['instrument_name']);
}

function getInstrumentNames() {
    let sheet = SpreadsheetApp.getActive().getSheetByName('Instruments')
    let lastRow = sheet.getLastRow();
    return SpreadsheetApp.getActiveSheet().getRange("Instruments!A2:A" + lastRow).getValues();
}