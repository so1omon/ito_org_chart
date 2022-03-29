var org={

    '관광마케팅실':['해외마케팅팀','국내관광팀','스마트관광팀','MICE뷰로'],
    '기획조정실':['고객홍보팀','전략기획팀','경영지원팀'],
}
var dept_info={'해외마케팅팀':2,'국내관광팀':2,'스마트관광팀':3,'MICE뷰로':2,'고객홍보팀':2,'전략기획팀':2,'경영지원팀':4};
var office = ['관광마케팅실','기획조정실'];

$(document).ready(function(){
    $('#container').css({"width": window.innerWidth, "height":'100%'});     //전체 컨테이너 크기 지정
    $('.cell').removeClass('border bg-light');                              //셀 안에 배경 색 제거 
    $('.mem-img').addClass('border');                                       //각 이미지에 선 추가
    $('.dept-table').last().css({'border-right':'none'});                   //마지막 팀 테두리 선 제거 
    $('.header').css({'width':`${100/(office.length)}%`});
    $('.btn').removeClass('clicked');
    // 실장실에 순서대로 클래스명 부착
    for(var off = 0; off<office.length; off++){
        $('.header').eq(off).addClass(`header-${off}`);
    }

    // 전체 열 수 
    var sum=0;
    Object.values(dept_info).forEach(function(element){
        sum=sum+element;
    });

    //열수를 이용해서 각 팀의 width 조정
    for(var i=0;i<Object.keys(dept_info).length;i++){
        $('.department').eq(i).css({'width':`${(100*(Object.values(dept_info)[i]))/sum}%`});
    }

    // '관광마케팅실' 이면 addClass('office-0') '기획조정실이면 addClass('office-1')
    for(var j = 0;j<Object.keys(dept_info).length;j++){
        // 각 부서를 돌면서. 
        var dept_name = $('.dept-name').eq(j).text();
        for(var k=0;k<Object.keys(org).length;k++){
            // org[k]의 team안에 해당 dept가 있는지 
            var width_sum = 0;
            var dept = Object.values(org)[k];
            // 배열
            for(var t=0;t<dept.length;t++){
                if(dept_name==dept[t]){
                    $('.department').eq(j).addClass(`office-${k}`);
                    width_sum=width_sum+$('.department').eq(j).width();
                }
            }
        } 
    }

    // 각 실에 해당하는 부서의 width를 더해서 실의 width로 바꾸기
    for(var h=0;h<$('.header').length;h++){
        var width_sum=0;
        for(var t=0;t<$(`.office-${h}`).length;t++){
            width_sum=width_sum+$(`.office-${h}`).eq(t).width();
        }
        $('.header').eq(h).css({'width':`${width_sum}`});
    }

    // 16F, 17F, 수정 버튼 클릭시 event
    // 1. 16F 페이지일 때 16버튼 active 되어야 함
    var btn = document.getElementsByClassName("btn");
    // 1.clicked 클래스 add,remove(버튼 색 변경)
    function handleClick(event) 
    {
        console.log(event.target);
        console.log(event.target.classList);
        if (event.target.classList[1] === "clicked") {
            
            event.target.classList.remove("clicked");
        } 
        else {
            for (var i = 0; i < btn.length; i++) {
                btn[i].classList.remove("clicked");
            }
            event.target.classList.add("clicked");
        }
    }
    // 2. 버튼 클릭시 페이지 이동
    function init() {
        for (var i = 0; i < btn.length; i++) 
        {
            btn[i].addEventListener("click", handleClick);
        }
    }
    init();

    // 만약 빈 셀이면, X 표시 없애고 border를 점선으로 표시
    for(var mem=0;mem<$('.memInfo').length;mem++){
        console.log($('.memInfo').eq(mem).children().length);
        if($('.memInfo').eq(mem).children().length==0)
        {
            // 빈 셀인 경우 버튼 제거
            $(".rounded-circle").eq(mem).css({'display':'none'});
            // $('.cell').eq(mem).append(`<img src="img/none.PNG"  class="mem-img dahsed-border" style="">`)
            $('.memInfo').eq(mem).css({'height':'48px'});
            $('.cell').eq(mem).addClass('dahsed-border');
            //버튼 추가
            $('.cell').eq(mem).append(`<button type="button" class="btn btn-secondary btn-add">+</button>`);
        }
        else{
        }
    }


    $('#btn-del').on('click',function(e){
        // 해당 셀 삭제 버튼 누르는 경우, 셀의 사번을 ajax로 전송
        var data = e.target.parentElement.children[1].children[0].getAttribute('id');
        console.log("ajax started");

        $.ajax({
            method:'POST',
            url:'/delete',
            data:{
                emp_id:data
            },  //서버로 보낼 데이터
            success:function(result){
                // 
            },
            error: function(result){
                alert('실패');
            }
        })
    });
});



// setTimeout(function(){ //30초에 한번씩 reload
//     location.reload();
// }, 30000);