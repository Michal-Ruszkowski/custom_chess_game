let gameOver = false;
let isLegal = false;
let isPlayerTurn = true;
let position;
let possibleMoves = [];
const soundOfLosing = new Audio("audio/loser.mp3");
const soundOfWinning = new Audio("audio/winner.mp3");
const rules = document.querySelector('.rules');
const result = document.querySelector('.result');
const right = document.querySelector('.right');
const myBoard = document.querySelector('.myBoard');

const loadBoard = color => {
    myBoard.classList.remove('hidden')
    rules.classList.add('hidden')
    right.classList.add('hidden')
    gameOver = false
    isLegal = false
    isPlayerTurn = true
    position = {
        a3: "wP",
        b3: "wP",
        c3: "wP",
        d3: "wP",
        e3: "wP",
        f3: "wP",
        g3: "wP",
        h3: "wP",
        d1: "wQ",
        e1: "wK",
        a6: "bP",
        b6: "bP",
        c6: "bP",
        d6: "bP",
        e6: "bP",
        f6: "bP",
        g6: "bP",
        h6: "bP",
        d8: "bQ",
        e8: "bK",
    }
    possibleMoves = []
    config.orientation = color
    config.position = position
    board = Chessboard('myBoard', config)
    color === 'black' ? setTimeout(computerTurn, 800) : config.draggable = true
}

const checkGameOver = (target, piece) => {
    if (position.hasOwnProperty(target) && position[target][0] !== piece[0] && position[target][1] === "K") {
        config.draggable = false
        gameOver = true
        piece[0] === config.orientation[0] ? win() : lose()
    }
}

const checkLegality = (target, piece) => {
    let isPawn = false
    isLegal = false
    if (piece[1] === "P") isPawn = true
    for (i = 0; i < possibleMoves.length; i++) {
        if (target === possibleMoves[i]) {
            if (target[0] !== "i" && target[0] !== "`" && target[1] !== "0" && target[1] !== "9") {
                if (!position.hasOwnProperty(target) || position[target][0] !== piece[0]) {
                    if (!isPawn) {
                        isLegal = true
                    } else {
                        if (target === possibleMoves[0] && !position.hasOwnProperty(target)) {
                            isLegal = true
                        } else if (target !== possibleMoves[0] && position.hasOwnProperty(target)) {
                            isLegal = true
                        }
                    }
                }
            }
        }
    }
    return isLegal
}

const computerTurn = () => {
    if (!gameOver) {
        let computerFigure
        const computerFigures = []
        let direction
        let enemySource = ""
        const figures = Object.entries(position)
        let isPossibleToChangePawnToQueen = false
        let isPossibleToKillKing = false
        let isPossibleToKillPawn = false
        let isPossibleToKillQueen = false
        let isPossibleToLossKing = false
        let king = ""
        let kingCanKillAnotherFigure = false
        let kingCanKillPotentialKiller = false
        let piece = ""
        const playerFigures = []
        let source = ""
        let sourceKing = ""
        let sourceOfPotentialKiller = ""
        let target = ""

        const checkKingCanKillPotentialKiller = () => {
            findPossibleMoves(sourceKing, king)
            for (i = 0; i < possibleMoves.length; i++) {
                if (possibleMoves[i] === sourceOfPotentialKiller) {
                    kingCanKillPotentialKiller = true
                    break;
                } else if (position.hasOwnProperty(possibleMoves[i]) && position[possibleMoves[i]][0] !== computerFigures[i][1][0]) {
                    kingCanKillAnotherFigure = true
                    enemySource = possibleMoves[i]
                    break;
                }
            }
        }

        const checkPossibilityToChangePawnToQueen = () => {
            for (i = 0; i < computerFigures.length; i++) {
                findPossibleMoves(computerFigures[i][0], computerFigures[i][1])
                if (!position.hasOwnProperty(possibleMoves[0]) && computerFigures[i][1][1] === "P" && (possibleMoves[0][1] === "1" || possibleMoves[0][1] === "8")) {
                    isPossibleToChangePawnToQueen = true
                    target = possibleMoves[0]
                    piece = computerFigures[i][1]
                    source = computerFigures[i][0]
                    break;
                }
            }
        }

        const checkPossibilityToKillKing = () => {
            for (i = 0; i < figures.length; i++) {
                if (figures[i][1][0] !== config.orientation[0])
                    computerFigures.push(figures[i])
            }
            for (i = 0; i < computerFigures.length; i++) {
                findPossibleMoves(computerFigures[i][0], computerFigures[i][1])
                for (j = 0; j < possibleMoves.length; j++) {
                    if (position.hasOwnProperty(possibleMoves[j]) && position[possibleMoves[j]][0] !== computerFigures[i][1][0] && position[possibleMoves[j]][1] === "K" && (computerFigures[i][1][1] !== "P" || j !== 0)) {
                        isPossibleToKillKing = true
                        target = possibleMoves[j]
                        piece = computerFigures[i][1]
                        source = computerFigures[i][0]
                        break;
                    }
                }
            }
        }

        const checkPossibilityToKillPawn = () => {
            for (i = 0; i < computerFigures.length; i++) {
                findPossibleMoves(computerFigures[i][0], computerFigures[i][1])
                for (j = 0; j < possibleMoves.length; j++) {
                    if (position.hasOwnProperty(possibleMoves[j]) && position[possibleMoves[j]][0] !== computerFigures[i][1][0] && position[possibleMoves[j]][1] === "P" && (computerFigures[i][1][1] !== "P" || j !== 0)) {
                        isPossibleToKillPawn = true
                        target = possibleMoves[j]
                        piece = computerFigures[i][1]
                        source = computerFigures[i][0]
                        break;
                    }
                }
            }
        }

        const checkPossibilityToKillQueen = () => {
            for (i = 0; i < computerFigures.length; i++) {
                findPossibleMoves(computerFigures[i][0], computerFigures[i][1])
                for (j = 0; j < possibleMoves.length; j++) {
                    if (position.hasOwnProperty(possibleMoves[j]) && position[possibleMoves[j]][0] !== computerFigures[i][1][0] && position[possibleMoves[j]][1] === "Q" && (computerFigures[i][1][1] !== "P" || j != 0)) {
                        isPossibleToKillQueen = true
                        target = possibleMoves[j]
                        piece = computerFigures[i][1]
                        source = computerFigures[i][0]
                        break
                    }
                }
            }
        }

        const checkPossibilityToLossKing = () => {
            for (i = 0; i < figures.length; i++) {
                if (figures[i][1][0] === config.orientation[0])
                    playerFigures.push(figures[i])
            }
            for (i = 0; i < playerFigures.length; i++) {
                findPossibleMoves(playerFigures[i][0], playerFigures[i][1])
                for (j = 0; j < possibleMoves.length; j++) {
                    if (position.hasOwnProperty(possibleMoves[j]) && position[possibleMoves[j]][0] !== playerFigures[i][1][0] && position[possibleMoves[j]][1] === "K" && (playerFigures[i][1][1] !== "P" || j !== 0)) {
                        isPossibleToLossKing = true
                        sourceKing = possibleMoves[j]
                        king = position[possibleMoves[j]]
                        potentialKiller = playerFigures[i][1]
                        sourceOfPotentialKiller = playerFigures[i][0]
                        break;
                    }
                }
            }
        }

        const randomMove = () => {
            do {
                computerFigure = Math.floor(Math.random() * computerFigures.length)
                findPossibleMoves(computerFigures[computerFigure][0], computerFigures[computerFigure][1])
                direction = Math.floor(Math.random() * possibleMoves.length)
                isLegal = checkLegality(possibleMoves[direction], computerFigures[computerFigure][1])
                target = possibleMoves[direction]
                piece = computerFigures[computerFigure][1]
                source = computerFigures[computerFigure][0]
            }
            while (!isLegal)
        }

        const randomMoveOfTheKing = () => {
            do {
                direction = Math.floor(Math.random() * possibleMoves.length)
                isLegal = checkLegality(possibleMoves[direction], king)
                target = possibleMoves[direction]
                piece = king
                source = sourceKing
            }
            while (!isLegal)
        }

        checkPossibilityToKillKing()
        if (!isPossibleToKillKing) {
            checkPossibilityToLossKing()
            if (isPossibleToLossKing) {
                checkKingCanKillPotentialKiller()
                if (kingCanKillPotentialKiller) {
                    source = sourceKing
                    piece = king
                    target = sourceOfPotentialKiller
                } else if (kingCanKillAnotherFigure) {
                    source = sourceKing
                    piece = king
                    target = enemySource
                } else randomMoveOfTheKing()
            } else {
                checkPossibilityToKillQueen()
                if (!isPossibleToKillQueen) {
                    checkPossibilityToKillPawn()
                    if (!isPossibleToKillPawn) {
                        checkPossibilityToChangePawnToQueen()
                        if (!isPossibleToChangePawnToQueen) {
                            randomMove()
                        }
                    }
                }
            }
        }
        if (piece === "bP" && target[1] === "1") {
            piece = "bQ"
        } else if (piece === "wP" && target[1] === "8") {
            piece = "wQ"
        }
        checkGameOver(target, piece)
        refresh(source, target, piece)
        config.draggable = true
    }
}

const findPossibleMoves = (source, piece) => {
    const nextLetter = String.fromCharCode(source[0].charCodeAt() + 1)
    const prevLetter = String.fromCharCode(source[0].charCodeAt() - 1)
    const nextNumber = parseInt(source[1]) + 1
    const prevNumber = parseInt(source[1]) - 1
    if (piece === 'wP') {
        possibleMoves = [source[0] + nextNumber, prevLetter + nextNumber, nextLetter + nextNumber]
    } else if (piece === 'bP') {
        possibleMoves = [source[0] + prevNumber, prevLetter + prevNumber, nextLetter + prevNumber]
    } else if (piece[1] === "Q") {
        possibleMoves = [source[0] + prevNumber, source[0] + nextNumber, nextLetter + source[1], nextLetter + nextNumber, nextLetter + prevNumber, prevLetter + source[1], prevLetter + nextNumber, prevLetter + prevNumber]
    } else if (piece[1] === "K") {
        possibleMoves = [source[0] + prevNumber, source[0] + nextNumber, nextLetter + source[1], prevLetter + source[1]]
    }
    return possibleMoves
}

const lose = () => {
    result.innerText = 'You lost'
    soundOfLosing.play();
    showResult()
}

const onDragStart = (source, piece, orientation) => {
    if ((orientation === 'white' && piece.search(/^w/) === -1) ||
        (orientation === 'black' && piece.search(/^b/) === -1)) return false
    else findPossibleMoves(source, piece)
}

const onDrop = (source, target, piece) => {
    if (piece.search(/ /) !== -1) {
        return 'snapback'
    }
    checkLegality(target, piece)
    if (!isLegal) {
        return 'snapback'
    }
    if (piece === "bP" && target[1] === "1") {
        piece = "bQ"
    } else if (piece === "wP" && target[1] === "8") {
        piece = "wQ"
    }
    checkGameOver(target, piece)
    refresh(source, target, piece)
    setTimeout(computerTurn, 300)
    config.draggable = false
}

const pieceTheme = piece => {
    return 'img/' + piece + '.png'
}

const refresh = (source, target, piece) => {
    delete position[source]
    position[target] = piece
    board = Chessboard('myBoard', config)
}

const win = () => {
    result.innerText = 'You won'
    soundOfWinning.play();
    showResult();
}

const showResult = () => {
    setTimeout(() => {
        right.classList.remove('hidden')
        myBoard.classList.add('hidden')
    }, 800)
}

const config = {
    pieceTheme: pieceTheme,
    draggable: false,
    orientation: 'white',
    dropOffBoard: 'snapback',
    position: position,
    moveSpeed: 'slow',
    snapbackSpeed: 500,
    snapSpeed: 100,
    onDragStart: onDragStart,
    onDrop: onDrop
};

let board = Chessboard('myBoard', config)