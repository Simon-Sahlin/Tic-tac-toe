let gameManager = (function(){
    let turn = 0;
    let player1;
    let player2;

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

    let startGame = () => {
        turn = Math.floor(Math.random() * 2);
        let names = screenController.getNames();
        player1 = new player(names[0], 0);
        player2 = new player(names[1], 1);
        console.log(player1.color)
        screenController.hideSetup();
        screenController.updateHeader(`<em>${turn == 1 ? player1.name : player2.name}</em>'s Turn!`);
    }

    let makeMove = (id)=>{
        if (gameBoard.isChecked(id))
            return;
        gameBoard.place(id, sign());
        screenController.updateCell(id);
        addTurn();
        screenController.updateHeader(`<em>${turn == 1 ? player1.name : player2.name}</em>'s Turn!`);
        if (hasWon())
            screenController.showMessage(`<em>${turn == 1 ? player1.name : player2.name}</em> Wins!`)
        if (gameBoard.isFull())
            screenController.showMessage(`It's a Tie!`)
    }

    let resetGame = () => {
        turn = Math.floor(Math.random() * 2);
        gameBoard.clearBoard();
    }

    return({makeMove, resetGame, startGame})
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

    let startButton = document.querySelector("#setupWrapper>button");
    startButton.addEventListener("click", ()=>{
        gameManager.startGame();
    });

    let getNames = () => {
        player1Name = document.querySelector("#player1").value;
        player2Name = document.querySelector("#player2").value;
        return [player1Name, player2Name]
    }

    let setupWrapper = document.querySelector("#setupWrapper")
    let hideSetup = () => {
        setupWrapper.classList.add("hidden");
    }

    let updateCell = (id) =>{
        gameBoard.cells[id].element.innerHTML = gameBoard.cells[id].sign;
    }

    let header = document.querySelector("h1");
    let updateHeader = (msg) => {
        header.innerHTML = msg;
    }

    let messageWrapper = document.querySelector("#messageWrapper");
    let messageText = document.querySelector("#messageWrapper>h2");
    let showMessage = (msg) => {
        messageText.innerHTML = msg;
        messageWrapper.classList.remove("hidden");
    }

    let hideMessage = () => {
        messageWrapper.classList.add("hidden")
    }

    let messagebutton = document.querySelector("#messageWrapper>button");
    messagebutton.addEventListener("click", () =>{
        hideMessage();
        gameManager.resetGame();
    });

    let colorWrappers = document.querySelectorAll(".colors");
    let ColorSelectors = [];
    colorWrappers.forEach((wrapper)=>{
        ColorSelectors.push(new colorSelector(wrapper))
    });

    return({updateCell, showMessage, getNames, hideSetup, updateHeader, ColorSelectors})
})();

function gameCell(id){
    this.id = id;
    this.checked = false;
    this.sign = "";
    this.element = document.querySelector(`#gameWrapper>div:nth-child(${id+1})`);
}

function player(name, id){
    this.name = name;
    this.color = screenController.ColorSelectors[id].selectedColor;
}


/* ------------------------------------ - ----------------------------------- */

function colorSelector(parent){
    let style = getComputedStyle(document.documentElement)
    let colors = [
        style.getPropertyValue('--red'),
        style.getPropertyValue('--orange'),
        style.getPropertyValue('--green'),
        style.getPropertyValue('--blue'),
        style.getPropertyValue('--purple'),
        style.getPropertyValue('--pink'),
    ]
    let selectedIndex = Math.floor(Math.random() * 6);
    this.selectedColor = colors[selectedIndex];

    function selectColor(index){
        parent.children[selectedIndex].classList.remove("selected");
        selectedIndex = index;
        this.selectedColor = colors[index];
        console.log({selectedIndex, selectedColor, index})
        parent.children[selectedIndex].classList.add("selected");
    }
    selectColor(selectedIndex);

    for (let i = 0; i < parent.childElementCount; i++) {
        parent.children[i].addEventListener("click", ()=>{
            selectColor(i);
        });
        parent.children[i].style.backgroundColor = colors[i];
    }
}
