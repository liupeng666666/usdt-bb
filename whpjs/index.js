var bb_currency;
var ajax_code;
var currency_right;
var currency_news_id;
var search;
var name;
var sort_list = new Array();
var cny = 1;
var usdtList;
var userid;
var kline_map = new Map();
var token;
var language = 2;
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");

    if (language != undefined && language != null & language == 2) {
        loadProperties_trade();
    }
    currencyInfobb_select();
    currencyOption_select("");
    optionArea();
});


function currencyInfobb_select() {
    $.ajax({
        type: "post",
        url: "../../usdtbb/BbCurrencyNews/getBbCurrencyNewsSelect",
        async: true,
        dataType: "json",
        success: function (info) {
            var str = "";
            if (info.code == 100) {
                bb_currency = info.bbCurrencyNews;
                cny = info.cny;
                for (var i in info.bbCurrencyNews) {
                    var bbCurrencyNews = info.bbCurrencyNews[i];
                    str += "<div class=\"swiper-slide\"><div class=\"swiperDetail\"><div class=\"swiperDetailBox\"><div class=\"swiperDetailmain\"><div><img src=\"" + bbCurrencyNews.img + "\">";
                    str += "<h5>" + bbCurrencyNews.name + "</h5>";
                    str += "<span class=\"grenFont\">" + bbCurrencyNews.bfb + "</span></div>";
                    str += "<div class=\"secondDiv\"><h4>" + bbCurrencyNews.money + "</h4>";
                    str += "<span>" + '≈' + parseInt(bbCurrencyNews.money * cny * 1000) / 1000 + 'CNY' + "</span></div>";
                    if (language == 2) {
                        str += "<p>" + '24H Volume ' + bbCurrencyNews.oneday + "</p>";
                    } else {
                        str += "<p>" + '24H量  ' + bbCurrencyNews.oneday + "</p>";
                    }
                    str += "</div></div><div id='kline_" + bbCurrencyNews.pid + "' class=\"KLine\"></div></div></div>";
                }
                $("#zd").html(str);
                for (var i in info.bbCurrencyNews) {//循环给kline赋值
                    var fh = kline_map.get(info.bbCurrencyNews[i].pid);//fh的是数据
                    if (fh != "" && fh != null && typeof (fh) != "undefined") {
                        klineShow("kline_" + info.bbCurrencyNews[i].pid, fh);
                    } else {
                        getklinedata(info.bbCurrencyNews[i].pid);
                    }

                }
                //格式显示
                var swiper = new Swiper('.yeswiper-container2', {
                    slidesPerView: 5,
                    spaceBetween: 30,
                    autoplay: false,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });

}

//自选区
function optionArea() {
    $.ajax({
        type: "get",
        url: "../../usdtbb/BbCurrency/currencySelectByStyle",
        async: true,
        dataType: "json",
        success: function (info) {
            var str = "";
            var str1 = "";
            if (info.code == 100) {
                currencyOption = info.currencyList;
                if (language == 2) {
                    str += "<li name=\"optli-" + (-1) + "\" onclick='class_qh(\"" + userid + "\",this,-1)'>Option Area</li>";
                } else {
                    str += "<li name=\"optli-" + (-1) + "\" onclick='class_qh(\"" + userid + "\",this,-1)'>自选区</li>";
                }

                for (var i in info.currencyList) {
                    var currencyOption = info.currencyList[i];
                    if (currencyOption.name == "USDT") {
                        str += "<li class=\"active\" name=\"optli-" + i + "\" onclick='class_qh(\"" + currencyOption.pid + "\",this," + i + ")'>" + currencyOption.name + "</li>";
                    } else {
                        str += "<li name=\"optli-" + i + "\" onclick='class_qh(\"" + currencyOption.pid + "\",this," + i + ")'>" + currencyOption.name + "</li>";
                    }

                }
                $("#optionArea").html(str);
                if (language == 2) {
                    str1 += "<img onclick=\"bbSearch()\" src=\"../img/ye/searchicon.png\"><input id=\"search\" name=\"search\" placeholder=\"Search Currency\">";
                } else {
                    str1 += "<img onclick=\"bbSearch()\" src=\"../img/ye/searchicon.png\"><input id=\"search\" name=\"search\" placeholder=\"搜索币种\">";
                }
                $("#bbSearch").html(str1);
            } else {
                ajax_code(info.code);
            }
        }

    });
}

//触发事件
function class_qh(value, th, state) {
    $("[name!='optli-" + state + "']").removeClass("active");
    $(th).addClass("active");
    if (state != -1) {
        currency_right = value;
        currency_news_id = "";
    } else {
        currency_news_id = value;
        currency_right = "";
    }

    currencyOption_select(value);

}

function bbSearch() {
    search = $("#search").val();
    value = search;
    currencyOption_select(value);

}

//自选主流区
function currencyOption_select(value) {
    if (value == '') {
        currency_right = "22c9cfc1-98ca-11e9-b3d0-0242ac110004"; //暂时定死usdt的pid
    }
    ;

    $.ajax({
        type: "post",
        url: "../../usdtbb/BbCurrencyNews/getBbCurrencyNewsSelectOptional",
        async: true,
        data: {
            currency_right: currency_right,
            userid: userid,
            currency_news_id: currency_news_id,
            name: search
        },
        dataType: "json",
        success: function (info) {

            var stdmoney = "";
            if (info.code == 100) {
                currencyOption = info.bbCurrencyNewsOptional;
                cny = info.cny;
                usdtList = info.usdtList;
                currency_html(currencyOption);
            } else {
                ajax_code(info.code);
            }
        },
        error: function (err) {
            ajax_code(500);

        }
    });
}

function currency_html(bbCurrencyNewsOptional) {

    var str = "";
    var str1 = "";
    var str2 = "";
    sort_list = new Array();
    for (var i in bbCurrencyNewsOptional) {

        var currencyOption = bbCurrencyNewsOptional[i];
        var cny_money = currencyOption.money * cny;//按人民币排序的声明
        for (var j in usdtList) {//循环显示人民币
            var usdtMoney = usdtList[j];
            stdmoney = usdtMoney.money;
            if (usdtMoney.currency_left == currencyOption.currency_right) {
                cny_money = parseInt(currencyOption.money * stdmoney * cny * 100) / 100;
            }

        }
        //排序注入
        sort_list.push(new bbsort(currencyOption.pid, currencyOption.img, currencyOption.bcname, currencyOption.name, currencyOption.money, currencyOption.volume, currencyOption.market, currencyOption.bfb, currencyOption.type, currencyOption.sort, currencyOption.currency_right, cny_money));

        if (currencyOption.type == 0) {
            str1 += "<ul class=\"tableBoxUl\"><li class=\"firstLi\"><img src=\"" + currencyOption.img + "\">";
            str1 += "<h5>" + currencyOption.bcname + "</h5>";
            str1 += "<span>" + (currencyOption.name).match(/\/(\S*)/g) + "</span></li>";
            if (currencyOption.bfb >= 0) {
                str1 += "<li class=\"secondeLi grennFont\">" + currencyOption.money + " / ";
                str1 += "<span>" + '￥' + cny_money + "</span><i>↑</i></li>";
            } else {
                str1 += "<li class=\"secondeLi redFont\">" + currencyOption.money + " / ";
                str1 += "<span>" + '￥' + cny_money + "</span><i>↓</i></li>";
            }
            str1 += "<li>" + '$' + currencyOption.volume + "</li>";
            str1 += "<li>" + currencyOption.market + "</li>";
            if (currencyOption.bfb >= 0) {
                str1 += "<li class=\"grennFont\">" + (currencyOption.bfb * 100) + "%" + "</li>"
            } else {
                str1 += "<li class=\"redFont\">" + (currencyOption.bfb * 100) + "%" + "</li>"
            }

            str1 += "<li><div id='kline_" + currencyOption.pid + "' class=\"KLine\"></div></li>"

            if (language == 2) {
                str1 += "<li> <a class=\"liBotton\">To trade</a></li>";
            } else {
                str1 += "<li> <a class=\"liBotton\">去交易</a></li>";
            }
            if (currencyOption.sort != null) {
                str1 += "<li class=\"startHead\"><img onclick='class_zx(\"" + currencyOption.pid + "\",this)' src=\"../img/ye/starYes.png\" class=\"stratImg choseimg\"></li></ul>"
            } else {
                str1 += "<li class=\"startHead\"><img onclick='class_zx(\"" + currencyOption.pid + "\",this)' src=\"../img/ye/starNo.png\" class=\"stratImg\"></li></ul>"
            }
            str1 += "<p class=\"line\"></p><br>";

        }
        if (currencyOption.type == 1) {
            str2 += "<ul class=\"tableBoxUl\"><li class=\"firstLi\"><img src=\"" + currencyOption.img + "\">";
            str2 += "<h5>" + currencyOption.bcname + "</h5>";
            str2 += "<span>" + (currencyOption.name).match(/\/(\S*)/g) + "</span></li>";
            if (currencyOption.bfb >= 0) {
                str2 += "<li class=\"secondeLi grennFont\">" + currencyOption.money + " / ";
                str2 += "<span>" + '￥' + cny_money + "</span><i>↑</i></li>";
            } else {
                str2 += "<li class=\"secondeLi redFont\">" + currencyOption.money + " / ";
                str2 += "<span>" + '￥' + cny_money + "</span><i>↓</i></li>";
            }
            str2 += "<li>" + '$' + currencyOption.volume + "</li>";
            str2 += "<li>" + currencyOption.market + "</li>";
            if (currencyOption.bfb > 0) {
                str2 += "<li class=\"grennFont\">" + currencyOption.bfb + "%" + "</li>"
            } else {
                str2 += "<li class=\"redFont\">" + currencyOption.bfb + "%" + "</li>"
            }
            str2 += "<li><div class=\"KLine\"  id='kline_" + currencyOption.pid + "'></div></li>"
            if (language == 2) {
                str2 += "<li> <a class=\"liBotton\">To trade</a></li>";
            } else {
                str2 += "<li> <a class=\"liBotton\">去交易</a></li>";
            }


            if (currencyOption.sort != null) {
                str2 += "<li class=\"startHead\"><img onclick='class_zx(\"" + currencyOption.pid + "\",this)' src=\"../img/ye/starYes.png\" class=\"stratImg choseimg\"></li></ul>"
            } else {
                str2 += "<li class=\"startHead\"><img onclick='class_zx(\"" + currencyOption.pid + "\",this)' src=\"../img/ye/starNo.png\" class=\"stratImg\"></li></ul>"
            }
            str2 += "<p class=\"line\"></p><br>";
        }

    }
    if (language == 2) {
        str += "<p class=\"headerLin\"><span></span>Main stream area</p>";
    } else {
        str += "<p class=\"headerLin\"><span></span>主流区</p>";
    }
    str += str1;
    if (language == 2) {
        str += "<p class=\"headerLin\"><span></span>leading creator area</p>";
    } else {
        str += "<p class=\"headerLin\"><span></span>主创区</p>";
    }
    str += str2;

    $("#bbOption").html(str);


    for (var i in bbCurrencyNewsOptional) {//循环给kline赋值
        var fh = kline_map.get(bbCurrencyNewsOptional[i].pid);
        if (fh != "" && fh != null && typeof (fh) != "undefined") {
            klineShow("kline_" + bbCurrencyNewsOptional[i].pid, fh);
        } else {
            getklinedata(bbCurrencyNewsOptional[i].pid);
        }


    }
}

//自选
function class_zx(pid, th) {
    var id = pid;
    if ($(th).hasClass('choseimg')) {
        $(th).removeClass('choseimg');
        $(th).attr('src', '../img/ye/starNo.png');
        //从free表删除
        $.ajax({
            type: "post",
            url: "../../usdtbb/BbFree/BbFreeDel",
            async: true,
            data: {
                id: id,
                userid: userid
            },
            dataType: "json",
            success: function (info) {
                if (info.code == 100) {
                    //alert("quxiao成功！");
                }
            }

        });
    } else {
        $(th).addClass('choseimg');
        $(th).attr('src', '../img/ye/starYes.png');
        //添加到free表
        $.ajax({
            type: "post",
            url: "../../usdtbb/BbFree/BbFreeInsert",
            async: true,
            data: {
                id: id,
                userid: userid
            },
            dataType: "json",
            success: function (info) {
                if (info.code == 100) {
                    //alert("自选成功！");
                }
            }

        });

    }

}

//排序
function bbsort(pid, img, bcname, name, money, volume, market, bfb, type, sort, currency_right, cny_money) {
    this.pid = pid;
    this.img = img;
    this.bcname = bcname;
    this.name = name;
    this.money = money;
    this.volume = volume;
    this.market = market;
    this.bfb = bfb;
    this.type = type;
    this.sort = sort;
    this.currency_right = currency_right;
    this.cny_money = cny_money;

}

//排序
function hideTriangle(th, title, state) {
    $(th).parent().find('span').css('visibility', 'visible');
    $(th).css('visibility', 'hidden');
    $("[name!='li-" + title + "']");

    if (title == 1) {
        if (state == 0) {
            sort_list.sort(function (a, b) {
                return a.cny_money - b.cny_money;
            });
        } else {
            sort_list.sort(function (a, b) {
                return b.cny_money - a.cny_money;
            });
        }
    }
    if (title == 2) {
        if (state == 0) {
            sort_list.sort(function (a, b) {
                return a.volume - b.volume;
            });
        } else {
            sort_list.sort(function (a, b) {
                return b.volume - a.volume;
            });
        }
    }
    if (title == 3) {
        if (state == 0) {
            sort_list.sort(function (a, b) {
                return a.market - b.market;
            });
        } else {
            sort_list.sort(function (a, b) {
                return b.market - a.market;
            });
        }
    }
    if (title == 4) {
        if (state == 0) {
            sort_list.sort(function (a, b) {
                return a.bfb - b.bfb;
            });
        } else {
            sort_list.sort(function (a, b) {
                return b.bfb - a.bfb;
            });
        }
    }

    currency_html(sort_list);
}


var klinedata;
var list;
var kline;

function getklinedata(pid) {
    $.ajax({
        type: "post",
        url: "../../usdtbb/BbKlineNews/BbKlineNewsSelect",
        async: true,
        data: {
            currency_news_id: pid
        },
        dataType: "json",
        success: function (info) {
            if (info.code == 100) {
                //处理数据
                var sum = 0;
                var avg = 0;
                klinedata = info.klinelist;
                for (var i in info.klinelist) {
                    kline = info.klinelist[i];
                    kline = JSON.parse(kline);//将Json转换成string
                    sum += kline.close;
                }
                if (info.klinelist.length != 0) {
                    avg = sum / info.klinelist.length;
                }
                list = new Array();
                for (var i = (info.klinelist.length - 1); i >= 0; i--) {
                    kline = info.klinelist[i];
                    kline = JSON.parse(kline);
                    var min = kline.close - avg;
                    list.push(min);
                }
                kline_map.set(pid, list);
                klineShow("kline_" + pid, list);
            }
        }
    });
}


//显示KLine图
function klineShow(id, data) {

    var dom = document.getElementById(id);
    var date = [];
    option = {
        grid: {
            top: 0,    //距离容器上边界40像素
            left: 0,
            right: 0,
            bottom: 0   //距离容器下边界30像素
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date,
            show: false
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            show: false,
            splitLine: {show: false},//去除网格线
        },
        series: [
            {
                name: '模拟数据',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#168349'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2f774f'
                    }, {
                        offset: 1,
                        color: '#343434'
                    }])
                },
                data: data
            }
        ]
    };

    if (option && typeof option === "object") {
        echarts.init(dom).setOption(option, true);
    }

}

