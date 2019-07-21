// var sizeLookup = {
//     '9': {totalBombs: 10, tableWidth: '245px', checker: 0},
//     '16': {totalBombs: 40, tableWidth: '420px', checker: 1}, <- ez ( 14 * 14 : 40 __ 47.8%)
//     '30': {totalBombs: 160, tableWidth: '794px', checker: 2} <- nm ( 20%)
//      난이도를 어떻게 할 것인가?
//      minesweeper.online - 특별에서 성공률,난이도 측정해줌
//  NM: 20% //  HD : 3~4%  //  SHD :: 0.05%
// };


var mapSize = "";
var levelSelected = {
  "EZ": false, 
  "NM": false, 
  "HD": false,
  "SHD": false
}; //EZ , NM, HD // SHD

var itemSelected = {
  "protect" : false,
  "predict" : false
}; // protect, predict



document.getElementById('size-btns').addEventListener('click', function(e) { // size-btns을 클릭한 경우... e : 이벤트 발생 객체
  targetBtn = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;

  if(levelSelected["EZ"] || levelSelected["NM"] || levelSelected["HD"]){
    if(levelSelected[targetBtn.id.toString()]) {
      targetBtn.style.backgroundColor = "";
      levelSelected[targetBtn.id.toString()] = false;
      mapSize = "";
    }
  } else {
    mapSize = targetBtn.id.toString();
    targetBtn.style.backgroundColor = "yellow";
    levelSelected[targetBtn.id.toString()] = true;      
  }

  console.log(levelSelected);
});


document.getElementById('item-btns').addEventListener('click', function (e){
  targetBtn = e.target;
  targetBtn.style.backgroundColor = targetBtn.style.backgroundColor === "" ? "yellow" : "";
  if(targetBtn.style.backgroundColor === "yellow") {
    itemSelected[targetBtn.id.toString()] = true;
  } else {
    itemSelected[targetBtn.id.toString()] = false;
  }

  console.log(itemSelected);
 });



$(document).ready(function(){
  $('#start-btn').click(function(e){
    if(mapSize === "") {
      console.log("No Level Selected");
      return;
    } else {
      for (const level in levelSelected) {
        if (levelSelected.hasOwnProperty(level) && levelSelected[level] ) {
            sessionStorage.setItem("level", level);
          }
        }

        for (const item in itemSelected) {
          if (itemSelected.hasOwnProperty(item)) {
            sessionStorage.setItem(item, itemSelected[item]);
          }
        }

        console.log(sessionStorage);
      
      // 아이템 구매 시 코인(토큰) 감소 요청 txn 전송

      $.ajax({
          type:"get",
          url:"game.html",
          success: function test(a) {
              $(".flex-body").html(a);
          }
      });
    }
  });

});


  
//https://blog.naver.com/PostView.nhn?blogId=psj9102&logNo=220821359506&proxyReferer=https%3A%2F%2Fwww.google.com%2F
//Ajax를 이용한 비동기 방식의 페이지 이동 (refresh 없이 특정 div만 내용 변경!!)
