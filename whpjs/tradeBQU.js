var pid;
var djs_Interval;
var datetime = 0;
var currency_buy = new Array();
var currency_sell = new Array();
var currency_order = new Array();
var minuteid;
var money = 1;
var left_money = 0;
var right_money = 0;
var left_poundage = 0;
var right_poundage = 0;
var currency_right_pid;
var currency_name;

function Persion(un, bfb, number, volume) {
    this.un = un;
    this.bfb = bfb;
    this.number = number;
    this.volume = volume;
}

$(function () {
    pid = GetRequest()["pid"];
    currency_news();
})

function currency_news() {
    $.ajax({
        url: "../../usdtbb/auth/getBbCurrencyNews",
        method: "post",
        data: {
            "pid": pid
        },
        success: function (data) {
            if (data.code == 100) {
                var currency = data.currency;
                if (data.status == true) {
                    $("#currency_img").attr("src", currency.img);
                    $("#currency_money").html(currency.money);
                    if (currency.bfb < 0) {
                        $(".value").addClass("extract");
                    } else {
                        $(".value").removeClass("extract");
                    }
                    $("#currency_bfb").html(parseInt(currency.bfb * 10000) / 100 + "%");
                    $("#currency_volume").html(currency.volume + "" + currency.left_name);
                    $("#currency_pid").html(currency.name);
                    $("#currency_cny").html("≈ ¥" + currency.money * data.money * data.cny);
                    $(".right_currency").html(currency.right_name);
                    $(".left_currency").html(currency.left_name);
                    currency_name = currency.name;
                    money = currency.money;
                    left_poundage = currency.left_poundage;
                    right_poundage = currency.right_poundage;
                    currency_right_pid = currency.currency_right;
                    open_zs();
                } else {

                    if (data.date != null && data.date != '' && data.date > 0) {
                        datetime = data.date;
                        djs_Interval = setInterval(function () {
                            if (datetime <= 0) {

                            } else {
                                datetime = datetime - 1000;

                                djs_datetime(datetime);
                            }

                        }, 1000);

                    }
                    $("#djs_datetime").html(data.datetime);
                    $(".countDownBox").show();
                    $(".shade").show();
                }
            } else {

            }
        },
        error: function (err) {

        }
    })
}

function open_zs() {
    top_left();
    minute();
    sell();
    order();
    currency_money();
    user_sell();
    planuser();
    user_sell_h();
    websocket();

}

function minute() {

    $.ajax({
        url: "../../usdtbb/auth/getBbMinuteSelect",
        method: "post",
        success: function (data) {
            var str = "";
            var minute_minute;
            if (data.code == 100) {

                for (var i in data.minute) {
                    var minute = data.minute[i];
                    if (i == 0) {
                        minuteid = minute.pid;
                        minute_minute = minute.minute;
                        str += "<i class=\"activeTime\">" + minute.name + "</i>";
                    } else {
                        str += "<i>" + minute.name + "</i>";
                    }
                }
                $(".rTime").html(str);
                if (minute_minute < 5) {
                    minute_minute = 5;
                }

                TradingEchart(currency_name, data.minute, minute_minute);
            }

        },
        error: function (err) {

        }
    })
}

function sell() {
    $.ajax({
        url: "../../usdtbb/auth/getSellRedis",
        method: "post",
        data: {
            pid: pid
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.buy) {
                    var buy = data.buy[i];
                    buy = JSON.parse(buy);
                    currency_buy.push(new Persion(buy.univalent, ((10000 - parseInt(buy.volume / buy.number * 10000)) / 100), buy.number, buy.volume));
                }
                for (var i in data.sell) {
                    var sell = data.sell[i];
                    sell = JSON.parse(sell);
                    currency_sell.push(new Persion(sell.univalent, ((10000 - parseInt(sell.volume / sell.number * 10000)) / 100), sell.number, sell.volume));
                }
            }
            xunhuan_buy();
            xunhuan_sell();
        },
        error: function (err) {

        }
    })
}

function xunhuan_buy() {

    currency_buy.sort(function (a, b) {
        return b.bfb - a.bfb;
    });
    var buy_size = 20;
    if (currency_buy.length < 20) {
        buy_size = currency_buy.length;
    }
    var buy_str = "";
    for (var i = 0; i < buy_size; i++) {
        buy_str += "<ul class=\"clearFloat\" onclick='fz_money(\"" + currency_buy[i].un + "\")'>";
        buy_str += "<li class=\"pkContent-1\">";
        buy_str += "<span>买" + (i + 1) + " " + currency_buy[i].un + "</span>";
        buy_str += "</li>";
        buy_str += "<li class=\"pkContent-2\">";
        buy_str += "<i>" + currency_buy[i].number + "</i>";
        buy_str += "</li>";
        buy_str += "<li class=\"pkContent-3\">";
        buy_str += "<span>" + currency_buy[i].volume + "</span>";
        buy_str += "</li>";
        buy_str += "<li class=\"pkContent-4\" style='width:" + currency_buy[i].bfb + "%'></li>";
        buy_str += "</ul>";
    }
    $("#currency_buy").html(buy_str);
}

function xunhuan_sell() {

    currency_sell.sort(function (a, b) {
        return b.bfb - a.bfb;
    });
    var sell_size = 20;
    if (currency_sell.length < 20) {
        sell_size = currency_sell.length;
    }
    var sell_str = "";
    for (var i = 0; i < sell_size; i++) {
        sell_str += "<ul class=\"clearFloat\" onclick='fz_money(\"" + currency_sell[i].un + "\")'>";
        sell_str += "<li class=\"pkContent-1\">";
        sell_str += "<span>卖" + (i + 1) + " " + currency_sell[i].un + "</span>";
        sell_str += "</li>";
        sell_str += "<li class=\"pkContent-2\">";
        sell_str += "<i>" + currency_sell[i].number + "</i>";
        sell_str += "</li>";
        sell_str += "<li class=\"pkContent-3\">";
        sell_str += "<span>" + currency_sell[i].volume + "</span>";
        sell_str += "</li>";
        sell_str += "<li class=\"pkContent-4\" style='width:" + currency_sell[i].bfb + "%'></li>";
        sell_str += "</ul>";
    }
    $("#currency_sell").html(sell_str);
}

function order() {

    $.ajax({
        url: "../../usdtbb/auth/getOrderSelect",
        method: "post",
        data: {
            pid: pid
        },
        success: function (data) {

            if (data.code == 100) {
                currency_order = data.order;
                order_message();
            }

        },
        error: function (err) {

        }
    })
}

function order_message() {
    var str = "";
    for (var i in currency_order) {
        var order = currency_order[i];
        if (i < 20) {
            str += "<ul class=\"clearFloat\">";
            str += "<li class=\"cjContent-1\">" + order.time + "</li>";
            str += "<li class=\"cjContent-2\">" + order.univalent + "</li>";
            str += "<li class=\"cjContent-3\">" + order.number + "</li>";
            str += "<li class=\"cjContent-4\">" + (order.univalent * order.number) + "</li>";
            str += "</ul>";
        } else {
            break;
        }

    }
    $(".cjContent").html(str);

}

function Kline(start, num) {

    var message;
    $.ajax({
        url: "../../usdtbb/auth/getKlineSelect",
        method: "post",
        data: {
            pid: pid,
            minuteid: minuteid,
            start: start,
            num: num
        },
        async: false,
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                message = data;
                h_kline(data);
            }

        },
        error: function (err) {

        }
    })
    return message;
}

function currency_money() {
    $.ajax({
        url: "../../usdtbb/BbCurrencyNews/BbCurrencyNewsMoney",
        method: "post",
        data: {
            pid: pid,
            userid: "1234567"
        },
        success: function (data) {
            if (data.code == 100) {
                left_money = data.currency.left_surplus;
                right_money = data.currency.right_surplus;
                $("#right_money").html(data.currency.right_surplus);
                $("#left_money").html(data.currency.left_surplus);
                $("#right_left_money").html(parseInt(data.currency.right_surplus / money * 1000000) / 1000000);
                $("#left_right_money").html(parseInt(data.currency.right_surplus * money * 1000000) / 1000000);
                $("#right_sell_money").html(data.currency.right_surplus);
                $("#right_left_sell_money").html(parseInt(data.currency.right_surplus / money * 1000000) / 1000000);
                $("#left_sell_money").html(data.currency.left_surplus);
                $("#left_right_sell_money").html(parseInt(data.currency.right_surplus * money * 1000000) / 1000000);
            }

        },
        error: function (err) {

        }
    })
}

function user_sell() {
    $.ajax({
        url: "../../usdtbb/BbSell/BbSellSelect",
        method: "post",
        data: {
            currency_news_id: pid,
            userid: "1234567",
            state: 0
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.sell) {
                    var sell = data.sell[i];
                    if (sell.type == 0) {
                        str += "<ul class=\"rcontent bqurcontent rcontentState-1 clearFloat\">";
                    } else {
                        str += "<ul class=\"rcontent bqurcontent rcontentState-2 clearFloat\">";
                    }

                    str += "<li class=\"bqurcontent-1\">" + sell.date;
                    str += "<br />" + sell.time + "</li>";
                    str += "<li class=\"bqurcontent-2 sepceilBQ\">";
                    if (sell.type == 0) {
                        str += "<i class=\"bqurcontentState state-1\">买</i>" + sell.number + " /" + sell.volume + "</li>";
                    } else {
                        str += "<i class=\"bqurcontentState state-2\">卖</i>" + sell.number + " /" + sell.volume + "</li>";
                    }

                    str += "<li class=\"bqurcontent-3 sepceilBQ\">";
                    if (sell.state == 0 || sell.state == 3) {
                        str += "<i>" + sell.univalent + "/--</i>";
                    } else {
                        str += "<i>" + sell.univalent + "/" + sell.univalent + "</i>";
                    }

                    str += " </li>";
                    var num = sell.univalent * sell.volume;
                    if (num == 0) {
                        str += "<li class=\"bqurcontent-2\">--</li>";
                    } else {
                        str += "<li class=\"bqurcontent-2\">" + num + "</li>";
                    }

                    str += "<li class=\"bqurcontent-8\">币币交易</li>";
                    if (sell.state == 0) {
                        str += "<li class=\"bqurcontent-8\">待成交</li>";
                    } else if (sell.state == 1) {
                        str += "<li class=\"bqurcontent-8\">部分成交</li>";
                    } else if (sell.state == 2) {
                        str += "<li class=\"bqurcontent-8\">已完成</li>";
                    } else if (sell.state == 3) {
                        str += "<li class=\"bqurcontent-8\">已取消</li>";
                    }
                    if (sell.style == 0) {
                        str += "<li class=\"bqurcontent-8\">网页</li>";
                    } else {
                        str += "<li class=\"bqurcontent-8\">APP</li>";
                    }

                    str += "<li class=\"bqurcontent-8\">";
                    if (sell.state == 0 || sell.state == 1) {
                        str += "<i class=\"bqurcontentCancle\" onclick='sell_update(\"" + sell.pid + "\")'>取消</i>";
                    } else {
                        str += "<i class=\"bqurcontentCancle\"></i>";
                    }

                    str += " </li>";
                    str += "</ul>";
                }
                $("#user_sell").html(str);
            }

        },
        error: function (err) {

        }
    })
}

function fz_money(un) {
    $(".money_un").val(un);
}

$(".progressBoxLeft span").click(function () {
    console.log($(this).attr("data"));
    var z_num = $(this).attr("data");
    var class_name;
    $(this).parent().children("span").each(function () {
        var num = $(this).attr("data");
        if (num == 1) {
            class_name = $(this).attr("class");
        }
        if (num <= z_num) {
            $(this).addClass(class_name);
        } else {
            $(this).removeClass(class_name);
        }
    })

    $(this).parent().parent().children(".right").html((z_num - 1) * 25 + "%");

    var left_right = $(this).parent().parent().parent().children("ul").children("li").children(".buyVal").attr("id");
    console.log(left_right);
    var danjia = $(this).parent().parent().parent().children(".lfBottomLInput").children("span").children(".money_un").val();
    if (danjia == null || danjia == "") {
        danjia = money;
    }
    if (left_right == "right_left_money") {
        var m = parseInt(right_money / danjia * 100000 / (6 - z_num)) / 1000000;
        $(this).parent().parent().parent().children(".lfBottomLInput").children("span").children(".input_cr").val(m);
        $(this).parent().parent().parent().children(".lfBottomLsxf").children("i").html(parseInt(m * left_poundage * 100000000) / 100000000);
        $(this).parent().parent().parent().children(".smallTips").children("#left_yj").html(parseInt(m * danjia * 100000000) / 100000000);
    } else if (left_right == "left_right_money") {
        var m = parseInt(left_money * danjia * 100000 / (6 - z_num)) / 1000000;
        $(this).parent().parent().parent().children(".lfBottomLInput").children("span").children(".input_cr").val(m);
        $(this).parent().parent().parent().children(".lfBottomLsxf").children("i").html(parseInt(m * right_poundage * 100000000) / 100000000);
        $(this).parent().parent().parent().children(".smallTips").children("#right_yj").html(parseInt(m * danjia * 100000000) / 100000000);
    } else if (left_right == "right_left_sell_money") {
        var m = parseInt(right_money / (6 - z_num) * 1000000) / 1000000;
        console.log(m);
        $("#right_sell_number").val(m);
    } else {
        var m = parseInt(left_money / (6 - z_num) * 1000000) / 1000000;
        $("#left_sell_number").val(m);
    }
})

function mairu(th, state) {
    var value = $(th).val();
    if (state == 0) {
        $("#left_sxf").html(value * left_poundage);
    } else {
        $("#right_sxf").html(value * right_poundage);
    }
}

function add(type) {
    var un = 0;
    var number = 0;
    if (type == 0) {
        un = $("#left_un").val();
        if (un == null) {
            alert("请输入单价");
            return false;
        }
        if (un <= 0) {
            alert("单价不能为负数");
            return false;
        }
        number = $("#left_number").val();
        if (number == null || number == 0) {
            alert("请输入购买量");
            return false;
        }
        if (number <= 0) {
            alert("请输入正确数量");
            return false;
        }
    } else {
        un = $("#right_un").val();
        if (un == null) {
            alert("请输入单价");
            return false;
        }
        if (un <= 0) {
            alert("单价不能为负数");
            return false;
        }
        number = $("#right_number").val();
        if (number == null || number == 0) {
            alert("请输入出售量");
            return false;
        }
        if (number <= 0) {
            alert("请输入正确数量");
            return false;
        }
    }
    $.ajax({
        url: "../../usdtbb/BbSell/BbSellInsert",
        method: "post",
        data: {
            currencyid: pid,
            number: number,
            univalent: un,
            userid: 1234567,
            type: type
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                currency_money();
                user_sell();
            }

        },
        error: function (err) {

        }
    })
}

function websocket() {
    if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");

        // 打开一个 web socket
        var ws = new WebSocket("ws://localhost:8095/BbSocket/ID=" + pid);

        ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            //ws.send("发送数据");
            console.log("数据发送中...");
        };

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log(JSON.parse(received_msg).code);
            if (JSON.parse(received_msg).code == 201) {

                socket_message(JSON.parse(received_msg));
            } else if (JSON.parse(received_msg).code == 202) {
                currency_order.unshift(JSON.parse(received_msg));
                order_message();
            }
            console.log("数据已接收...");
        };

        ws.onclose = function () {
            // 关闭 websocket
            console.log("连接已关闭...");
        };
    } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
    }
}

function socket_message(data) {
    console.log(data);
    if (data.pid == pid) {
        if (data.type == 0) {
            console.log("===");
            var list = new Array();
            var num = 0;
            for (var i in currency_buy) {
                if (currency_buy[i].un == data.money) {
                    list.push(new Persion(data.money, ((10000 - parseInt(data.volume / data.number * 10000)) / 100), data.number, data.volume));
                    num += 1;
                } else {
                    list.push(currency_buy[i]);
                }
            }
            if (num == 0) {
                list.push(new Persion(data.money, ((10000 - parseInt(data.volume / data.number * 10000)) / 100), data.number, data.volume));
            }
            currency_buy = list;

            xunhuan_buy();
        } else {
            var list = new Array();
            var num = 0;
            for (var i in currency_sell) {
                if (currency_sell[i].un == data.money) {
                    list.push(new Persion(data.money, ((10000 - parseInt(data.volume / data.number * 10000)) / 100), data.number, data.volume));
                    num += 1;
                } else {
                    list.push(currency_sell[i]);
                }
            }
            if (num == 0) {
                list.push(new Persion(data.money, ((10000 - parseInt(data.volume / data.number * 10000)) / 100), data.number, data.volume));
            }
            currency_sell = list;
            xunhuan_sell();
        }
    }

}

function jianting(state, th, type) {

    if (state == 0) {
        var number = $("#right_sell_number").val();
        var max_un = $("#right_sell_max_un").val();
        var max_sell = $("#right_sell_max_sell").val();
        var min_un = $("#right_sell_min_un").val();
        var min_sell = $("#right_sell_min_sell").val();
        if (type == 0) {
            if (number > 0) {
                var nm = $(th).val();
                if (nm) {
                    $("#right_sell_money_yj_max").html(max_un * number);
                } else {
                    $("#right_sell_money_yj_max").html(nm * number);
                }
            }

        } else if (type == 1) {
            if (number > 0) {
                var nm = $(th).val();
                $("#right_sell_money_yj_max").html(nm * number);

            }
        } else if (type == 2) {
            if (number > 0) {
                var nm = $(th).val();
                if (min_un < nm) {
                    $("#right_sell_money_yj_min").html(min_un * number);
                } else {
                    $("#right_sell_money_yj_min").html(nm * number);
                }
            }

        } else if (type == 3) {
            if (number > 0) {
                var nm = $(th).val();
                $("#right_sell_money_yj_min").html(um * number);

            }
        } else if (type == 4) {
            var nm = $(th).val();
            if (max_un != null && max_un != '' && typeof (max_un) != "undefined") {
                $("#right_sell_money_yj_max").html(max_un * nm);
            } else if (max_sell != null && max_sell != '' && typeof (max_sell) != "undefined") {

                $("#right_sell_money_yj_max").html(max_sell * nm);
            } else {
                $("#right_sell_money_yj_max").html(nm);
            }

            if (min_un != null && min_un != '' && typeof (min_un) != "undefined") {
                $("#right_sell_money_yj_min").html(min_un * nm);
            } else if (min_sell != null && min_sell != '' && typeof (min_sell) != "undefined") {

                $("#right_sell_money_yj_min").html(min_sell * nm);
            } else {
                $("#right_sell_money_yj_min").html(nm);
            }
            $("#right_sell_sxf").html(nm * right_poundage);
        }
    } else {
        var number = $("#left_sell_number").val();
        var max_un = $("#left_sell_max_un").val();
        var max_sell = $("#left_sell_max_sell").val();
        var min_un = $("#left_sell_min_un").val();
        var min_sell = $("#left_sell_min_sell").val();
        if (type == 0) {
            if (number > 0) {
                var nm = $(th).val();
                console.log(nm + "==" + number);
                if (max_un > nm) {
                    $("#left_sell_money_yj_max").html(max_un * number);
                } else {
                    $("#left_sell_money_yj_max").html(nm * number);
                }
            }

        } else if (type == 1) {
            if (number > 0) {
                var nm = $(th).val();
                $("#left_sell_money_yj_max").html(nm * number);

            }
        } else if (type == 2) {
            if (number > 0) {
                var nm = $(th).val();
                if (min_un < nm) {
                    $("#left_sell_money_yj_min").html(min_un * number);
                } else {
                    $("#left_sell_money_yj_min").html(nm * number);
                }
            }

        } else if (type == 3) {
            if (number > 0) {
                var nm = $(th).val();
                $("#left_sell_money_yj_min").html(nm * number);

            }
        } else if (type == 4) {
            var nm = $(th).val();
            if (max_un != null && max_un != '' && typeof (max_un) != "undefined") {
                $("#left_sell_money_yj_max").val(max_un * nm);
            } else if (max_sell != null && max_sell != '' && typeof (max_sell) != "undefined") {

                $("#left_sell_money_yj_max").html(max_sell * nm);
            } else {
                $("#left_sell_money_yj_max").html(nm);
            }

            if (min_un != null && min_un != '' && typeof (min_un) != "undefined") {
                $("#left_sell_money_yj_min").html(min_un * nm);
            } else if (min_sell != null && min_sell != '' && typeof (min_sell) != "undefined") {

                $("#left_sell_money_yj_min").html(min_sell * nm);
            } else {
                $("#left_sell_money_yj_min").html(nm);
            }
            $("#left_sell_sxf").html(nm * left_poundage);
        }

    }
}

function addPlan(type) {
    var min_un = 0;
    var min_sell = 0;
    var max_un = 0;
    var max_sell = 0;
    var number = 0;
    if (type == 0) {
        number = $("#right_sell_number").val();
        max_un = $("#right_sell_max_un").val();
        max_sell = $("#right_sell_max_sell").val();
        min_un = $("#right_sell_min_un").val();
        min_sell = $("#right_sell_min_sell").val();

        if (number == null || number == 0) {
            alert("请输入委托金额");
            return false;
        }
        if (number <= 0) {
            alert("请输入正确数量");
            return false;
        }
        if (max_sell == null) {
            alert("请输入最高触发价");
            return false;
        }
        if (max_sell <= 0) {
            alert("最高触发价不能为负数");
            return false;
        }
        if (max_un == null) {
            alert("请输入最高委托价");
            return false;
        }
        if (max_un <= 0) {
            alert("最高委托价不能为负数");
            return false;
        }
        if (min_sell == null) {
            alert("请输入最低触发价");
            return false;
        }
        if (min_sell <= 0) {
            alert("最低触发价不能为负数");
            return false;
        }
        if (min_un == null) {
            alert("请输入最低委托价");
            return false;
        }
        if (min_un <= 0) {
            alert("最低委托价不能为负数");
            return false;
        }
        if (max_sell > max_un) {
            alert("最高触发价不能高于最高委托价");
            return false;
        }
        if (min_sell > min_un) {
            alert("最低触发价不能低于最低委托价");
            return false;
        }
    } else {
        number = $("#left_sell_number").val();
        max_un = $("#left_sell_max_un").val();
        max_sell = $("#left_sell_max_sell").val();
        min_un = $("#left_sell_min_un").val();
        min_sell = $("#left_sell_min_sell").val();

        if (number == null || number == 0) {
            alert("请输入委托数量");
            return false;
        }
        if (number <= 0) {
            alert("请输入正确数量");
            return false;
        }
        if (max_sell == null) {
            alert("请输入止盈触发价");
            return false;
        }
        if (max_sell <= 0) {
            alert("止盈触发价不能为负数");
            return false;
        }
        if (max_un == null) {
            alert("请输入止盈委托价");
            return false;
        }
        if (max_un <= 0) {
            alert("止盈委托价不能为负数");
            return false;
        }
        if (min_sell == null) {
            alert("请输入止损触发价");
            return false;
        }
        if (min_sell <= 0) {
            alert("止损触发价不能为负数");
            return false;
        }
        if (min_un == null) {
            alert("请输入止损委托价");
            return false;
        }
        if (min_un <= 0) {
            alert("止损委托价不能为负数");
            return false;
        }
        if (max_sell > max_un) {
            alert("止盈触发价不能高于止盈委托价");
            return false;
        }
        if (min_sell > min_un) {
            alert("止损触发价不能低于止损委托价");
            return false;
        }
    }
    $.ajax({
        url: "../../usdtbb/BbPlan/BbPlanInsert",
        method: "post",
        data: {
            currencyid: pid,
            number: number,
            max_un: max_un,
            max_sell: max_sell,
            min_un: min_un,
            min_sell: min_sell,
            userid: 1234567,
            type: type
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                currency_money();
                planuser();
            }

        },
        error: function (err) {

        }
    })
}

/*
 * 计划委托记录查询
 * */

function planuser() {
    $.ajax({
        url: "../../usdtbb/BbPlan/BbPlanSelect",
        method: "post",
        data: {
            currency_news_id: pid,
            userid: 1234567,
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.plan) {
                    var plan = data.plan[i];
                    if (plan.type == 0) {
                        str += "<ul class=\"rcontent bqurcontent rcontentState-1 clearFloat\">";
                    } else {
                        str += "<ul class=\"rcontent bqurcontent rcontentState-2 clearFloat\">";
                    }

                    str += " <li class=\"bqurcontent-1\">" + plan.date;
                    str += "<br />+" + plan.time + "</li>";
                    str += " <li class=\"bqurcontent-2\">";
                    if (plan.type == 0) {
                        str += "<i class=\"bqurcontentState state-1\">买</i>" + plan.number + " /" + plan.volume + "</li>";
                    } else {
                        str += "<i class=\"bqurcontentState state-1\">卖</i>" + plan.number + " /" + plan.volume + "</li>";
                    }

                    str += " <li class=\"bqurcontent-3 sepceilBQ\">";
                    str += " 追高触发价：" + plan.max_sell;
                    str += "<br> 追底触发价：" + plan.min_sell;
                    str += "</li>";
                    str += "<li class=\"bqurcontent-3 sepceilBQ\">";
                    str += "追高委托价：" + plan.max_un;
                    str += "<br> 追底委托价：" + plan.min_sell;
                    str += "</li>";
                    str += " <li class=\"bqurcontent-8\">" + plan.trigger_money + "</li>";
                    if (plan.trigger == 0) {

                        if (sell.state == 3) {
                            str += "<li class=\"bqurcontent-8\">已取消</li>";
                        } else {
                            str += "<li class=\"bqurcontent-8\">等待委托</li>";
                        }
                    } else {
                        if (plan.state == 0) {
                            str += "<li class=\"bqurcontent-8\">待成交</li>";
                        } else if (plan.state == 1) {
                            str += "<li class=\"bqurcontent-8\">部分成交</li>";
                        } else if (plan.state == 2) {
                            str += "<li class=\"bqurcontent-8\">已完成</li>";
                        } else if (plan.state == 3) {
                            str += "<li class=\"bqurcontent-8\">已取消</li>";
                        }
                    }

                    if (plan.style == 0) {
                        str += "<li class=\"bqurcontent-8\">网页</li>";
                    } else {
                        str += "<li class=\"bqurcontent-8\">APP</li>";
                    }

                    str += "<li class=\"bqurcontent-8\">";
                    if (plan.state == 0 || plan.state == 1) {
                        str += "<i class=\"bqurcontentCancle\" onclick='plan_update(\"" + plan.pid + "\")'>取消</i>";
                    } else {
                        str += "<i class=\"bqurcontentCancle\"></i>";
                    }

                    str += " </li>";
                    str += " </ul>";

                }
                $("#plan_html").html(str);
            }

        },
        error: function (err) {

        }
    })
}

function user_sell_h() {
    $.ajax({
        url: "../../usdtbb/BbSell/BbSellSelect",
        method: "post",
        data: {
            currency_news_id: pid,
            userid: "1234567"
        },

        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.sell) {
                    var sell = data.sell[i];
                    if (sell.type == 0) {
                        str += "<ul class=\"rcontent bqurcontent rcontentState-1 clearFloat\">";
                    } else {
                        str += "<ul class=\"rcontent bqurcontent rcontentState-2 clearFloat\">";
                    }

                    str += "<li class=\"bqurcontent-1\">" + sell.date;
                    str += "<br />" + sell.time + "</li>";
                    str += "<li class=\"bqurcontent-2 sepceilBQ\">";
                    if (sell.type == 0) {
                        str += "<i class=\"bqurcontentState state-1\">买</i>" + sell.number + " /" + sell.volume + "</li>";
                    } else {
                        str += "<i class=\"bqurcontentState state-2\">卖</i>" + sell.number + " /" + sell.volume + "</li>";
                    }

                    str += "<li class=\"bqurcontent-3 sepceilBQ\">";
                    if (sell.state == 0 || sell.state == 3) {
                        str += "<i>" + sell.univalent + "/--</i>";
                    } else {
                        str += "<i>" + sell.univalent + "/" + sell.univalent + "</i>";
                    }

                    str += " </li>";
                    var num = sell.univalent * sell.volume;
                    if (num == 0) {
                        str += "<li class=\"bqurcontent-7\">--</li>";
                    } else {
                        str += "<li class=\"bqurcontent-7\">" + num + "</li>";
                    }

                    str += "<li class=\"bqurcontent-4\">币币交易</li>";
                    if (sell.state == 0) {
                        str += "<li class=\"bqurcontent-4\">待成交</li>";
                    } else if (sell.state == 1) {
                        str += "<li class=\"bqurcontent-4\">部分成交</li>";
                    } else if (sell.state == 2) {
                        str += "<li class=\"bqurcontent-4\">已完成</li>";
                    } else if (sell.state == 3) {
                        str += "<li class=\"bqurcontent-4\">已取消</li>";
                    }
                    if (sell.style == 0) {
                        str += "<li class=\"bqurcontent-7\">网页</li>";
                    } else {
                        str += "<li class=\"bqurcontent-7\">APP</li>";
                    }
                    str += "</ul>";
                }
                $("#h_sell_html").html(str);
            }

        },
        error: function (err) {

        }
    })
}

function sell_update(sell_pid) {
    $.ajax({
        url: "../../usdtbb/BbSell/BbSellUpdate",
        method: "post",
        data: {
            pid: sell_pid,
            userid: "1234567"
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                currency_money();
                user_sell();
            }

        },
        error: function (err) {

        }
    })
}

function sell_update_S(url, state) {
    $.ajax({
        url: url,
        method: "post",
        data: {
            currency_news_id: pid,
            userid: "1234567"
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                currency_money();
                if (state == 0) {
                    user_sell();
                } else {
                    planuser();
                }
                $("#myModal").modal("hide");
            }

        },
        error: function (err) {

        }
    })
}

function chexiao() {
    var cl = $(".rbTitleLeft").children(".rbActiveTitle").attr("class");
    if (cl.indexOf("rbActiveone") > -1) {
        $("#modal_body").html("确定取消全部限价委托？");
        $("#myModal").modal("show");
    } else if (cl.indexOf("rbActivetow") > -1) {
        $("#modal_body").html("	确定取消全部计划委托？");
        $("#myModal").modal("show");

    }
}

function qd_update() {
    var cl = $(".rbTitleLeft").children(".rbActiveTitle").attr("class");
    var url = "";
    if (cl.indexOf("rbActiveone") > -1) {
        sell_update_S("../../usdtbb/BbSell/BbSellUpdateS");
    } else if (cl.indexOf("rbActivetow") > -1) {

        sell_update_S("../../usdtbb/BbPlan/BbPlanUpdateS");
    }
}

function plan_update(plan_pid) {
    $.ajax({
        url: "../../usdtbb/BbPlan/BbPlanUpdate",
        method: "post",
        data: {
            pid: plan_pid,
            userid: "1234567"
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                currency_money();
                planuser();
            }

        },
        error: function (err) {

        }
    })
}

function top_left() {
    $.ajax({
        url: "../../usdtbb/BbCurrencyNews/getBbCurrencyNewsSelect",
        method: "post",
        success: function (data) {
            var str = "<li onclick='top_left_bottom(\"\",\"\",\"\")'>自选</li>";
            if (data.code == 100) {

                for (var i in data.bbCurrencyNews) {
                    var currency = data.bbCurrencyNews[i];
                    var name = currency.name.split("/")[0];
                    if (currency_right_pid == currency.currency_left) {
                        str += "<li  class=\"activeChoice\" onclick='top_left_bottom(\"" + currency.currency_left + "\",\"" + name + "\",\"" + currency.money + "\")'>" + name + "<li>";
                        top_left_bottom(currency.currency_left, name, currency.money);
                    } else {
                        str += "<li onclick='top_left_bottom(\"" + currency.currency_left + "\",\"" + name + "\",\"" + currency.money + "\")'>" + name + "<li>";
                    }

                }
                $(".choice-header").html(str);
            }

        },
        error: function (err) {

        }
    })
}

function top_left_bottom(pid, name, money) {
    var currency_news_id;
    if (pid == null || pid == "") {
        currency_news_id = 1;
    }
    var name;
    $.ajax({
        url: "../../usdtbb/BbCurrencyNews/getBbCurrencyNewsSelectOptional",
        method: "post",
        data: {
            currency_right: pid,
            userid: "1234567",
            name: name,
            currency_news_id: currency_news_id
        },
        success: function (data) {
            var str = "";
            var st = "";
            if (data.code == 100) {
                for (var i in data.bbCurrencyNewsOptional) {
                    var currency = data.bbCurrencyNewsOptional[i];
                    var s = "";
                    s += "<ul class=\"clearFloat\">";
                    s += "<li class=\"choice-1\">";
                    s += "<img src=\"" + currency.img + "\" alt=\"\">";
                    s += "<span>" + currency.bcname + "</span>";
                    if (currency.name.split("/").length > 1) {
                        s += "<i class=\"rgba-5\">/" + currency.name.split("/")[1] + "</i>";
                    } else {
                        s += "<i class=\"rgba-5\">/" + name + "</i>";
                    }

                    s += "</li>";
                    s += "<li class=\"choice-2\">";
                    var mo = currency.money;
                    if (money == null || money == "") {
                        var mon = 1;
                        for (var j in data.usdtList) {
                            var usdt = data.usdtList[j];
                            if (currency.currency_right == usdt.currency_left) {
                                mon = usdt.money;
                                break;
                            }
                        }
                        mo = mo * mon;
                    } else {
                        mo = mo * money;
                    }

                    s += "<p>" + currency.money + "</p>";
                    s += "<p class=\"rgba-5\">¥" + parseInt(mo * data.cny * 100) / 100 + "</p>";
                    s += "</li>";
                    s += "<li class=\"choice-3\">";
                    if (currency.bfb < 0) {
                        s += "<p class=\"extract\">" + parseInt(currency.bfb * 10000) / 100 + "%</p>";
                    } else {
                        s += "<p class=\"green-5\">+" + parseInt(currency.bfb * 10000) / 100 + "%</p>";
                    }

                    s += "<p class=\"rgba-5\">" + currency.volume + "</p>";
                    s += "</li>";
                    s += "<li class=\"choice-4\">";
                    if (currency.sort != null) {
                        s += "<img src=\"../img/ye/starYes.png\" class=\"stratImg\" onclick='zan(1,\"" + currency.pid + "\",this)'>";
                    } else {
                        s += "<img src=\"../img/ye/starNo.png\" class=\"stratImg\" onclick='zan(0,\"" + currency.pid + "\",this)'>";
                    }

                    s += "</li>";
                    s += "</ul>";
                    if (currency.type == 0) {
                        str += s;
                    } else {
                        st += s;
                    }
                }
                $("#currency_left_zl").html(str);
                $("#currency_left_zc").html(st);
            }

        },
        error: function (err) {

        }
    })
}

function zan(state, currencyid, th) {
    var url = "";
    if (state == 0) {
        url = "../../usdtbb/BbFree/BbFreeInsert";
    } else {
        url = "../../usdtbb/BbFree/BbFreeDel";
    }

    $.ajax({
        url: url,
        method: "post",
        data: {
            id: currencyid,
            userid: "1234567"
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                if (state == 0) {
                    $(th).attr("src", "../img/ye/starYes.png");
                } else {
                    $(th).attr("src", "../img/ye/starNo.png");
                }
            }

        },
        error: function (err) {

        }
    })
}
