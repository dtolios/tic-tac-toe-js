const Game = (function () {

    const $body = $('body');
    const $board = $('#board');
    const $box = $('.box');
    const $startScreen = $('<div class="screen screen-start" id="start"><header><h1>Tic Tac Toe</h1><a href="#" class="button">Start game</a></header></div>');
    const $endScreen = $('<div class="screen screen-win" id="finish"><header><h1>Tic Tac Toe</h1><p class="message"></p><a href="#" class="button">New game</a></header></div>');
    let winner = 'none';
    const boardState = ['NaN','NaN','NaN','NaN','NaN','NaN','NaN','NaN','NaN'];


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
            playGame(startingPlayer);
        });

    }

    function playGame(player) {
        let turn = 1;
        $(`#${player}`).addClass('active');
        while(turn !== 9) {
            $box.on('click', takeTurn(player, event));
            turn += 1;
            if(player === 'player1')
                player = 'player2';
            else
                player = 'player1';
        }
        endGame(winner);
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

        const $sbutton = $('.button');

        $sbutton.on('click', () => {
            removeEndScreen();
            appendBoard();
            const newStartingPlayer = getStartingPlayer();
            playGame(newStartingPlayer);
        });
    }

    function takeTurn(currPlayer, event) {
        let symbol = '';
        if (currPlayer === 'player1') {
            symbol = 'img/o.svg';
        }
        else {
            symbol = 'img/x.svg';
        }

        $box.hover(
            (ev) => {
                $(ev.target).css('background-image', `url(${symbol})`);
                $(ev.target).css('background-size', `100px 100px`);
            },
            (ev) => {
                $(ev.target).css('background-image', 'initial');
            }
        );

        if(currPlayer === 'player1') {
            $(event.target).addClass('box-filled-1');
            $(event.target).off();
        }
        else {
            $(event.target).addClass('box-filled-2');
            $(event.target).off();
        }
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
