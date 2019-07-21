var sizeLookup = {
    '9': {totalBombs: 10, tableWidth: '245px'},
    '16': {totalBombs: 40, tableWidth: '420px'},
    '30': {totalBombs: 160, tableWidth: '794px'}
};

document.getElementById('size-btns').addEventListener('click', function(e) { // size-btns을 클릭한 경우... e : 이벤트 발생 객체
    size = parseInt(e.target.id.replace('size-', '')); // size-N 으로 되어있는 id에서 N을 추출하기 위해 replace로 'size-' 제거 후 변환
    // init(); // 초기화 
    // render(); // 렌더링
  });
  