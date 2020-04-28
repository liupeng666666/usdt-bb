function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

TradingView.onready(function () {
    var widget = window.tvWidget = new TradingView.widget({
        fullscreen: true,
        symbol: 'AAPL',
        interval: 'D',
        container_id: "kxtBox",
        //	BEWARE: no trailing slash is expected in feed URL
        // "http://localhost:3030",
        datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
        library_path: "",
        locale: getParameterByName('lang') || "zh",
        //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
        drawings_access: {type: 'black', tools: [{name: "Regression Trend"}]},
        disabled_features: ["use_localstorage_for_settings", "left_toolbar", "header_symbol_search",
            "pane_context_menu", "header_undo_redo", "header_resolutions", "header_settings",
            "header_compare", "timeframes_toolbar", "header_chart_type", "header_fullscreen_button",
            "header_indicators", "header_saveload", "header_screenshot", "control_bar", "legend_context_menu", "border_around_the_chart"],
        enabled_features: [],
        overrides: {
            //背景
            //  画布白色背景颜色
            "paneProperties.background": "#2e3237",
            // 网格
            'paneProperties.vertGridProperties.style': 0,
            'paneProperties.horzGridProperties.color': '#2e3237',
            'paneProperties.vertGridProperties.color': '#2e3237',
            // 坐标轴和刻度标签颜色
            'scalesProperties.lineColor': '#fff',
            'scalesProperties.textColor': '#fff',
            //是否收缩行情信息
            'paneProperties.legendProperties.showLegend': true,
            'paneProperties.topMargin': 20,
            //边框
            "mainSeriesProperties.candleStyle.drawBorder": false,
            "symbolWatermarkProperties.color": "rgba(0,	0,	0,	0)"
        },
        custom_css_url: './css/custom_color_white.css',
        loading_screen: {backgroundColor: '＃000', foregroundColor: '＃162431'},
        charts_storage_url: 'http://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.com',
        timezone: 'Asia/Tokyo',
        user_id: 'public_user_id',
        widgetbar: {
            details: true,
            watchlist: true,
            watchlist_settings: {
                default_symbols: ["NYSE:AA", "NYSE:AAL", "NASDAQ:AAPL"],
                readonly: false
            }
        }
    });
    widget.onChartReady(function () {
        widget.chart().createStudy('Moving Average', false, false, [5, 'close', 0], null, {
            'Plot.color': '#34a9ff',
            'Plot.linewidth': 1
        });
        widget.chart().createStudy('Moving Average', false, false, [10, 'close', 0], null, {
            'Plot.color': '#ffb620',
            'Plot.linewidth': 1
        });
        widget.chart().createStudy('Moving Average', false, false, [15, 'close', 0], null, {
            'Plot.color': '#8750ff',
            'Plot.linewidth': 1
        });
        // 创建最新价水平线
        /*widget.chart().createShape({
            time: self.timestamp,
            channel:close
        },{
            shape: 'horizontal_line'
        });*/
        // 现在可以调用其他widget的方法了
        /*$("body").delegate(".click-symbol","click",function(){
            console.log("======= click = "+$(this).data("name"));
            //使图表更改商品。 新商品的数据到达后调用回调。
            widget.activeChart().setSymbol($(this).data("name"),() => console.log('new symbol data has arrived: '));
        });*/

        // widget.activeChart().symbolInterval(function(res){
        //     console.log("@@@@@@@@@@@@@@@@@");
        //     console.log(res);
        //
        // })
        /**
                  *   //使图表更改分辨率。 新分辨率的数据到达后调用回调。
                  widget.activeChart().setResolution($(this).data("name"),() => console.log('new symbol data has arrived: '));
                  */
    });
});
