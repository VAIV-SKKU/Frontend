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

$(document).ready(function() {
    $('#add-form').on('submit',function(e) {
        $('#result').empty()
        var models = [];
        var date = document.forms['add-form'].elements['date']
        date.max = new Date().toISOString().split("T")[0];
        var cbs = document.forms['add-form'].elements['models'];
        for(var i=0,cbLen=cbs.length;i<cbLen;i++){
            if(cbs[i].checked){
                models.push(cbs[i].value);
            } 
        }
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'http://14.49.45.139:80/graph',
            data:{
                "models": models,
                "date": date.value,
                'stock': document.forms['add-form'].elements['stock'].value,
                // 'forecast': document.forms['add-form'].elements['forecast'].value
            },
            dataType: 'json',
            success:function(data)
            {
                var models = data['models']
                var success = data['success']
                var ret = data['ret']
                var profit = data['profit']
                var pre_success = ['예측 성공', '예측 실패']
                var pre_color = ['#FF0000', '#0000FF']
                console.log(typeof (success))
                if(success == false) {
                    alert('종목명을 다시 입력해 주세요')
                }
                else {
                    let result = document.getElementById('result')
                    let img = document.getElementById('image')
                    result.innerHTML='<img src="/static//images/test_gragh.png" style="width: 100%" height="50%">'
                    // img.src = "/static/images/test_gragh.png";
                    // result.appendChild(img)
                    let h2 = document.createElement('h2');
                    let h3 = document.createElement('h3');
                    h2.innerHTML = ' Prediction Result'
                    h3.innerHTML = '전일 종가 대비 수익률: ' + profit
                    result.appendChild(h2)
                    result.appendChild(h3)
                    for (let model of models) {
                        let span = document.createElement('span')
                        span.style = 'float:left;margin-right:30px;margin-left:15px;border-left:thick #32a1ce;'

                        lists = ret[model]
                        signal = lists[0]
                        percent = lists[1]
                        pre_suc = lists[2]
                        let h3_signal = document.createElement('h3');
                        let h3_percent = document.createElement('h3');
                        let h2_title = document.createElement('h2');
                        h2_title.innerHTML = model
                        h3_signal.innerHTML = '예측 결과: ' + signal + ' (<span style=" color:' + pre_color[pre_suc] + '">' + pre_success[pre_suc] + '</span>)'
                        h3_percent.innerHTML = '예측 확률: ' + percent

                        h2_title.style = 'text-align:center;'
                        
                        result.appendChild(span)
                        span.appendChild(h2_title)
                        span.appendChild(h3_signal)
                        span.appendChild(h3_percent)
                    }
                }
            },
            error: function() {
                alert('error');
            }
        })
    })
});