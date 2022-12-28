// import axios from 'axios'
let today = new Date().toISOString().split('T')[0]
var now = new Date();
let yolo_result;
var oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0]
now = new Date();
var oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0]
// console.log(oneMonthAgo, today)
localStorage.setItem('login', 0);
localStorage.setItem('updated', 0);
localStorage.setItem('kospi_discover', 0);
localStorage.setItem('kosdaq_discover', 0);

$(function(){
    var requiredCheckboxes = $('.options :checkbox[required]');
    requiredCheckboxes.change(function(){
        if(requiredCheckboxes.is(':checked')) {
            requiredCheckboxes.removeAttr('required');
        } else {
            requiredCheckboxes.attr('required', 'required');
        }
    });
});

function showGraph(ticker, date, interval, prob) {
    let new_wnd = window.open("", "Yolo", "width=200,height=100")

    let content = '<html><head><title>과거 1년간 매수매도 예측 시점<title></head>'
                + '<body></body></html>'

};

// function getProfitList(results) {
//     let tickerlist = []
//     let currentlist = []
//     let closelist = []
//     let profitlist = []

//     for (const predictInfo of results) {
//         let ticker = predictInfo[0]
//         let close = predictInfo[2]
//         tickerlist.push(ticker)
//         closelist.push(close)

//     }

//     console.log(tickerlist)
//     console.log(closelist)

//     /* 현재가 불러오기 : argument는 s_date, ticker / return : float type */
//     $.ajax({
//         type:'POST',
//         url:'http://14.49.45.139:80/currentlist',
//         data:{
//             "tickerlist": tickerlist,
//         },
//         dataType: 'json',
//         global: false,

//         success:function(data)
//         {
//             currentlist = data['currentlist']
//             //console.log(currentlist)
//             for (var i = 0; i < currentlist.length; i++) {
//                 var profit = Number(((currentlist[i]*0.9975 - closelist[i]) / closelist[i] *100 ).toFixed(1))
//                 //console.log(profit)
//                 profitlist.push(profit)
//             }

//             return profitlist

//         },

//         error: function() {
//             alert('error');
//         }
//     });
//     return profitlist
// }

function discoverFunction(data, stockMarket) {
    let isOpen = data['isOpen']    // 개장일이 맞는지 여부 확인
    if (!isOpen) {
        console.log(isOpen);
    }
    else {
        let realDate = data['realDate']
        console.log(realDate)
        window.localStorage.setItem('realDate', realDate)
        // document.getElementById('currentDate').value = new Date(realDate);

        let results = data['results']
        let currentlist = data['currentlist']
        let ensemble_prob = data['ensemble_prob']
        let ensemble_result = data['ensemble_result']
        yolo_result = data['yolo']
        // console.log(ensemble_prob)
        // console.log(ensemble_result)

        let tableContent = document.getElementById('discoverTableDiv');

        // Create table
        let table = document.createElement('table');
        table.setAttribute('id', 'discoverTable_id')
        table.classList.add('discoverTable', 'table-fill');

        // Setting headers of table
        let thead = document.createElement('thead');
        let tr1 = document.createElement('tr');
        let tr2 = document.createElement('tr');

        let th1 = document.createElement('th');
        th1.classList.add('text-center', 'sticky-head-one', 'thBold', 'th1', 'exceptModels_th')
        th1.setAttribute('rowspan', '2')
        th1.innerHTML = '종목명'
        tr1.appendChild(th1)
        let th2 = document.createElement('th');
        th2.classList.add('text-center', 'sticky-head-one', 'thBold', 'th2', 'exceptModels_th')
        th2.setAttribute('rowspan', '2')
        th2.innerHTML = '종가'
        tr1.appendChild(th2)
        let th3 = document.createElement('th');
        th3.classList.add('text-center', 'sticky-head-one', 'th3');
        th3.setAttribute('colspan', '4')
        th3.innerHTML = '예측모델 5-Day 상승 확률'
        tr1.appendChild(th3)

        let th3_1 = document.createElement('th');
        th3_1.classList.add('text-center', 'sticky-head-one', 'thBold')
        th3_1.innerHTML = 'VGG16'
        tr2.appendChild(th3_1)
        let th3_2 = document.createElement('th');
        th3_2.classList.add('text-center', 'sticky-head-one', 'thBold')
        th3_2.innerHTML = 'EfficientNet'
        tr2.appendChild(th3_2)

        // let th3_3 = document.createElement('th');
        // th3_3.classList.add('text-center', 'sticky-head-one', 'thBold')
        // th3_3.innerHTML = '앙상블'
        // tr2.appendChild(th3_3)

        let th3_4 = document.createElement('th');
        th3_4.classList.add('text-center', 'sticky-head-one', 'thBold')
        th3_4.innerHTML = 'Yolo'
        tr2.appendChild(th3_4)

        thead.appendChild(tr1)
        thead.appendChild(tr2)
        table.appendChild(thead)

        // Setting table body
        let tbody = document.createElement('tbody')
        tbody.classList.add('table-hover')
        let count=0
        console.log(results)
        for (const predictInfo of results) {
            let ticker = predictInfo[0]
            let stock = predictInfo[1]
            let close = predictInfo[2]
            let vggRes = predictInfo[3][0][1]
            let vggProb = predictInfo[3][0][2]
            let effiRes = predictInfo[3][1][1]
            let effiProb = predictInfo[3][1][2]
            let yoloRes = predictInfo[3][2][1]
            let yoloProb = predictInfo[3][2][2]
            let sumProb = predictInfo[4]
            let profit = null
            let currentClose = currentlist[count]
            //let ensembleRes = ensemble_result[count]
            //let ensembleProb = ensemble_prob[count]
            count++;

            let tr = document.createElement('tr')
            tr.setAttribute('id', 'row'+String(count))

            let td1 = document.createElement('td')
            td1.classList.add('text-left', 'exceptModels')
            let td2 = document.createElement('td')
            td2.classList.add('text-left', 'exceptModels')
            let td3 = document.createElement('td')
            td3.classList.add('text-left')
            let td4 = document.createElement('td')
            td4.classList.add('text-left')
            // let td5 = document.createElement('td')
            // td5.classList.add('text-left')
            let td6 = document.createElement('td')
            td6.classList.add('text-left')

            let td1LabelDiv = document.createElement('div')
            td1LabelDiv.classList.add('stockNameLabel')
            // td1LabelDiv.innerHTML = ">??<"
            let td1LabelImg = document.createElement('img')
            td1LabelImg.classList.add('stockNameLabel_img')

            if (vggRes === 1.0 && effiRes === 1.0) {    // 기준점 : probability threshold + 0.5
                td1LabelImg.setAttribute('src', 'static/images/label_strong_buy.png')
                td1LabelImg.setAttribute('alt', 'strong buy label')
            }
            else {
                td1LabelImg.setAttribute('src', 'static/images/label_moderate_buy.png')
                td1LabelImg.setAttribute('alt', 'moderate buy label')
            }

            td1LabelDiv.appendChild(td1LabelImg)

            let td1StringDiv = document.createElement('div')
            td1StringDiv.classList.add('stockNameString')
            let td1String = '<b>' + String(ticker) + '</b>' + '<br>' + "<span class='stockName'>" + String(stock) + "</span>"
            td1StringDiv.innerHTML = td1String

            let td2String = close.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'

            if (currentClose == close) {
                profit = 0
            }
            else {
                profit = Number(((currentClose*0.9975 - close) / close *100 ).toFixed(1))
            }
            if (profit != null) {
                if (profit > 0.0) {
                    td2String = td2String + '&nbsp;&nbsp;&nbsp;' + '<span style="color:red">+' + String(profit) + '%</span>'
                    //console.log(profit)
                }
                else if (profit < 0.0){
                    td2String = td2String + '&nbsp;&nbsp;&nbsp;' + '<span style="color:blue">' + String(profit) + '%</span>'
                }
                else {
                    td2String = td2String + '&nbsp;&nbsp;&nbsp;' + '<span>' + String(profit) + '%</span>'
                }
            }

            let td3String = String(vggProb) + '%'
            let td4String = String(effiProb) + '%'
            // let td5String = String(ensembleProb) + '%'
            let td6String;
            if (yoloRes == 1.0) {
                td6String = String(yoloProb) + '%'
            }
            else {
                td6String = '―'
            }
            console.log(td6String)

            /* Start edit */
            let vggProbText = document.createElement('div')
            vggProbText.style.float = 'left'
            vggProbText.innerHTML = td3String
            td3.appendChild(vggProbText)

            let effiProbText = document.createElement('div')
            effiProbText.style.float = 'left'
            effiProbText.innerHTML = td4String
            td4.appendChild(effiProbText)

            // let ensembleProbText = document.createElement('div')
            // ensembleProbText.style.float = 'left'
            // ensembleProbText.innerHTML = td5String
            // td5.appendChild(ensembleProbText)

            let yoloProbText = document.createElement('div')
            yoloProbText.style.textAlign = 'center'
            yoloProbText.innerHTML = td6String
            td6.appendChild(yoloProbText)

            let vggProbCheck = document.createElement('div')
            let effiProbCheck = document.createElement('div')
            //let ensembleProbCheck = document.createElement('div')

            if (vggRes === 1.0) {
                //console.log("vgg checked!")
                vggProbCheck.classList.add('v60_1574')
                let checkImage = document.createElement('img')
                checkImage.classList.add('icons')
                checkImage.setAttribute('src', "static/images/checked.png")
                checkImage.setAttribute('alt', "checked icon")
                vggProbCheck.appendChild(checkImage)
            }
            else {
                vggProbCheck.classList.add('v60_1574_unchecked')
                let checkImage = document.createElement('img')
                checkImage.classList.add('icons')
                checkImage.setAttribute('src', "static/images/unchecked.png")
                checkImage.setAttribute('alt', "unchecked icon")
                vggProbCheck.appendChild(checkImage)
            }
            td3.appendChild(vggProbCheck)

            if (effiRes === 1.0) {
                //console.log("effi checked!")
                effiProbCheck.classList.add('v60_1574')
                let checkImage = document.createElement('img')
                checkImage.classList.add('icons')
                checkImage.setAttribute('src', "static/images/checked.png")
                checkImage.setAttribute('alt', "checked icon")
                effiProbCheck.appendChild(checkImage)
            }
            else {
                effiProbCheck.classList.add('v60_1574_unchecked')
                let checkImage = document.createElement('img')
                checkImage.classList.add('icons')
                checkImage.setAttribute('src', "static/images/unchecked.png")
                checkImage.setAttribute('alt', "unchecked icon")
                effiProbCheck.appendChild(checkImage)
            }
            td4.appendChild(effiProbCheck)


            // if (ensembleRes === 1.0) {
            //     ensembleProbCheck.classList.add('v60_1574')
            //     let checkImage = document.createElement('img')
            //     checkImage.classList.add('icons')
            //     checkImage.setAttribute('src', "static/images/checked.png")
            //     checkImage.setAttribute('alt', "checked icon")
            //     ensembleProbCheck.appendChild(checkImage)
            // }
            // else {
            //     ensembleProbCheck.classList.add('v60_1574_unchecked')
            //     let checkImage = document.createElement('img')
            //     checkImage.classList.add('icons')
            //     checkImage.setAttribute('src', "static/images/unchecked.png")
            //     checkImage.setAttribute('alt', "unchecked icon")
            //     ensembleProbCheck.appendChild(checkImage)
            // }
            // td5.appendChild(ensembleProbCheck)


            /* End edit */

            //td1.innerHTML = td1String
            td1.appendChild(td1LabelDiv)
            td1.appendChild(td1StringDiv)
            td2.innerHTML = td2String

            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            // tr.appendChild(td5)
            tr.appendChild(td6)
            tbody.appendChild(tr)
            //var currentClose_inDiscover = window.localStorage.getItem('currentClose_inDiscover')
        }

        table.appendChild(tbody)
        tableContent.appendChild(table)
    }
}

// Table 부분 + default 실행
$(document).ready(function() {
    // default로 yolo 저장
    let yolo_default = {
        'Ticker': [],
        'Name': [],
        'Probability': [],
        'Signal': [],
        'Start': [],
        'End': [],
        'Date': '',
    }
    window.localStorage.setItem('yolo', JSON.stringify(yolo_default));

    // default로 실행
    window.localStorage.setItem('login', false);
    console.log('*** default ***')
    $('#discoverTableDiv').empty()
    $('#assetTableBody').empty()
    let backtestProgress = document.getElementById('backtestProgress')
    backtestProgress.value = 0

    var stockMarket = $('input[name=stockMarket]:checked').val();
    var numOfStock_str = $('input[name=topNumber]').val();
    var numOfStock = parseInt(numOfStock_str)

    // var selectedDate = $('input[name=date]').val();

    if (stockMarket === 'KOSPI') {
        window.localStorage.setItem('market', 'Kospi')
    }
    else {
        window.localStorage.setItem('market', 'kosdaq')
    }

    const today = new Date();   

    const hours = today.getHours(); // 시
    const minutes = today.getMinutes();  // 분
    
    const time = hours * 60 + minutes;

    $.ajax({
        type:'POST',
        url:'http://14.49.45.139:80/discover',
        data:{
            "stockMarket": stockMarket,
            "numOfStock": numOfStock,
            // "date": selectedDate,
        },
        dataType: 'json',
        success:function(data)
        {
            //var profitlist = getProfitList(data['results'])
            //console.log(profitlist)
            discoverFunction(data, stockMarket)
            if (stockMarket === 'KOSPI') {
                localStorage.setItem('kospi_discover', 1)
                localStorage.setItem('kospi_time', time)
                localStorage.setItem('kospi_data', JSON.stringify(data))
            }
            else {
                localStorage.setItem('kosdaq_discover', 1)
                localStorage.setItem('kosdaq_time', time)
                localStorage.setItem('kosdaq_data', JSON.stringify(data))
            }
        },
        error: function() {
            alert('error');
        }
    });
});

$(document).ready(function() {
    // input 값 변경시 실행
    $( 'input[name=stockMarket]' ).change( function() {
        console.log('input data changed')

        $('#discoverTableDiv').empty()
        $('#assetTableBody').empty()
        var stockMarket = $('input[name=stockMarket]:checked').val();
        var numOfStock_str = $('input[name=topNumber]').val();
        var numOfStock = parseInt(numOfStock_str)

        // var selectedDate = $('input[name=date]').val();
        console.log(stockMarket)
        // console.log(selectedDate)

        if (stockMarket === 'KOSPI') {
            window.localStorage.setItem('market', 'Kospi')
        }
        else {
            window.localStorage.setItem('market', 'kosdaq')
        }

        const today = new Date();   

        const hours = today.getHours(); // 시
        const minutes = today.getMinutes();  // 분
        
        const time = hours * 60 + minutes;

        if (stockMarket === 'KOSPI') {
            if (localStorage.getItem('kospi_discover') == 1) {
                const last_time = localStorage.getItem('kospi_time')
                if (last_time - time <= 5) {
                    const data = JSON.parse(localStorage.getItem('kospi_data'));
                    discoverFunction(data, stockMarket);
                    return;
                }
            }
        }
        else {
            if (localStorage.getItem('kosdaq_discover') == 1) {
                const last_time = localStorage.getItem('kosdaq_time')
                if (last_time - time <= 5) {
                    const data = JSON.parse(localStorage.getItem('kosdaq_data'));
                    discoverFunction(data, stockMarket);
                    return;
                }
            }
        }
        $.ajax({
            type:'POST',
            url:'http://14.49.45.139:80/discover',
            data:{
                "stockMarket": stockMarket,
                "numOfStock": numOfStock,
                // "date": selectedDate,
            },
            dataType: 'json',

            success:function(data)
            {
                discoverFunction(data, stockMarket);
                if (stockMarket === 'KOSPI') {
                    localStorage.setItem('kospi_discover', 1)
                    localStorage.setItem('kospi_time', time)
                    localStorage.setItem('kospi_data', JSON.stringify(data))
                }
                else {
                    localStorage.setItem('kosdaq_discover', 1)
                    localStorage.setItem('kosdaq_time', time)
                    localStorage.setItem('kosdaq_data', JSON.stringify(data))
                }
            },
            error: function() {
                alert('error');
            }
        });
    } );

    $( 'input[name=topNumber]' ).change( function() {
        console.log('input data changed')

        $('#discoverTableDiv').empty()
        $('#assetTableBody').empty()
        var stockMarket = $('input[name=stockMarket]:checked').val();
        var numOfStock_str = $('input[name=topNumber]').val();
        var numOfStock = parseInt(numOfStock_str)

        // var selectedDate = $('input[name=date]').val();
        console.log(stockMarket)
        // console.log(selectedDate)

        if (stockMarket === 'KOSPI') {
            window.localStorage.setItem('market', 'Kospi')
        }
        else {
            window.localStorage.setItem('market', 'kosdaq')
        }

        $.ajax({
            type:'POST',
            url:'http://14.49.45.139:80/discover',
            data:{
                "stockMarket": stockMarket,
                "numOfStock": numOfStock,
                // "date": selectedDate,
            },
            dataType: 'json',

            success:function(data)
            {
                discoverFunction(data, stockMarket);
            },
            error: function() {
                alert('error');
            }
        });
    } );

});


$(window).load(function() {
    $(document.body).delegate('#discoverTable_id tr', 'click', function() {
    //$("#discoverTable_id tr").click( function() {
        console.log('row clicked')
        var tdArr = new Array;
        var tr = $(this);
        var td = tr.children();

        td.each(function(i){
            tdArr.push(td.eq(i).text());
        });

        var stockName = tdArr[0].substring(7)

        var closeProfit = tdArr[1]
        var str = window.localStorage.getItem('realDate')

        var year = str.substring(0, str.indexOf('-')) + "년 ";
        var month = str.substring(str.indexOf('-')+1, str.indexOf('-', str.indexOf('-')+1)) + "월 ";
        var date = str.substring(str.lastIndexOf('-') + 1) + "일 ";

        var rightDate = year + month + date + "오후 3:30";
        var rightClosePrice;
        var rightProfit;

        // td2String = td2String + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '<span style="color:red">+' + String(profit) + '%</span>'
        if (closeProfit.includes('%')) {
            var close = closeProfit.substring(0, closeProfit.indexOf('원') + 1);
            var profit = (closeProfit.substring(closeProfit.lastIndexOf('원') + 1)).trim();

            rightClosePrice = close
            rightProfit = profit
        }
        else {
            rightClosePrice = closeProfit;
            rightProfit = "";
        }
        document.getElementById('rightStockName').innerHTML = stockName
        document.getElementById('rightDate').innerHTML = rightDate
        document.getElementById('rightClosePrice').innerHTML = rightClosePrice
        document.getElementById('rightProfit').innerHTML = rightProfit

        if (closeProfit.includes('%')) {
            profit_float = parseFloat(profit.substring(0, profit.indexOf('%')))
            console.log(profit_float)
            if (profit_float > 0.0) {
                document.getElementById('rightProfit').classList.add('v1_955_red')
            }
            else {
                document.getElementById('rightProfit').classList.add('v1_955_blue')
            }
        }

        /* 현재가 불러오기 : argument는 s_date, ticker / return : float type */
        $.ajax({
            type:'POST',
            url:'http://14.49.45.139:80/current',
            data:{
                "s_date": rightDate,
                "ticker": tdArr[0].substring(0, 7),
            },
            dataType: 'json',
            global: false,

            success:function(data)
            {
                var currentClose = data['currentClose']
                //console.log(currentClose)
                window.localStorage.setItem('currentClose', currentClose)
                //console.log(window.localStorage.getItem('currentClose'));
            },

            error: function() {
                alert('error');
            }
        });

        window.localStorage.setItem('ticker', tdArr[0].substring(0, 7))
        window.localStorage.setItem('s_date', str)
        window.localStorage.setItem('buyClose', (closeProfit.substring(0, closeProfit.indexOf('원'))).replace(/,/g, ""))

        window.localStorage.setItem('stockName', stockName)



        frontGraph()


    });


    $(document.body).delegate('.minus_class', 'click', function() {
        const resultElement = document.getElementById('numOfBuy');
        let number = resultElement.innerHTML;

        if (parseInt(number) > 0) {
            number = parseInt(number) - 1;
        }
        resultElement.innerHTML = number;
    });

    $(document.body).delegate('.plus_class', 'click', function() {
        const resultElement = document.getElementById('numOfBuy');
        let number = resultElement.innerHTML;

        number = parseInt(number) + 1;
        resultElement.innerHTML = number;
    });

    $(document.body).delegate('.buy_class', 'click', function() {

        // Get Data
        var ticker = window.localStorage.getItem('ticker');
        var stockName = window.localStorage.getItem('stockName');
        var s_date = window.localStorage.getItem('s_date');
        var buyClose = window.localStorage.getItem('buyClose');
        var buyCount = document.getElementById('numOfBuy').innerHTML;
        var currentClose = "";
        var totalBuyPrice = (parseInt(buyCount) * parseInt(buyClose)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        var totalCurrentPrice = "";
        var difference = "";
        var profit = "";
        var color = null;
        var stockMarket = $('input[name=stockMarket]:checked').val();

        if (buyCount == 0) {
            alert("매수 수량은 0보다 커야합니다.")
            return;
        }
        else {
            alert("Added to asset")
            document.getElementById('numOfBuy').innerHTML = 0;
        }

        /* 현재가 불러오기 : argument는 s_date, ticker / return : float type */
        $.ajax({
            type:'POST',
            url:'http://14.49.45.139:80/current',
            data:{
                "s_date": s_date,
                "ticker": ticker,
            },
            dataType: 'json',

            success:function(data)
            {
                var currentClose = data['currentClose']
                //console.log(currentClose)
                window.localStorage.setItem('currentClose', currentClose)
                //console.log(window.localStorage.getItem('currentClose'));
            },

            error: function() {
                alert('error');
            }
        });
        console.log(window.localStorage.getItem('currentClose'));
        currentClose = window.localStorage.getItem('currentClose');

        /* 불러온 현재가를 기반으로 totalCurrentPrice, difference, profit 계산 */
        totalCurrentPrice = (parseInt(buyCount) * parseInt(currentClose)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        difference = (parseInt(buyCount)) * (parseInt(currentClose)*0.9975 - parseInt(buyClose))
        console.log("평가손익 : ")
        console.log(difference)
        var float_totalCurrentPrice = parseInt(buyCount) * parseInt(currentClose)
        var float_totalBuyPrice = parseInt(buyCount) * parseInt(buyClose)
        var profit_float = ((float_totalCurrentPrice * 0.9975 - float_totalBuyPrice) / float_totalBuyPrice )*100;
        profit = (Number((profit_float).toFixed(1))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%'

        /* parseInt(buyClose), parseInt(currentClose) 비교해서 currentClose, totalCurrentPrice, profit, difference 색깔 지정하기 */
        if (parseInt(buyClose) < parseInt(currentClose)) {
            color = 'red'
        }
        else {
            color = 'blue'
        }
        if (color === 'red') {
            profit = '+' + profit;
        }

        const tbody = document.getElementById('assetTableBody');

        let tr = document.createElement('tr')

        let td1 = document.createElement('td')
        td1.classList.add('text-left')
        let td2 = document.createElement('td')
        td2.classList.add('text-right')
        let td3 = document.createElement('td')
        td3.classList.add('text-right')
        let td4 = document.createElement('td')
        td4.classList.add('text-right')
        let td5 = document.createElement('td')
        td5.classList.add('text-right')

        td1.innerHTML = ticker + '<br>' + stockName;
        td2.innerHTML = '<span style="color:' + String(color) + '">' + difference.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '<br>' + String(profit) + '</span>';
        td3.innerHTML = String(buyCount);
        td4.innerHTML = parseInt(buyClose).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '<br>' + '<span style="color:' + String(color) + '">' + parseInt(currentClose).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</span>';
        td5.innerHTML = totalBuyPrice + '<br>' + totalCurrentPrice;

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)

        tbody.appendChild(tr)


        // Asset DB에도 추가 - 로그인 되어있을 경우만
        let login = localStorage.getItem('login')
        // console.log("login : ")
        // console.log(typeof(login))
        if (login === '1') {
            console.log("user info : ")
            let user_id = localStorage.getItem('user_id')
            console.log(user_id)
            $.ajax({
                type:'POST',
                url:'http://14.49.45.139:80/updateasset1',
                data:{
                    "user_id" : user_id,
                    "ticker" : ticker,
                    "name" : stockName,
                    "buy_date" : s_date,
                    "buy_close" : buyClose,
                    "buy_count" : buyCount,
                    "current_close" : currentClose,
                    "profit" : profit_float,
                    "difference" : difference,
                    "buy_total" : float_totalBuyPrice,
                    "current_total" : float_totalBuyPrice,
                    "market" : stockMarket,
                },
                dataType: 'json',

                success:function(data)
                {


                },

                error: function() {
                    alert('error');
                }
            });
        }

        // // yolo stock analysis
        // var yolo = JSON.parse(window.localStorage.getItem('yolo'));
        // var stockMarket = $('input[name=stockMarket]:checked').val();
        // if (yolo['Ticker'].includes(ticker)) {
        //     return;
        // }
        // console.log('Yolo Detection ' + ticker);
        // $.ajax({
        //     type:'POST',
        //     url:'http://14.49.45.139:80/sell',
        //     data:{
        //         "ticker": ticker,
        //         "s_date": s_date,
        //         "stockMarket": stockMarket,
        //     },
        //     dataType: 'json',
        //
        //     success:function(data)
        //     {
        //         var signal = data['signal']
        //         if (signal == 'FileNotFoundError') {
        //             return;
        //         }
        //         var probability = data['probability']
        //         var trade_date = data['trade_date']
        //         var start = data['start']
        //         var end = data['end']
        //         //console.log(currentClose)
        //         yolo['Ticker'].push(ticker);
        //         yolo['Name'].push(stockName);
        //         yolo['Date'] = trade_date;
        //         yolo['Probability'].push(probability);
        //         yolo['Signal'].push(signal);
        //         yolo['Start'].push(start);
        //         yolo['End'].push(end);
        //         window.localStorage.setItem('yolo', JSON.stringify(yolo));
        //         //console.log(window.localStorage.getItem('currentClose'));
        //     },
        //
        //     error: function() {
        //         alert('error');
        //     }
        // });
        // img = '/static/predict/' + ticker + '_' + trade_date + '.png';
        // console.log('Img Source: ' + img);
    });
});

// My Asset Tab Clicked
$(window).load(function() {
    $(document.body).delegate('.myAssetTabClass, .refresh_icon', 'click', function() {
        let login = localStorage.getItem('login')
        let updated = localStorage.getItem('updated')

        if (login === '1' && updated === '0') {
            let user_id = localStorage.getItem('user_id');

            // 일단 myasset table 비우기
            $('#assetTableBody').empty()

            $.ajax({
                type:'POST',
                url:'http://14.49.45.139:80/updateasset2',
                data:{
                    "user_id" : user_id,
                    "s_date": today,
                },
                dataType: 'json',

                success:function(data)
                {
                    // yolo detection 결과
                    let Kospi = data['Kospi']
                    let Kosdaq = data['Kosdaq']
                    console.log(Kospi)
                    console.log(Kosdaq)
                    // myasset table 수정
                    let asset_list = data['asset_list']
                    let total_list = data['total_list']
                    console.log("asset_list : ")
                    console.log(asset_list)
                    // myasset total asset info 수정
                    const tbody = document.getElementById('assetTableBody');

                    for (const stock of asset_list) {
                        let ticker = stock['ticker']
                        let name = stock['name']
                        let difference = stock['difference']
                        let profit = stock['profit']
                        let buy_count = stock['buy count']
                        let buy_close = stock['buy close']
                        let buy_total = stock['buy total']
                        let current_close = stock['current close']
                        let current_total = stock['current total']
                        let dayprofit_list = stock['dayprofit']
                        let color = null;

                        if (parseInt(buy_close) < parseInt(current_close)) {
                            color = 'red'
                        }
                        else {
                            color = 'blue'
                        }
                        if (color === 'red') {
                            profit = '+' + profit;
                        }

                        let tr = document.createElement('tr')

                        let td1 = document.createElement('td')
                        td1.classList.add('text-left')
                        let td2 = document.createElement('td')
                        td2.classList.add('text-right')
                        let td3 = document.createElement('td')
                        td3.classList.add('text-right')
                        let td4 = document.createElement('td')
                        td4.classList.add('text-right')
                        let td5 = document.createElement('td')
                        td5.classList.add('text-right')

                        td1.innerHTML = ticker + '<br>' + name;
                        td2.innerHTML = '<span style="color:' + String(color) + '">' + difference.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '<br>' + String(profit) + '%</span>';
                        td3.innerHTML = String(buy_count);
                        td4.innerHTML = parseInt(buy_close).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '<br>' + '<span style="color:' + String(color) + '">' + parseInt(current_close).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</span>';
                        td5.innerHTML = buy_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '<br>' + current_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                        tr.appendChild(td1)
                        tr.appendChild(td2)
                        tr.appendChild(td3)
                        tr.appendChild(td4)
                        tr.appendChild(td5)

                        let td_day1 = document.createElement('td')
                        td_day1.classList.add('text-center')
                        let td_day2 = document.createElement('td')
                        td_day2.classList.add('text-center')
                        let td_day3 = document.createElement('td')
                        td_day3.classList.add('text-center')
                        let td_day4 = document.createElement('td')
                        td_day4.classList.add('text-center')
                        let td_day5 = document.createElement('td')
                        td_day5.classList.add('text-center')

                        let count_td = 0
                        td_list = [td_day1, td_day2, td_day3, td_day4, td_day5]
                        for (const dayprofit of dayprofit_list) {
                            let td_curr = td_list[count_td]

                            if (dayprofit[0] == -1) {
                                td_curr.innerHTML = '-';
                            }
                            else {
                                if (dayprofit[1] > buy_close) {
                                    td_curr.innerHTML = '<span style="color:red">+' + String(dayprofit[2]) + '%</span>'
                                }
                                else {
                                    td_curr.innerHTML = '<span style="color:blue">' + String(dayprofit[2]) + '%</span>'
                                }
                            }
                            count_td += 1
                        }

                        tr.appendChild(td_day1)
                        tr.appendChild(td_day2)
                        tr.appendChild(td_day3)
                        tr.appendChild(td_day4)
                        tr.appendChild(td_day5)

                        tbody.appendChild(tr)
                    }

                    // update total info
                    let total_gain = total_list[0]
                    let total_buy = total_list[1]
                    let real_gain = total_list[2]
                    let total_current = total_list[3]
                    let total_profit = total_list[4]

                    if (total_gain > 0) {
                        document.getElementById('assetTotalGain').innerHTML = "+" + total_gain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "&nbsp;원"
                        document.getElementById('assetTotalProfit').innerHTML = "+" + String(total_profit) + "&nbsp;%"
                    }
                    else {
                        document.getElementById('assetTotalGain').innerHTML = total_gain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "&nbsp;원"
                        document.getElementById('assetTotalProfit').innerHTML = String(total_profit) + "&nbsp;%"
                    }

                    document.getElementById('assetTotalBuy').innerHTML = total_buy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "&nbsp;원"
                    document.getElementById('assetTotalCurrent').innerHTML = total_current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "&nbsp;원"

                    document.getElementById('assetRealGain').innerHTML = real_gain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "&nbsp;원"

                    //localStorage.setItem('updated', 1);
                },

                error: function() {
                    alert('error');
                }
            });
        }
        else {
            console.log("not logged in.");
        }
    });
});


// Back Testing
$(window).load(function() {
    $(document.body).delegate('.backtest', 'click', function() {
        //$.LoadingOverlay("show");
        $('#back_01Div').empty()
        $('#cumulative_chart').empty()
        $('#winning_rate').empty()

        var startDate = $('input[id=startDate]').val();
        var endDate = $('input[id=endDate]').val();
        var stocks = $('input[name=numberOfStocks]').val();
        var stockMarket = $('input[name=backTestStockMarket]:checked').val();
        //var model= $('input[name=backTestModel]:checked').val();
        var model = []
        $("input[name=backTestModel]:checked").each(function() {
            var chk = $(this).val();
            model.push(chk);
        });
        console.log(model)
        var sellcondition = $('input[name=declineRate]').val();


        $.ajax({
            type:'POST',
            url:'http://14.49.45.139:80/backtest',
            data:{
                "startDate" : startDate,
                "endDate" : endDate,
                "stocks" : stocks,
                "stockMarket" : stockMarket,
                "model" : model,
                "sellcondition" : sellcondition,
            },
            dataType: 'json',
            global: false,

            success:function(data)
            {
               let profit = data['profit'];
               console.log("pro : ",profit['profit']);
               //profit = profit['profit']
               let profitDiv = document.createElement('div');
               let back_01Div = document.getElementById('back_01Div');

               if (profit > 0) {
                    profitDiv.classList.add('back_01_profit', 'back_profit_plus');
                    profitDiv.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;+' + String(profit) + '%';
               }
               else {
                    profitDiv.classList.add('back_01_profit', 'back_profit_minus');
                    profitDiv.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + String(profit) + '%';
               }

               back_01Div.appendChild(profitDiv);

               // showing images
               let chartDiv = document.getElementById('cumulative_chart');
               let rateDiv = document.getElementById('winning_rate');

               let chartImage = document.createElement('img');
               let rateImage = document.createElement('img');
               chartImage.classList.add('img_backtestChart');
               rateImage.classList.add('img_backtestChart_win');

               chartImage.setAttribute('src', '../static/images/cumulative_profit.png')
               chartImage.setAttribute('alt', 'cumulative profit chart');

               rateImage.setAttribute('src', '../static/images/winning_rate.png')
               rateImage.setAttribute('alt', 'winning rate chart');

               // back_02_image, img_backtestChart
               chartDiv.appendChild(chartImage);
               rateDiv.appendChild(rateImage);

               console.log("end backtest")
            },

            error: function() {
                alert('error');
            }
        });
        //$.LoadingOverlay("hide");
        // $(document).ajaxStart(function () {
        //     console.log("starting backtest")
        // })
        // $(document).ajaxStop(function () {
        //     console.log("ending backtest")
        // })
    });
});

function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

// backtest progress bar
$(window).load(function() {
    $(document.body).delegate('.backtest', 'click', function() {
        let message = document.getElementById("loadingMessage");
        message.innerHTML = "Loading...<br>"
        document.getElementById("backtestProgress").value = 0;

        var stocks = $('input[name=numberOfStocks]').val();
        var stockMarket = $('input[name=backTestStockMarket]:checked').val();
        var startDate = $('input[id=startDate]').val();
        var endDate = $('input[id=endDate]').val();

        let secondPerDay;
        if (stockMarket === "KOSPI") {
            secondPerDay = 0.025; // 하루에 0.8초 소요
        }
        else {
            secondPerDay = 0.027;
        }

        $.ajax({
            type:'POST',
            url:'http://14.49.45.139:80/getopendates',
            data:{
                "startDate" : startDate,
                "endDate" : endDate,
            },
            dataType: 'json',
            global: false,

            success:function(data)
            {
                (async () => {
                    let countDates = data['countDates'];

                    let totalTime = countDates * secondPerDay * 2;
                    let movePerTime = 100 / totalTime;
                    console.log("totalTime : ", totalTime)

                    let progress = document.getElementById("backtestProgress");
                    // for (f = 1; f <= countDates; f++) {
                    //     await sleep(1);
                    //     console.log(f)
                    //     var curr = progress.value;
                    //     curr += movePerTime;
                    //     progress.value = curr;

                    //     if (progress.value >= 100) {
                    //         break;
                    //     }
                    // }
                    progress.value = 1;
                    for (t = 0; t < totalTime; t++) {
                        //console.log(t)
                        await sleep(1)

                        var curr = progress.value;
                        // var goal = curr + movePerTime;
                        // while(1) {
                        //     curr = curr * 1.1
                        //     progress.value = curr;
                        //     if (progress.value >= goal) {
                        //         break;
                        //     }
                        // }
                        curr += movePerTime;
                        progress.value = curr;
                    }
                    message.innerHTML = "Complete!<br>"
                })();
            },

            error: function() {
                alert('error');
            }
        });
    });
});




/* This is JP's YOLO js function part */

$(document.body).delegate('#leftbox', 'click', function() {
    const resultElement = document.getElementById('numOfSell');
    let number = resultElement.innerHTML;

    if (parseInt(number) > 0) {
        number = parseInt(number) - 1;
    }
    resultElement.innerHTML = number;
});

$(document.body).delegate('#rightbox', 'click', function() {
    const resultElement = document.getElementById('numOfSell');
    let number = resultElement.innerHTML;

    number = parseInt(number) + 1;
    resultElement.innerHTML = number;
});

// This is where we start our new yolo function from mongoDB

$(window).load(function() {
    $(document.body).delegate('.myAssetTabClass, .refresh_icon', 'click', function() {
        let login = localStorage.getItem('login')
        let updated = localStorage.getItem('updated')
        var yolo = JSON.parse(window.localStorage.getItem('yolo'));


        if (login === '1' && updated === '0') {
            let user_id = localStorage.getItem('user_id');

            // 일단 myasset table 비우기
            $('#sidebar').empty()

            $.ajax({
                type:'POST',
                url:'http://14.49.45.139:80/updateasset2',
                data:{
                    "user_id" : user_id,
                },
                dataType: 'json',

                success:function(data)
                {
                    // yolo detection 결과
                    let detect = data['detect']
                    console.log('Yolo Detection Result: ')
                    console.log(detect)

                    // myasset table 수정
                    let asset_list = data['asset_list']

                    console.log("asset_list : ")
                    console.log(asset_list)
                    // myasset total asset info 수정
                    // let yolo = JSON.parse(window.localStorage.getItem("yolo"));
                    let sidebar = document.getElementById('sidebar');

                    let i = 0;

                    for (const stock of asset_list) {
                        let ticker = stock['ticker']
                        let name = stock['name']
                        let buy_count = stock['buy count']
                        let buy_date = stock['buy date']

                        console.log(ticker)
                        console.log(buy_count)
                        console.log('Ticker: ' + ticker.slice(1))
                        console.log('Yolo: ' + detect[ticker.slice(1)])
                        let probability = detect[ticker.slice(1)][3]
                        let signal = detect[ticker.slice(1)][2]

                        let card = document.createElement("div")
                        card.setAttribute("class", "card")

                        let yoloArticle = document.createElement("article")
                        yoloArticle.setAttribute("id", "yoloArticle")


                        let yoloProb = document.createElement("section")
                        yoloProb.setAttribute("id", "yoloProb")

                        let yoloImage = document.createElement("section")
                        yoloImage.setAttribute("class", "yoloImage")
                        yoloImage.setAttribute("id", "yoloImage")

                        let thumb = document.createElement("div")
                        thumb.setAttribute("class", 'thumb')
                        thumb.setAttribute("id", "thumb" + i)
                        //thumb.setAttribute("style", "background-image: url(" + img + " )")

                        let yoloButtons = document.createElement("section")
                        yoloButtons.setAttribute("id", "yoloButtons")

                        let icon1 = document.createElement("div")
                        icon1.setAttribute("class", "icon1")

                        let ellipseIcon = document.createElement("img")
                        ellipseIcon.setAttribute("src",  "static/images/Ellipse 2.png")
                        ellipseIcon.setAttribute("id", "ellipseIcon")

                        let icon2 = document.createElement("div")
                        icon2.setAttribute("class", "icon2")

                        let stockName = document.createElement("h1")
                        stockName.setAttribute("id", "stockName")
                        let textnode = document.createTextNode(name);
                        stockName.appendChild(textnode)

                        let icon3 = document.createElement("div")
                        icon3.setAttribute("class", "icon3")

                        let yoloPrice = document.createElement("a")
                        yoloPrice.setAttribute("id", "yoloPrice")

                        let yoloChange = document.createElement("a")
                        yoloChange.setAttribute("id", "yoloChange")

                        icon1.appendChild(ellipseIcon)
                        yoloArticle.appendChild(icon1)

                        icon2.appendChild(stockName)
                        yoloArticle.appendChild(icon2)

                        icon3.appendChild(yoloPrice)
                        icon3.appendChild(yoloChange)

                        yoloArticle.appendChild(icon3)

                        //This is where we do image

                        let pie_circle = document.createElement("div")
                        pie_circle.setAttribute("class", "circular-progress")

                        let pie_number = document.createElement("div")
                        pie_number.setAttribute("class", "value-container")
                        pie_number.innerHTML = "0%"

                        pie_circle.appendChild(pie_number)

                        yoloProb.appendChild(pie_circle)


                        yoloImage.appendChild(thumb)

                       //This is where we do the buttons

                        let transactionButton = document.createElement("div")
                        transactionButton.setAttribute("class", "transaction-button")

                        let change1 = document.createElement("div")
                        change1.setAttribute("class", "change1")

                        let leftbox = document.createElement("div")
                        leftbox.setAttribute("class", "leftbox minus_class")
                        leftbox.setAttribute("id", "leftbox" + i)
                        leftbox.setAttribute("onclick", `minus(${i}, ${buy_count})`)


                        let yolo_minus = document.createElement("span")
                        yolo_minus.setAttribute("id", "yolo-minus")
                        yolo_minus.innerHTML = "-"

                        leftbox.appendChild(yolo_minus)
                        change1.appendChild(leftbox)

                        let centerbox = document.createElement("div")
                        centerbox.setAttribute("class", "centerbox")

                        let yolo_center = document.createElement("span")
                        yolo_center.setAttribute("id", "numOfSell" + i)
                        yolo_center.innerHTML = "0"

                        centerbox.appendChild(yolo_center)
                        change1.appendChild(centerbox)

                        let rightbox = document.createElement("div")
                        rightbox.setAttribute("class", "rightbox plus_class")
                        rightbox.setAttribute("id", "rightbox" + i)
                        rightbox.setAttribute("onclick", `plus(${i}, ${buy_count})`)

                        let yolo_plus = document.createElement("span")
                        yolo_plus.setAttribute("id", "yolo-plus")
                        yolo_plus.innerHTML = "+"

                        rightbox.appendChild(yolo_plus)
                        change1.appendChild(rightbox)

                        transactionButton.appendChild(change1)


                        yoloButtons.appendChild(transactionButton)

                        let change2 = document.createElement("button")
                        change2.setAttribute("class", "change2")
                        change2.setAttribute("id", "sell" + i)
                        change2.setAttribute("onclick", `sellClick(${i}, ${ticker}, ${name}, ${buy_date})`)
                        change2.innerHTML = "매도"

                        transactionButton.appendChild(change2)

                        card.appendChild(yoloArticle)
                        card.appendChild(yoloProb)
                        card.appendChild(yoloImage)
                        card.appendChild(yoloButtons)

                        sidebar.appendChild(card)


                        let sellLabel = document.createElement("div")
                        sellLabel.setAttribute("class", "sellLabel")

                        let progressValue = 0;
                        let progressEndValue = Math.round(probability * 100);
                        console.log(progressEndValue)


                        creatGraph(i, ticker.slice(1), detect[ticker.slice(1)])
                        i++;
                        console.log(i)

                        console.log("end of loop")

                        if(progressEndValue > 80) {
                            sellLabel.setAttribute("style", `background-image: url(/static/images/label_strong_${signal}.png)`)
                            yoloProb.appendChild(sellLabel)


                        }
                        else if(progressEndValue == 0) {
                            sellLabel.setAttribute("style", "background-image: url(/static/images/label_hold.png)")
                            yoloProb.appendChild(sellLabel)
                        }
                        else {
                            sellLabel.setAttribute("style", `background-image: url(/static/images/label_moderate_${signal}.png)`)
                            yoloProb.appendChild(sellLabel)
                        }


                        let speed = 50;
                        // console.log(progressEndValue)
                        if (progressEndValue == 0 || isNaN(progressEndValue)) {
                            continue;
                        }

                        let progress = setInterval(() => {


                            progressValue ++;
                            pie_number.textContent = `${progressValue}%`;
                            pie_circle.style.background = `conic-gradient(
                            red ${progressValue * 3.6}deg,
                            #cadcff ${progressValue * 3.6}deg
                            )`;
                            if(progressValue == progressEndValue){
                            clearInterval(progress);
                            }
                        },speed);

                    }

                },

                error: function() {
                    alert('error');
                }
            });
        }
        else {
            console.log("not logged in.");
        }
    });
});


/*
let names = ['SKT', "SK Reitz", "SK Hynix" , "삼성전자", "LG"]
localStorage.setItem("Names", JSON.stringify(names))
*/


// This is our original makeYoloCard()
function makeYoloCard() {
    let yolo = JSON.parse(window.localStorage.getItem('yolo'));


    /*
    let probability = ['95', "54", "55" , "76", "88"]
    localStorage.setItem("Probability", JSON.stringify(probability))
    */


    let sidebar = document.getElementById("sidebar")

    // Switch the yoloArray to whatever the key name is
    //console.log(yolo['Name'].length)

    for(i = 0; i< yolo['Name'].length; i++){ // We make the multiple cards using the for loop

        let card = document.createElement("div")
        card.setAttribute("class", "card")

        let yoloArticle = document.createElement("article")
        yoloArticle.setAttribute("id", "yoloArticle")


        let yoloProb = document.createElement("section")
        yoloProb.setAttribute("id", "yoloProb")

        let yoloImage = document.createElement("section")
        yoloImage.setAttribute("class", "yoloImage")
        yoloImage.setAttribute("id", "yoloImage")


        //console.log(yolo['Ticker'][i])
        // console.log(yolo['Date'][i])

        let thumb = document.createElement("div")
        thumb.setAttribute("class", 'thumb')
        thumb.setAttribute("id", "thumb" + i)
        //thumb.setAttribute("style", "background-image: url(" + img + " )")

        let yoloButtons = document.createElement("section")
        yoloButtons.setAttribute("id", "yoloButtons")

        // This is where we add the yoloIcons in yoloArticle

        let icon1 = document.createElement("div")
        icon1.setAttribute("class", "icon1")

        let ellipseIcon = document.createElement("img")
        ellipseIcon.setAttribute("src",  "static/images/Ellipse 2.png")
        ellipseIcon.setAttribute("id", "ellipseIcon")

        let icon2 = document.createElement("div")
        icon2.setAttribute("class", "icon2")

        let stockName = document.createElement("h1")
        stockName.setAttribute("id", "stockName")
        let textnode = document.createTextNode(yolo['Name'][i]);
        stockName.appendChild(textnode)

        let icon3 = document.createElement("div")
        icon3.setAttribute("class", "icon3")

        let yoloPrice = document.createElement("a")
        yoloPrice.setAttribute("id", "yoloPrice")

        let yoloChange = document.createElement("a")
        yoloChange.setAttribute("id", "yoloChange")

        icon1.appendChild(ellipseIcon)
        yoloArticle.appendChild(icon1)

        icon2.appendChild(stockName)
        yoloArticle.appendChild(icon2)

        icon3.appendChild(yoloPrice)
        icon3.appendChild(yoloChange)

        yoloArticle.appendChild(icon3)

        //This is where we do image

        let pie_circle = document.createElement("div")
        pie_circle.setAttribute("class", "circular-progress")

        let pie_number = document.createElement("div")
        pie_number.setAttribute("class", "value-container")
        pie_number.innerHTML = "0%"

        pie_circle.appendChild(pie_number)

        yoloProb.appendChild(pie_circle)


        yoloImage.appendChild(thumb)


        //This is where we do the buttons

        let transactionButton = document.createElement("div")
        transactionButton.setAttribute("class", "transaction-button")

        let change1 = document.createElement("div")
        change1.setAttribute("class", "change1")

        let leftbox = document.createElement("div")
        leftbox.setAttribute("class", "leftbox minus_class")
        leftbox.setAttribute("id", "leftbox" + i)
        leftbox.setAttribute("onclick", `minus(${i})`)


        let yolo_minus = document.createElement("span")
        yolo_minus.setAttribute("id", "yolo-minus")
        yolo_minus.innerHTML = "-"

        leftbox.appendChild(yolo_minus)
        change1.appendChild(leftbox)

        let centerbox = document.createElement("div")
        centerbox.setAttribute("class", "centerbox")

        let yolo_center = document.createElement("span")
        yolo_center.setAttribute("id", "numOfSell" + i)
        yolo_center.innerHTML = "0"

        centerbox.appendChild(yolo_center)
        change1.appendChild(centerbox)

        let rightbox = document.createElement("div")
        rightbox.setAttribute("class", "rightbox plus_class")
        rightbox.setAttribute("id", "rightbox" + i)
        rightbox.setAttribute("onclick", `plus(${i})`)


        let yolo_plus = document.createElement("span")
        yolo_plus.setAttribute("id", "yolo-plus")
        yolo_plus.innerHTML = "+"

        rightbox.appendChild(yolo_plus)
        change1.appendChild(rightbox)

        transactionButton.appendChild(change1)


        yoloButtons.appendChild(transactionButton)

        let change2 = document.createElement("button")
        change2.setAttribute("class", "change2")
        change2.innerHTML = "매도"
        change2.setAttribute("id", "sell" + i)
        change2.setAttribute("onclick", `sellClick(${i})`)
        change2.setAttribute("type", "button")

        transactionButton.appendChild(change2)

        card.appendChild(yoloArticle)
        card.appendChild(yoloProb)
        card.appendChild(yoloImage)
        card.appendChild(yoloButtons)

        sidebar.appendChild(card)


        let sellLabel = document.createElement("div")
        sellLabel.setAttribute("class", "sellLabel")

        let progressValue = 0;
        let progressEndValue = Math.round(yolo['Probability'][i] * 100);
        let signal = yolo['Signal'][i]

        creatGraph(i)
        console.log("end of loop")

        if(progressEndValue > 80) {
            sellLabel.setAttribute("style", `background-image: url(/static/images/label_strong_${signal}.png)`)
            yoloProb.appendChild(sellLabel)


        }
        else if(progressEndValue == 0) {
            sellLabel.setAttribute("style", "background-image: url(/static/images/label_hold.png)")
            yoloProb.appendChild(sellLabel)
        }
        else {
            sellLabel.setAttribute("style", `background-image: url(/static/images/label_moderate_${signal}.png)`)
            yoloProb.appendChild(sellLabel)
        }

        let speed = 50;
        // console.log(progressEndValue)
        if (progressEndValue == 0 || progressEndValue > 100) {
            continue;
        }

        let progress = setInterval(() => {


            progressValue ++;
            pie_number.textContent = `${progressValue}%`;
            pie_circle.style.background = `conic-gradient(
            red ${progressValue * 3.6}deg,
            #cadcff ${progressValue * 3.6}deg
            )`;
            if(progressValue == progressEndValue){
            clearInterval(progress);
            }
        },speed);

    }
}
function removeAllChildNodes(parent) {

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// This is our chart maker
/*
anychart.onDocumentReady(function () {
    anychart.data.loadCsvFile(
      '/static/000020.csv',
      function (data) {
        // create data table on loaded data
        var dataTable = anychart.data.table();
        dataTable.addData(data);

        // map loaded data for the candlestick series
        var mapping = dataTable.mapAs({
          open: 1,
          high: 2,
          low: 3,
          close: 4
        });

        // var ORCL = plot.candlestick(
        //     mapping
        // );

        // ORCL.risingFill('#77d879')
        // ORCL.fallingFill('#db3f3f')
        // ORCL.risingStroke('#77d879')
        // ORCL.fallingStroke('#db3f3f')


        // create stock chart
        var chart = anychart.stock();

        // create first plot on the chart
        var plot = chart.plot(0);

        // set grid settings
        plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);

        var series = plot.candlestick(mapping)
          .name('Tesla');
        series.legendItem().iconType('rising-falling');

//        var controller = plot.annotations();

        // signal_date = []
        // probability = []
        // console.log(signals)
        // for (const signal of signals) {
        //     signal_date.push(signal[6])
        //     probability.push(signal[7])
        //     x = 0
        //     y = 5
        //     controller.rectangle({
        //         // X - part of the first anchor
        //         xAnchor: signal[0],
        //         // Y - part of the first anchor
        //         valueAnchor: signal[1],
        //         // X - part of the second anchor
        //         secondXAnchor: signal[2],
        //         // Y - part of the second anchor
        //         secondValueAnchor: signal[3],
        //         // set stroke settings
        //         stroke: '2 ' + signal[4],
        //         // set fill settings
        //         fill: "#FFFFFF 0",
        //     });

        //     controller.label({
        //         xAnchor: signal[x],
        //         valueAnchor: signal[x+1] + 5,
        //         text: signal[5] + ' ' + Math.round(((signal[7]*100 + Number.EPSILON) * 100) / 100) + '%',
        //         fontSize: 30,
        //         fontColor: signal[4],
        //         fontWeight: 200,
        //         background: {
        //             stroke: '1 ' + signal[4],
        //             fill: "#FFFFFF 0",
        //         }
        //     });
        // }

        // create scroller series with mapped data
        chart.scroller().candlestick(mapping);

        // set chart selected date/time range
        chart.selectRange('2022-10-15', '2022-11-15');

        // create range picker
        var rangePicker = anychart.ui.rangePicker();

        // init range picker
        rangePicker.render(chart);

        // create range selector
        var rangeSelector = anychart.ui.rangeSelector();

        // init range selector
        rangeSelector.render(chart);

        // sets the title of the chart
      //  chart.title('Tesla Inc. Stock Chart');

        // set container id for the chart
        chart.container('container');

        // initiate chart drawing
        chart.draw();
      }
    );
  });*/

function creatGraph(i, ticker, yolo) {

    // let yolo = JSON.parse(window.localStorage.getItem('yolo'));
    // let temp = yolo['Ticker'][i]
    // let start = yolo['Start'][i]
    // let end = yolo['End'][i]
    // let signal = yolo['Signal'][i]
    let full_code = yolo[0]
    let name = yolo[1]
    let signal = yolo[2]
    let start = yolo[4]
    let end = yolo[5]
    console.log(start, end)

    let market = window.localStorage.getItem('market')
    if (market == 'Kospi') {
        yf = '.KS'
    }
    else if (market == 'Kosdaq') {
        yf = '.KQ'
    }

    // config2 = setConfig(ticker + '.KS', undefined, undefined)
    config2 = setConfig2(ticker + yf, undefined, undefined)
    console.log(config2)
    axios(config2)
        .then(function (response) {
            // resultCsv = response.data
            // resultObject = result2stock(resultCsv)
            resultObject = response.data['stock']
            anychart.onDocumentReady(function() {
                console.log(resultObject);
                var dataTable = anychart.data.table();
                dataTable.addData(resultObject);
                var mapping = dataTable.mapAs({
                     open: 1,
                     high: 2,
                     low: 3,
                     close: 4
                 });
                 var chart = anychart.stock();

                 // create first plot on the chart
                 var plot = chart.plot(0);

                 if (signal !== 'hold') {
                     console.log('Start, End: ', start, end)
                     var boxStock = resultObject.filter(function(value) {
                         return (value[0] >= start) && (value[0] <= end)
                     })

                     console.log('Box: ', boxStock)
                     var lowArray = []
                     var highArray = []
                     for (stock of boxStock) {
                         highArray.push(Number(stock[2]))
                         lowArray.push(Number(stock[3]))
                     }
                     var low = Math.min.apply(Math, lowArray)
                     var high = Math.max.apply(Math, highArray)
                     // console.log('High: ' + high, 'Low: ' + low)
                     var controller = plot.annotations();
                     controller.rectangle({
                         // X - part of the first anchor
                         xAnchor: start,
                         // Y - part of the first anchor
                         valueAnchor: low,
                         // X - part of the second anchor
                         secondXAnchor: end,
                         // Y - part of the second anchor
                         secondValueAnchor: high,
                         // set stroke settings
                         stroke: '2 ' + "#ff0000",
                         // set fill settings
                         fill: "#FFFFFF 0",
                     });
                 }

                 // set grid settings
                 plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);

                 var series = plot.candlestick(mapping)
                     .name(name);
                 series.legendItem().iconType('rising-falling');
                 // create scroller series with mapped data
                 chart.scroller().candlestick(mapping);

                 // set chart selected date/time range
                 chart.selectRange(oneYearAgo, today);

                 // create range picker
                 var rangePicker = anychart.ui.rangePicker();

                 // init range picker
                 rangePicker.render(chart);

                 // create range selector
                 var rangeSelector = anychart.ui.rangeSelector();

                 // init range selector
                 rangeSelector.render(chart);

                 // sets the title of the chart
             //  chart.title('Tesla Inc. Stock Chart');

                 // set container id for the chart
                 chart.container("thumb" + i);
                 // chart.container('container');

                 // initiate chart drawing
                 chart.draw();
             });
        })
        .catch(function (error) {
            console.log(error);
        });
   //  var promise = getOHLCbyTicker(ticker, undefined, undefined);
   //
   // // getOHLCbyTicker(temp, date)
   //
   //  //console.log(temp)
   //
   //  console.log("i is in " + i)
   //  anychart.onDocumentReady(function () {
   //      var stocks = []
   //      promise.success(function (result) {
   //          item = result.getElementsByTagName("item")
	// 		for(let item_node of item) {
	// 			data = item_node.getAttribute('data')
	// 			data = data.split('|')
   //              if (data[5] === "0") continue;
   //              data = data.slice(0, 5)
   //              data[0] = to_date(data[0])
	// 			stocks.push(data)
	// 		}
	// 		console.log(stocks);
   //          var dataTable = anychart.data.table();
   //          dataTable.addData(stocks);
   //          var mapping = dataTable.mapAs({
   //              open: 1,
   //              high: 2,
   //              low: 3,
   //              close: 4
   //          });
   //          var chart = anychart.stock();
   //
   //          // create first plot on the chart
   //          var plot = chart.plot(0);
   //
   //          if (signal !== 'hold') {
   //              var boxStock = stocks.filter(function(value) {
   //                  return (value[0] >= start) && (value[0] <= end)
   //              })
   //
   //              // console.log('Box: ', boxStock)
   //              var lowArray = []
   //              var highArray = []
   //              for (stock of boxStock) {
   //                  highArray.push(Number(stock[2]))
   //                  lowArray.push(Number(stock[3]))
   //              }
   //              var low = Math.min.apply(Math, lowArray)
   //              var high = Math.max.apply(Math, highArray)
   //              // console.log('High: ' + high, 'Low: ' + low)
   //              var controller = plot.annotations();
   //              controller.rectangle({
   //                  // X - part of the first anchor
   //                  xAnchor: start,
   //                  // Y - part of the first anchor
   //                  valueAnchor: low,
   //                  // X - part of the second anchor
   //                  secondXAnchor: end,
   //                  // Y - part of the second anchor
   //                  secondValueAnchor: high,
   //                  // set stroke settings
   //                  stroke: '2 ' + "#ff0000",
   //                  // set fill settings
   //                  fill: "#FFFFFF 0",
   //              });
   //          }
   //
   //          // set grid settings
   //          plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
   //
   //          var series = plot.candlestick(mapping)
   //              .name(name);
   //          series.legendItem().iconType('rising-falling');
   //          // create scroller series with mapped data
   //          chart.scroller().candlestick(mapping);
   //
   //          // set chart selected date/time range
   //          chart.selectRange('2020-11-27', '2022-11-15');
   //
   //          // create range picker
   //          var rangePicker = anychart.ui.rangePicker();
   //
   //          // init range picker
   //          rangePicker.render(chart);
   //
   //          // create range selector
   //          var rangeSelector = anychart.ui.rangeSelector();
   //
   //          // init range selector
   //          rangeSelector.render(chart);
   //
   //          // sets the title of the chart
   //      //  chart.title('Tesla Inc. Stock Chart');
   //
   //          // set container id for the chart
   //          chart.container("thumb" + i);
   //          // chart.container('container');
   //
   //          // initiate chart drawing
   //          chart.draw();
   //      });
   //

        // anychart.data.loadCsvFile(
        //   img,
        //   function (data) {
        //     // create data table on loaded data
        //     var dataTable = anychart.data.table();
        //     dataTable.addData(data);
        //     console.log(data)

        //     // map loaded data for the candlestick series
        //     var mapping = dataTable.mapAs({
        //       open: 1,
        //       high: 2,
        //       low: 3,
        //       close: 4
        //     });

        //     // var ORCL = plot.candlestick(
        //     //     mapping
        //     // );

        //     // ORCL.risingFill('#77d879')
        //     // ORCL.fallingFill('#db3f3f')
        //     // ORCL.risingStroke('#77d879')
        //     // ORCL.fallingStroke('#db3f3f')


        //     // create stock chart
        //     var chart = anychart.stock();

        //     // create first plot on the chart
        //     var plot = chart.plot(0);

        //     // set grid settings
        //     plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);

        //     var series = plot.candlestick(mapping)
        //       .name(yolo['Name'][i]);
        //     series.legendItem().iconType('rising-falling');

        // //    var controller = plot.annotations();

        //     // signal_date = []
        //     // probability = []
        //     // console.log(signals)
        //     // for (const signal of signals) {
        //     //     signal_date.push(signal[6])
        //     //     probability.push(signal[7])
        //     //     x = 0
        //     //     y = 5
        //     //     controller.rectangle({
        //     //         // X - part of the first anchor
        //     //         xAnchor: signal[0],
        //     //         // Y - part of the first anchor
        //     //         valueAnchor: signal[1],
        //     //         // X - part of the second anchor
        //     //         secondXAnchor: signal[2],
        //     //         // Y - part of the second anchor
        //     //         secondValueAnchor: signal[3],
        //     //         // set stroke settings
        //     //         stroke: '2 ' + signal[4],
        //     //         // set fill settings
        //     //         fill: "#FFFFFF 0",
        //     //     });

        //     //     controller.label({
        //     //         xAnchor: signal[x],
        //     //         valueAnchor: signal[x+1] + 5,
        //     //         text: signal[5] + ' ' + Math.round(((signal[7]*100 + Number.EPSILON) * 100) / 100) + '%',
        //     //         fontSize: 30,
        //     //         fontColor: signal[4],
        //     //         fontWeight: 200,
        //     //         background: {
        //     //             stroke: '1 ' + signal[4],
        //     //             fill: "#FFFFFF 0",
        //     //         }
        //     //     });
        //     // }

        //     // create scroller series with mapped data
        //     chart.scroller().candlestick(mapping);

        //     // set chart selected date/time range
        //     chart.selectRange('2020-11-27', '2022-11-15');

        //     // create range picker
        //     var rangePicker = anychart.ui.rangePicker();

        //     // init range picker
        //     rangePicker.render(chart);

        //     // create range selector
        //     var rangeSelector = anychart.ui.rangeSelector();

        //     // init range selector
        //     rangeSelector.render(chart);

        //     // sets the title of the chart
        //   //  chart.title('Tesla Inc. Stock Chart');

        //     // set container id for the chart
        //     chart.container("thumb" + i);
        //     // chart.container('container');

        //     // initiate chart drawing
        //     chart.draw();
        //   }
        // );
    // });
}


function frontGraph() {

    $('#container').empty()
    console.log('empty')
    let korStock = window.localStorage.getItem('ticker');
    let korName = window.localStorage.getItem('stockName')
    let market = window.localStorage.getItem('market')
    if (market == 'Kospi') {
        yf = '.KS'
    }
    else if (market == 'kosdaq') {
        yf = '.KQ'
    }

    console.log(korStock, market)
    let temp = korStock
    config1 = setConfig(korStock.slice(1) + yf, undefined, undefined)
    config2 = setConfig2(korStock.slice(1) + yf, undefined, undefined)

    let signal = yolo_result[korStock.slice(1)][0]
    let start = yolo_result[korStock.slice(1)][3]
    let end = yolo_result[korStock.slice(1)][4]

    // console.log('Config: ', config2)
    // axios(config2)
    //     .then(function(response) {
    //         console.log()
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    axios(config2)
        .then(function (response) {
            // resultCsv = response.data
            resultObject = response.data['stock']
            anychart.onDocumentReady(function() {
                console.log(resultObject);
                var dataTable = anychart.data.table();
                dataTable.addData(resultObject);
                var mapping = dataTable.mapAs({
                    open: 1,
                    high: 2,
                    low: 3,
                    close: 4
                });
                var chart = anychart.stock();

                // create first plot on the chart
                var plot = chart.plot(0);

                if (signal === 'buy') {
                    console.log('Start, End: ', start, end)
                    var boxStock = resultObject.filter(function(value) {
                        return (value[0] >= start) && (value[0] <= end)
                    })

                    console.log('Box: ', boxStock)
                    var lowArray = []
                    var highArray = []
                    for (stock of boxStock) {
                        highArray.push(Number(stock[2]))
                        lowArray.push(Number(stock[3]))
                    }
                    var low = Math.min.apply(Math, lowArray)
                    var high = Math.max.apply(Math, highArray)
                    // console.log('High: ' + high, 'Low: ' + low)
                    var controller = plot.annotations();
                    controller.rectangle({
                        // X - part of the first anchor
                        xAnchor: start,
                        // Y - part of the first anchor
                        valueAnchor: low,
                        // X - part of the second anchor
                        secondXAnchor: end,
                        // Y - part of the second anchor
                        secondValueAnchor: high,
                        // set stroke settings
                        stroke: '2 ' + "#ff0000",
                        // set fill settings
                        fill: "#FFFFFF 0",
                    });
                }

                // set grid settings
                plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);

                var series = plot.candlestick(mapping)
                .name(korName);
                series.legendItem().iconType('rising-falling');

                // create scroller series with mapped data
                chart.scroller().candlestick(mapping);


                // set chart selected date/time range
                chart.selectRange(oneMonthAgo, today);

                // create range picker
                var rangePicker = anychart.ui.rangePicker();

                // init range picker
                rangePicker.render(chart);

                // create range selector
                var rangeSelector = anychart.ui.rangeSelector();

                // init range selector
                rangeSelector.render(chart);

                // set container id for the chart
                chart.container("container");
                // chart.container('container');

                // initiate chart drawing
                if (korStock === window.localStorage.getItem('ticker')) {
                    chart.draw();
                }
                else {
                    $('#container').empty()
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}


function setConfig(ticker, start='1990-01-01', end = new Date().toISOString().split('T')[0]) {
    start = new Date(start).getTime() / 1000
    end = new Date(end).getTime() / 1000
    var config = {
        method: 'get',
        url: `https://query1.finance.yahoo.com/v7/finance/download/${ticker}`,
        params: {
            'period1': start,
            'period2': end,
            'interval': '1d',
        },
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded;"
        }, // [요청 헤더]
    }
    return config
}


function setConfig2(ticker, start='1990-01-01', end = new Date().toISOString().split('T')[0]) {
    var config = {
        method: 'get',
        url: '/stock',
        params: {
            'ticker': ticker,
            'timeframe': '1d',
        },
    }
    return config
}


function to_date(date_str)
{
    var yyyyMMdd = String(date_str);
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(4,6);
    var sDate = yyyyMMdd.substring(6,8);
    return sYear + '-' + sMonth + '-' + sDate
}

function result2stock(csvStr) {
    var lines=csvStr.split("\n");
    var result = [];

    for(var i=1; i < lines.length; i++){

        var obj = [];
        var currentline=lines[i].split(",");

        for(var j=0; j<5; j++){
            obj[j] = currentline[j];
        }

        result.push(obj);

    }
    return result; //JavaScript object
}


function getOHLCbyTicker(ticker, start='1990-01-01', end=today) {
	time_difference = 6000 //difference(new Date(start), new Date(end))
	// num = time_difference
	return $.ajax({
		type: "GET",
		url: "https://fchart.stock.naver.com/sise.nhn",
		data: {
			'symbol': ticker,
			'requestType': 0,
			'count': time_difference,  // 받아오는 날짜 개수
			'timeframe': 'day',
		},
		dataType: "xml",
		error: function(){
			alert('error')
		}
	});
}

const col_map = {'TRD_DD':'Date', 'TDD_CLSPRC':'Close', 'TDD_OPNPRC':'Open', 'TDD_HGPRC':'High', 'TDD_LWPRC':'Low'}
const delete_key = ['ISU_CD', 'ISU_NM', 'MKT_NM', 'SECUGRP_NM', 'FLUC_TP_CD', 'CMPPRVDD_PRC', 'FLUC_RT', 'ACC_TRDVOL', 'ACC_TRDVAL', 'MKTCAP']

// request로 받아온 주가 데이터에 column 수정 및 Date 형식 수정
function ModifyStock (obj) {
	// Date 형식를 Datetime으로
	obj['TRD_DD'] = new Date(obj['TRD_DD']).toISOString().split('T')[0]
    obj['TDD_OPNPRC'] = obj['TDD_OPNPRC'].replace(',', '')
    obj['TDD_HGPRC'] = obj['TDD_HGPRC'].replace(',', '')
    obj['TDD_LWPRC'] = obj['TDD_LWPRC'].replace(',', '')
    obj['TDD_CLSPRC'] = obj['TDD_CLSPRC'].replace(',', '')
    obj = [obj['TRD_DD'], obj['TDD_OPNPRC'], obj['TDD_HGPRC'], obj['TDD_LWPRC'], obj['TDD_CLSPRC']]
    return obj
}



function getKRXOHLCbyTicker() {
	/*
	종목 표준 코드 받아오기
	=> 미리 서버에서 맵핑 해놓고 ticker 보낼 때 같이 보내는 편이 빠를 수도 있다
	*/
	return $.ajax({
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
		error: function(){
			alert('error')
		}
	});
}

function getOHLCbyFullCode(full_code, start='1990-01-01', end=today) {
	// 날짜에서 모든 - 제거 19900101
	start = start.replace(/-/g, '')
	end = end.replace(/-/g, '')
	return $.ajax({
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
		error: function(){
			alert('error')
		}
	});
}


function minus(index) {

    console.log(index)

    let resultElement = document.getElementById(`numOfSell${index}`);
    let number = resultElement.innerHTML;

    if (parseInt(number) > 0) {
      number = parseInt(number) - 1;
    }
    resultElement.innerHTML = number;
  };

  function plus(index , max) {

    console.log("This is where we plus")
    console.log(index)
    console.log(max)

    let resultElement = document.getElementById(`numOfSell${index}`);
    let number = resultElement.innerHTML;

      number = parseInt(number) + 1;

      if(parseInt(number) > max) {
        alert("Max number of stock")
        number = number - 1;
      }
      else {
        resultElement.innerHTML = number;
      }
  };


  function sellClick(index, ticker, name, buy_date) {
    console.log(index)

    let resultElement = document.getElementById(`numOfSell${index}`);

    let number = resultElement.innerHTML
    console.log(resultElement)

    alert(`You have sold ${number} stocks! ${ticker}, ${name}, ${buy_date}`)

    resultElement.innerHTML = '0'

    let user_id = localStorage.getItem('user_id')
            console.log(user_id)
            $.ajax({
                type:'POST',
                url:'http://14.49.45.139:80/updateasset3',
                data:{
                    "user_id" : user_id,
                    "ticker" : ticker,
                    "buy_date" : s_date,
                    "sell_count" : number,
                },
                dataType: 'json',

                success:function(data)
                {


                },

                error: function() {
                    alert('error');
                }
            });


  }
