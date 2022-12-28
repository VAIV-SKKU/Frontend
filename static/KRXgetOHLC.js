let today = new Date().toISOString().split('T')[0] // 오늘 날짜 yyyy-mm-dd
let ticker = '005930' // ticker 임의로 지정 (단축 코드)
let full_code; // 표준 종목 코드 ex) 삼전: KR7005930003
const col_map = {'TRD_DD':'Date', 'TDD_CLSPRC':'Close', 'TDD_OPNPRC':'Open', 'TDD_HGPRC':'High', 'TDD_LWPRC':'Low'}
const delete_key = ['ISU_CD', 'ISU_NM', 'MKT_NM', 'SECUGRP_NM', 'FLUC_TP_CD', 'CMPPRVDD_PRC', 'FLUC_RT', 'ACC_TRDVOL', 'ACC_TRDVAL', 'MKTCAP']
let time1 = new Date().valueOf()
let time2
let time3

getOHLCbyTicker(ticker)

// request로 받아온 주가 데이터에 column 수정 및 Date 형식 수정
function ModifyStock (obj) {
	// Date, OHLC Column 이름 변경
	for (var oldKey in col_map) {
		let newKey = col_map[oldKey]
		obj[newKey] = obj[oldKey];
		delete obj[oldKey];
	}
	// 필요 없는 Column 제거
	delete_key.forEach((item, i) => {
		delete obj[item]
	});
	// Date 형식를 Datetime으로
	obj['Date'] = new Date(obj['Date'])
	// obj['Open'] = Number(obj['Open'])
	// obj['High'] = Number(obj['High'])
	// obj['Low'] = Number(obj['Low'])
	// obj['Close'] = Number(obj['Close'])
}

// ticker 입력 시 OHLC 받아오는 함수
function getOHLCbyTicker(ticker) {
	/*
	종목 표준 코드 받아오기
	=> 미리 서버에서 맵핑 해놓고 ticker 보낼 때 같이 보내는 편이 빠를 수도 있다
	*/
	$.ajax({
		type: "POST",
		url: "http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd",
		beforeSend : function(xhr){
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		},
		data: {
			"bld": "dbms/MDC/STAT/issue/MDCSTAT23902",
			"mktsel": "ALL",  // 조회 시장 (STK/KSQ/ALL)  (STK: Kospi)
			"bld": "dbms/comm/finder/finder_stkisu",
		},
		dataType: "json",
		success: function (result) {
			stocks = result['block1']
			const found = stocks.find(jsonObject => (jsonObject['short_code'] == ticker))
			full_code = found['full_code']
			time2 = new Date().valueOf()
			// 대략 2초 걸린다.
			console.log('Find ' + ticker + ' Full Code: '  + Math.round((time2-time1) / 100) / 10)
			/*
			Full Code를 통해 OHLC 받아오기
			현재 코드는 전체 날짜에 대해 받지만, (삼성 8초, 1년은 0.6초)
			이전 날짜는 flask에서 받고 현재가만 불러오는 시간이 더 짧을 수도 있다.
			*/
			getOHLCbyFullCode(full_code, undefined, undefined) // undefined: default 값 사용하겠다.
		},
		error: function(){
			alert('error')
		}
	});
}

function getOHLCbyFullCode(full_code, start='1990-01-01', end=today) {
	// 날짜에서 모든 - 제거 19900101
	start = start.replace(/-/g, '')
	end = end.replace(/-/g, '')
	$.ajax({
		type: "POST",
		url: "http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd",
		beforeSend : function(xhr){
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		},
		data: {
			"bld": "dbms/MDC/STAT/issue/MDCSTAT23902",
			"isuCd": full_code,
			"strtDd": start,
			"endDd": end,
			"share": "1",
			"money": '1',
			"csvxls_isNo": "false"
		},
		dataType: "json",
		success: function (result) {
			stocks = result['output']
			stocks.forEach(obj => ModifyStock(obj))
			// 걸린 시간 로그
			time3 = new Date().valueOf()
			console.log('Get All ' + ticker +' Data: ' + Math.round((time3 - time2) / 100) / 10)
			console.log(stocks)
		},
		error: function(){
			alert('error')
		}
	});
}
