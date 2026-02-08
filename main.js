function createField() {
    let board = document.getElementById("board");
    for (let i = 1; i <= 8; i++) {
        let letter = String.fromCharCode('a'.charCodeAt(0) + i - 1)
        for (let j = 1; j <= 8; j++) {
            let colorClass = "white";
            if (i % 2 !== 0 && j % 2 === 0 || i % 2 === 0 && j % 2 !== 0) {
                colorClass = "grey";
            }
            let cell = document.createElement("div");
            cell.id = i + "" + j;
            cell.classList.add("cell");
            cell.classList.add(colorClass);
            cell.addEventListener('click', handleClick)

            let cellPositionP = document.createElement("p");
            cellPositionP.textContent = letter + j

            cell.appendChild(cellPositionP)
            board.appendChild(cell);
        }
    }
}

var clickNumber = 0;
var fromX;
var fromY;
var toX;
var toY;

function handleClick(e) {
    clickNumber++;
    if (clickNumber === 1) {
        let target = e.target
        if (target.tagName !== "DIV") {
            target = target.parentNode
        }
        fromX = parseInt(target.id[1]);
        fromY = parseInt(target.id[0]);
    }
    if (clickNumber === 2) {
        let target = e.target
        console.log(target.tagName)
        if (target.tagName !== "DIV") {
            target = target.parentNode
        }
        toX = parseInt(target.id[1]);
        toY = parseInt(target.id[0]);
        makeMove().then(result => placeFigures(result.board));
        clickNumber = 0
    }
}

async function getGame() {
    let response = await fetch("http://localhost:8080/startGame", {method: 'POST'});
    if (!response.ok) {
        console.log("Failed to request startGame. Status code: " + response.status)
    }
    return await response.json();
}

async function makeMove() {
    let response = await fetch("http://localhost:8080/move", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "gameId": gameId,
            "fromX": fromX,
            "fromY": fromY,
            "toX": toX,
            "toY": toY
        })
    });
    if (!response.ok) {
        console.log("Failed to request startGame. Status code: " + response.status)
    }
    return await response.json();
}

function placeFigures(figures) {
    let cells = document.getElementById("board").children;
    let index = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let figure = figures[i][j];
            let divChildren = cells.item(index).children;
            for (let k = 0; k < divChildren.length; k++) {
                if (divChildren.item(k).tagName === "IMG") {
                    divChildren.item(k).remove();
                    break;
                }
            }
            if (figure === "") {
                index++
                continue;
            }
            let img = document.createElement("img");
            let imgName = getImg(figure);
            img.src = "./img/" + imgName;
            img.alt = imgName;
            img.id = i + "" + j
            img.classList.add("figure");
            cells.item(index++).appendChild(img);
        }
    }
}

function getImg(figure) {
    switch (figure) {
        case "P":
            return "wpawn.png"
        case "R":
            return "wrook.png"
        case "N":
            return "wknight.png"
        case "B":
            return "wbishop.png"
        case "Q":
            return "wqueen.png"
        case "K":
            return "wking.png"
        case "p":
            return "bpawn.png"
        case "r":
            return "brook.png"
        case "n":
            return "bknight.png"
        case "b":
            return "bbishop.png"
        case "q":
            return "bqueen.png"
        case "k":
            return "bking.png"
        default:
            return ""
    }
}

var gameId
createField();
getGame()
    .then(result => {
        gameId = result.gameId;
        placeFigures(result.board);
    });

// All this shit works, but...... Will be rewritten, lol
// 1) don't request full board updates. Just updated pieces.
// 2) don't update all board
// 3) find a way to exclude img loading on moves