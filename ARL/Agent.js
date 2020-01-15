// ARL.Agent
// Namespace for mob decision making AI

ARL.Agent = function () {};

/*
ARL.Agent.prototype.
*/

// Compulsion functions

ARL.Agent.prototype.compelMob = function (aMob) {
    // right now we're just going to call different individual AI functions
    // depending on which type of mob we get passed
    switch (GET(aMob).mIdentity.iAgent) {
        case 'player':
            // compelPlayer is the only compulsion that doesn't have the mob
            // as an argument
            SIG('compelPlayer');
            break;
        case 'gobbo':
            SIG('compelGobbo', aMob);
            break;
        case 'shooto':
            SIG('compelShooto', aMob);
            break;
        case 'puncho':
            SIG('compelPuncho', aMob);
            break;
        default:
            // failsafe, I guess
            console.log('Failed to compel mob ' + aMob + ' with agent ' + GET(aMob).mIdentity.iAgent);
            SIG('endCurrentTurn');
    }
};

ARL.Agent.prototype.compelPlayer = function () {
    // all we have to do here is toggle the PLAYER_TURN flag and the input
    // loop will start catching and handling input
    SCON('PLAYER_TURN', true);
};

// Refactoring this as compelBrawler
ARL.Agent.prototype.compelGobbo = function (aMob) {
    if (!GCON('GAME_OVER')) {
        if (SIG('canSeeThePlayer', aMob)) {
            SIG('pursueThePlayer', aMob);
        }
        else {
            SIG('wanderInRandomDir', aMob);
        }
    }
    else {
        SIG('wanderInRandomDir', aMob);
    }
};

// pretty sure all non-player mob AI should be in the form:
// if (!GCON('GAME_OVER')) { anything that requires the player to be alive }
// else { SIG('wanderInRandomDir', aMob); }

ARL.Agent.prototype.compelShooto = function (aMob) {
    if (!GCON('GAME_OVER')) {
        if (GET(aMob).mActionState.asVerb === 'drawn') {
            // console.log('shooto is drawn');
            if (GET(aMob).mActionState.asClock > 0) {
                GET(aMob).mActionState.asClock -= 1;
                // we tick the action clock down 1, and then if it's zero, we trigger the action
                if (GET(aMob).mActionState.asClock === 0) {
                    // shoot your shot
                    GET(aMob).mActionState.asVerb = null;
                    SIG('doARangedAttackTowardTarget', aMob);
                }
            }
            else {
                // if the mob is aiming, the clock should be > 0, period
                // if we hit this condition, we should log the error and reset the mob state
                console.log('Encountered error: shooto is aiming while action clock is 0');
                console.log('Resetting state for mob eid ' + aMob);
                GET(aMob).mActionState.asVerb = null;
                GET(aMob).mActionState.asClock = 0;
            }
        }
        else if (SIG('canSeeThePlayer', aMob)) {
            if (SIG('isInlineWithPlayer', aMob)) {
                SIG('prepRangedAttackTowardTarget', [aMob, GCON('PLAYER_MOB').mIdentity.iEid]);
            }
            else {
                SIG('pursueThePlayer', aMob);
            }
        }
        else {
            SIG('wanderInRandomDir', aMob);
        }
    }
    else {
        SIG('wanderInRandomDir', aMob);
    }
};

// this stays unchanged from compelGobbo
ARL.Agent.prototype.compelPuncho = function (aMob) {
    if (!GCON('GAME_OVER')) {
        if (SIG('canSeeThePlayer', aMob)) {
            SIG('pursueThePlayer', aMob);
        }
        else {
            SIG('wanderInRandomDir', aMob);
        }
    }
    else {
        SIG('wanderInRandomDir', aMob);
    }
};

// Assessment functions

ARL.Agent.prototype.canSeeThePlayer = function(aMob) {
    let visibleLocs = new Set(GET(aMob).mVision.vInViewLocs);
    return visibleLocs.has(GCON('PLAYER_MOB').mPosition.pLocXY);
};

ARL.Agent.prototype.isInlineWithPlayer = function(aMob) {
    let playerLoc = SIG('depair', GCON('PLAYER_MOB').mPosition.pLocXY);
    let mobLoc = SIG('depair', GET(aMob).mPosition.pLocXY);
    if (mobLoc.x === playerLoc.x || mobLoc.y === playerLoc.y) {
        return true;
    }
    else {
        return false;
    }
};



/*
*
*
* Courtesy Spaces
*
*
*/