// ARL.Turner.js
// Turn scheduler, but easier to type

ARL.Turner = function () {};

/*
ARL.Turner.prototype.
*/

ARL.Turner.prototype.whoseTurnIsIt = function () {
    // pretty straightforward
    let cFloor = GCON('FLOOR_MAP')[GCON('CURRENT_FLOOR')];
    let mIdxA = null;
    let mIdxB = null;
    // we can add a speed system later, right now it's not strictly necessary
    // and tbqh it's super easy to add
    
    // ok, if the floor's last mob is false, it means that:
    // A: this is the player's first time on this floor, or
    // B: this is a new game, in which case... see A, or
    // C: the last mob died
    if (cFloor.fCurMob === false) {
        cFloor.fCurMob = GCON('PLAYER_MOB').mIdentity.iEid;
    }
    else {
        mIdxA = cFloor.fMobs.indexOf(cFloor.fCurMob);
        if (mIdxA + 1 === cFloor.fMobs.length) {
            mIdxB = 0;
        }
        else {
            mIdxB = mIdxA + 1;
        }
        cFloor.fLastMob = cFloor.fMobs[mIdxA];
        cFloor.fCurMob = cFloor.fMobs[mIdxB];
    }
    console.log('current turn: ' + GET(cFloor.fCurMob).mIdentity.iType);
};

// shit that was easy, pffffft



/*
*
*
* Courtesy Spaces
*
*
*/