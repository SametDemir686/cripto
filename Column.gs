const callStrikeCell = 'E3';
const putStrikeCell = 'F3';
const instrumentNameRangeCell = 'F4';
const tableRowStartIndex = 189;
const tableIndexBtcDeribitColumn = 'A';
const tableExitPriceColumn = 'B';
const tablePnlFutureResultColumn = 'C';
const tablePnlCallResultColumn = 'D';
const tablePnlPutResultColumn = 'E';
const tablePnlMoveResultColumn = 'F';
const tablePnlTotalColumn = 'G';
const tablePnlCallFutureColumn = 'H';
const tablePnlPutFutureColumn = 'I';
const tablePnlTotalFutureColumn = 'J';
const selectedCallInstrumentColumn = 'K';
const selectedCallInstrumentRow = '2';
const selectedPutInstrumentColumn = 'L';
const selectedPutInstrumentRow = '2';
const thresholdCell = 'Trade!$F$17';
const boostCell = 'Trade!$F$19';
const capitalRangeStartCell = 'Trade!$C$2';
const capitalRangeEndCell = 'Trade!$C$3';
const capitalRangeIncrementCell = 'Trade!$C$4';
const exitRangeStartCell = 'Trade!$E$7';
const exitRangeEndCell = 'Trade!$E$8';
const exitRangeIncrementCell = 'Trade!$E$9';
const moveRangeStartCell = 'Trade!$D$2';
const moveRangeEndCell = 'Trade!$D$3';
const moveRangeIncrementCell = 'Trade!$D$4';
const callRangeStartCell = 'Trade!$A$2';
const callRangeEndCell = 'Trade!$A$3';
const callRangeIncrementCell = 'Trade!$A$4';
const putRangeStartCell = 'Trade!$B$2';
const putRangeEndCell = 'Trade!$B$3';
const maxTotalFundsInvestedCell = 'Trade!$F$15';
const putRangeIncrementCell = 'Trade!$B$4';
const timeDelayCell = 'Trade!$E$17';
const balanceCell = 'Trade!$E$15';
const moveInstrumentNameFtxCell = 'Trade!$E$19';
const resultCallInstrumentCell = 'Trade!$A$17';
const resultPutInstrumentCell = 'Trade!$B$17';
const resultCallOptionCell = 'Trade!$A$10';
const resultPutOptionCell = 'Trade!$B$10';
const resultCall_IVCell = 'Trade!$A$13';
const resultPut_IVCell = 'Trade!$B$13';
const resultMoveNoCell = 'Trade!$D$7';
const resultCallNoCell = 'Trade!$A$7';
const resultPutNoCell = 'Trade!$B$7';
const resultCapitalNo = 'Trade!$C$7';
const resultAverageCell = 'Trade!$D$29';
const resultSuccessCell = 'Trade!$F$27';
const resultTotalPremiumCell = 'Trade!$D$16';
const resultMaxReturnPercentageCell = 'Trade!$C$27';
const resultMinReturnPercentageCell = 'Trade!$B$27';
const resultAverageReturnPercentageCell = 'Trade!$D$27';
const resultTotalFundsInvestedCell = 'Trade!$G$27';
const maintenanceMarginCallCell = 'Trade!$E$27';
const maintenanceMarginPutCell = 'Trade!$E$29';
const resultIndexBtcDeribitCell = 'Trade!$D$14';
const resultMovePriceCell = 'Trade!$D$10';
const resultMoveStrikePriceCell = 'Trade!$D$12';
const resultLiqRiskCell = 'Trade!$C$12';
const resultInitialMarginCallCell = 'Trade!$A$15';
const resultInitialMarginPutCell = 'Trade!$B$15';
const statusCell = 'Trade!$C$18';
const resultCallSizeCell = 'Trade!$A$8';
const resultPutSizeCell = 'Trade!$B$8';
const exitRangeStart3Cell = 'Trade!$E$11';
const exitRangeEnd3Cell = 'Trade!$E$12';
const minReturnPercentage3Cell = 'Trade!$B$35';
const maxReturnPercentage3Cell = 'Trade!$C$35';
const averageReturnPercentage3Cell = 'Trade!$D$35';
const maintenanceMarginMaxCall3Cell = 'Trade!$E$35';
const maintenanceMarginMaxPut3Cell = 'Trade!$E$37';
const exitRangeIncrement3Cell = 'Trade!$E$13';
const exitRangeStart2Cell = 'Trade!$F$7';
const exitRangeEnd2Cell = 'Trade!$F$8';
const minReturnPercentage2Cell = 'Trade!$B$31';
const maxReturnPercentage2Cell = 'Trade!$C$31';
const averageReturnPercentage2Cell = 'Trade!$D$31';
const maintenanceMarginMaxCall2Cell = 'Trade!$E$31';
const maintenanceMarginMaxPut2Cell = 'Trade!$E$33';
const exitRangeIncrement2Cell = 'Trade!$F$9';
const openSellCallInstrumentNameCell = 'Trade!$B$52';
const openSellCallAmountCell = 'Trade!$B$53';
const openSellCallTypeCell = 'Trade!$B$54';
const openSellCallLabelCell = 'Trade!$B$55';
const openSellCallPriceCell = 'Trade!$B$56';
const openSellCallTimeInForceCell = 'Trade!$B$57';
const openSellCallMaxShowCell = 'Trade!$B$58';
const openSellCallPostOnlyCell = 'Trade!$B$59';
const openSellCallRejectPostOnlyCell = 'Trade!$B$60';
const openSellCallReduceOnlyCell = 'Trade!$B$61';
const openSellCallStopPriceCell = 'Trade!$B$62';
const openSellCallTriggerCell = 'Trade!$B$63';
const openSellCallAdvancedCell = 'Trade!$B$64';
const openSellCallMmpCell = 'Trade!$B$65';
const openBuyCallInstrumentNameCell = 'Trade!$C$52';
const openBuyCallAmountCell = 'Trade!$C$53';
const openBuyCallTypeCell = 'Trade!$C$54';
const openBuyCallLabelCell = 'Trade!$C$55';
const openBuyCallPriceCell = 'Trade!$C$56';
const openBuyCallTimeInForceCell = 'Trade!$C$57';
const openBuyCallMaxShowCell = 'Trade!$C$58';
const openBuyCallPostOnlyCell = 'Trade!$C$59';
const openBuyCallRejectPostOnlyCell = 'Trade!$C$60';
const openBuyCallReduceOnlyCell = 'Trade!$C$61';
const openBuyCallStopPriceCell = 'Trade!$C$62';
const openBuyCallTriggerCell = 'Trade!$C$63';
const openBuyCallAdvancedCell = 'Trade!$C$64';
const openBuyCallMmpCell = 'Trade!$C$65';
const openSellPutInstrumentNameCell = 'Trade!$D$52';
const openSellPutAmountCell = 'Trade!$D$53';
const openSellPutTypeCell = 'Trade!$D$54';
const openSellPutLabelCell = 'Trade!$D$55';
const openSellPutPriceCell = 'Trade!$D$56';
const openSellPutTimeInForceCell = 'Trade!$D$57';
const openSellPutMaxShowCell = 'Trade!$D$58';
const openSellPutPostOnlyCell = 'Trade!$D$59';
const openSellPutRejectPostOnlyCell = 'Trade!$D$60';
const openSellPutReduceOnlyCell = 'Trade!$D$61';
const openSellPutStopPriceCell = 'Trade!$D$62';
const openSellPutTriggerCell = 'Trade!$D$63';
const openSellPutAdvancedCell = 'Trade!$D$64';
const openSellPutMmpCell = 'Trade!$D$65';
const openBuyPutInstrumentNameCell = 'Trade!$E$52';
const openBuyPutAmountCell = 'Trade!$E$53';
const openBuyPutTypeCell = 'Trade!$E$54';
const openBuyPutLabelCell = 'Trade!$E$55';
const openBuyPutPriceCell = 'Trade!$E$56';
const openBuyPutTimeInForceCell = 'Trade!$E$57';
const openBuyPutMaxShowCell = 'Trade!$E$58';
const openBuyPutPostOnlyCell = 'Trade!$E$59';
const openBuyPutRejectPostOnlyCell = 'Trade!$E$60';
const openBuyPutReduceOnlyCell = 'Trade!$E$61';
const openBuyPutStopPriceCell = 'Trade!$E$62';
const openBuyPutTriggerCell = 'Trade!$E$63';
const openBuyPutAdvancedCell = 'Trade!$E$64';
const openBuyPutMmpCell = 'Trade!$E$65';
const closeSellCallInstrumentNameCell = 'Trade!$G$52';
const closeSellCallAmountCell = 'Trade!$G$53';
const closeSellCallTypeCell = 'Trade!$G$54';
const closeSellCallLabelCell = 'Trade!$G$55';
const closeSellCallPriceCell = 'Trade!$G$56';
const closeSellCallTimeInForceCell = 'Trade!$G$57';
const closeSellCallMaxShowCell = 'Trade!$G$58';
const closeSellCallPostOnlyCell = 'Trade!$G$59';
const closeSellCallRejectPostOnlyCell = 'Trade!$G$60';
const closeSellCallReduceOnlyCell = 'Trade!$G$61';
const closeSellCallStopPriceCell = 'Trade!$G$62';
const closeSellCallTriggerCell = 'Trade!$G$63';
const closeSellCallAdvancedCell = 'Trade!$G$64';
const closeSellCallMmpCell = 'Trade!$G$65';
const closeBuyCallInstrumentNameCell = 'Trade!$H$52';
const closeBuyCallAmountCell = 'Trade!$H$53';
const closeBuyCallTypeCell = 'Trade!$H$54';
const closeBuyCallLabelCell = 'Trade!$H$55';
const closeBuyCallPriceCell = 'Trade!$H$56';
const closeBuyCallTimeInForceCell = 'Trade!$H$57';
const closeBuyCallMaxShowCell = 'Trade!$H$58';
const closeBuyCallPostOnlyCell = 'Trade!$H$59';
const closeBuyCallRejectPostOnlyCell = 'Trade!$H$60';
const closeBuyCallReduceOnlyCell = 'Trade!$H$61';
const closeBuyCallStopPriceCell = 'Trade!$H$62';
const closeBuyCallTriggerCell = 'Trade!$H$63';
const closeBuyCallAdvancedCell = 'Trade!$H$64';
const closeBuyCallMmpCell = 'Trade!$H$65';
const closeSellPutInstrumentNameCell = 'Trade!$I$52';
const closeSellPutAmountCell = 'Trade!$I$53';
const closeSellPutTypeCell = 'Trade!$I$54';
const closeSellPutLabelCell = 'Trade!$I$55';
const closeSellPutPriceCell = 'Trade!$I$56';
const closeSellPutTimeInForceCell = 'Trade!$I$57';
const closeSellPutMaxShowCell = 'Trade!$I$58';
const closeSellPutPostOnlyCell = 'Trade!$I$59';
const closeSellPutRejectPostOnlyCell = 'Trade!$I$60';
const closeSellPutReduceOnlyCell = 'Trade!$I$61';
const closeSellPutStopPriceCell = 'Trade!$I$62';
const closeSellPutTriggerCell = 'Trade!$I$63';
const closeSellPutAdvancedCell = 'Trade!$I$64';
const closeSellPutMmpCell = 'Trade!$I$65';
const closeBuyPutInstrumentNameCell = 'Trade!$J$52';
const closeBuyPutAmountCell = 'Trade!$J$53';
const closeBuyPutTypeCell = 'Trade!$J$54';
const closeBuyPutLabelCell = 'Trade!$J$55';
const closeBuyPutPriceCell = 'Trade!$J$56';
const closeBuyPutTimeInForceCell = 'Trade!$J$57';
const closeBuyPutMaxShowCell = 'Trade!$J$58';
const closeBuyPutPostOnlyCell = 'Trade!$J$59';
const closeBuyPutRejectPostOnlyCell = 'Trade!$J$60';
const closeBuyPutReduceOnlyCell = 'Trade!$J$61';
const closeBuyPutStopPriceCell = 'Trade!$J$62';
const closeBuyPutTriggerCell = 'Trade!$J$63';
const closeBuyPutAdvancedCell = 'Trade!$J$64';
const closeBuyPutMmpCell = 'Trade!$J$65';
const openOrders1TimeInForceCell = 'Trade!$G$69';
const openOrders1ReduceOnlyCell = 'Trade!$G$70';
const openOrders1ProfitLossCell = 'Trade!$G$71';
const openOrders1PriceCell = 'Trade!$G$72';
const openOrders1PostOnlyCell = 'Trade!$G$73';
const openOrders1OrderTypeCell = 'Trade!$G$74';
const openOrders1OrderStateCell = 'Trade!$G$75';
const openOrders1OrderIdCell = 'Trade!$G$76';
const openOrders1MaxShowCell = 'Trade!$G$77';
const openOrders1LastUpdateTimestampCell = 'Trade!$G$78';
const openOrders1LabelCell = 'Trade!$G$79';
const openOrders1IsLiquidationCell = 'Trade!$G$80';
const openOrders1InstrumentNameCell = 'Trade!$G$81';
const openOrders1FilledAmountCell = 'Trade!$G$82';
const openOrders1DirectionCell = 'Trade!$G$83';
const openOrders1CreationTimestampCell = 'Trade!$G$84';
const openOrders1CommissionCell = 'Trade!$G$85';
const openOrders1AveragePriceCell = 'Trade!$G$86';
const openOrders1ApiCell = 'Trade!$G$87';
const openOrders1AmountCell = 'Trade!$G$88';
const openOrders2TimeInForceCell = 'Trade!$H$69';
const openOrders2ReduceOnlyCell = 'Trade!$H$70';
const openOrders2ProfitLossCell = 'Trade!$H$71';
const openOrders2PriceCell = 'Trade!$G$72';
const openOrders2PostOnlyCell = 'Trade!$H$73';
const openOrders2OrderTypeCell = 'Trade!$H$74';
const openOrders2OrderStateCell = 'Trade!$H$75';
const openOrders2OrderIdCell = 'Trade!$H$76';
const openOrders2MaxShowCell = 'Trade!$H$77';
const openOrders2LastUpdateTimestampCell = 'Trade!$H$78';
const openOrders2LabelCell = 'Trade!$H$79';
const openOrders2IsLiquidationCell = 'Trade!$H$80';
const openOrders2InstrumentNameCell = 'Trade!$H$81';
const openOrders2FilledAmountCell = 'Trade!$H$82';
const openOrders2DirectionCell = 'Trade!$H$83';
const openOrders2CreationTimestampCell = 'Trade!$H$84';
const openOrders2CommissionCell = 'Trade!$H$85';
const openOrders2AveragePriceCell = 'Trade!$H$86';
const openOrders2ApiCell = 'Trade!$H$87';
const openOrders2AmountCell = 'Trade!$H$88';
const openOrders3TimeInForceCell = 'Trade!$I$69';
const openOrders3ReduceOnlyCell = 'Trade!$I$70';
const openOrders3ProfitLossCell = 'Trade!$I$71';
const openOrders3PriceCell = 'Trade!$I$72';
const openOrders3PostOnlyCell = 'Trade!$I$73';
const openOrders3OrderTypeCell = 'Trade!$I$74';
const openOrders3OrderStateCell = 'Trade!$I$75';
const openOrders3OrderIdCell = 'Trade!$I$76';
const openOrders3MaxShowCell = 'Trade!$I$77';
const openOrders3LastUpdateTimestampCell = 'Trade!$I$78';
const openOrders3LabelCell = 'Trade!$I$79';
const openOrders3IsLiquidationCell = 'Trade!$I$80';
const openOrders3InstrumentNameCell = 'Trade!$I$81';
const openOrders3FilledAmountCell = 'Trade!$I$82';
const openOrders3DirectionCell = 'Trade!$I$83';
const openOrders3CreationTimestampCell = 'Trade!$I$84';
const openOrders3CommissionCell = 'Trade!$I$85';
const openOrders3AveragePriceCell = 'Trade!$I$86';
const openOrders3ApiCell = 'Trade!$I$87';
const openOrders3AmountCell = 'Trade!$I$88';
const openOrders4TimeInForceCell = 'Trade!$J$69';
const openOrders4ReduceOnlyCell = 'Trade!$J$70';
const openOrders4ProfitLossCell = 'Trade!$J$71';
const openOrders4PriceCell = 'Trade!$J$72';
const openOrders4PostOnlyCell = 'Trade!$J$73';
const openOrders4OrderTypeCell = 'Trade!$J$74';
const openOrders4OrderStateCell = 'Trade!$J$75';
const openOrders4OrderIdCell = 'Trade!$J$76';
const openOrders4MaxShowCell = 'Trade!$J$77';
const openOrders4LastUpdateTimestampCell = 'Trade!$J$78';
const openOrders4LabelCell = 'Trade!$J$79';
const openOrders4IsLiquidationCell = 'Trade!$J$80';
const openOrders4InstrumentNameCell = 'Trade!$J$81';
const openOrders4FilledAmountCell = 'Trade!$J$82';
const openOrders4DirectionCell = 'Trade!$J$83';
const openOrders4CreationTimestampCell = 'Trade!$J$84';
const openOrders4CommissionCell = 'Trade!$J$85';
const openOrders4AveragePriceCell = 'Trade!$J$86';
const openOrders4ApiCell = 'Trade!$J$87';
const openOrders4AmountCell = 'Trade!$J$88';
const openPositions1AveragePrice = 'Trade!$B$69';
const openPositions1Delta = 'Trade!$B$70';
const openPositions1Direction = 'Trade!$B$71';
const openPositions1EstimatedLiqPrice = 'Trade!$B$72';
const openPositions1FloatingProfitLoss = 'Trade!$B$73';
const openPositions1IndexPrice = 'Trade!$B$74';
const openPositions1InitialMargin = 'Trade!$B$75';
const openPositions1InstrumentName = 'Trade!$B$76';
const openPositions1Kind = 'Trade!$B$77';
const openPositions1Levegare = 'Trade!$B$78';
const openPositions1MaintenanceMargin = 'Trade!$B$79';
const openPositions1MarkPrice = 'Trade!$B$80';
const openPositions1OpenOrdersMargin = 'Trade!$B$81';
const openPositions1RealizedFunding = 'Trade!$B$82';
const openPositions1RealizedProfitLoss = 'Trade!$B$83';
const openPositions1SettlementPrice = 'Trade!$B$84';
const openPositions1Size = 'Trade!$B$85';
const openPositions1SizeCurrency = 'Trade!$B$86';
const openPositions1TotalProfitLoss = 'Trade!$B$87';
const openPositions2AveragePrice = 'Trade!$C$69';
const openPositions2Delta = 'Trade!$C$70';
const openPositions2Direction = 'Trade!$C$71';
const openPositions2EstimatedLiqPrice = 'Trade!$C$72';
const openPositions2FloatingProfitLoss = 'Trade!$C$73';
const openPositions2IndexPrice = 'Trade!$C$74';
const openPositions2InitialMargin = 'Trade!$C$75';
const openPositions2InstrumentName = 'Trade!$C$76';
const openPositions2Kind = 'Trade!$C$77';
const openPositions2Levegare = 'Trade!$C$78';
const openPositions2MaintenanceMargin = 'Trade!$C$79';
const openPositions2MarkPrice = 'Trade!$C$80';
const openPositions2OpenOrdersMargin = 'Trade!$C$81';
const openPositions2RealizedFunding = 'Trade!$C$82';
const openPositions2RealizedProfitLoss = 'Trade!$C$83';
const openPositions2SettlementPrice = 'Trade!$C$84';
const openPositions2Size = 'Trade!$C$85';
const openPositions2SizeCurrency = 'Trade!$C$86';
const openPositions2TotalProfitLoss = 'Trade!$C$87';
const openPositions3AveragePrice = 'Trade!$D$69';
const openPositions3Delta = 'Trade!$D$70';
const openPositions3Direction = 'Trade!$D$71';
const openPositions3EstimatedLiqPrice = 'Trade!$D$72';
const openPositions3FloatingProfitLoss = 'Trade!$D$73';
const openPositions3IndexPrice = 'Trade!$D$74';
const openPositions3InitialMargin = 'Trade!$D$75';
const openPositions3InstrumentName = 'Trade!$D$76';
const openPositions3Kind = 'Trade!$D$77';
const openPositions3Levegare = 'Trade!$D$78';
const openPositions3MaintenanceMargin = 'Trade!$D$79';
const openPositions3MarkPrice = 'Trade!$D$80';
const openPositions3OpenOrdersMargin = 'Trade!$D$81';
const openPositions3RealizedFunding = 'Trade!$D$82';
const openPositions3RealizedProfitLoss = 'Trade!$D$83';
const openPositions3SettlementPrice = 'Trade!$D$84';
const openPositions3Size = 'Trade!$D$85';
const openPositions3SizeCurrency = 'Trade!$D$86';
const openPositions3TotalProfitLoss = 'Trade!$D$87';
const openPositions4AveragePrice = 'Trade!$E$69';
const openPositions4Delta = 'Trade!$E$70';
const openPositions4Direction = 'Trade!$E$71';
const openPositions4EstimatedLiqPrice = 'Trade!$E$72';
const openPositions4FloatingProfitLoss = 'Trade!$E$73';
const openPositions4IndexPrice = 'Trade!$E$74';
const openPositions4InitialMargin = 'Trade!$E$75';
const openPositions4InstrumentName = 'Trade!$E$76';
const openPositions4Kind = 'Trade!$E$77';
const openPositions4Levegare = 'Trade!$E$78';
const openPositions4MaintenanceMargin = 'Trade!$E$79';
const openPositions4MarkPrice = 'Trade!$E$80';
const openPositions4OpenOrdersMargin = 'Trade!$E$81';
const openPositions4RealizedFunding = 'Trade!$E$82';
const openPositions4RealizedProfitLoss = 'Trade!$E$83';
const openPositions4SettlementPrice = 'Trade!$E$84';
const openPositions4Size = 'Trade!$E$85';
const openPositions4SizeCurrency = 'Trade!$E$86';
const openPositions4TotalProfitLoss = 'Trade!$E$87';