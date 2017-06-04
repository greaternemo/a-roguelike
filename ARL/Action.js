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

ARL.Action.prototype.moveMobNorth = function (aMob) {
    SIG('tryToMoveMobInDirection', [aMob, 'N']);
};

ARL.Action.prototype.moveMobEast = function (aMob) {
    SIG('tryToMoveMobInDirection', [aMob, 'E']);
};

ARL.Action.prototype.moveMobSouth = function (aMob) {
    SIG('tryToMoveMobInDirection', [aMob, 'S']);
};

ARL.Action.prototype.moveMobWest = function (aMob) {
    SIG('tryToMoveMobInDirection', [aMob, 'W']);
};

ARL.Action.prototype.movePlayerNorth = function () {
    SIG('tryToMoveMobInDirection', [GCON('PLAYER_MOB').mIdentity.iEid, 'N']);
};

ARL.Action.prototype.movePlayerEast = function () {
    SIG('tryToMoveMobInDirection', [GCON('PLAYER_MOB').mIdentity.iEid, 'E']);
};

ARL.Action.prototype.movePlayerSouth = function () {
    SIG('tryToMoveMobInDirection', [GCON('PLAYER_MOB').mIdentity.iEid, 'S']);
};

ARL.Action.prototype.movePlayerWest = function () {
    SIG('tryToMoveMobInDirection', [GCON('PLAYER_MOB').mIdentity.iEid, 'W']);
};

ARL.Action.prototype.useStairs = function () {};

ARL.Action.prototype.tryToMoveMobInDirection = function (mData) {
    // Is there a wall there? If yes, don't move.
    // Is there a mob there? If yes, hit them and don't move.
    // If it's floor and there's nothing there, move there.
    let [aMob, aDir] = mData;
    let locFrom = GET(aMob).mPosition.locXY;
    let locTo = GCON('SIDE_REFS')[locFrom][aDir];
    let physLocTo = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][locTo];
    if (GCON('TERRAIN_BASE')[physLocTo.aTerrain].tIsWalkable === false) {
        // can't walk there
        return;
    }
    else if (physLocTo.aBody !== false) {
        // ya gotta fite em
        return SIG('doAHit', [aMob, physLocTo.aBody]);
    }
    else {
        // move to the new loc
        return SIG('moveMobToLoc', [aMob, locFrom, locTo]);
    }
};

ARL.Action.prototype.moveMobToLoc = function (mData) {
    let [aMob, locFrom, locTo] = mData;
    let physLocFrom = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][locFrom];
    let physLocTo = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][locTo];
    
    // update anything that needs to be updated, then signal those updates
    GET(aMob).mPosition.locXY = newLoc;
    physLocFrom.aBody = false;
    physLocTo.aBody = aMob;
    SIG('handleTileUpdates', [locFrom, locTo]);
};

ARL.Action.prototype.doAHit = function (fMobs) {
    let [aMob, aVic] = fMobs;
    let hitDamage = GET(aMob).mState.sStrTotal - GET(aVic).mState.sDefTotal;
    if (hitDamage > 0) {
        // note the mob as the last damage source, TODO
        SIG('changeMobHPCur', [aVic, hitDamage]);
    }
    else {
        // mob whiffs, narrate it
    }
    // do aMob.mStats.sStr - aVic.mStats.sDef
    // then if it's > 0, subtract that from aVic.mHPCur
};

ARL.Action.prototype.changeMobHPCur = function (mData) {
    let [aMob, aVal] = mData;
    SIG('changeMobState', [aMob, 'sHPCur', aVal]);
    // then do a death check on the mob
    // this may/will eventually need refactoring to include cause of death
    SIG('wasMobKilled', aMob);
};

ARL.Action.prototype.changeMobState = function (sData) {
    let [aMob, aStat, aVal] = sData;
    GET(aMob).mState[aStat] += aVal;
    if (GET(aMob).mState[aStat] < 0) {
        GET(aMob).mState[aStat] = 0;
    }
};

ARL.Action.prototype.changeMobStats = function (sData) {
    let [aMob, aStat, aVal] = sData;
    GET(aMob).mStats[aStat] += aVal;
    if (GET(aMob).mStats[aStat] < 0) {
        GET(aMob).mStats[aStat] = 0;
    }
};

ARL.Action.prototype.wasMobKilled = function (aMob) {
    if (GET(aMob).mState.sHPCur === 0) {
        SIG('mobDeath', aMob);
    }
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