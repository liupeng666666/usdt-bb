function FeedBase() {
}

FeedBase.prototype.onReady = function (callback) {
    callback(this._configuration)
}

FeedBase.prototype.getSendSymbolName = function (symbolName) {
    var name = symbolName.split('/')
    return (name[0] + name[1]).toLocaleLowerCase()
}

FeedBase.prototype.resolveSymbol = function (symbolName, onResolve, onError) {
    onResolve({
        "name": symbolName,
        "timezone": "Asia/Shanghai",
        "pricescale": 100,
        "minmov": 1,
        "minmov2": 0,
        "ticker": symbolName,
        "description": "",
        "session": "24x7",
        "type": "bitcoin",
        "volume_precision": 10,
        "has_intraday": true,
        "intraday_multipliers": ['5', '15', '30'],
        "has_weekly_and_monthly": false,
        "has_no_volume": false,
        "regular_session": "24x7"
    })
}
var start = 0;
var num = 300;
var state = false;
FeedBase.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onResult, onError, firstDataRequest) {
    if (state == false) {
        state = true;
        var data = Kline(start, num);
        state = false;
        start = num;
        num = num + 300;
        var meta = {
            noData: true
        };
//	data=JSON.parse(data);
        var bars = [];

        if (typeof (data) != 'undefined' && data.code == 100) {

            if (data.kline.length != 0) {
                for (var i = data.kline.length - 1; i >= 0; i--) {
                    var message = JSON.parse(data.kline[i]);
                    var date = message.createtime.replace(/-/g, '/');
                    var timestamp = new Date(date).getTime();
                    bars.push({
                        time: timestamp,
                        close: message.close,
                        open: message.open,
                        high: message.high,
                        low: message.low,
                        volume: message.volume
                    })

                }
            } else {
                state = true;
            }
        } else {
            meta = {
                noData: true
            };
            state = true;
        }
        console.log(bars);
        onResult(bars, meta);
    } else {
        var meta = {
            noData: true
        };
        var bars = [];
        onResult(bars, meta);
    }

}

FeedBase.prototype.subscribeBars = function (symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) {

    var data = Kline(0, 0);
    if (typeof (data) != 'undefined' && data.code == 100) {
        var message = JSON.parse(data.kline[0]);
        console.log(message);
        onTick({
            time: message.createtime,
            close: message.close,
            open: message.open,
            high: message.high,
            low: message.low,
            volume: message.volume
        })
    }

}

FeedBase.prototype.unsubscribeBars = function (listenerGuid) {
    // 取消订阅产品的callback
}