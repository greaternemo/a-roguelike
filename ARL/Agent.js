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
        case 'archer':
            SIG('compelArcher'. aMob);
            break;
        case 'brawler':
            SIG('compelBrawler', aMob);
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

ARL.Agent.prototype.compelArcher = function (aMob) {
    if (!GCON('GAME_OVER')) {
        if (GET(aMob).mActionState.asCur === 'drawn') {
            if (SIG('canSeeThePlayer', aMob)) {
                SIG('pursueThePlayer', aMob);
            }
            else {
                SIG('wanderInRandomDir', aMob);
            }
        }
        else if (SIG('canSeeThePlayer', aMob)) {
            
        }
    }
    else {
        SIG('wanderInRandomDir', aMob);
    }
};

// this stays unchanged from compelGobbo
ARL.Agent.prototype.compelBrawler = function (aMob) {
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



/*
*
*
* Courtesy Spaces
*
*
*/