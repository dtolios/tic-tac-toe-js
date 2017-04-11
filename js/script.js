const Game = (function () {

    const $body = $('body');
    const $board = $('#board');
    const $startScreen = $('<div class="screen screen-start" id="start"><header><h1>Tic Tac Toe</h1><a href="#" class="button">Start game</a></header></div>');

    function startGame() {
        $body.append($startScreen);
        const $button = $('.button');
        $button.on('click', () => {
            $startScreen.remove();
            appendBoard();
            const startingPlayer = getStartingPlayer();
            $(`#${startingPlayer}`).addClass('active');
            takeTurn(startingPlayer);
        });
    }

    function appendBoard() {
        $board.appendTo($body);
    }

    function removeBoard() {
        $board.remove();
    }

    function getStartingPlayer() {
        const coin = Math.floor(Math.random() * 2);
        if (coin === 1)
            return 'player1';
        else
            return 'player2';
    }

    function takeTurn(currPlayer) {
    let symbol = '';
    if (currPlayer === 'player1') {
        symbol = 'img/o.svg';
    }
    else {
        symbol = 'img/x.svg';
    }

    $('.box').hover(
        (ev) => {
            $(ev.target).css('background-image', `url(${symbol})`);
        },
        (ev) => {
            $(ev.target).css('background-image', 'initial');
        }
    );

    $('.box').on('click', (ev) => {
        $(ev.target).css('background-image', `url(${symbol})`);
    });
}

    function init() {
        removeBoard();
        startGame();
    }

    return {
        init: init
    }
})();

Game.init();
