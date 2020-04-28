var cny = 1;
var assetslist = new Array();
var token;
var userid;
var stdList;//usdt对价

var a = null;
var b = null;
var c = null;

function loadTotal() {
    if (a != null && b != null && c != null) {
        cir(a, b, c);
    }
}

//显示bb
function bbShow() {

    $.ajax({
        type: "post",
        url: "../../usdtbb/BbCurrency/BbCurrencyDealSelect",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: "json",
        success: function (info) {
            if (info.code == 100) {
                bbDealList = info.bbDealList;
                cny = info.cny;
                stdList = info.stdList;//获取usdt标准
                assets_html(bbDealList, 1);

            } else {
                //ajax_code(info.code);
            }
        },
        error: function (err) {
            //ajax_code(500);

        }
    });
}


//声明变量
function userasset(img, name, sum, frozen, surplus, close, total, net, cny, pid) {
    this.img = img;
    this.name = name;
    this.sum = sum;
    this.frozen = frozen;
    this.surplus = surplus;
    this.close = close;
    this.total = total;
    this.net = net;
    this.cny = cny;
    this.pid = pid;
}

//显示币币资产
function assets_html(bbDealList, state) {
    var str = "";
    var total = 0;
    var net = 0;
    var sum = 0;
    assetslist = new Array();
    for (var i in bbDealList) {
        var bbDeal = bbDealList[i];
        sum = 0;
        var stdmoney = 1;
        if ((bbDeal.surplus != null) && (typeof (bbDeal.surplus) != 'undefined')) {
            for (var j in stdList) {
                var usdtMoney = stdList[j];
                if (usdtMoney.currency_left == bbDeal.pid) {
                    stdmoney = usdtMoney.money;
                    break;
                }
            }
            net += parseInt(bbDeal.surplus * stdmoney);
            total += parseInt(((bbDeal.frozen) + (bbDeal.surplus)) * stdmoney);

        }

        if (((bbDeal.frozen == null) || (typeof (bbDeal.frozen) == 'undefined')) && (bbDeal.surplus == null) || (typeof (bbDeal.surplus) == 'undefined')) {
            sum = 0;
        } else {
            sum = (bbDeal.frozen) + (bbDeal.surplus);

        }
        if (state == 1) {//默认不显示
            if (sum == 0) {//结束本次循环
                continue;
            }
        }
        str += "<tr><td class=\"text-left p-l-20\"><img src=\"" + bbDeal.img + "\" width=\"20px\" height=\"20px\" class=\"m-r-10\">" + bbDeal.name + "</td>";
        str += "<td>" + sum + "</td>";
        if ((bbDeal.frozen == null) || (bbDeal.frozen == 'undefined')) {
            str += "<td class=\"redColor\">0</td>";
        } else {
            str += "<td class=\"redColor\">" + bbDeal.frozen + "</td>";
        }
        if ((bbDeal.surplus == null) || (bbDeal.surplus == 'undefined')) {
            str += "<td class=\"greenColor2\">0</td>";
        } else {
            str += "<td class=\"greenColor2\">" + bbDeal.surplus + "</td>";
        }
        str += "<td>";
        if (language == 2) {
            if (bbDeal.close == 0) {
                str += "<a href=\"user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link greenButton\">Recharge</a>";
                str += "<a href=\"user-assets-withdraw.html\" class=\"detail-link detail-link-sm redButton\">Cash withdrawal</a>";
            } else {
                str += "<a href=\"user-assets-recharge.html\" class=\"detail-link detail-link-sm grayButton\">Recharge</a>";
                str += "<a href=\"user-assets-withdraw.html\" class=\"detail-link detail-link-sm grayButton\">Cash withdrawal</a>";
            }

            str += "<a href=\"FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">Transaction</a>";
            str += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"" + bbDeal.name + "\", \"" + bbDeal.surplus + "\", \"" + stdmoney + "\", 3)'>Transfer</a>";
            str += "<a href=\"../../usdt-bb/ye/user-bbassets-detail.html?pid=" + bbDeal.pid + "\" class=\"detail-link detail-link-sm\">Detailed</a></td></tr>";
        } else if (language == 1) {

            if (bbDeal.close == 0) {
                str += "<a href=\"user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link greenButton\">充值</a>";
                str += "<a href=\"user-assets-withdraw.html\" class=\"detail-link detail-link-sm redButton\">提现</a>";
            } else {
                str += "<a href=\"user-assets-recharge.html\" class=\"detail-link detail-link-sm grayButton\">充值</a>";
                str += "<a href=\"user-assets-withdraw.html\" class=\"detail-link detail-link-sm grayButton\">提现</a>";
            }
            str += "<a href=\"FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">交易</a>";
            str += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"" + bbDeal.name + "\", \"" + bbDeal.surplus + "\", \"" + stdmoney + "\", 3)'>划转</a>";
            str += "<a href=\"../../usdt-bb/ye/user-bbassets-detail.html?pid=" + bbDeal.pid + "\" class=\"detail-link detail-link-sm\">明细</a></td></tr>";

        }

        assetslist.push(new userasset(bbDeal.img, bbDeal.name, sum, bbDeal.frozen, bbDeal.surplus, total, net, bbDeal.close, cny, bbDeal.pid));

    }
    $("#bbDeal").html(str);
    c = total;
    loadTotal();
    var totalAssets = "<span class=\"orangeColor font24\">$" + total + "<small>≈￥" + (parseInt(total * cny * 100) / 100) + "</small></span>";
    var netAssets = "<span class=\"orangeColor font24\">$" + net + "<small>≈￥" + (parseInt(net * cny * 100) / 100) + "</small></span>";
    $("#totalAssets").html(totalAssets);
    $("#netAssets").html(netAssets);
}


//隐藏0币种
document.querySelector("input.widget_switch_checkbox").addEventListener("click", function () {
    if (document.querySelector("input.widget_switch_checkbox").checked) {
        assets_html(bbDealList, 0);//显示所有
    } else {
        assets_html(bbDealList, 1);//状态是1是跳出循环
    }
});


//
var fbName = "法币总资产";
var xhName = "现货总资产";
var bbName = "币币总资产";
var otchName = "OTCH总资产";

function cir(xh, fb, bb) {
    var dom = document.getElementsByClassName('containerCavass');


    if (language = 2) {
        fbName = "Legal_Total Assets";
        xhName = "Spot_Total Assets";
        bbName = "Bb_Total Assets";
        otchName = "OTCH_Total Assets";
    }
    var app = {};
    option = null;
    app.title = '环形图';
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: '20%',
            y: 40,
            textStyle: {
                color: '#fft'
            },
            data: [xhName, fbName, otchName, bbName]
            //data: ['现货总资产', '法币总资产', 'OTCH总资产', '币币总资产']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                center: ['60%', '40%'],
                radius: ['30%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'top'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [

                    {value: xh, name: xhName, itemStyle: {color: '#00ce8d'}},
                    {value: fb, name: fbName, itemStyle: {color: '#d2aaff'}},
                    {value: 0, name: otchName, itemStyle: {color: '#ef6354'}},
                    {value: bb, name: bbName, itemStyle: {color: '#f5a623'}}
                    /*{ value: xh, name: '现货总资产', itemStyle: { color: '#00ce8d' } },
                    { value: fb, name: '法币总资产', itemStyle: { color: '#d2aaff' } },
                    { value: 0, name: 'OTCH总资产', itemStyle: { color: '#ef6354' } },
                    { value: bb, name: '币币总资产', itemStyle: { color: '#f5a623' } }*/

                ]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        for (i in dom) {
            echarts.init(dom[i]).setOption(option, true);
        }
        myChart.setOption(option, true);
        // myChart1.setOption(option, true);
        // myChart2.setOption(option, true);
    }
}








