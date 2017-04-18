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
            $(`#${player}`).removeClass('active');
            turn += 1;
            $box.off();
            playGame(players[next].name, turn);
        });

    }

    function endGame(winner) {
        removeBoard();
        appendEndScreen();

        if(winner === 'player1') {
            $('#finish').addClass('screen-win-one');
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

    function hasWon() {
        winner = 'player1';
        return false;
    }

    // PUBLIC API //
    return {
        init: init
    }

})();

Game.init();
