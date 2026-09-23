const canvas =
    document.getElementById("board");

const ctx =
    canvas.getContext("2d");


/* =========================
   O'YIN O'LCHAMI
========================= */

const COLS = 10;

const ROWS = 20;

const SIZE = 30;


/* =========================
   O'YIN O'ZGARUVCHILARI
========================= */

let board;

let player;

let score = 0;

let lines = 0;

let gameOver = false;

let lastTime = 0;

let dropCounter = 0;

let dropInterval = 700;


/* =========================
   TETRIS SHAKLLARI
========================= */

const pieces = [

    {
        shape: [
            [1, 1, 1, 1]
        ],
        color: "#00e5ff"
    },


    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: "#ffd21f"
    },


    {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: "#b84cff"
    },


    {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        color: "#ff8c00"
    },


    {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: "#398cff"
    },


    {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: "#00e676"
    },


    {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: "#ff3b6b"
    }

];


/* =========================
   YANGI O'YIN
========================= */

function newGame() {

    board = [];

    for (
        let y = 0;
        y < ROWS;
        y++
    ) {

        board.push(
            new Array(COLS).fill(0)
        );

    }


    score = 0;

    lines = 0;

    gameOver = false;

    dropCounter = 0;

    dropInterval = 700;


    updateInfo();


    document
        .getElementById("gameOver")
        .style.display = "none";


    player = createPiece();


    draw();
}


/* =========================
   SHAKL YARATISH
========================= */

function createPiece() {

    const random =
        pieces[
            Math.floor(
                Math.random() *
                pieces.length
            )
        ];


    return {

        shape:
            random.shape.map(
                row => [...row]
            ),

        color:
            random.color,

        x:
            Math.floor(
                COLS / 2 -
                random.shape[0].length / 2
            ),

        y: 0

    };
}


/* =========================
   EKRANGA CHIZISH
========================= */

function draw() {

    ctx.fillStyle =
        "#101010";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawGrid();

    drawBoard();

    drawPlayer();
}


/* =========================
   GRID
========================= */

function drawGrid() {

    ctx.strokeStyle =
        "rgba(255,255,255,0.06)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= COLS;
        x++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x * SIZE,
            0
        );

        ctx.lineTo(
            x * SIZE,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y <= ROWS;
        y++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y * SIZE
        );

        ctx.lineTo(
            canvas.width,
            y * SIZE
        );

        ctx.stroke();
    }
}


/* =========================
   JOYLASHGAN BLOKLAR
========================= */

function drawBoard() {

    for (
        let y = 0;
        y < ROWS;
        y++
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            if (board[y][x]) {

                drawBlock(
                    x,
                    y,
                    board[y][x]
                );

            }
        }
    }
}


/* =========================
   TUSHAYOTGAN SHAKL
========================= */

function drawPlayer() {

    player.shape.forEach(
        (row, y) => {

            row.forEach(
                (value, x) => {

                    if (value) {

                        drawBlock(
                            player.x + x,
                            player.y + y,
                            player.color
                        );

                    }
                }
            );
        }
    );
}


/* =========================
   BLOK CHIZISH
========================= */

function drawBlock(
    x,
    y,
    color
) {

    const px =
        x * SIZE;

    const py =
        y * SIZE;


    ctx.fillStyle = color;


    ctx.fillRect(
        px + 2,
        py + 2,
        SIZE - 4,
        SIZE - 4
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.7)";

    ctx.lineWidth = 2;


    ctx.strokeRect(
        px + 3,
        py + 3,
        SIZE - 6,
        SIZE - 6
    );


    /* Yorqin yuqori qismi */

    ctx.fillStyle =
        "rgba(255,255,255,0.25)";


    ctx.fillRect(
        px + 5,
        py + 5,
        SIZE - 14,
        5
    );
}


/* =========================
   TO'QNASHUV
========================= */

function collide() {

    for (
        let y = 0;
        y < player.shape.length;
        y++
    ) {

        for (
            let x = 0;
            x < player.shape[y].length;
            x++
        ) {

            if (
                !player.shape[y][x]
            ) {
                continue;
            }


            const newX =
                player.x + x;

            const newY =
                player.y + y;


            /* Chap/o'ng chegara */

            if (
                newX < 0 ||
                newX >= COLS
            ) {

                return true;
            }


            /* Pastki chegara */

            if (
                newY >= ROWS
            ) {

                return true;
            }


            /* Boshqa blok bilan urilish */

            if (
                board[newY] &&
                board[newY][newX]
            ) {

                return true;
            }

        }
    }


    return false;
}


/* =========================
   SHAKLNI JOYLASHTIRISH
========================= */

function merge() {

    player.shape.forEach(
        (row, y) => {

            row.forEach(
                (value, x) => {

                    if (value) {

                        board[
                            player.y + y
                        ][
                            player.x + x
                        ] =
                            player.color;

                    }

                }
            );

        }
    );
}


/* =========================
   TO'LIQ QATORNI O'CHIRISH
========================= */

function clearLines() {

    let cleared = 0;


    /*
       Pastdan yuqoriga qarab
       barcha qatorlarni tekshiramiz.
    */

    for (
        let y = ROWS - 1;
        y >= 0;
        y--
    ) {

        let full = true;


        /*
           Qatorning barcha
           kataklarini tekshiramiz.
        */

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            if (
                board[y][x] === 0
            ) {

                full = false;

                break;
            }
        }


        /*
           Agar 10 ta katakning
           hammasi to'liq bo'lsa
        */

        if (full) {

            /*
               Qatorni o'chiramiz
            */

            board.splice(
                y,
                1
            );


            /*
               Yuqoriga yangi
               bo'sh qator qo'shamiz
            */

            board.unshift(
                new Array(COLS)
                    .fill(0)
            );


            /*
               1 ta qator o'chdi
            */

            cleared++;


            /*
               Shu indeksni
               yana tekshiramiz
            */

            y++;
        }
    }


    /*
       ⭐ Eng muhim joy:
       
       1 qator = 1 ball
       2 qator = 2 ball
       3 qator = 3 ball
       4 qator = 4 ball
    */

    if (cleared > 0) {

        score += cleared;

        lines += cleared;

        updateInfo();
    }
}


/* =========================
   PASTGA TUSHIRISH
========================= */

function drop() {

    if (gameOver) {
        return;
    }


    player.y++;


    /*
       Pastga tushganda urilsa
    */

    if (collide()) {

        /*
           Bir qadam yuqoriga
           qaytaramiz
        */

        player.y--;


        /*
           Shaklni joylashtiramiz
        */

        merge();


        /*
           To'liq qatorlarni
           o'chiramiz
        */

        clearLines();


        /*
           Yangi shakl
        */

        player =
            createPiece();


        /*
           Yangi shakl ham
           joylasha olmasa
           GAME OVER
        */

        if (collide()) {

            endGame();

            return;
        }
    }


    dropCounter = 0;

    draw();
}


/* =========================
   CHAP / O'NG
========================= */

function move(direction) {

    if (gameOver) {
        return;
    }


    player.x += direction;


    if (collide()) {

        player.x -= direction;
    }


    draw();
}


/* =========================
   AYLANTIRISH
========================= */

function rotate() {

    if (gameOver) {
        return;
    }


    const oldShape =
        player.shape;


    const newShape =
        oldShape[0].map(
            (_, index) =>
                oldShape
                    .map(
                        row =>
                            row[index]
                    )
                    .reverse()
        );


    player.shape =
        newShape;


    /*
       Aylantirganda urilib
       qolsa eski holatiga
       qaytaramiz.
    */

    if (collide()) {

        player.shape =
            oldShape;
    }


    draw();
}


/* =========================
   BIR ZUMDA TUSHIRISH
========================= */

function hardDrop() {

    if (gameOver) {
        return;
    }


    while (!collide()) {

        player.y++;
    }


    player.y--;


    drop();
}


/* =========================
   SCORE / LINES
========================= */

function updateInfo() {

    document.getElementById(
        "score"
    ).textContent =
        score;


    document.getElementById(
        "lines"
    ).textContent =
        lines;
}


/* =========================
   GAME OVER
========================= */

function endGame() {

    gameOver = true;


    document.getElementById(
        "finalScore"
    ).textContent =
        score;


    document.getElementById(
        "gameOver"
    ).style.display =
        "block";
}


/* =========================
   GAME LOOP
========================= */

function update(time = 0) {

    if (gameOver) {
        return;
    }


    const deltaTime =
        time - lastTime;


    lastTime = time;


    dropCounter +=
        deltaTime;


    /*
       Vaqt tugaganda
       shakl pastga tushadi.
    */

    if (
        dropCounter >
        dropInterval
    ) {

        drop();
    }


    draw();


    requestAnimationFrame(
        update
    );
}


/* =========================
   KLAVIATURA
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (gameOver) {
            return;
        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            move(-1);
        }


        else if (
            event.key ===
            "ArrowRight"
        ) {

            move(1);
        }


        else if (
            event.key ===
            "ArrowDown"
        ) {

            drop();
        }


        else if (
            event.key ===
            "ArrowUp"
        ) {

            rotate();
        }


        else if (
            event.code ===
            "Space"
        ) {

            hardDrop();
        }

    }
);


/* =========================
   EKRAN TUGMALARI
========================= */

document.getElementById(
    "left"
).onclick = function() {

    move(-1);
};


document.getElementById(
    "right"
).onclick = function() {

    move(1);
};


document.getElementById(
    "rotate"
).onclick = function() {

    rotate();
};


document.getElementById(
    "down"
).onclick = function() {

    drop();
};


/* =========================
   QAYTA BOSHLASH
========================= */

document.getElementById(
    "restart"
).onclick = function() {

    newGame();
};


document.getElementById(
    "restart2"
).onclick = function() {

    newGame();
};


/* =========================
   O'YINNI BOSHLASH
========================= */

newGame();

requestAnimationFrame(
    update
);