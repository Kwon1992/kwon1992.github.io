/* << 변화한 점 - 190721 Update>>
 * shift + 좌클릭이 깃발 표시 였으나, 우클릭으로 변경함. (shift+좌클릭 깃발 표시 제거) (main.js)
 * 깃발이 표시된 상태에서 좌클릭 시 reveal하던 버그 발견 -> 수정 (MAIN.js)
 * cell 위에 마우스가 hover되는 경우 색깔 번경 (CSS 파트)
 * 깃발 갯수와 열린 부분의 폭탄 숫자가 같을 때 좌클릭하면 자동으로 인접 셀 열어줌 -> 만약 깃발이 잘못된 경우 게임 오버처리. (MAIN, CELL.js)
 * 모바일 롱 프레스 인식 - 약 0.5초 누르면 플래그 on/off
 * Main 페이지 제작 -> Ajax 이용해서 페이지 전체 refresh 없이 이동 가능! (sessionStorage 활용)
 * 아이템 기능 추가 (protect, start pin, veil all) _ 동시 사용 가능!! (가격은 2500, 4000, 8000 예상)
 * GAME OVER 페이지 구현 예정 (POP-UP 형태)
 * 
 * 버그 : easy 모드에서 셀을 전부 열지 않았는데 게임이 끝나버리는 현상 발생... - 수정 완료!
 * 버그2 : 플래그를 정해진 폭탄 개수 이상 찍을 수 있는 현상. - 수정 완료!
 * 버그3 : 안드로이드 상에서 롱 프레스할 경우 터치엔드 2번 인식 현상 발생
 */


/*----- constants -----*/

console.log("IN GAME PAGE");
console.log(sessionStorage);

var bombImage = '<img src="images/bomb.png">';
var flagImage = '<img src="images/flag.png">';
var wrongBombImage = '<img src="images/wrong-bomb.png">'
var sizeLookup = {
  
  //size : colSize임!!

  'EZ': {size:13, totalBombs:40, tableWidth: "338px"}, // 45.15%
  'NM': {size:20, totalBombs:70, tableWidth: "520px"}, // 18.70%
  'HD': {size:25, totalBombs:100, tableWidth: "650px"}, // 2.35%
  //row는 15로 고정!
};
var colors = [ // 각각 폭탄 개수마다 숫자의 색을 바꾸기 위한 리스트
  '',
  '#0000FA',
  '#4B802D',
  '#DB1300',
  '#202081',
  '#690400',
  '#457A7A',
  '#1B1B1B',
  '#7A7A7A',
];

/*----- app's state (variables) -----*/


// map var
const level = sessionStorage.getItem("level");
const colSize = sizeLookup[level].size;
const rowSize = 15;

const protect = document.getElementById("item_protect");
const predict = document.getElementById("item_predict");

var board;
var bombCount;
var gameSHA;

// bomb var
var winner;
var adjBombs;
var hitBomb;

// timer var - setTimer()
var timerId;
var elapsedTime;
var timeElapsed;


// touch timer var
var touchStartTimeStamp;
var touchEndTimeStamp
var touchFlag = [false, false];

// item user
var startCell = null;

/*----- cached element references -----*/
var boardEl = document.getElementById('board'); // html의 table 가져옴


window.addEventListener('load', function() {
  //Assign Metamask to window.web3 var
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
  }
  // Now you can start your app & access web3 freely:
  // startApp()?
  console.log(web3);
  console.log(sessionStorage);
});


/*----- event listeners -----*/
// target.addEventListener(이벤트종류, listener);

/* <<  listener  >>
 * 지정된 타입의 이벤트가 발생했을 때, 알림(Event 인터페이스를 구현하는 객체)을 받는 객체입니다. 
 * EventListener 인터페이스 또는 JavaScript function를 구현하는 객체여야만 합니다. 
 * 콜백 자체에 대한 자세한 내용은 The event listener callback 를 참조하세요.
 *
 * <<  Mouse Event  >>
 * click : 클릭
 * dblclick : 더블클릭
 * contextmenu : 마우스 우클릭 시
 * wheel : 마우스 휠 회전 시
 *
 * <<  참고 사이트  >>
 * https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener
 * https://developer.mozilla.org/ko/docs/Web/Events
 * https://blog.sonim1.com/152
 */

//제거 예정인 리스너 #1
// document.getElementById('size-btns').addEventListener('click', function(e) { // size-btns을 클릭한 경우... e : 이벤트 발생 객체
//   size = parseInt(e.target.id.replace('size-', '')); // size-N 으로 되어있는 id에서 N을 추출하기 위해 replace로 'size-' 제거 후 변환
//   //e.target : 이벤트가 발생한 초기 DOM 요소
//   init(); // 초기화 
//   render(); // 렌더링
// });


// HTML 파일 & buildTable() 과 같이 볼 것
// board의 태그 현황
/*
 * <table>
 *  <tr>
 *    <td class = 'game-cell' ... ></td>, <td></td>, ... <td></td>
 *  </tr>
 *   (repeat...)
 * </table>
 */
boardEl.addEventListener('click', function(e) {
  if (winner || hitBomb) return; // 전부 폭탄없는 부분을 누르거나 폭탄을 클릭한 경우
  
  var clickedEl = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target; 
  // 플래그 표시가 있으면 해당 cell을 눌렀을 때 img 태그로 인식되는 경우 존재!! 
  //클릭한 element의 태그가 img라면... 부모Element로 바꾼다(TD)
  //처음 깃발이 없는 상태에서는 클릭한 태그가 img가 아님...
  /*  <html> <body> </body> </html> 에서
   *  body에 대해 .parentElement를 하면 <html>을 반환.
   *  
   *  parentNode와 parentElement를 비슷한 역할을 하지만, 
   *  Node의 경우 최상위 elemnet에서 Document를 반환하지만
   *  Element는 null을 반환한다.
   *  각각의 셀<td class='game-cell' ..>은 내부에 img 태그를 포함(flagImage / bombImage 등)
   */

  console.log(clickedEl.classList)

  if (clickedEl.classList.contains('game-cell')) { 
    //buildTable() 함수를 보면 각 cell마다 game-cell이라는 class명을 붙이는 것을 알 수 있다.
    if (!timerId) {
      if(startCell !== null) {
        var td = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
        td.style.backgroundColor = "#C0C0C0";
      }
      setTimer(); 
    }
    // 첫 클릭 전까지는 timer가 시작되지 않으므로, 첫 클릭시 setTimer()를 호출해 타이머 시작!
    // 누른 셀의 attribute 값인 row와 col을 가져와서 cell 변수에 담는다.
    var row = parseInt(clickedEl.dataset.row);
    var col = parseInt(clickedEl.dataset.col);
    var cell = board[row][col];

    if(cell.flagged) return; // 좌클릭한 cell이 플래그 표시가 되어있으면 무시
     
    hitBomb = cell.reveal(); // Cell을 열었을 때 폭탄 여부에 따른 true, false 반환
    
    if(sessionStorage.getItem("flag") === "true") {
      if(bombCount !== 0) {
        bombCount -= 1;
      }

      sessionStorage.removeItem("flag");
    }

    if (hitBomb) { 
      revealAll();
      clearInterval(timerId);
      
      e.target.style.backgroundColor = 'red';
    }
  } else if(clickedEl.classList.contains('revealed')){
      var row = parseInt(clickedEl.dataset.row);
      var col = parseInt(clickedEl.dataset.col);
      var cell = board[row][col];

      if(cell.calcAdjFlagsAndOpen()) { // flag 갯수와 해당 셀의 인접 폭탄 갯수가 같을 경우 인근 셀 전부 연다.....
        hitBomb = true;
        revealAll();
        clearInterval(timerId);
      }
    } 

    winner = getWinner();
    console.log(`when click : ${winner}`)
    render(); // 클릭한 경우 무조건 계속 render 해야함!
});




boardEl.addEventListener('contextmenu',function(e){
  e.preventDefault();
  console.log(e.target.tagName);
  var clickedEl = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
  if(clickedEl.classList.contains('game-cell')) {
    if (!timerId) {
      if(startCell !== null) {
        var td = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
        td.style.backgroundColor = "#C0C0C0";
      }
      setTimer(); 
    }
    var row = parseInt(clickedEl.dataset.row);
    var col = parseInt(clickedEl.dataset.col);
    var cell = board[row][col];

    if(!cell.revealed && bombCount >= 0) {
      if(bombCount == 0 && !cell.flagged) {
        // do Nothing;
      } else {
        bombCount += cell.flag() ? -1 : 1;
      }
    }
  }
  winner = getWinner();
  console.log(`when contextmenu : ${winner}`)
  render(); // 클릭한 경우 무조건 계속 render 해야함!

});


// Mobile long press implementation
boardEl.addEventListener('touchstart', function(e){
  touchStartTimeStamp = e.timeStamp;
  touchFlag[0] = true;
});
boardEl.addEventListener('touchend', function(e){
  touchEndTimeStamp = e.timeStamp;
  touchFlag[1] = true;
  if(touchEndTimeStamp - touchStartTimeStamp > 499 && touchFlag[0] === touchFlag[1]) { // press 0.5 sec
    touchFlag[0] = false;
    touchFlag[1] = false;
    var clickedEl = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
    if(clickedEl.classList.contains('game-cell')) {
      if (!timerId) {
        if(startCell !== null) {
          var td = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
          td.style.backgroundColor = "#C0C0C0";
        }
        setTimer(); 
      }
      var row = parseInt(clickedEl.dataset.row);
      var col = parseInt(clickedEl.dataset.col);
      var cell = board[row][col];
  
      if(!cell.revealed && bombCount >= 0) {
        if(bombCount == 0 && !cell.flagged) {
          // do Nothing;
        } else {
          bombCount += cell.flag() ? -1 : 1;
        }
      }
    }
    winner = getWinner();
    console.log(`when touch-end : ${winner}`)
    render(); // 클릭한 경우 무조건 계속 render 해야함!
  }
});
// 아이템??

document.getElementById('result-btn').addEventListener('click', function() {
  sessionStorage.clear();
  window.location.href='index.html';

});


console.log(document.getElementById('copy-btn'));



//제거 예정 리스너#2
function createResetListener() { 
  // document.getElementById('reset').addEventListener('click', function() {
  //   init();
  //   render();
  // });
}


/*----- functions -----*/
function setTimer () {
  timerId = setInterval(function(){
    elapsedTime += 1;
    document.getElementById('timer').innerText = elapsedTime.toString().padStart(3, '0');
  }, 1000);
};
// setInterval : 일정시간마다 반복 실행하는 함수
// setInterval(function() { ... }, 지연시간(ms));
// padStart : padStart() 메서드는 현재 문자열의 시작을 다른 문자열로 채워, 주어진 길이를 만족하는 새로운 문자열을 반환합니다. 
//            채워넣기는 대상 문자열의 시작(좌측)부터 적용됩니다.


function revealAll() { // 모든 셀 열기
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cell.reveal();
    });
  });
};


function unveil() { // 모든 셀 열기 (아이템 사용 시)

  
  var revealNum = Math.floor(sizeLookup[sessionStorage.getItem("level")].size * rowSize / 5);
  var curVeilNum = 0;

  var tdList = Array.from(document.querySelectorAll('[data-row]')); // [data-row]라는 attribute를 가진 모든 DOM을 array로!!

  tdList.some(function(td) {


    var rowIdx = parseInt(td.getAttribute('data-row'));
    var colIdx = parseInt(td.getAttribute('data-col'));
    var cell = board[rowIdx][colIdx]; 
    
    curVeilNum += 1;

    if (cell.isBomb) { // 폭탄이라면
        td.innerHTML = bombImage; // 폭탄 이미지
    } else if (cell.adjBombs) { // 인접된 곳에 폭탄이 있다면
        td.style.color = colors[cell.adjBombs]; // 색 변경
        td.textContent = cell.adjBombs; // 글자 담음
    } else { // 아무것도 없는 빈 칸이라면
    }

    return curVeilNum == revealNum;
  });
};

function veil() { // 모든 셀 열기 (아이템 사용 시)
  var tdList = Array.from(document.querySelectorAll('[data-row]')); // [data-row]라는 attribute를 가진 모든 DOM을 array로!!
  tdList.some(function(td) {
    td.innerHTML = "";
    td.textContent = "";
  });
}

function buildTable() { // core Function #1

  // <tr> : (가로_행 추가) <td> : (세로_열 추가) <tr>i <td></td> <td></td> </tr> : 1행 2열짜리 테이블
  //<div id="folder1"><a href="https://github.com/nckarocho/minesweeper/blob/master/readme.md" target="blank">Read Me </a></div>
  var topRow = `
  <tr>
    <td class="menu" id="window-title-bar" colspan="${colSize}">
      <div id="window-title"><img src="images/mine-menu-icon.png"> Minesweeper</div>
      <div id="window-controls"><img src="images/window-controls.png"></div>
    </td>
  <tr>
    <td class="menu" id="folder-bar" colspan="${colSize}">
      
      <div id="folder2"><a href="https://github.com/Kwon1992/kwon1992.github.io/tree/master/minesweeper" target="blank">Source Code</a></div>
    </td>
  </tr>
  </tr>
    <tr>
      <td class="menu" colspan="${colSize}">
          <section id="status-bar">
            <div id="bomb-counter">000</div>
            <div id="reset"><img src="images/smiley-face.png"></div>
            <div id="timer">000</div>
          </section>
      </td>
    </tr>
    `;
  /* 맨 처음 <tr>은 윈도우 타이틀 바 표현 <td>는 맨 위의 표시줄과 '_'ㅁ'X' 버튼을 각각 나타냄
   * 두 번째 <tr>은 타이틀 바 바로 아래의 Read Me와 Source Code를 나타냄
   *
   */
  // template literals : https://jeong-pro.tistory.com/108
  //                     https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals
  
  boardEl.innerHTML = topRow + `<tr>${'<td class="game-cell"></td>'.repeat(colSize)}</tr>`.repeat(rowSize); 

  // template literals의 [ `string text ${expression} string text` ] 형태
  // String.repeat(n) : String을 n회 반복해서 출력함. [example] 'abc'.repeat( 2 ) -> 'abcabc'
  // N * N 크기의 테이블 생성하여 위의 topRow에 이어붙이고 innerHTML을 활용해 실제 HTML 내부에 적용.
  
  boardEl.style.width = sizeLookup[level].tableWidth;
  // HTML board element의 style width 설정
  createResetListener();
  // ResetListener를 실행시켜 init과 render을 함.
  
  var cells = Array.from(document.querySelectorAll('td:not(.menu)'));
  // <td> 태그 중 클래스가 menu가 아닌 모든 td를 선택한 nodeList를 반환하고 이 list들을 Array.from 함수를 이용해 array로 변환함
   
  /*
   * document.querySelectorAll : https://developer.mozilla.org/ko/docs/Web/API/Document/querySelectorAll
   * 지정된 셀렉터 그룹에 일치하는 다큐먼트의 엘리먼트 리스트를 나타내는 정적(살아 있지 않은) NodeList 를 반환
   * Select all <p> elements except those with class="intro"
   * The :not() selector selects all elements except the specified element.
   * $("p:not(.intro)")
   */
  
  /*
   * Array.from(arrayLike[, mapFn[, thisArg]])
   * arrayLike : 배열로 변환하고자 하는 유사 배열 객체나 반복 가능한 객체.
   */

  cells.forEach(function(cell, idx) {

    cell.setAttribute('data-row', Math.floor(idx / colSize));
    cell.setAttribute('data-col', idx % colSize);    
    
  });
  // 용도 불명... 뭔 목적인지 이해 불가 ㅠㅠ 
  // 각 셀마다 row와 col 값을 attribute로 입력하는 것으로 판단됨
}


function buildArrays() { // core Function #2
  var arr = Array(rowSize).fill(null); 
  // size 만큼의 1차원 배열 생성 _ 각 배열의 요소 값은 null
  

  arr = arr.map(function() {
    return new Array(colSize).fill(null);
  }); 
  // 각각의 요소를 배열로 만들어 2차원 배열로 만든 뒤 각각의 요소 값 전부 null

  return arr; 
  // 2차원 배열 반환
};

// board = buildArrays(); 를 실행한 뒤에 buildCells()를 실행하므로 board 내에는 이미 2차원배열을 할당한 상태임.
function buildCells(){ // core Function #3
  board.forEach(function(rowArr, rowIdx) { 
    rowArr.forEach(function(slot, colIdx) { // 각 요소도 배열이므로 각 요소별로 forEach통해서 순회 시작.
      board[rowIdx][colIdx] = new Cell(rowIdx, colIdx, board);
      //0,0 -> 0,1 -> 0,2 -> ... -> 1,0 -> 1,1 -> ... 이런식으로 순회하게됨 (이중 for문) : 순회하면서 null을 Cell로 채움!!
      //Cell에 관한 내용은 cell.js 참조.
    });
  });


  addBombs(); // 모든 2차원배열을 cell로 만든 뒤 폭탄을 추가함.
}


function getBombCount() {
  var count = 0;
  board.forEach(function(row){
    count += row.filter(function(cell) {
      return cell.isBomb;
    }).length
  });
  // Array.filter() : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  // 주어진 함수의 테스트를 통과하는 모든 요소를 모아 새로운 배열로 반환
  // 즉, board.forEach로 각 요소(배열)를 순회하면서 해당 배열의 요소(cell)마다 bomb인지 검사 -> 길이를 추가!
  /*
   * var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
   * const result = words.filter(word => word.length > 6);
   * console.log(result);
   * // expected output: Array ["exuberant", "destruction", "present"]
   */
  return count;
};



function  addBombs() { // 랜덤하게 폭탄 설치 core Function #4 _ updating...
  var currentTotalBombs = sizeLookup[level].totalBombs;

  while (currentTotalBombs !== 0) {
    var row = Math.floor(Math.random() * rowSize);
    var col = Math.floor(Math.random() * colSize);
    var currentCell = board[row][col];

    if (!currentCell.isBomb){
      // 추가된 폭탄위치를 저장하는 위치 나열하는 string 제작

      currentCell.isBomb = true;
      currentTotalBombs -= 1;
      
      currentCell.calcAdjBombs();
      // 인접 cell에 폭탄 갯수 추가
    }
  }

   // 나중에 hash값으로 변환하기 위해 string값 return
}
/* "//"부분은 임의로 추가할 부분 - update 예정
*/

function useItem() {
  if(sessionStorage.getItem("showStart") === "true"){
    while(true){
      var row = Math.floor(Math.random() * rowSize);
      var col = Math.floor(Math.random() * colSize);
      startCell = board[row][col];

      if (!startCell.isBomb && startCell.row >= 3){
        var td = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
        td.style.backgroundColor = "skyblue"
        break;
      }
     }
  }
  
  if(sessionStorage.getItem("revealAll") === "true"){
      setTimeout(unveil,0);
      setTimeout(veil,500);
  }
}


function checkItem(){
  protect.style.backgroundColor = sessionStorage.getItem("protect") === "true" ? "yellow" : "";
}



function getWinner() { 
  for (var row = 0; row<board.length; row++) {
    for (var col = 0; col<board[0].length; col++) {
      var cell = board[row][col];
      if (!cell.revealed && !cell.isBomb) return false;
    }
  } 
  return true;
}

function init() { // map 제작 + 초기 변수 설정
  buildTable();
  board = buildArrays();
  buildCells();
  bombCount = getBombCount();
  elapsedTime = 0;

  clearInterval(timerId);

  useItem();
  
  timerId = null;
  hitBomb = false;
  winner = false;
};



function render() {
  checkItem();
  //아이템 선택여부 체크

  document.getElementById('bomb-counter').innerText = bombCount.toString().padStart(3, '0'); //bombCount에 따른 bomb 개수 innerText..
  var seconds = timeElapsed % 60; // 어따 써? 
  var tdList = Array.from(document.querySelectorAll('[data-row]')); // [data-row]라는 attribute를 가진 모든 DOM을 array로!!
  
  tdList.forEach(function(td) {
    var rowIdx = parseInt(td.getAttribute('data-row'));
    var colIdx = parseInt(td.getAttribute('data-col'));
    // 셀렉터 문법 정리표 : https://ggoreb.tistory.com/172
    // E[A] :: 속성 A를 가지는 태그 명이 E인 모든 엘리먼트
    // getAttribute : 선택한 요소(element)의 특정 속성(attribute)의 값을 가져옵니다.
    var cell = board[rowIdx][colIdx]; // 특정 셀 담음

    if (cell.flagged) { // 깃발을 표시한 셀이면..
      td.innerHTML = flagImage; // 이미지 바꿔줌
    } 
    else if (cell.revealed) { // 공개된 경우
      if (cell.isBomb) { // 폭탄이라면
        td.innerHTML = bombImage; // 폭탄 이미지
      } else if (cell.adjBombs) { // 인접된 곳에 폭탄이 있다면
        td.className = 'revealed' // 클래스 이름 변경
        td.style.color = colors[cell.adjBombs]; // 색 변경
        td.textContent = cell.adjBombs; // 글자 담음
      } else { // 아무것도 없는 빈 칸이라면
        td.className = 'revealed' // 클래스 이름만 변경
      }
    } 
    else { // 아무것도 안 한 상태라면..
      td.innerHTML = ''; // 테이블이 비어있음
    }
  });
  
  if (hitBomb) { // 폭탄을 건드렸다면...
    document.getElementById('reset').innerHTML = '<img src=images/dead-face.png>'; // 사망!
    console.log(`winner : ${winner}`);
    console.log(`hitBomb : ${hitBomb}`);
    console.log(`winner && hitBom : ${(winner && !hitBomb)}`);
    alert("Accept the Transaction if you want to get rewards!");

    gameController.getTotalGameCount({from:accountAddr}, function(err, res) {
      var gameSHA = web3.sha3(mapSize + accountAddr.toString() + res.toNumber());
  
      gameController.endGame(gameSHA, (winner && !hitBomb) , function(err,res) {
        if(err) {
          console.log(err);
        }
        console.log(res);
        runCodeForAllCells(function(cell) { // 모든 cell에 대해서 해당 함수 적용
          if (!cell.isBomb && cell.flagged) { // flag 표시가 되었으나 폭탄이 아닌 cell에 대해서...
            var td = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`); // 해당 셀의 좌표 td에 담음
            td.innerHTML = wrongBombImage; // 잘못된 폭탄 이미지 넣음
          }
        });
        document.getElementById('hashValue').innerHTML = res;
        $('#myModal').delay(1500).show(0);
      })
    })

  } else if (winner) { // winner라면
    document.getElementById('reset').innerHTML = '<img src=images/cool-face.png>';
    
    clearInterval(timerId); // interval 종료

    console.log(`winner : ${winner}`);
    console.log(`hitBomb : ${hitBomb}`);
    console.log(` winner && hitBom : ${(winner && !hitBomb)}`);

    alert("Accept the Transaction if you want to get rewards!");

    gameController.getTotalGameCount({from:accountAddr}, function(err, res) {
      var gameSHA = web3.sha3(mapSize + accountAddr.toString() + res.toNumber());
      console.log("AFTER GAME START __ GAME ID : " + gameSHA)
      console.log(gameSHA)
      gameController.endGame(gameSHA, (winner && !hitBomb) , function(err,res) {
        if(err) {
          console.log(err);
          
        }
        console.log(res);
        document.getElementById('hashValue').innerHTML = res;
        $('#myModal').delay(1500).show(0);
      })
    })

  }

  
};


function runCodeForAllCells(cb) {
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cb(cell);
    });
  });
}



init();
render(); 






//-------------------------------------------------------------------------------

/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
**/

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
