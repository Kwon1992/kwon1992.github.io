
var mapSize = "";
var itemCost = 0;
var levelSelected = {
  "EZ": false, 
  "NM": false, 
  "HD": false,
  "SHD": false
}; //EZ , NM, HD // SHD

var itemSelected = {
  "protect" : false,
  "showStart" : false,
  "revealAll" : false
}; // protect, predict



document.getElementById('size-btns').addEventListener('click', function(e) { // size-btns을 클릭한 경우... e : 이벤트 발생 객체

  targetBtn = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;

  if(targetBtn.childElementCount != 0) return;

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

  if(targetBtn.childElementCount != 0) return;

  targetBtn.style.backgroundColor = targetBtn.style.backgroundColor === "" ? "yellow" : "";
  if(targetBtn.style.backgroundColor === "yellow") {
    itemSelected[targetBtn.id.toString()] = true;
    switch(targetBtn.id){
      case 'protect': itemCost += 2500; break;
      case 'showStart': itemCost += 4000; break;
      case 'revealAll': itemCost += 10000; break;
    }
  } else {
    itemSelected[targetBtn.id.toString()] = false;
    switch(targetBtn.id){
      case 'protect': itemCost -= 2500; break;
      case 'showStart': itemCost -= 4000; break;
      case 'revealAll': itemCost -= 10000; break;
    }
  }
});


document.getElementById('explain-btn').addEventListener('click', function (e){
  $('#myModal').slideDown();
  document.getElementById('close-btn').addEventListener('click', function (e){
    $('#myModal').slideUp();
   });
 });



$(document).ready(function(){
  $('#start-btn').click(function(e){
    var bettingTokens = document.getElementById('bettingTokens').value;

    if(mapSize === "") {
      console.log("No Level Selected");
      return;
    } else if(bettingTokens > parseInt(document.getElementById('btTokens').innerText)) {
        alert("You bet Too much tokens.");
        return;
    } else if(itemCost > parseInt(document.getElementById('bmtTokens').innerText)){
        alert("You cannot buy items.(Not enought Tokens.)");
        return;
    } else {
        sessionStorage.setItem("bettingBTTokens", bettingTokens);
        sessionStorage.setItem("usedBMTtokens", itemCost);

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
    }
      // 아이템 구매 시 코인(토큰) 감소 요청 txn 전송

      $.ajax({
        type:"get",
        url:"game.html",
        success: function test(a) {
          $(".flex-body").html(a);
        }
       });
    });
});



  
//https://blog.naver.com/PostView.nhn?blogId=psj9102&logNo=220821359506&proxyReferer=https%3A%2F%2Fwww.google.com%2F
//Ajax를 이용한 비동기 방식의 페이지 이동 (refresh 없이 특정 div만 내용 변경!!)
