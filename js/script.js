const Game = (function () {

    // Frequently used jQuery selectors //
    const $body = $('body');
    const $board = $('#board');
    const $startScreen = $('#start');
    const $endScreen = $('#finish');

    let winner = 'none';
    let availableSpaces = [0,1,2,3,4,5,6,7,8];

    // players array contains two objects, one for each player //
    const players = [
        {
            id: 'player1',
            symbol: 'O',
            filePath: 'img/o.svg',
            spacesOwned: [],
            name: ''
        },
        {
            id: 'player2',
            symbol: 'X',
            filePath: 'img/x.svg',
            spacesOwned: [],
            name: ''
        }
    ];

    // REQUIRES: only call this function the first time the page loads
    // MODIFIES: removes start, board, and finish html from index.html
    // EFFECTS:  initializes the game by removing html and calling the startGame function
    function init() {
        removeStart();
        removeBoard();
        removeFinish();
        startGame();
    }

    // REQUIRES:
    // MODIFIES: appends the start screen to index.html and adds a button click event listener
    // EFFECTS:  on click, begins the
    function startGame() {

        appendStart();

        const $button = $('.button');

        $button.on('click', (ev) => {
            players[0].name = $('input[name=player_name]').val();
            players[1].name = 'Friend';
            const $target = $(ev.target);
            let isAIGame = false;
            if($target.is('.pve')) {
                isAIGame = true;
                players[1].name = 'Computer';
            }
            removeStart();
            appendBoard();
            displayNames();
            playGame(isAIGame);
        });

    }

    function playGame(isAIGame) {

        let player = getStartingPlayer();
        let turn = 0;
        let current = 0;
        let next = 1;

        if(player === 'player2') {
            current = 1;
            next = 0;
            if(isAIGame) {
                // take first turn
                takeAITurn();
                turn += 1;
                current = 0;
                next = 1;
                player = 'player1';
            }
        }


        const $box = $('.box').not('.box-filled-1, .box-filled-2');
        $(`#${player}`).addClass('active');

        $box.on('click', (ev) => {
            // mark the box with the proper symbol
            $(ev.target).addClass(`box-filled-${current+1}`);

            // push the space's index onto the correct player's spacesOwned array
            players[current].spacesOwned.push($(ev.target).index());

            // get the index in the availableSpaces array that the target space index is
            const index = availableSpaces.indexOf($(ev.target).index());

            // remove that index from the availableSpaces array
            availableSpaces.splice(index, 1);

            // remove the active player class
            $(`#${player}`).removeClass('active');

            // increment the turn number
            turn += 1;

            // turn off the listener for this box
            $(ev.target).off();

            // check for winner
            winner = checkWinner();
            if(turn === 9 || winner !== 'none')
                endGame(winner, isAIGame);

            if(isAIGame) {
                takeAITurn();
                turn += 1;
                if(turn === 9)
                    endGame(winner, isAIGame);
            }
            else {
                if (player === 'player1') {
                    current = 1;
                    next = 0;
                    player = 'player2';
                }
                else {
                    current = 0;
                    next = 1;
                    player = 'player1';
                }
            }

            $(`#${player}`).addClass('active');

        });

        $box.hover(
            (ev) => {
                $(ev.target).css('background-image', `url(${players[current].filePath})`);
                $(ev.target).css('background-size', `100px 100px`);
            },
            (ev) => {
                $(ev.target).css('background-image', 'initial');
            }
        );

    }

    function endGame(winner, isAIGame) {
        // Reset the board by initializing the spaces/boxes to their original state
        $('.box').removeClass('box-filled-1 box-filled-2').css('background-image', 'initial');

        // Clear the spacesOwned array for both players
        players[0].spacesOwned = [];
        players[1].spacesOwned = [];
        // Reset the availableSpaces array
        availableSpaces = [0,1,2,3,4,5,6,7,8];

        // Render the finish screen
        removeBoard();
        appendFinish();

        // Render correct view based on outcome of game
        if (winner === 'player1') {
            $('#finish').addClass('screen-win-one');
            if(players[0].name !== 'Anonymous')
                $('.message').text(`${players[0].name} has won!`);
            else
                $('.message').text('Winner');
        }
        else if (winner === 'player2') {
            $('#finish').addClass('screen-win-two');
            $('.message').text(`${players[1].name} has won!`);
        }
        else {
            $('#finish').addClass('screen-win-tie');
            $('.message').text('It\'s a Tie!');
        }

        const $button = $('.button');

        $button.on('click', () => {
            $('#finish').removeClass('screen-win-one screen-win-two screen-win-tie');
            removeFinish();
            appendBoard();
            playGame(isAIGame);
        });
    }

    // RENDER FUNCTIONS //
    function appendStart() {
        $startScreen.appendTo($body);
    }

    function removeStart() {
        $startScreen.remove();
    }

    function appendBoard() {
        $board.appendTo($body);
    }

    function removeBoard() {
        $board.remove();
    }

    function appendFinish() {
        $endScreen.appendTo($body);
    }

    function removeFinish() {
        $endScreen.remove();
    }

    function displayNames() {
        const $playerNames = $('.player-names li');
        if(players[0].name === '')
            players[0].name = 'Anonymous';
        $playerNames.first().text(`Player 1: ${players[0].name}`);
        $playerNames.last().text(`Player 2: ${players[1].name}`);
    }

    // HELPER FUNCTIONS //
    function shuffle(array) {
        let currentIndex = array.length;
        let temporaryValue = 0;
        let randomIndex = 0;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function takeAITurn() {
        // shuffle the stack
        shuffle(availableSpaces);
        const spaceNum = availableSpaces.pop();

        // mark the box with the proper symbol
        const $space = $(`.boxes li:nth-child(${spaceNum+1})`);
        $space.addClass('box-filled-2');
        $space.css('background-image', `url(${players[1].filePath})`);
        $space.off();
        // push the space's index onto the correct player's spacesOwned array
        players[1].spacesOwned.push(spaceNum);
        // check for winner
        winner = checkWinner();
        if(winner !== 'none')
            endGame(winner, true);
    }

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
            return players[0].id;
        else if(isHorizontal(players[1].spacesOwned))
            return players[1].id;
        // Vertical: 0 3 6 / 1 4 7 / 2 5 8
        else if(isVertical(players[0].spacesOwned))
            return players[0].id;
        else if(isVertical(players[1].spacesOwned))
            return players[1].id;
        // Diagonal: 0 4 8 / 2 4 6
        else if(isDiagonal(players[0].spacesOwned))
            return players[0].id;
        else if(isDiagonal(players[1].spacesOwned))
            return players[1].id;
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
