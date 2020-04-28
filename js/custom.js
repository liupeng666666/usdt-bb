$(function () {
    $('[data-toggle="popover"]').popover();
});

$(function () {
    $('[rel=popover]').popover({
        html: true,
        content: function () {
            return $('#popover_content_wrapper').html();
        }
    });
});

function showPop(dd) { //要显示的图层以及宽度
    $(dd).fadeIn();
}

function hidePop(dd) { //要显示的图层以及宽度
    $(dd).fadeOut();
}


//iCheck
$('.check-icheck').iCheck({
    checkboxClass: 'icheckbox_minimal-orange',
    radioClass: 'iradio_minimal-orange',
    increaseArea: '20%' // optional'
});


//可拖动弹出层
function popWin(obj) {
    var _z = 9000; //新对象的z-index
    var _mv = false; //移动标记
    var _x, _y; //鼠标离控件左上角的相对位置		
    var _obj = $(obj);
    var _wid = _obj.width();
    var _hei = _obj.height();
    var _tit = _obj.find(".tit");
    var _cls = _obj.find(".close");
    var docE = document.documentElement;
    var left = $(document).width() - _obj.width() - 10
    var top = docE.clientHeight - _obj.height() - 10;
    _obj.css({
        "display": "block",
        "z-index": _z - (-1)
    });

    _tit.mousedown(function (e) {
        _mv = true;
        _x = e.pageX - parseInt(_obj.css("left")); //获得左边位置
        _y = e.pageY - parseInt(_obj.css("top")); //获得上边位置
        _obj.fadeTo(50, 1); //点击后开始拖动并透明显示	
    });
    _tit.mouseup(function (e) {
        _mv = false;
        _obj.fadeTo("fast", 1); //松开鼠标后停止移动并恢复成不透明				 

    });

    $(document).mousemove(function (e) {
        if (_mv) {
            var x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
            if (x <= 0) {
                x = 0
            }
            ;
            x = Math.min(docE.clientWidth - _wid, x) - 5;
            var y = e.pageY - _y;
            if (y <= 0) {
                y = 0
            }
            ;
            y = Math.min(docE.clientHeight - _hei, y) - 5;
            _obj.css({
                top: y,
                left: x,
                bottom: 'auto',
                right: 'auto',
            }); //控件新位置
        }
    });

    _cls.on("click", function () {
        _obj.hide();
    });


    reModel();
    $(window).on("resize", function () {
        reModel();
    });
    $(document).keydown(function (event) {
        if (event.keyCode == 27) {
            _obj.hide();
        }
    });

    function reModel() {
        var b = docE ? docE : document.body,
            height = b.scrollHeight > b.clientHeight ? b.scrollHeight : b.clientHeight,
            width = b.scrollWidth > b.clientWidth ? b.scrollWidth : b.clientWidth;
    };
}
