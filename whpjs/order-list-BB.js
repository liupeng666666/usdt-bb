var pid;
var userid = "1234567";
var num = 10;
$(function () {
    pid = GetRequest().pid;
    bb_sell_select(1);
    bb_plan_select(1);
});

function bb_sell_select(page) {
    var p = (page - 1) * num;
    var start = $("#start").val();
    var end = $("#end").val();
    var type = $("#type").attr("data");
    var state = $("#state").attr("data");
    $.ajax({
        type: "post",
        url: "../../usdtbb/BbSell/BbSellaSelect",
        data: {
            pid: pid,
            userid: userid,
            type: type,
            start: start,
            end: end,
            state: state,
            page: p,
            num: num
        },
        async: true,
        dataType: "json",
//         beforeSend: function(xhr) {
//             xhr.setRequestHeader('Authorization', token);
//         },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                bb_sell = info.bb_sell;
                for (var i in info.sell) {
                    var sell = info.sell[i]

                    str += "<tr><td>" + sell.date + "<br>" + sell.time + "</td>";
                    if (sell.type == 0) {
                        str += "<td class=\"greenFont\"><i>买</i>" + sell.number + "/" + sell.volume + "</td>";
                    } else {
                        str += "<td class=\"redFont\"><i>卖</i>" + sell.number + "/" + sell.volume + "</td>";
                    }
                    if (sell.state == 0) {
                        str += "<td class=\"greenFont\">" + sell.univalent + "/--</td>"
                    } else {
                        str += "<td class=\"redFont\">" + sell.univalent + "/" + sell.univalent + "</td>"
                    }
                    str += "<td>" + sell.volume * sell.univalent + "</td>"
                    str += "<td>币币交易</td>";
                    if (sell.state == 0) {
                        str += "<td>未交易</td>  ";
                    } else if (sell.state == 1) {
                        str += "<td>正在交易</td>  ";
                    } else if (sell.state == 2) {
                        str += "<td>已完成</td>  ";
                    } else if (sell.state == 3) {
                        str += "<td>已取消</td>  ";
                    }
                    if (sell.style == 0) {
                        str += " <td>pc</td>  ";
                    } else {
                        str += " <td>app</td>  ";
                    }
                    if (sell.state == 0 || sell.state == 1) {
                        str += "<td><a>取消</a></td></tr>";
                    } else {
                        str += "<td></td></tr>";
                    }
                }
                $("#sell_center").html(str);
                fenye(info.count, page, num, "bb_sell_select", "center_fy");
            } else {
                //ajax_code(info.code);
            }
        },
        error: function (err) {
            //ajax_code(500);
        }
    });
}

function bb_plan_select(page) {
    var p = (page - 1) * num;
    var start = $("#start").val();
    var end = $("#end").val();
    var type = $("#type").attr("data");
    var state = $("#state").attr("data");
    $.ajax({
        type: "post",
        url: "../../usdtbb/BbSell/BbSellbSelect",
        data: {
            pid: pid,
            userid: userid,
            type: type,
            start: start,
            end: end,
            state: state,
            page: p,
            num: num
        },
        async: true,
        dataType: "json",
//         beforeSend: function(xhr) {
//             xhr.setRequestHeader('Authorization', token);
//         },
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                bb_plan = info.bb_plan;
                for (var i in info.plan) {
                    var plan = info.plan[i]

                    str += "<tr><td>" + plan.date + "<br>" + plan.time + "</td>";
                    if (plan.type == 0) {
                        str += "<td class=\"greenFont\"><i>买</i>" + plan.number + "</td>";
                    } else {
                        str += "<td class=\"redFont\"><i>卖</i>" + plan.number + "</td>";
                    }
                    if (plan.type == 0) {
                        str += "<td class=\"greenFont\">追高触发价:" + plan.max_un + "<br>" + " 抄底触发价:" + plan.min_un + "</td>";
                    } else {
                        str += "<td class=\"redFont\">追高触发价:" + plan.max_un + "<br>" + " 抄底触发价:" + plan.min_un + "</td>";
                    }
                    if (plan.type == 0) {
                        str += "<td class=\"greenFont\">追高委托价:" + plan.max_sell + "<br>" + " 抄底委托价:" + plan.min_sell + "</td>";
                    } else {
                        str += "<td class=\"redFont\">追高委托价:" + plan.max_sell + "<br>" + " 抄底委托价:" + plan.min_sell + "</td>";
                    }
                    if (plan.trigger == 0) {
                        str += "<td>0.000</td>"
                    } else {
                        str += "<td>" + plan.trigger_money + "</td>"
                    }
                    if (plan.state == 0) {
                        str += "<td>未交易</td>";
                    } else if (plan.state == 1) {
                        str += "<td>正在交易</td>";
                    } else if (plan.state == 2) {
                        str += "<td>已完成</td>";
                    } else if (plan.state == 3) {
                        str += "<td>已取消</td>";
                    }
                    if (plan.style == 0) {
                        str += " <td>pc</td>  ";
                    } else {
                        str += " <td>app</td>  ";
                    }
                    str += "<td><a href=\"Goumai-Step1.html\">取消</a></td></tr>";
                }
                $("#plan_center").html(str);
                fenye(info.count, page, num, "bb_sell_select", "center_fy");
            } else {
                //ajax_code(info.code);
            }
        },
        error: function (err) {
            //ajax_code(500);
        }
    });
}

function qiehuan(id, state, th) {


    if (id == 0) {
        $("#type").html($(th).html());
        $("#type").attr("data", state);
    } else if (id == 1) {
        $("#state").html($(th).html());
        $("#state").attr("data", state);
    } else if (id == 2) {
        $("#plan").html($(th).html());
        $("#plan").attr("data", state);
    }
}

function bb_sell_plan() {
    var data = $("#plan").attr("data");
    if (data == 0) {
        bb_sell_select(1);
    } else {
        bb_plan_select(1);
    }

}

       