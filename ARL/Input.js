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
    // set initial input context, may need to change this later
    // probably will need to change this later
    SCON('INPUT_CONTEXT', ['movement']);
};

ARL.Input.prototype.startListeningForInput = function () {
    // Add any relevant input listeners here to have them added in the main init process
    window.addEventListener('keydown', KEYIN);
};

ARL.Input.prototype.stopListeningForInput = function () {
    // Kill any input listeners here that you spawned in startListeningForInput
    window.removeEventListener('keydown', KEYIN);
};

ARL.Input.prototype.startNewInputContext = function (aCtx) {
    // if transition is valid, add the new IC to the list at index 0
    let contextBase = GCON('INPUT_BASE').inputContext;
    let validTransitions = new Set(contextBase.transitions[GCON('INPUT_CONTEXT')[0]]);
    let validContexts = new Set(contextBase.allContexts);
    if (validContexts.has(aCtx) && validTransitions.has(aCtx)) {
        GCON('INPUT_CONTEXT').unshift(aCtx);
    }
};

ARL.Input.prototype.endCurrentInputContext = function () {
    // I think this might really be it for this
    GCON('INPUT_CONTEXT').shift();
};

ARL.Input.prototype.parseRawKeydown = function (rKey) {
    // wrapping this in a bullshit conditional now
    // I will probably want to add actual conditions to this later
    if (true) {
        let newKey = null;
        if (rKey.code.substr(0,3).toLowerCase() === 'key') {
            newKey = rKey.code.toLowerCase();
        }
        else {
            newKey = 'key' + rKey.code.toLowerCase();
        }
        // console.log(newKey);
        let knownKeys = new Set(GCON('INPUT_BASE').knownKeys);
        // console.log('hasKnown: ' + knownKeys.has(newKey));
        if (knownKeys.has(newKey)) {
            SIG('queueInput', newKey);
        }
    }
};

ARL.Input.prototype.queueInput = function (iStr) {
    let iBuffer = GCON('INPUT_BUFFER');
    if (GCON('GAME_OVER') === true) {
        return RIP();
    }
    else if (
      GCON('LISTEN_NUMPAD') === true &&
      iBuffer.length        === 0 &&
      // we don't even queue input unless it's the player's turn, fuck it
      GCON('PLAYER_TURN')   === true) {
        iBuffer.push(iStr);
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

/*
ARL.Input.prototype.NEWKEY = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            // asdf
            break;
        case 'targeting':
            // fdsa
            break;
    }
};
*/

ARL.Input.prototype.numpad1 = function () {
    /*
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            // asdf
            break;
        case 'targeting':
            // fdsa
            break;
    }
    */
    // nothing rn
};

ARL.Input.prototype.numpad2 = function () {
    // duplicate key
    return SIG('keyarrowdown');
};

ARL.Input.prototype.numpad3 = function () {
    /*
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            // asdf
            break;
        case 'targeting':
            // fdsa
            break;
    }
    */
    // nothing rn
};

ARL.Input.prototype.numpad4 = function () {
    // duplicate key
    return SIG('keyarrowleft');
};

ARL.Input.prototype.numpad5 = function () {
    // duplicate key
    return SIG('keyspace');
};

ARL.Input.prototype.numpad6 = function () {
    // duplicate key
    return SIG('keyarrowright');
};

ARL.Input.prototype.numpad7 = function () {
    // duplicate key
    return SIG('keyescape');
};

ARL.Input.prototype.numpad8 = function () {
    // duplicate key
    return SIG('keyarrowup');
};

ARL.Input.prototype.numpad9 = function () {
    // duplicate key
    return SIG('keyf');
};

ARL.Input.prototype.keyarrowup = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            SIG('movePlayerNorth');
            break;
        case 'targeting':
            SIG('tryToMoveCursorInDir', 'N');
            break;
    }
};

ARL.Input.prototype.keyarrowright = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            SIG('movePlayerEast');
            break;
        case 'targeting':
            SIG('tryToMoveCursorInDir', 'E');
            break;
    }
};

ARL.Input.prototype.keyarrowdown = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            SIG('movePlayerSouth');
            break;
        case 'targeting':
            SIG('tryToMoveCursorInDir', 'S');
            break;
    }
};

ARL.Input.prototype.keyarrowleft = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            SIG('movePlayerWest');
            break;
        case 'targeting':
            SIG('tryToMoveCursorInDir', 'W');
            break;
    }
};

ARL.Input.prototype.keyspace = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            SIG('makeMobPassTheTurn');
            // MEGA DEBUG SHORTCUT FOR RAPID MAP GENERATION
            // SCON('GAME_OVER', true);
            // SIG('endCurrentTurn');
            // console.clear();
            break;
        case 'targeting':
            // confirms target and fires
            // DO THAT HERE
            SIG('doARangedAttackTowardCursor');
            break;
    }
};

ARL.Input.prototype.keyescape = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            // does nothing
            break;
        case 'targeting':
            // cancels targeting
            SIG('endCurrentInputContext');
            // kill the cursor
            SIG('delCursorAtLoc', GCON('CURSOR_LOC'));
            break;
    }
};

ARL.Input.prototype.keyf = function () {
    switch (GCON('INPUT_CONTEXT')[0]) {
        case 'movement':
            // switch to targeting
            SIG('startNewInputContext', 'targeting');
            SIG('addCursorAtLoc', GCON('PLAYER_MOB').mPosition.pLocXY);
            break;
        case 'targeting':
            // does nothing durr
            break;
    }
};



// asdf



/*
*
*
* Courtesy Spaces
*
*
*/