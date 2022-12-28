let today = new Date().toISOString().split('T')[0] // 오늘 날짜 yyyy-mm-dd
let ticker = '005930' // ticker 임의로 지정 (단축 코드)
let time1 = new Date().valueOf()
let time2
let time3

getOHLCbyTicker(ticker, undefined, undefined)
// getOHLCbyTicker(ticker, '2021-01-01', '2022-11-17')


function to_date(date_str)
{
    var yyyyMMdd = String(date_str);
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(4,6);
    var sDate = yyyyMMdd.substring(6,8);

    return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
}

function difference(date1, date2) {
	const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
	day = 1000*60*60*24;
	return(date2utc - date1utc)/day
}

// ticker 입력 시 OHLC 받아오는 함수
export function getOHLCbyTicker(ticker, start='1990-01-01', end=today) {
	time_difference = difference(new Date(start), new Date(end))
	// num = time_difference
	var stocks = []
	$.ajax({
		type: "GET",
		url: "https://fchart.stock.naver.com/sise.nhn",
		data: {
			'symbol': ticker,
			'requestType': 0,
			'count': time_difference,  // 받아오는 날짜 개수
			'timeframe': 'day',
		},
		dataType: "xml",
		success: function (result) {
			item = result.getElementsByTagName("item")
			for(let item_node of item) {
				data = item_node.getAttribute('data')
				data = data.split('|').slice(0, 5)
				// 날짜 컷
				if ((data[0] < start) | (data[0] > end)) {
					continue;
				}
				stock = {'Date': to_date(data[0]), 'Open': data[1], 'High': data[2], 'Low': data[3], 'Close': data[4]}
				stocks.push(stock)
			}
			time2 = new Date().valueOf()
			console.log('Get All ' + ticker +' Data: ' + Math.round((time2 - time1) / 100) / 10)
			getNowPrice(ticker)
			// console.log(stocks)
		},
		error: function(){
			alert('error')
		}
	});
}


export function getNowPrice(ticker) {
	$.ajax({
		type: "GET",
		url: "https://api.finance.naver.com/service/itemSummary.nhn",
        data: {
			'itemcode': ticker,
		},
		dataType: "json",
		success: function (result) {
            console.log(result['now'])
			// let now = result['datas'][0]['closePrice']
			time3 = new Date().valueOf()
			console.log('Get Current Price: ' + Math.round((time3 - time2) / 100) / 10)
			// console.log(now)
		},
		error: function(){
			alert('error')
		}
	});
}
