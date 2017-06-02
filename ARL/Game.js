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
};

ARL.Game.prototype.doTheGame = function () {
    if (GCON('READY_FOR_TURN') === true) {
        // lock the game loop
        SCON('READY_FOR_TURN', false);
        // make the turn happen
        SIG('doNextTurn');
        // check for win/loss?
        // do that here
        // unlock the game loop
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