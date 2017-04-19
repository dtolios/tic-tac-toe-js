const Game = (function () {

    const $body = $('body');
    const $board = $('#board');

    const $startScreen = $('<div class="screen screen-start" id="start"><header><h1>Tic Tac Toe</h1><a href="#" class="button">Start game</a></header></div>');
    const $endScreen = $('<div class="screen screen-win" id="finish"><header><h1>Tic Tac Toe</h1><p class="message"></p><a href="#" class="button">New game</a></header></div>');
    let winner = 'none';

    const players = [
        {
            name: 'player1',
            symbol: 'O',
            filePath: 'img/o.svg',
            isAI: false,
            spacesOwned: []
        },
        {
            name: 'player2',
            symbol: 'X',
            filePath: 'img/x.svg',
            isAI: false,
            spacesOwned: []
        }
    ];

    // GAME START and GAME LOOP //
    function init() {
        removeBoard();
        startGame();
    }

    function startGame() {

        appendStartScreen();
        const $button = $('.button');

        $button.on('click', () => {
            removeStartScreen();
            appendBoard();
            const startingPlayer = getStartingPlayer();
            playGame(startingPlayer, 1);
        });

    }

    function playGame(player, turn) {
        winner = checkWinner();
        if(turn === 10 || winner !== 'none')
            endGame(winner);

        let current = 0;
        let next = 1;

        $(`#${player}`).addClass('active');
        if(player === 'player1') {
            current = 0;
            next = 1;
        }
        else {
            current = 1;
            next = 0;
        }

        const $box = $('.box').not('.box-filled-1, .box-filled-2');

        $box.hover(
            (ev) => {
                $(ev.target).css('background-image', `url(${players[current].filePath})`);
                $(ev.target).css('background-size', `100px 100px`);
            },
            (ev) => {
                $(ev.target).css('background-image', 'initial');
            }
        );

        $box.on('click', (ev) => {
            $(ev.target).addClass(`box-filled-${current+1}`);
            players[current].spacesOwned.push($(ev.target).index());
            $(`#${player}`).removeClass('active');
            turn += 1;
            $box.off();
            playGame(players[next].name, turn);
        });

    }

    function endGame(winner) {
        $('.box').removeClass('box-filled-1 box-filled-2').css('background-image', 'initial');
        players[0].spacesOwned = [];
        players[1].spacesOwned = [];
        removeBoard();
        appendEndScreen();

        if(winner === 'player1') {
            $('#finish').addClass('screen-win-one');
            $('.message').text('Winner');
        }
        else if(winner === 'player2') {
            $('#finish').addClass('screen-win-two');
            $('.message').text('Winner');
        }
        else {
            $('#finish').addClass('screen-win-tie');
            $('.message').text('It\'s a Tie!');
        }

        const $button = $('.button');

        $button.on('click', () => {
            removeEndScreen();
            appendBoard();
            const newStartingPlayer = getStartingPlayer();
            playGame(newStartingPlayer);
        });
    }

    // RENDER FUNCTIONS //
    function appendBoard() {
        $board.appendTo($body);
    }

    function removeBoard() {
        $board.remove();
    }

    function appendStartScreen() {
        $startScreen.appendTo($body);
    }

    function removeStartScreen() {
        $startScreen.remove();
    }

    function appendEndScreen() {
        $endScreen.appendTo($body);
    }

    function removeEndScreen() {
        $endScreen.remove();
    }

    // HELPER FUNCTIONS //
    function getStartingPlayer() {
        const coin = Math.floor(Math.random() * 2);
        if (coin === 1)
            return 'player1';
        else
            return 'player2';
    }

    function checkWinner() {
        // Horizontal: 0 1 2 / 3 4 5 / 6 7 8
        if(isHorizontal(players[0].spacesOwned))
            return players[0].name;
        else if(isHorizontal(players[1].spacesOwned))
            return players[1].name;
        // Vertical: 0 3 6 / 1 4 7 / 2 5 8
        else if(isVertical(players[0].spacesOwned))
            return players[0].name;
        else if(isVertical(players[1].spacesOwned))
            return players[1].name;
        // Diagonal: 0 4 8 / 2 4 6
        else if(isDiagonal(players[0].spacesOwned))
            return players[0].name;
        else if(isDiagonal(players[1].spacesOwned))
            return players[1].name;
        else
            return 'none';
    }

    function isHorizontal(arr) {
        if(arr.includes(0)) {
            if(arr.includes(1)) {
                if(arr.includes(2)) {
                    return true;
                }
            }
        }
        if(arr.includes(3)) {
            if(arr.includes(4)) {
                if(arr.includes(5)) {
                    return true;
                }
            }
        }
        if(arr.includes(6)) {
            if(arr.includes(7)) {
                if(arr.includes(8)) {
                    return true;
                }
            }
        }
        return false;
    }

    function isVertical(arr) {
        if(arr.includes(0)) {
            if(arr.includes(3)) {
                if(arr.includes(6)) {
                    return true;
                }
            }
        }
        if(arr.includes(1)) {
            if(arr.includes(4)) {
                if(arr.includes(7)) {
                    return true;
                }
            }
        }
        if(arr.includes(2)) {
            if(arr.includes(5)) {
                if(arr.includes(8)) {
                    return true;
                }
            }
        }
        return false;
    }

    function isDiagonal(arr) {
        if(arr.includes(0)) {
            if(arr.includes(4)) {
                if(arr.includes(8)) {
                    return true;
                }
            }
        }
        if(arr.includes(2)) {
            if(arr.includes(4)) {
                if(arr.includes(6)) {
                    return true;
                }
            }
        }
        return false;
    }

    // PUBLIC API //
    return {
        init: init
    }

})();

Game.init();
