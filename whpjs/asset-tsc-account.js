var token;
var assetListTmp;
var assetUsdtListTmp;
var currency_name;
var currency_id;
var accMoney;
var surplus;
var updState;
var profitSum;
var profitSumCny;
var userid;
var language;

$(function () { //加载后执行，获取token、userid
    token = window.sessionStorage.getItem("token");
    userid = window.sessionStorage.getItem("userid");

    language = window.localStorage.getItem("language");
    //changHead(userid);
    language = 2;

    if (language != undefined && language != null & language == 2) {
        loadProperties_trade();
    }

    select();
    selectSet();
    usdtSelect();
    bbShow();

});

var profitSumStr = "";
var profitStr = "";

//显示总资产
function select() {
    $.ajax({
        url: "../../usdtfb/LFbAssetOrder/LFbAssetOrderSelect",
        method: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: false,
        success: function (data) {
            if (data.code == 100) {
                assetListTmp = data.asset;
                profitSum = data.profitSum;
                profitSumCny = data.profitSumCny;
            } else if (data.code == 101) {
                tunchu("暂无数据！");
            } else if (data.code == 103) {
                tunchu("服务器连接失败！");
            } else if (data.code == 401) {
                //					tokenLoseEfficacy();
                //					token = window.sessionStorage.getItem("token");
                //					select();
                //					selectSet();
                //					usdtSelect();
            } else {
                tunchu("服务器连接失败！");
            }
        },
        error: function (err) {

        }
    });
}

//显示法币
function selectSet() {

    profitSumStr = "";
    profitStr = "";
    if (language == 2) {
        profitSumStr = "<li class=\"title\">Total Assets |</li>";
        profitSumStr += "<li> Total revenue：";
    } else {
        profitSumStr = "<li class=\"title\">资产总计 |</li>";
        profitSumStr += "<li> 总收益：";
    }
    b = profitSum;
    loadTotal();
    profitSumStr += "<span class=\"orangeColor font24\">$" + profitSum + " <small>≈￥" + profitSumCny + "</small></span>";

    $("#profitSum").html(profitSumStr);

    var account_list = assetListTmp;
    for (var i in account_list) {
        var account_info = account_list[i];

        profitStr += "<tr> <td class=\"text-left p-l-20\"><img src=" + account_info.img + " style=\"width:25px;height:25px;\" class=\"m-r-10\">" + account_info.name + "</td>";
        profitStr += "<td>" + account_info.moneySum + "</td>";
        profitStr += "<td class=\"redColor\">" + account_info.frozen + "</td>";
        profitStr += "<td class=\"greenColor2\">" + account_info.surplus + "</td>";

        if (language == 2) {
            profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html?currencyName=" + account_info.name + "\" class=\"detail-link detail-link-sm orange-link\">Recharge</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html?currencyName=" + account_info.name + "\" class=\"detail-link detail-link-sm\">Cash withdrawal</a>";
            profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">Transaction</a>";
            profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"" + account_info.pid + "\", \"" + account_info.name +
                "\", \"" + account_info.surplus + "\", \"" + account_info.money + "\", 1)'>Transfer</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-detail.html?pid=" + account_info.pid + "\"  class=\"detail-link detail-link-sm\">Detailed</a>";
            profitStr += "</td> </tr>";
        } else {
            profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html?currencyName=" + account_info.name + "\" class=\"detail-link detail-link-sm orange-link\">充值</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html?currencyName=" + account_info.name + "\" class=\"detail-link detail-link-sm\">提现</a>";
            profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">交易</a>";
            profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"" + account_info.pid + "\", \"" + account_info.name +
                "\", \"" + account_info.surplus + "\", \"" + account_info.money + "\", 1)'>划转</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-detail.html?pid=" + account_info.pid + "\"  class=\"detail-link detail-link-sm\">明细</a>";
            profitStr += "</td> </tr>";
        }
    }

    $("#profitInfoFb").html(profitStr);
}

//
function usdtSelect() {
    profitStr = "";

    $.ajax({
        url: "../../usdtfb/LFbAssetOrder/LFbAssetOrderUsdtSelect",
        method: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: false,
        success: function (data) {
            if (data.code == 100) {
                assetUsdtListTmp = data.assetUsdt;
                usdtSelectSet(1);
                getUserInfoById(data.cny);

            } else if (data.code == 101) {
                tunchu("暂无数据！");
            } else if (data.code == 103) {
                tunchu("服务器连接失败！");
            } else if (data.code == 401) {
                //					tokenLoseEfficacy();
                //					token = window.sessionStorage.getItem("token");
                //					select();
                //					usdtSelect();
                //					usdtSelectSet();
            } else {
                tunchu("服务器连接失败！");
            }
        },
        error: function (err) {

        }
    });
}

//显示现货
function usdtSelectSet(state) {
    profitStr = "";
    var accountInfo = assetUsdtListTmp;
//console.log(accountInfo);
    if (state == 1) {
        if (accountInfo.surplus != 0) {
            profitStr += "<tr> <td class=\"text-left p-l-20\"><img src=\"img/zichan/usdt.png\" >USDT</td>";
            profitStr += "<td>" + accountInfo.surplus + "</td>";
            profitStr += "<td class=\"redColor\">0</td>";
            profitStr += "<td class=\"greenColor2\">" + accountInfo.surplus + "</td>";

            if (language == 2) {
                profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">Recharge</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">Cash withdrawal</a>";
                profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">Transaction</a>";
                profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"USDT\", \"" + accountInfo.surplus +
                    "\", \"" + accountInfo.moneyUsdt + "\", 2)'>Transfer</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-detail-xh.html?currencyName=USDT\" class=\"detail-link detail-link-sm\">Detailed</a>";
                profitStr += "</td> </tr>";
            } else {
                profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">充值</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">提现</a>";
                profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">交易</a>";
                profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"USDT\", \"" + accountInfo.surplus +
                    "\", \"" + accountInfo.moneyUsdt + "\", 2)'>划转</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-detail-xh.html?currencyName=USDT\" class=\"detail-link detail-link-sm\">明细</a>";
                profitStr += "</td> </tr>";
            }

        }

        if (accountInfo.bur_money != 0) {
            profitStr += "<tr> <td class=\"text-left p-l-20\"><img src=\"img/zichan/BRU.png\" >BRU</td>";
            profitStr += "<td>" + accountInfo.bur_money + "</td>";
            profitStr += "<td class=\"redColor\">0</td>";
            profitStr += "<td class=\"greenColor2\">" + accountInfo.bur_money + "</td>";

            if (language == 2) {
                profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">Recharge</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">Cash withdrawal</a>";
                profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">Transaction</a>";
                profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"BRU\", \"" + accountInfo.bur_money +
                    "\", \"" + accountInfo.moneyBru + "\", 2)'>Transfer</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-detail-xh.html?currencyName=BRU\" class=\"detail-link detail-link-sm\">Detailed</a>";
                profitStr += "</td> </tr>";
            } else {
                profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">充值</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">提现</a>";
                profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">交易</a>";
                profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"BRU\", \"" + accountInfo.bur_money +
                    "\", \"" + accountInfo.moneyBru + "\", 2)'>划转</a>";
                profitStr += "<a href=\"../../usdt-fb/user-assets-detail-xh.html?currencyName=BRU\" class=\"detail-link detail-link-sm\">明细</a>";
                profitStr += "</td> </tr>";
            }
        }
    } else {

        profitStr += "<tr> <td class=\"text-left p-l-20\"><img src=\"img/zichan/usdt.png\" >USDT</td>";
        profitStr += "<td>" + accountInfo.surplus + "</td>";
        profitStr += "<td class=\"redColor\">0</td>";
        profitStr += "<td class=\"greenColor2\">" + accountInfo.surplus + "</td>";

        if (language == 2) {
            profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">Recharge</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">Cash withdrawal</a>";
            profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">Transaction</a>";
            profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"USDT\", \"" + accountInfo.surplus +
                "\", \"" + accountInfo.moneyUsdt + "\", 2)'>Transfer</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-detail-xh.html?currencyName=USDT\" class=\"detail-link detail-link-sm\">Detailed</a>";
            profitStr += "</td> </tr>";
        } else {
            profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">充值</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">提现</a>";
            profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">交易</a>";
            profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"USDT\", \"" + accountInfo.surplus +
                "\", \"" + accountInfo.moneyUsdt + "\", 2)'>划转</a>";
            profitStr += "<a href=\"../../usdt-fb/../../usdt-fb/../../usdt-fb/user-assets-detail-xh.html?currencyName=USDT\" class=\"detail-link detail-link-sm\">明细</a>";
            profitStr += "</td> </tr>";
        }

        profitStr += "<tr> <td class=\"text-left p-l-20\"><img src=\"img/zichan/BRU.png\" >BRU</td>";
        profitStr += "<td>" + accountInfo.bur_money + "</td>";
        profitStr += "<td class=\"redColor\">0</td>";
        profitStr += "<td class=\"greenColor2\">" + accountInfo.bur_money + "</td>";

        if (language == 2) {
            profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">Recharge</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">Cash withdrawal</a>";
            profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">Transaction</a>";
            profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"BRU\", \"" + accountInfo.bur_money +
                "\", \"" + accountInfo.moneyBru + "\", 2)'>Transfer</a>";
            profitStr += "<a href=\"../../usdt-fb/../../usdt-fb/user-assets-detail-xh.html?currencyName=BRU\" class=\"detail-link detail-link-sm\">Detailed</a>";
            profitStr += "</td> </tr>";
        } else {
            profitStr += "<td> <a href=\"../../usdt-fb/user-assets-recharge.html\" class=\"detail-link detail-link-sm orange-link\">充值</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-withdraw.html\" class=\"detail-link detail-link-sm\">提现</a>";
            profitStr += "<a href=\"../../usdt-fb/FaBiJiaoYi-Wygm.html\" class=\"detail-link detail-link-sm\">交易</a>";
            profitStr += "<a href=\"\" class=\"detail-link detail-link-sm\" data-toggle=\"modal\" onclick='transfer(\"\", \"BRU\", \"" + accountInfo.bur_money +
                "\", \"" + accountInfo.moneyBru + "\", 2)'>划转</a>";
            profitStr += "<a href=\"../../usdt-fb/user-assets-detail-xh.html?currencyName=BRU\" class=\"detail-link detail-link-sm\">明细</a>";
            profitStr += "</td> </tr>";
        }

    }
    //console.log(profitStr);
    $("#profitInfoXh").html(profitStr);
}

//显示
document.querySelector("input.widget_switch_checkbox2").addEventListener("click", function () {
    if (document.querySelector("input.widget_switch_checkbox2").checked) {
        usdtSelectSet(0);
    } else {

        usdtSelectSet(1);
    }
});

//划转
function transfer(fb_pid, fb_name, fb_surplus, fb_money, state) {
    $(":text").val("");
    $("#message").html("");
    var str = "";
    currency_id = fb_pid;
    currency_name = fb_name;
    accMoney = fb_money;
    surplus = fb_surplus;
    updState = state;

    $("#currencyFrmName").val(fb_name);
    $("#moneySum").val(fb_surplus + "" + fb_name);
    $("#currencyAcctTo").html("");
    if (state == 1) {
        if (language == 2) {
            $("#currencyAcctFrm").val("Legal account");
            $("#currencyAcctTo").append("<option value=\"2\"  data-locale=\"assets.fabizhanghu\">Spot account</option>");
            $("#currencyAcctTo").append("<option value=\"3\"  data-locale=\"assets.fabizhanghu\">Bb account</option>");
        } else {
            $("#currencyAcctFrm").val("法币账户");
            $("#currencyAcctTo").append("<option value=\"2\"  data-locale=\"assets.fabizhanghu\">现货账户</option>");
            $("#currencyAcctTo").append("<option value=\"3\"  data-locale=\"assets.fabizhanghu\">币币账户</option>");
        }


    } else if (state == 2) {
        if (language == 2) {
            $("#currencyAcctFrm").val("Spot account");
            $("#currencyAcctTo").append("<option value=\"1\"  data-locale=\"assets.fabizhanghu\">Legal account</option>");
            $("#currencyAcctTo").append("<option value=\"3\"  data-locale=\"assets.fabizhanghu\">Bb account</option>");
        } else {
            $("#currencyAcctFrm").val("现货账户");
            $("#currencyAcctTo").append("<option value=\"1\"  data-locale=\"assets.fabizhanghu\">法币账户</option>");
            $("#currencyAcctTo").append("<option value=\"3\"  data-locale=\"assets.fabizhanghu\">币币账户</option>");
        }
    } else if (state == 3) {
        if (language == 2) {
            $("#currencyAcctFrm").val("Bb account");
            $("#currencyAcctTo").append("<option value=\"1\"  data-locale=\"assets.fabizhanghu\">Legal account</option>");
            $("#currencyAcctTo").append("<option value=\"2\"  data-locale=\"assets.fabizhanghu\">Spot account</option>");
        } else {
            $("#currencyAcctFrm").val("币币账户");
            $("#currencyAcctTo").append("<option value=\"1\"  data-locale=\"assets.fabizhanghu\">法币账户</option>");
            $("#currencyAcctTo").append("<option value=\"2\"  data-locale=\"assets.fabizhanghu\">现货账户</option>");

        }
    }


    if (language == 2) {
        $("#moneyFrm").attr('placeholder', 'Available assets' + fb_surplus + fb_name);
    } else {

        $("#moneyFrm").attr('placeholder', '可用资产' + fb_surplus + fb_name);
    }

    $("#toTransfer").modal("show");
}


function accChange() {
    var account = $("#currencyAcctTo").val();
    $("#moneyFrm").val("");
    $("#moneyTo").val("");
    var str = "";
    if (account == 1) {
        for (var i in assetListTmp) {
            var assetInfoTmp = assetListTmp[i];
            if (currency_name == assetInfoTmp.name) {
            } else {
                str += "<option value=\"" + assetInfoTmp.pid + "\">" + assetInfoTmp.name + "</option>";
            }
        }
    } else {
        if (currency_name == "USDT") {
            str += "<option value=\"2\">BRU</option>";
        } else if (currency_name == "BRU") {
            str += "<option value=\"1\">USDT</option>";
        } else {
            str += "<option value=\"1\">USDT</option>";
            str += "<option value=\"2\">BRU</option>";
        }
    }
    $("#currencyToName").html(str);
}

function currencyChange() {
    $("#moneyFrm").val("");
    $("#moneyTo").val("");
}

function qiehuan(money, id) {
    if (money == null || money == 0) {
        money = 0
    } else {
        money = parseFloat(money);
    }

    $("#message").html("");
    var account = $("#currencyAcctTo").val();
    var currencyToName = $("#currencyToName").find("option:selected").text();
    var accCurrencyMoney = 0;

    if (account == 1) {
        for (var i in assetListTmp) {
            var assetInfoTmp = assetListTmp[i];
            if (currencyToName == assetInfoTmp.name) {
                accCurrencyMoney = assetInfoTmp.money;
            }
        }
    } else {
        if (currencyToName == "USDT") {
            accCurrencyMoney = assetUsdtListTmp.moneyUsdt;
        } else {
            accCurrencyMoney = assetUsdtListTmp.moneyBru;
        }
    }

    var accMoneyTo = parseInt(((money * accMoney) / accCurrencyMoney) * 100000000) / 100000000;
    $("#" + id).val(accMoneyTo);

    if (isNaN(money)) {
        if (language == 2) {
            $("#message").html("The number of transitions must be numerical！");
        } else {
            $("#message").html("划转数量必须是数值！");
        }
    } else if (money > surplus) {
        if (language == 2) {
            $("#message").html("The quantity you entered exceeds the remaining quantity of this order!");
        } else {
            $("#message").html("您输入的数量超出了本订单剩余数量!");
        }
    }
}

function updateClick() {
    $("#message").html("");
    var currencyFrmName = $("#currencyFrmName").val();
    var surplusUpd = $("#moneyFrm").val();
    surplusUpd = parseFloat(surplusUpd);
    var zhanghu = $("#currencyAcctFrm").val();
    var currencyAcctTo = $("#currencyAcctTo").val();

    if (surplusUpd == null || surplusUpd == "" || surplusUpd == 0) {
        if (language == 2) {
            $("#message").html("The number of transfers should not be empty or zero！");
        } else {
            $("#message").html("划转数量不能为空或者0！");
        }
        return false;
    } else if (isNaN(surplusUpd)) {
        if (language == 2) {
            $("#message").html("The number of transitions must be numerical！");
        } else {
            $("#message").html("划转数量必须是数值！");
        }
        return false;
    } else if (surplusUpd > surplus) {

        if (language == 2) {
            $("#message").html("Transfer quantity shall not exceed the remaining quantity of this order!");
        } else {
            $("#message").html("划转数量不能超过本订单剩余数量!");
        }
        return false;
    }


    if (zhanghu != "币币账户" && (currencyAcctTo != 3)) {//选择的账户为现货、法币

        $.ajax({
            type: "post",
            url: "../../usdtfb/LFbTransferXh/LFbTransInsert",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                "name": currency_name,
                "state": updState,
                "money": surplusUpd
            },
            success: function (info) {
                var str = "";
                if (info.code == 100) {

                    if (updState == 1) {
                        select();
                        selectSet();
                        usdtSelect();
                        bbShow();
                    } else if (updState == 2) {
                        select();
                        usdtSelect();
                        usdtSelectSet(1);
                        bbShow();
                    } else if (updState == 3) {
                        select();
                        usdtSelect();
                        usdtSelectSet(1);
                        bbShow();
                    }

                    $("#toTransfer").modal("hide");
                } else if (info.code == 103) {
                    $("#message").html("服务器连接失败！");
                } else if (info.code == 104) {
                    $("#message").html("该币种不可划转！");
                } else if (info.code == 105) {
                    $("#message").html("划转数量不能大于当前余额！");
                } else if (info.code == 401) {
                    tokenLoseEfficacy();
                    token = window.sessionStorage.getItem("token");
                    updateClick();
                }
            },
            error: function (err) {
                ajax_code(500);
            }
        });
    } else {

        $.ajax({
            type: "post",
            url: "../../usdtbb/BbTransfer/BbTransfer",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                "name": currency_name,
                "state": updState,
                "money": surplusUpd,
                "toAccount": currencyAcctTo,
                "zhanghu": zhanghu
            },
            success: function (info) {
                var str = "";
                if (info.code == 100) {

                    if (updState == 1) {
                        select();
                        selectSet();
                        usdtSelect();
                        bbShow();
                    } else if (updState == 2) {
                        select();
                        usdtSelect();
                        usdtSelectSet(1);
                        bbShow();
                    } else if (updState == 3) {
                        select();
                        usdtSelect();
                        usdtSelectSet(1);
                        bbShow();
                    }

                    $("#toTransfer").modal("hide");
                } else if (info.code == 103) {
                    $("#message").html("服务器连接失败！");
                } else if (info.code == 104) {
                    $("#message").html("该币种不可划转！");
                } else if (info.code == 105) {
                    $("#message").html("划转数量不能大于当前余额！");
                } else if (info.code == 401) {
                    tokenLoseEfficacy();
                    token = window.sessionStorage.getItem("token");
                    updateClick();
                }
            },
            error: function (err) {
                ajax_code(500);
            }
        });
    }

}


/**
 * 根据用户id获取用户详细信息
 */
function getUserInfoById(cny) {
    $.ajax({
        url: "../../usdtpc/auth/getUserInfoById",
        data: {
            "userid": userid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {

                var z_yl = (parseFloat(data.user.income) + parseFloat(data.user.loss));
                if (z_yl < 0) {
                    $("#info_title_zongshouyi").html("-$" + (0 - z_yl).toFixed(2) + "<small>≈-￥" + ((0 - z_yl) * cny).toFixed(2) + "</small>");

                } else {
                    $("#info_title_zongshouyi").html("+$" + z_yl.toFixed(2) + "<small>≈￥" + (z_yl * cny).toFixed(2) + "</small>");

                }
                $("#info_title_zongrujin").html("$" + data.user.usdt_money.toFixed(2) + "<small>≈￥" + (data.user.usdt_money * cny).toFixed(2) + "</small>");
                $("#info_title_yue").html("$" + data.user.surplus.toFixed(2) + "<small>≈￥" + (data.user.surplus * cny).toFixed(2) + "</small>");
                a = data.user.surplus.toFixed(2);
                loadTotal();
            }
        },
        error: function (err) {

        }
    })
}

















