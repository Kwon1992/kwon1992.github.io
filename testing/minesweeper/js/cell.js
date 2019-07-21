class  Cell {
    constructor(row, col, board) { // row : 행 개수, col : 열 개수, board : 2차원배열 형태의 보드판
        this.row = row;
        this.col = col;
        this.isBomb = false;
        this.board = board;
        this.revealed = false;
        this.flagged = false;
        this.adjBombs = 0;
        //this.XXX = XXX; (this.XXX : Cell의 변수, XXX : 인자값)
    }

    getAdjCells() { //인접 셀의 리스트를 반환하는 함수.
        var adj = [];
        var lastRow = board.length - 1;
        var lastCol = board[0].length - 1;
        if (this.row > 0 && this.col > 0) adj.push(board[this.row - 1][this.col - 1]);              //Ⅰ
        if (this.row > 0) adj.push(board[this.row - 1][this.col]);                                  //Ⅱ
        if (this.row > 0 && this.col < lastCol) adj.push(board[this.row - 1][this.col + 1]);        //Ⅲ
        if (this.col < lastCol) adj.push(board[this.row][this.col + 1]);                            //Ⅳ
        if (this.row < lastRow && this.col < lastCol) adj.push(board[this.row + 1][this.col + 1]);  //Ⅴ
        if (this.row < lastRow) adj.push(board[this.row + 1][this.col]);                            //Ⅵ
        if (this.row < lastRow && this.col > 0) adj.push(board[this.row + 1][this.col - 1]);        //Ⅶ
        if (this.col > 0) adj.push(board[this.row][this.col - 1]);                                  //Ⅷ
        return adj;
    }
    /* ┌ ── ┬ ─ ─ ─ ┬ ── ┐
     * │  Ⅰ │   Ⅱ   │ Ⅲ │
     * ├ ── ┼ ─ ─ ─ ┼ ── │
     * │ Ⅷ│ Origin│ Ⅳ │
     * ├ ── ┼ ─ ─ ─ ┼ ── │
     * │ Ⅶ │  Ⅵ  │ Ⅴ  │
     * └ ── ┴ ─ ─ ─ ┴ ── ┘ 에서 [I, II, III, IV, V, VI, VII, VIII] 의 배열을 반환함. => caclAdjBombs()에서 사용됨
     */

    calcAdjBombs() { // 특정 cell(A)의 인접 cell들 중 폭탄이 있는지 확인 후 A에 인접한 폭탄 갯수를 할당.
                     // 모든 cell을 돌아야하는 비용 발생.. 폭탄 발생시 폭탄이 발생한 곳을 기준으로 인접한 셀에 추가하는 것은 안되나?
                     /* Update 완료
                      * (기존: 보드의 모든 셀을 돌면서 해당 셀 주변의 폭탄 갯수에 따른 업데이트)
                      * (신규: 특정 셀에 폭탄을 놓으면서 해당 셀 주변에 폭탄 갯수를 +1 해주는 방식)
                      */ 
                     var adjCells = this.getAdjCells();
                     var adjBombs = adjCells.forEach(function(cell) {
                         cell.adjBombs += 1;
                     });
        return; 
    }

    calcAdjFlagsAndOpen() {
        var checker = false;
        var numOfFlags = 0;
        var adjCells = this.getAdjCells();
        adjCells.forEach(function(cell) {
            if(cell.flagged) {
                numOfFlags += 1;
            }
        });
        if(this.adjBombs === numOfFlags) {
            adjCells.forEach(function(cell) {
                cell.reveal();
                if(cell.flagged === false && cell.isBomb === true  && checker === false) {
                    checker = true;
                }
            });
        }
        return checker;
    }


    /* Javascript의 Array.reduce()함수
     * 
     * Array.reduce(callback[, initVal]); 형태
     * 
     * (example)
     * val initialValue = {};
     * votes.reduce(reducer, initialValue);
     * 
     * reducer는 reduce 메서드의 첫번째 "함수"인자
     * 
     * var reducer = function(accumulator, value, index, array) {
     *  if(accumulator.hasOwnProperty(value)) {
     *      accumulator[value] accumulator[val] + 1;
     *  } else {
     *      accumulator[value] = 1;
     *  }
     *  return accumulator;
     * }
     * 
     * 여기서 value는 현재 처리해야할 array의 element.
     * accumulator는 배열의 요소를 모두 순회할떄까지 계속해서 유지되는 변수
     * accumulator를 반환할 때에는 int, string, object등 다양한 유형을 반환할 수 있음.
     * 
     * initialValue는 초기값으로서 initialValue라는 빈 Object를 사용하겠다는 의미
     * 
     */


    flag() { 
        if (!this.revealed) {
            this.flagged = !this.flagged;
            return this.flagged;
        }
    }
    // 특정 cell에 flag를 걸거나 없앨 수 있음.
    

    reveal() {
        if (this.revealed && !hitBomb) return;
        if (this.flagged) return;
        // 특정 Cell의 revealed 초기값은 false 이다. (즉, 열리지 않음)
        // 해당 셀이 열렸고 폭탄이 아니라면 좌클릭/우클릭 시 아무일도 일어나지 않는다.
        
        this.revealed = true;
        // 위의 경우에 해당하지 않는다면 revealed의 값을 true로 바꾼다.
        if (this.isBomb) {
            if(sessionStorage.getItem("protect") === "true") {
                this.revealed = false; 
                this.flag(); // 버그 : 플래그 잔여 숫자 1 감소 안 함;
                sessionStorage.setItem("protect", false);
                sessionStorage.setItem("flag", true);
                return false;
            }
            return true;
        }
        // 한편 열어본 cell이 폭탄인 경우 true를 return한다.
        
        if (this.adjBombs === 0) {
            var adj = this.getAdjCells();
            // 이 cell의 인접 cell들을 반환한다.
            adj.forEach(function(cell){
                // 각각의 인접하는 cell마다
                if (!cell.revealed) cell.reveal();
                // 열리지 않았다면 reveal을 Recursive하게 호출한다.
            });
        }
        // === : type까지 일치하는지 확인한다. 
        // unidentified == null은 true, unidentified === null은 false
        // 폭탄도 아니며, 아예 빈칸인 경우(인접 cell에 폭탄이 없는 경우)...
        return false;
        //폭탄이 아닌 경우 false를 return한다.
    }

    veil() {
        this.revealed = false;
        // 특정 Cell의 revealed 초기값은 false 이다. (즉, 열리지 않음)
        // 해당 셀이 열렸고 폭탄이 아니라면 좌클릭/우클릭 시 아무일도 일어나지 않는다.
        // 위의 경우에 해당하지 않는다면 revealed의 값을 true로 바꾼다.
        if (this.isBomb) {
            if(sessionStorage.getItem("protect") === "true") {
                this.revealed = false; 
                this.flag(); // 버그 : 플래그 잔여 숫자 1 감소 안 함;
                sessionStorage.setItem("protect", false);
                sessionStorage.setItem("flag", true);
                return false;
            }
            return true;
        }
        // 한편 열어본 cell이 폭탄인 경우 true를 return한다.
        
        if (this.adjBombs === 0) {
            var adj = this.getAdjCells();
            // 이 cell의 인접 cell들을 반환한다.
            adj.forEach(function(cell){
                // 각각의 인접하는 cell마다
                if (!cell.revealed) cell.reveal();
                // 열리지 않았다면 reveal을 Recursive하게 호출한다.
            });
        }
        // === : type까지 일치하는지 확인한다. 
        // unidentified == null은 true, unidentified === null은 false
        // 폭탄도 아니며, 아예 빈칸인 경우(인접 cell에 폭탄이 없는 경우)...
        return false;
        //폭탄이 아닌 경우 false를 return한다.
    }

    // 추가적인 함수... 좌 + 우 동시에 클릭할 경우 해당셀을 기준으로 인접한 셀을 보여주고, 깃발을 제대로 달았을 경우
    // 자동적으로 reveal해주어야함.
}