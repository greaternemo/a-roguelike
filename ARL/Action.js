// ARL.Action
// For *simple* movement and combat

ARL.Action = function () {
    /*
    this.p1.pStats = SIG('byId', 'p1_stats');
    */
    
};

/*
ARL.Action.prototype
*/

ARL.Action.prototype.handleCurrentTurn = function () {
    // asdf
    // let theMob = GET(aMob);
    SIG('compelMob', GCON('FLOOR_DATA')[GCON('CURRENT_FLOOR')].fCurMob);
};

ARL.Action.prototype.moveMobNorth = function (aMob) {};

ARL.Action.prototype.moveMobEast = function (aMob) {};

ARL.Action.prototype.moveMobSouth = function (aMob) {};

ARL.Action.prototype.moveMobWest = function (aMob) {};

ARL.Action.prototype.movePlayerNorth = function () {};

ARL.Action.prototype.movePlayerEast = function () {};

ARL.Action.prototype.movePlayerSouth = function () {};

ARL.Action.prototype.movePlayerWest = function () {};

ARL.Action.prototype.useStairs = function () {};

ARL.Action.prototype.tryToMoveMobInDirection = function (aDir, aMob) {};

ARL.Action.prototype.moveMobInDirection = function (aDir, aMob) {};

ARL.Action.prototype.tryToMoveInDir = function (aMob, aDir) {
    // What's the process here?
    // Can you move? If yes,
    // Is there something blocking your movement in that direction? If yes,
    //   Is it a wall? If yes, can you break it or pass through it?
    //   Is it another body? If yes, try to hit them.
    // Else, move there. Then,
    // Is there a hazard? If yes then apply the effect.
};

ARL.Action.prototype.moveInDir = function (aMob, aDir) {
    //
};

ARL.Action.prototype.doAHit = function (aMob, aVic) {
    // do aMob.mStats.sStr - aVic.mStats.sDef
    // then if it's > 0, subtract that from aVic.mHPCur
};

ARL.Action.prototype.changeMobHPCur = function (aMob, aVal) {
    // aMob.mHPCur += aVal
    // then do a death check on the mob
}

ARL.Action.prototype.deathCheck = function (aMob) {
    // if (aMob.mHPCur <= 0) {
    //     kill the mob
    // }
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