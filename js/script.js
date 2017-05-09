// game module holds all tic tac toe game functionality
const Game = (function () {

    // frequently used jQuery selectors
    const $body = $('body');
    const $board = $('#board');
    const $startScreen = $('#start');
    const $endScreen = $('#finish');

    // global variables for winner state and available spaces state
    let winner = 'none';
    let availableSpaces = [0,1,2,3,4,5,6,7,8];

    // players array contains two objects, one for each player
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

    // REQUIRES: assumes page is blank
    // MODIFIES: appends the start screen to index.html
    // EFFECTS:  adds button click listeners; on click, saves the player input (if any exists), determines if player
    //           requested an AI game or PvP game, and calls the playGame function accordingly
    function startGame() {

        appendStart();

        const $button = $('.button');

        $button.on('click', (ev) => {

            // save player name input, default player2 to "Friend"
            players[0].name = $('input[name=player_name]').val();
            players[1].name = 'Friend';

            // save the target
            const $target = $(ev.target);
            let isAIGame = false;
            // determine if user selected to play against a friend or AI
            if($target.is('.pve')) {
                isAIGame = true;
                players[1].name = 'Computer';
            }

            // remove the start screen and render the board with names
            removeStart();
            appendBoard();
            displayNames();

            // play the game with the appropriate AI game flag
            playGame(isAIGame);

        });

    }

    // REQUIRES: none
    // MODIFIES: board is modified based on user input, and/or by the AI taking its turn
    // EFFECTS:  plays a game of tic tac toe
    function playGame(isAIGame) {

        // get the starting player by flipping a coin, and initialize the game state
        let player = getStartingPlayer();
        let turn = 0;
        // currPlayer and nextPlayer are indexes. '0' for player1 & '1' for player2
        let currPlayer = 0;
        let nextPlayer = 1;

        // flip flop the currPlayer & nextPlayer indexes if starting player is player2
        if(player === 'player2') {

            currPlayer = 1;
            nextPlayer = 0;

            // if this is an AI game, take the first turn and set the indexes back to player1
            if(isAIGame) {

                // take first turn
                takeAITurn();
                turn += 1;
                currPlayer = 0;
                nextPlayer = 1;
                player = 'player1';

            }

        }

        const $box = $('.box').not('.box-filled-1, .box-filled-2');

        $(`#${player}`).addClass('active');

        // click event listener on each box/space of the board
        $box.on('click', (ev) => {

            // mark the box with the proper symbol by adding the appropriate class
            $(ev.target).addClass(`box-filled-${currPlayer+1}`);

            // push the space number onto the correct player's spacesOwned array
            players[currPlayer].spacesOwned.push($(ev.target).index());

            // get the space number's index in the availableSpaces array
            const index = availableSpaces.indexOf($(ev.target).index());

            // remove that space number from the availableSpaces array
            availableSpaces.splice(index, 1);

            // remove the active player class
            $(`#${player}`).removeClass('active');

            // increment the turn number
            turn += 1;

            // turn off the listener for this box
            $(ev.target).off();

            // check for winner, end game if there is a winner OR if there are no more turns
            winner = checkWinner();
            if(turn === 9 || winner !== 'none') {
                endGame(winner, isAIGame);
                return;
            }

            // if this is an AI game, have the AI take their turn immediately
            if(isAIGame) {

                takeAITurn();
                turn += 1;

                // if the AI took the last available turn and didn't win, end the game in a tie
                if(turn === 9)
                    endGame(winner, isAIGame);

            }
            // for non-AI games, check the current player number, and flip flop them
            else {
                if (player === 'player1') {
                    currPlayer = 1;
                    nextPlayer = 0;
                    player = 'player2';
                }
                else {
                    currPlayer = 0;
                    nextPlayer = 1;
                    player = 'player1';
                }
            }

            // make the new player active
            $(`#${player}`).addClass('active');

        });

        // hover event listener so that the boxes/spaces show the correct symbol ('X' or 'O') on hover
        $box.hover(
            (ev) => {
                $(ev.target).css('background-image', `url(${players[currPlayer].filePath})`);
                $(ev.target).css('background-size', `100px 100px`);
            },
            (ev) => {
                $(ev.target).css('background-image', 'initial');
            }
        );

    }

    // REQUIRES: none
    // MODIFIES: the board is modified with an 'X' in an available space
    // EFFECTS:  shuffles the availableSpaces array and pops the first item. This is then used as the space number
    //           for the AI player to use for their turn. Ends the game if the AI chooses a winning move.
    function takeAITurn() {

        // shuffle the stack
        shuffle(availableSpaces);

        // save the space number by popping from the availableSpaces array
        const spaceNum = availableSpaces.pop();

        // mark the box with the proper symbol and remove any listeners
        const $space = $(`.boxes li:nth-child(${spaceNum+1})`); // nth-child is 1-indexed in CSS
        $space.addClass('box-filled-2');
        $space.css('background-image', `url(${players[1].filePath})`);
        $space.off();

        // push the space's index onto the correct player's spacesOwned array
        players[1].spacesOwned.push(spaceNum);

        // check for winner, end game if winner exists
        winner = checkWinner();
        if(winner !== 'none')
            endGame(winner, true);

    }

    // REQUIRES: none
    // MODIFIES: modifies game state variables/arrays, and modifies index.html
    // EFFECTS:  resets the spacesOwned and availableSpaces arrays, resets the board's boxes/spaces
    //           appends the finish screen, and adds the appropriate class and message for the winner
    function endGame(winner, isAIGame) {

        // reset the board by initializing the spaces/boxes to their original state
        $('.box').removeClass('box-filled-1 box-filled-2').css('background-image', 'initial');

        // clear the spacesOwned array for both players & reset the availableSpaces array
        players[0].spacesOwned = [];
        players[1].spacesOwned = [];
        availableSpaces = [0,1,2,3,4,5,6,7,8];

        // remove the board & render the finish screen
        removeBoard();
        appendFinish();

        // render correct view based on outcome of game
        if (winner === 'player1') {

            $('#finish').addClass('screen-win-one');

            // if the player was Anonymous, just say 'Winner' in the message
            if(players[0].name !== 'Anonymous')
                $('.message').text(`${players[0].name} has won!`);
            else
                $('.message').text('Winner');

        }
        else if (winner === 'player2') {
            $('#finish').addClass('screen-win-two');
            $('.message').text(`${players[1].name} has won!`);
        }
        // if the game ended in a tie...
        else {
            $('#finish').addClass('screen-win-tie');
            $('.message').text('It\'s a Tie!');
        }

        const $button = $('.button');

        // click event listener for starting a new game
        $button.on('click', () => {
            $('#finish').removeClass('screen-win-one screen-win-two screen-win-tie');
            removeFinish();
            appendBoard();
            // game will always restart based on the original selection of PvP or PvE (AI game)
            playGame(isAIGame);
        });
    }



    // HELPER FUNCTIONS //

    // gets the starting player by generating '0' or '1' randomly (basically flipping a coin)
    function getStartingPlayer() {
        const coin = Math.floor(Math.random() * 2);
        if (coin === 1)
            return 'player1';
        else
            return 'player2';
    }


    // REQUIRES: array must be a global variable
    // MODIFIES: because javascript doesn't have pass by reference, this function takes in a global array and
    //           shuffles the contents. This simulates pass by reference
    // EFFECTS:  randomly reorders the contents in array
    function shuffle(array) {
        let currentIndex = array.length;
        let temporaryValue = 0;
        let randomIndex = 0;

        // while there remain elements to shuffle...
        while (0 !== currentIndex) {

            // pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // and swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

    }

    // returns 'player1', 'player2', or 'none' based on if there is a winner vertically, horizontally, or diagonally
    function checkWinner() {

        // uses the space numbers in spacesOwned array for each player to check for a winner

        // horizontal: 0 1 2 / 3 4 5 / 6 7 8
        if(isHorizontal(players[0].spacesOwned))
            return players[0].id;
        else if(isHorizontal(players[1].spacesOwned))
            return players[1].id;

        // vertical: 0 3 6 / 1 4 7 / 2 5 8
        else if(isVertical(players[0].spacesOwned))
            return players[0].id;
        else if(isVertical(players[1].spacesOwned))
            return players[1].id;

        // diagonal: 0 4 8 / 2 4 6
        else if(isDiagonal(players[0].spacesOwned))
            return players[0].id;
        else if(isDiagonal(players[1].spacesOwned))
            return players[1].id;

        // no winner
        else
            return 'none';
    }

    // returns true if a horizontal win exists
    function isHorizontal(arr) {
        // checks for the appropriate space numbers in the given array
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

    // returns true if a vertical win exists
    function isVertical(arr) {
        // checks for the appropriate space numbers in the given array
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

    // returns true if a diagonal win exists
    function isDiagonal(arr) {
        // checks for the appropriate space numbers in the given array
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

    // render helper functions
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

    // REQUIRES: none
    // MODIFIES: inserts the player names into the board html
    // EFFECTS:  checks for empty player1 name (uses 'Anonymous' if so), and adds the names to the board html for display
    function displayNames() {

        const $playerNames = $('.player-names li');

        // check for empty player1 name
        if(players[0].name === '')
            players[0].name = 'Anonymous';

        // add the names to the board html
        $playerNames.first().text(`Player 1: ${players[0].name}`);
        $playerNames.last().text(`Player 2: ${players[1].name}`);

    }

    // PUBLIC API //
    return {
        init: init
    }

})();

Game.init();
