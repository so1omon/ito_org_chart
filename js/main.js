$(document).ready(function(){

    $(document).on('click','.cell',function(){
        //tpf    
    }) 
    
    })

//전체 컨테이너 width height 설정
$('#container').css({"width": screen.width,"height":screen.height});
window.onload=function(){
    
    //DB에서 인원수 받아와서 만들기
    
    make2Cell(8,3);
}

// 임시 load
// 팀 인원수대로 cell 만드는 함수(인원수,한 row에 몇명넣을건지)
// 한 행에 2명 넣을거면-> 12/2 = 6
function make2Cell(total,colNum){
    
    //임의 지정(이름,직급)
    var name = "임희복"
    var position = "차장"
    var info = `<div class="memInfo">
        <span class="memName fs-6" >${name}</span>
        <span class="memPos fs-6" >${position}</span>
      </div>`

    for(let i=0;i<total;i++)
    {
        var cell = `<div class="col-${12/colNum} " id="cell-${i}">
            <div class=" border bg-light cell"></div>
          </div>`;

        $('#1-team-row').append(cell);
    }
    
   for(let j=0;j<total;j++)
    {
       $(`#cell-${j}`).append(info);
   }

}
$('.memName').on('click',function(){
    console.log('클릭');
})