var chartConfig = {

    fullscreen: true,
    symbol: 'AAPL',
    interval: 'D',
    container_id: "kxtBox",
    //	BEWARE: no trailing slash is expected in feed URL
    // "http://localhost:3030",
    //      datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
    datafeed: new FeedBase(),
    library_path: "",
    locale: "zh",
    //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
    drawings_access: {
        type: 'black',
        tools: [{
            name: "Regression Trend"
        }]
    },
    disabled_features: ["use_localstorage_for_settings", "left_toolbar", "header_symbol_search",
        "pane_context_menu", "header_undo_redo", "header_resolutions", "header_settings",
        "header_compare", "timeframes_toolbar", "header_chart_type", "header_fullscreen_button",
        "header_indicators", "header_saveload", "header_screenshot", "control_bar", "legend_context_menu", "border_around_the_chart"
    ],
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
    loading_screen: {
        backgroundColor: '＃000',
        foregroundColor: '＃162431'
    },
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

}

// 图表库实例化后储存的函数
var widget = null;
// 进入页面 默认展示的产品
var index_market = 'BTC/USDT';
// 进入页面 默认展示的产品周期
var index_activeCycle = '1';
var kline_color = ["#2ba7d6", "#de9f66", "#4F9D9D", "#2894FF", "#8600FF"];

function TradingEchart(name, minute_list, minte_name) {
    console.log(name);
    console.log(minte_name);
    console.log(minute_list);
    index_market = name;
    index_activeCycle = minte_name;
    // window.TradingView.onready 确保在html的dom加载完成后在调用
    // chartConfig 在chartConfig.js里面
    // 给chartConfig添加展示周期
    chartConfig.interval = index_activeCycle;
    // 给chartConfig添加展示产品
    chartConfig.symbol = index_market;
    chartConfig.width = 500;
    chartConfig.height = 300;
    // 初始化 TradingView
    widget = new window.TradingView.widget(chartConfig);

    widget && widget.onChartReady && widget.onChartReady(function () {
        for (var i in minute_list) {
            console.log(minute_list[i].minute);
            widget.chart().createStudy('Moving Average', false, false, [minute_list[i].minute], null, {
                'Plot.linewidth': 2,
                'Plot.color': kline_color[i]
            });
        }

    })

}