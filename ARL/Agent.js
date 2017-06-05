// ARL.Agent
// Namespace for mob decision making AI

ARL.Agent = function () {};

/*
ARL.Agent.prototype.
*/

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
    }
};

ARL.Agent.prototype.compelPlayer = function () {
    // all we have to do here is toggle the PLAYER_TURN flag and the input
    // loop will start catching and handling input
    SCON('PLAYER_TURN', true);
};

ARL.Agent.prototype.compelGobbo = function (aMob) {
    let mLoc = GET(aMob).mPosition.pLocXY;
    let aDir = SIG('findRandomWalkableSide', mLoc);
    SIG('tryToMoveMobInDir', [aMob, aDir]);
    
};




/*
*
*
* Courtesy Spaces
*
*
*/