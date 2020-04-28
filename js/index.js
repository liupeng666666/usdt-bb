$(document).ready(function () {
    $('.iosBox').mouseover(function () {
        $(".iosBox").find(".ewmBOX").show();
    }).mouseout(function () {
        $(".iosBox").find(".ewmBOX").hide();
    });
    $('.azBox').mouseover(function () {
        $(".azBox").find(".ewmBOX").show();
    }).mouseout(function () {
        $(".azBox").find(".ewmBOX").hide();
    });
    $('.stratImg').click(function () {
        if ($(this).hasClass('choseimg')) {
            $(this).removeClass('choseimg');
            $(this).attr('src', '../img/ye/starNo.png');
        } else {
            $(this).addClass('choseimg');
            $(this).attr('src', '../img/ye/starYes.png');
        }

    });


    $('.slipDownBox').click(function () {
        if ($('.slipDownBox').hasClass('slipTops')) {
            $('.slipDownBox').removeClass('slipTops');
            $('#bbOption').addClass('bbOption');
            if (language == 2) {
                $('.slipDownBox span').html("Open");
            } else {
                $('.slipDownBox span').html("展开");
            }

        } else {
            $('.slipDownBox').addClass('slipTops');
            $('#bbOption').removeClass('bbOption');
            if (language == 2) {
                $('.slipDownBox span').html("Close");
            } else {
                $('.slipDownBox span').html("闭合");
            }

        }
        // $('.slipDownBox').hasClass('slipTops')?$('.slipDownBox').removeClass('slipTops'):$('.slipDownBox').addClass('slipTops')
    });


    $(".dayS").rating({
        min: 0, max: 6, step: 0.5, size: "xl", stars: "6", showClear: false
    });
    // $(".fdayS").rating({
    //     min: 0, max: 2, step: 0.5, size: "xl", stars: "5", showClear: false
    // });
    var timing = setInterval("info()", 2000);

    /*var dom = document.getElementsByClassName('KLine');

    // var myChart = echarts.init(domid);
    var base = +new Date(1968, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    var date = [];
    
    var data = [Math.random() * 300];
    
    for (var i = 1; i < 2000; i++) {
        var now = new Date(base += oneDay);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
    }
    option = {
        grid : {
            top : 0,    //距离容器上边界40像素
            left:0,
            right:0,
            bottom: 0   //距离容器下边界30像素
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date,
            show : false
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            show : false,
            splitLine: { show: false },//去除网格线
        },
        series: [
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
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
    ;
    if (option && typeof option === "object") {
        for (i in dom) {
            echarts.init(dom[i]).setOption(option, true);
        }
    }*/

})

function info() {
    var li = $(".gongaoBox li").eq(0).clone();
    $(".gongaoBox li").eq(0).animate({marginTop: "-60px"}, 2000, function () {
        $(".gongaoBox li").eq(0).remove();
        $(".gongaoBox").append(li);
    })
}

/*function hideTriangle(_this){
    $(_this).parent().find('span').css('visibility','visible');
    $(_this).css('visibility','hidden');
   
}*/