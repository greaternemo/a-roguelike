// ARL.Game
// Do the game

ARL.Game = function () {
    this.gameLoop = null;

    this.init();
};

/*
ARL.Game.prototype
*/

ARL.Game.prototype.init = function () {
    // build the world
    // build the scheduler
    // build the turn loop
    // ok go

    this.gameLoop = new ARL.Loop(function () {
        return SIG('doTheGame');
    }, GCON('LOOP_DELAY'));
    SCON('GAME_OVER', false);
    
    // ARE YOU READYYYYY
    // YES I'M READYYYYY
    SCON('READY_FOR_TURN', true);
};

ARL.Game.prototype.doTheGame = function () {
    if (GCON('READY_FOR_TURN') === true) {
        // lock the game loop
        SCON('READY_FOR_TURN', false);
        // make the turn happen
        SIG('doNextTurn');
        // check for win/loss?
        // do that here
    }
    // we'll do this here to integrate it into the existing loop
    if (GCON('END_OF_TURN') === true && GCON('READY_FOR_TURN') === false) {
        // unlock the game loop
        SCON('PLAYER_TURN', false);
        SCON('END_OF_TURN', false);
        SCON('READY_FOR_TURN', true);
    }
};

ARL.Game.prototype.doNextTurn = function () {
    SIG('whoseTurnIsIt');
    SIG('handleCurrentTurn');
};



/*
*
*
*
* Courtesy Space
*
*
*
*/