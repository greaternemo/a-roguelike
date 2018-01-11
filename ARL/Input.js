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

ARL.Input.prototype.startListeningForInput = function () {
    // Add any relevant input listeners here to have them added in the main init process
    window.addEventListener('keydown', KEYIN);
};

ARL.Input.prototype.stopListeningForInput = function () {
    // Kill any input listeners here that you spawned in startListeningForInput
    window.removeEventListener('keydown', KEYIN);
}

ARL.Input.prototype.parseRawKeydown = function (rKey) {
    // wrapping this in a bullshit conditional now
    // I will probably want to add actual conditions to this later
    if (true) {
        let newKey = 'key' + rKey.code.toLowerCase();
        if (GCON('INPUT_BASE').knownKeys.indexOf(newKey) != -1) {
            SIG('queueInput', newKey);
        }
    }
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
    // This is a part of the input process that I'm not really looking to remove.
    // I considered that it might be ridiculous to have a function for handling each
    // individual method of input, but the more inputs I support, the more times I'd
    // be iterating over each one if I just used a giant switch statement.
    // Doing it this way saves us computational overhead at the cost of importing a
    // pile of input functions into our router.
    // With that being said, each individual input function will need more guts to
    // switch output based on the current input context, which will be a constant
    // that contains a simple string that can be checked on function resolution.
    // The output of every input function will need to account for EVERY potential
    // input context unless we start filtering the input we accept before parsing
    // based on the current input context...
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

ARL.Input.prototype.keyarrowup = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerNorth');
};

ARL.Input.prototype.keyarrowright = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerEast');
};

ARL.Input.prototype.keyarrowdown = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerSouth');
};

ARL.Input.prototype.keyarrowleft = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('movePlayerWest');
};

ARL.Input.prototype.keyspace = function () {
    // decide what to do based on current input context
    // TODO

    return SIG('makeMobPassTheTurn');
};



// asdf



/*
*
*
* Courtesy Spaces
*
*
*/