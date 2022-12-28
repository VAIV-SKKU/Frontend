function receiveMessage(event) {
    if (event.origin !== "http://14.49.45.139/simulate") {
        console.log('invalid url')
        
    }
    console.log(event.data)
}
window.addEventListener("message", receiveMessage, false);

/* Log-In Part */
$(document).ready(function() {
    $(document.body).delegate('#login', 'click', function() {
    let id = document.getElementById('id');
    let password = document.getElementById('password');

    console.log(id.value)

    if (id.value == null || password.value == null) {
        alert("올바른 아이디와 비밀번호를 입력하세요.");
    }
    else {
        // id와 password가 맞게 입력되었는지 확인
        $.ajax({
            type:'POST',
            url:'http://14.49.45.139/isvalid',
            data:{
                "id" : id.value,
                "password" : password.value,
            },
            dataType: 'json',
            global: false,

            success:function(data) {
                var success = data['success'];
                if (success != 0) {
                    // Load My Asset data in local Storage
                    console.log("Log in success!")
                    if (success == -1) {
                        alert('새로운 계정 생성')
                    }

                    localStorage.setItem('login', 1);
                    localStorage.setItem('updated', 0);
                    localStorage.setItem('user_id', id.value);

                    // close the log-in tab
                    // document.getElementById('login').innerHTML = '로그아웃';
                    alert('로그인 되었습니다.');
                    
                    //window.postMessage("login", window.opener.document.URL)
                    var temp = $(parent.document, '#tempInput').value
                    console.log(temp)
                    //alert(window.document.URL);

                    window.close();
                }
                else {
                    localStorage.setItem('login', 0);
                    alert("올바른 아이디와 비밀번호를 입력하세요.");
                }
            },
            error: function() {
                alert("error");
            }
        });
    }
});
});