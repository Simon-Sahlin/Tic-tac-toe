let gameManager = (function(){
    let turn = 0;

    function addTurn(){
        turn++;
        turn = turn % 2;
    }

    function sign(){
        return turn == 0 ? "X" : "O"
    }

    function hasWon(){
        let combs = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,1,2],
            [2,4,6],
        ];
        for (let comb of combs) {
            if (
                gameBoard.getSign(comb[0]) === gameBoard.getSign(comb[1]) &&
                gameBoard.getSign(comb[1]) === gameBoard.getSign(comb[2]) &&
                gameBoard.getSign(comb[0]) !== ""
            )
                return true;
        };
        return false;
    }

    let makeMove = (id)=>{
        if (gameBoard.isChecked(id))
            return;
        gameBoard.place(id, sign());
        screenController.updateCell(id);
        addTurn();
        if (hasWon())
            screenController.showMessage(`<em>Player ${turn == 0 ? "O" : "X"}</em> Wins!`)
        if (gameBoard.isFull())
            screenController.showMessage(`It's a Tie!`)
    }

    let resetGame = () => {
        turn = 0;
        gameBoard.clearBoard();
    }

    return({makeMove, resetGame})
})();

let gameBoard = (function(){
    let cells = [];
    for (let i = 0; i < 9; i++) {
        cells.push(new gameCell(i));
    }

    let isChecked = (id) =>{
        return cells[id].checked;
    }

    let getSign = (id) => {
        return cells[id].sign;
    }

    let place = (id, sign) =>{
        cells[id].checked = true;
        cells[id].sign = sign;
    }

    let isFull = () => {
        for (let i = 0; i < 9; i++) {
            if (!getSign(i))
                return false
        }
        return true;
    }

    let clearBoard = () => {
        for (let i = 0; i < 9; i++) {
            cells[i].sign = "";
            cells[i].checked = false;
            screenController.updateCell(i);
        }
    }

    return({cells, isChecked, place, getSign, isFull, clearBoard})
})();

let screenController = (function(){

    gameBoard.cells.forEach(cell => {
        cell.element.addEventListener("click", ()=>{
            gameManager.makeMove(cell.id);
        })
    });

    let updateCell = (id) =>{
        gameBoard.cells[id].element.innerHTML = gameBoard.cells[id].sign;
    }

    let messageWrapper = document.querySelector("#messageWrapper");
    let messageText = document.querySelector("#messageWrapper>h2");
    let showMessage = (msg) => {
        messageText.innerHTML = msg;
        messageWrapper.classList.remove("hidden");
    }

    let messagebutton = document.querySelector("#messageWrapper>button");
    let hideMessage = () => {
        messageWrapper.classList.add("hidden")
    }
    messagebutton.addEventListener("click", () =>{
        hideMessage();
        gameManager.resetGame();
    });

    return({updateCell, showMessage})
})();

function gameCell(id){
    this.id = id;
    this.checked = false;
    this.sign = "";
    this.element = document.querySelector(`#gameWrapper>div:nth-child(${id+1})`);
}