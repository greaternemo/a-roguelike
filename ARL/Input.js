// ARL.Input
// For handling input, oi

ARL.Input = function () {
    this.inputLoop = null;
    // always start true, listening should be the default
    // if we are not listening, we are deliberately ignoring input
    // removed, replaced with LISTEN_NUMPAD constant

    this.init();
};

/*
ARL.Input.prototype.
*/

ARL.Input.prototype.init = function () {
    // create the input buffer array
    SCON('INPUT_BUFFER', []);
    this.inputLoop = new ARL.Loop(function () {
        return SIG('handleInput');
    }, GCON('LOOP_DELAY'));
};

ARL.Input.prototype.queueInput = function (iStr) {
    let iBuffer = GCON('INPUT_BUFFER');
    if (
      GCON('LISTEN_NUMPAD') === true &&
      iBuffer.length        === 0 &&
      // we don't even queue input unless it's the player's turn, fuck it
      GCON('PLAYER_TURN')   === true) {
        iBuffer.push(iStr);
    }
    if (GCON('GAME_OVER') === true) {
        return RIP();
    }
    // shit that was simple
};

ARL.Input.prototype.handleInput = function () {
    // only do this if we have input, durr
    if (GCON('INPUT_BUFFER').length !== 0) {
        // first we lock this shit down
        SCON('LISTEN_NUMPAD', false);
        // only take the most recent input
        let newInput = GCON('INPUT_BUFFER').shift();
        // empty the buffer
        SCON('INPUT_BUFFER', []);
        // parse the input
        SIG('pressButton', newInput);
        // unlock the loop
        SCON('LISTEN_NUMPAD', true);
    }
};

ARL.Input.prototype.pressButton = function (aButton) {
    return SIG(aButton);
};

ARL.Input.prototype.numpad1 = function () {
    // decide what to do based on current input context
    // TODO

    // nothing rn
};

ARL.Input.prototype.numpad2 = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerSouth');
};

ARL.Input.prototype.numpad3 = function () {
    // decide what to do based on current input context
    // TODO

    // nothing rn
};

ARL.Input.prototype.numpad4 = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerWest');
};

ARL.Input.prototype.numpad5 = function () {
    // decide what to do based on current input context
    // TODO

    // return SIG('useStairs');
    return SIG('makeMobPassTheTurn');
};

ARL.Input.prototype.numpad6 = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerEast');
};

ARL.Input.prototype.numpad7 = function () {
    // decide what to do based on current input context
    // TODO

    // nothing rn
};

ARL.Input.prototype.numpad8 = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerNorth');
};

ARL.Input.prototype.numpad9 = function () {
    // decide what to do based on current input context
    // TODO

    // nothing rn
};



// asdf



/*
*
*
* Courtesy Spaces
*
*
*/