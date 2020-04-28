function kline(start, num) {
    var message;
    $.ajax({
        url: "../usdtpc/subdisc/SubDiscKlineNew",
        data: {
            "sys_currency_id": "5a75a78d-8825-11e8-9c87-507b9d9c3062",
            "sys_minute_id": "1",
            "num": num,
            "start": start
        },
        method: "POST",
        async: false,
        success: function (data) {
            if (data.code == 100) {
                message = data;
            }
        },
        error: function (err) {

        }
    })
    return message;
}