function updateOrders() {
    let tokenData = pullDataFrom(tokenUrl).result;
    let url = 'https://test.deribit.com/api/v2/private/get_open_orders_by_currency?currency=BTC&kind=option&type=all';
    let plusOptions = {
        "headers": {
            "Authorization": "Bearer " + tokenData.access_token
        }
    };
    let plusResponse = UrlFetchApp.fetch(url, plusOptions);
    let data = Utilities.jsonParse(plusResponse.getContentText());

    if (data.result.length > 0) {
        writeDataTo(openOrders1TimeInForceCell, data.result[0].time_in_force);
        writeDataTo(openOrders1ReduceOnlyCell, data.result[0].reduce_only);
        writeDataTo(openOrders1ProfitLossCell, data.result[0].profit_loss);
        writeDataTo(openOrders1PriceCell, data.result[0].price);
        writeDataTo(openOrders1PostOnlyCell, data.result[0].post_only);
        writeDataTo(openOrders1OrderTypeCell, data.result[0].order_type);
        writeDataTo(openOrders1OrderStateCell, data.result[0].order_state);
        writeDataTo(openOrders1OrderIdCell, data.result[0].order_id);
        writeDataTo(openOrders1MaxShowCell, data.result[0].max_show);
        writeDataTo(openOrders1LastUpdateTimestampCell, data.result[0].last_update_timestamp);
        writeDataTo(openOrders1LabelCell, data.result[0].label);
        writeDataTo(openOrders1IsLiquidationCell, data.result[0].is_liquidation);
        writeDataTo(openOrders1InstrumentNameCell, data.result[0].instrument_name);
        writeDataTo(openOrders1FilledAmountCell, data.result[0].filled_amount);
        writeDataTo(openOrders1DirectionCell, data.result[0].direction);
        writeDataTo(openOrders1CreationTimestampCell, data.result[0].creation_timestamp);
        writeDataTo(openOrders1CommissionCell, data.result[0].commission);
        writeDataTo(openOrders1AveragePriceCell, data.result[0].average_price);
        writeDataTo(openOrders1ApiCell, data.result[0].api);
        writeDataTo(openOrders1AmountCell, data.result[0].amount);
    }

    if (data.result.length > 1) {
        writeDataTo(openOrders2TimeInForceCell, data.result[1].time_in_force);
        writeDataTo(openOrders2ReduceOnlyCell, data.result[1].reduce_only);
        writeDataTo(openOrders2ProfitLossCell, data.result[1].profit_loss);
        writeDataTo(openOrders2PriceCell, data.result[1].price);
        writeDataTo(openOrders2PostOnlyCell, data.result[1].post_only);
        writeDataTo(openOrders2OrderTypeCell, data.result[1].order_type);
        writeDataTo(openOrders2OrderStateCell, data.result[1].order_state);
        writeDataTo(openOrders2OrderIdCell, data.result[1].order_id);
        writeDataTo(openOrders2MaxShowCell, data.result[1].max_show);
        writeDataTo(openOrders2LastUpdateTimestampCell, data.result[1].last_update_timestamp);
        writeDataTo(openOrders2LabelCell, data.result[1].label);
        writeDataTo(openOrders2IsLiquidationCell, data.result[1].is_liquidation);
        writeDataTo(openOrders2InstrumentNameCell, data.result[1].instrument_name);
        writeDataTo(openOrders2FilledAmountCell, data.result[1].filled_amount);
        writeDataTo(openOrders2DirectionCell, data.result[1].direction);
        writeDataTo(openOrders2CreationTimestampCell, data.result[1].creation_timestamp);
        writeDataTo(openOrders2CommissionCell, data.result[1].commission);
        writeDataTo(openOrders2AveragePriceCell, data.result[1].average_price);
        writeDataTo(openOrders2ApiCell, data.result[1].api);
        writeDataTo(openOrders2AmountCell, data.result[1].amount);
    }

    if (data.result.length > 2) {
        writeDataTo(openOrders3TimeInForceCell, data.result[2].time_in_force);
        writeDataTo(openOrders3ReduceOnlyCell, data.result[2].reduce_only);
        writeDataTo(openOrders3ProfitLossCell, data.result[2].profit_loss);
        writeDataTo(openOrders3PriceCell, data.result[2].price);
        writeDataTo(openOrders3PostOnlyCell, data.result[2].post_only);
        writeDataTo(openOrders3OrderTypeCell, data.result[2].order_type);
        writeDataTo(openOrders3OrderStateCell, data.result[2].order_state);
        writeDataTo(openOrders3OrderIdCell, data.result[2].order_id);
        writeDataTo(openOrders3MaxShowCell, data.result[2].max_show);
        writeDataTo(openOrders3LastUpdateTimestampCell, data.result[2].last_update_timestamp);
        writeDataTo(openOrders3LabelCell, data.result[2].label);
        writeDataTo(openOrders3IsLiquidationCell, data.result[2].is_liquidation);
        writeDataTo(openOrders3InstrumentNameCell, data.result[2].instrument_name);
        writeDataTo(openOrders3FilledAmountCell, data.result[2].filled_amount);
        writeDataTo(openOrders3DirectionCell, data.result[2].direction);
        writeDataTo(openOrders3CreationTimestampCell, data.result[2].creation_timestamp);
        writeDataTo(openOrders3CommissionCell, data.result[2].commission);
        writeDataTo(openOrders3AveragePriceCell, data.result[2].average_price);
        writeDataTo(openOrders3ApiCell, data.result[2].api);
        writeDataTo(openOrders3AmountCell, data.result[2].amount);
    }

    if (data.result.length > 3) {
        writeDataTo(openOrders4TimeInForceCell, data.result[3].time_in_force);
        writeDataTo(openOrders4ReduceOnlyCell, data.result[3].reduce_only);
        writeDataTo(openOrders4ProfitLossCell, data.result[3].profit_loss);
        writeDataTo(openOrders4PriceCell, data.result[3].price);
        writeDataTo(openOrders4PostOnlyCell, data.result[3].post_only);
        writeDataTo(openOrders4OrderTypeCell, data.result[3].order_type);
        writeDataTo(openOrders4OrderStateCell, data.result[3].order_state);
        writeDataTo(openOrders4OrderIdCell, data.result[3].order_id);
        writeDataTo(openOrders4MaxShowCell, data.result[3].max_show);
        writeDataTo(openOrders4LastUpdateTimestampCell, data.result[3].last_update_timestamp);
        writeDataTo(openOrders4LabelCell, data.result[3].label);
        writeDataTo(openOrders4IsLiquidationCell, data.result[3].is_liquidation);
        writeDataTo(openOrders4InstrumentNameCell, data.result[3].instrument_name);
        writeDataTo(openOrders4FilledAmountCell, data.result[3].filled_amount);
        writeDataTo(openOrders4DirectionCell, data.result[3].direction);
        writeDataTo(openOrders4CreationTimestampCell, data.result[3].creation_timestamp);
        writeDataTo(openOrders4CommissionCell, data.result[3].commission);
        writeDataTo(openOrders4AveragePriceCell, data.result[3].average_price);
        writeDataTo(openOrders4ApiCell, data.result[3].api);
        writeDataTo(openOrders4AmountCell, data.result[3].amount);
    }
}

function updatePositions() {
    let tokenData = pullDataFrom(tokenUrl).result;
    let url = 'https://test.deribit.com/api/v2/private/get_positions?currency=BTC&kind=option';
    let plusOptions = {
        "headers": {
            "Authorization": "Bearer " + tokenData.access_token
        }
    };
    let plusResponse = UrlFetchApp.fetch(url, plusOptions);
    let data = Utilities.jsonParse(plusResponse.getContentText());

    if (data.result.length > 0) {
        let index = 0;
        let result = data.result[index];
        writeDataTo(openPositions1AveragePrice, result.average_price);
        writeDataTo(openPositions1Delta, result.delta);
        writeDataTo(openPositions1Direction, result.direction);
        writeDataTo(openPositions1EstimatedLiqPrice, result.estimated_liquidation_price);
        writeDataTo(openPositions1FloatingProfitLoss, result.floating_profit_loss);
        writeDataTo(openPositions1IndexPrice, result.index_price);
        writeDataTo(openPositions1InitialMargin, result.initial_margin);
        writeDataTo(openPositions1InstrumentName, result.instrument_name);
        writeDataTo(openPositions1Kind, result.kind);
        writeDataTo(openPositions1Levegare, result.leverage);
        writeDataTo(openPositions1MaintenanceMargin, result.maintenance_margin);
        writeDataTo(openPositions1MarkPrice, result.mark_price);
        writeDataTo(openPositions1OpenOrdersMargin, result.open_orders_margin);
        writeDataTo(openPositions1RealizedFunding, result.realized_funding);
        writeDataTo(openPositions1RealizedProfitLoss, result.realized_profit_loss);
        writeDataTo(openPositions1SettlementPrice, result.settlement_price);
        writeDataTo(openPositions1Size, result.size);
        writeDataTo(openPositions1SizeCurrency, result.size_currency);
        writeDataTo(openPositions1TotalProfitLoss, result.total_profit_loss);
    }

    if (data.result.length > 1) {
        let index = 1;
        let result = data.result[index];
        writeDataTo(openPositions2AveragePrice, result.average_price);
        writeDataTo(openPositions2Delta, result.delta);
        writeDataTo(openPositions2Direction, result.direction);
        writeDataTo(openPositions2EstimatedLiqPrice, result.estimated_liquidation_price);
        writeDataTo(openPositions2FloatingProfitLoss, result.floating_profit_loss);
        writeDataTo(openPositions2IndexPrice, result.index_price);
        writeDataTo(openPositions2InitialMargin, result.initial_margin);
        writeDataTo(openPositions2InstrumentName, result.instrument_name);
        writeDataTo(openPositions2Kind, result.kind);
        writeDataTo(openPositions2Levegare, result.leverage);
        writeDataTo(openPositions2MaintenanceMargin, result.maintenance_margin);
        writeDataTo(openPositions2MarkPrice, result.mark_price);
        writeDataTo(openPositions2OpenOrdersMargin, result.open_orders_margin);
        writeDataTo(openPositions2RealizedFunding, result.realized_funding);
        writeDataTo(openPositions2RealizedProfitLoss, result.realized_profit_loss);
        writeDataTo(openPositions2SettlementPrice, result.settlement_price);
        writeDataTo(openPositions2Size, result.size);
        writeDataTo(openPositions2SizeCurrency, result.size_currency);
        writeDataTo(openPositions2TotalProfitLoss, result.total_profit_loss);
    }

    if (data.result.length > 2) {
        let index = 2;
        let result = data.result[index];
        writeDataTo(openPositions3AveragePrice, result.average_price);
        writeDataTo(openPositions3Delta, result.delta);
        writeDataTo(openPositions3Direction, result.direction);
        writeDataTo(openPositions3EstimatedLiqPrice, result.estimated_liquidation_price);
        writeDataTo(openPositions3FloatingProfitLoss, result.floating_profit_loss);
        writeDataTo(openPositions3IndexPrice, result.index_price);
        writeDataTo(openPositions3InitialMargin, result.initial_margin);
        writeDataTo(openPositions3InstrumentName, result.instrument_name);
        writeDataTo(openPositions3Kind, result.kind);
        writeDataTo(openPositions3Levegare, result.leverage);
        writeDataTo(openPositions3MaintenanceMargin, result.maintenance_margin);
        writeDataTo(openPositions3MarkPrice, result.mark_price);
        writeDataTo(openPositions3OpenOrdersMargin, result.open_orders_margin);
        writeDataTo(openPositions3RealizedFunding, result.realized_funding);
        writeDataTo(openPositions3RealizedProfitLoss, result.realized_profit_loss);
        writeDataTo(openPositions3SettlementPrice, result.settlement_price);
        writeDataTo(openPositions3Size, result.size);
        writeDataTo(openPositions3SizeCurrency, result.size_currency);
        writeDataTo(openPositions3TotalProfitLoss, result.total_profit_loss);
    }

    if (data.result.length > 3) {
        let index = 3;
        let result = data.result[index];
        writeDataTo(openPositions4AveragePrice, result.average_price);
        writeDataTo(openPositions4Delta, result.delta);
        writeDataTo(openPositions4Direction, result.direction);
        writeDataTo(openPositions4EstimatedLiqPrice, result.estimated_liquidation_price);
        writeDataTo(openPositions4FloatingProfitLoss, result.floating_profit_loss);
        writeDataTo(openPositions4IndexPrice, result.index_price);
        writeDataTo(openPositions4InitialMargin, result.initial_margin);
        writeDataTo(openPositions4InstrumentName, result.instrument_name);
        writeDataTo(openPositions4Kind, result.kind);
        writeDataTo(openPositions4Levegare, result.leverage);
        writeDataTo(openPositions4MaintenanceMargin, result.maintenance_margin);
        writeDataTo(openPositions4MarkPrice, result.mark_price);
        writeDataTo(openPositions4OpenOrdersMargin, result.open_orders_margin);
        writeDataTo(openPositions4RealizedFunding, result.realized_funding);
        writeDataTo(openPositions4RealizedProfitLoss, result.realized_profit_loss);
        writeDataTo(openPositions4SettlementPrice, result.settlement_price);
        writeDataTo(openPositions4Size, result.size);
        writeDataTo(openPositions4SizeCurrency, result.size_currency);
        writeDataTo(openPositions4TotalProfitLoss, result.total_profit_loss);
    }
}

function updateOrdersAndPositions() {
    updateOrders();
    updatePositions();
}