var language;

function fenye(total, page, num, ff, id) {
    var m = Math.ceil(parseFloat(total) / num);
    page = parseInt(page);
    var str = "";
    if (page == 1) {
        if (language == 2) {
            str += "<li><a href= \"javascript:void(0)\">last</a></li>";
        } else {
            str += "<li><a href=\"javascript:void(0)\">上一页</a></li>";
        }

    } else {
        if (language == 2) {
            str += "<li onclick='" + ff + "(\"" + (page - 1) + "\")'><a href=\"javascript:void(0)\">last</a></li>";
        } else {
            str += "<li onclick='" + ff + "(\"" + (page - 1) + "\")'><a href=\"javascript:void(0)\">上一页</a></li>";
        }
    }
    if (m <= 5) {
        for (var i = 1; i < (m + 1); i++) {
            str += "<li onclick='" + ff + "(\"" + i + "\")'><a href=\"javascript:void(0)\">" + i + "</a></li>";
        }
    } else {
        if (m - page > 5) {
            for (var i = page; i < page + 5; i++) {
                str += "<li onclick='" + ff + "(\"" + i + "\")'><a href=\"javascript:void(0)\">" + i + "</a></li>";
            }
        } else {
            for (var i = (m - 5); i < (m + 1); i++) {
                str += "<li onclick='" + ff + "(\"" + i + "\")'><a href=\"javascript:void(0)\">" + i + "</a></li>";
            }
        }
    }
    if (page == m) {
        if (language == 2) {
            str += "<li><a href=\"javascript:void(0)\">next</a></li>";
        } else {
            str += "<li><a href=\"javascript:void(0)\">下一页</a></li>";
        }

    } else {
        if (language == 2) {
            str += "<li onclick='" + ff + "(\"" + (page + 1) + "\")'><a href=\"javascript:void(0)\">next</a></li>";
        } else {
            str += "<li onclick='" + ff + "(\"" + (page + 1) + "\")'><a href=\"javascript:void(0)\">下一页</a></li>";
        }

    }
    console.log(str);
    $("#" + id).html(str);
}

/**
 * 获取url 地址栏请求参数数据
 */
function GetRequest() {
    var url = location.search; // 获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


function djs_datetime(time) {
    time = parseInt(time / 1000);
    var day = Math.floor(time / (60 * 60 * 24));
    var hour = Math.floor(time / (60 * 60)) - (day * 24);
    var minute = Math.floor(time / 60) - (hour * 60) - (day * 60 * 24);
    var second = Math.floor(time) - (hour * 60 * 60) - (minute * 60) - (day * 60 * 60 * 24);
    $("#djs_day").html(day);
    $("#djs_xs").html(hour);
    $("#djs_fz").html(minute);
    $("#djs_m").html(second);
}
