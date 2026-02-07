function createField() {
    let board = document.getElementById("board");
    for (var i = 1; i <= 8; i++) {
        let letter = String.fromCharCode('a'.charCodeAt(0) + i - 1)
        for (var j = 1; j <= 8; j++) {
            let colorClass = "white";
            if (i % 2 != 0 && j % 2 == 0 || i % 2 == 0 && j % 2 != 0) {
                colorClass = "grey";
            }
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add(colorClass);

            let cellPositionP = document.createElement("p");
            cellPositionP.textContent = letter + j
            
            cell.appendChild(cellPositionP)
            board.appendChild(cell);
        }
    }
}

createField();