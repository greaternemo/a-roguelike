// ARL.Action
// For *simple* movement and combat

ARL.Action = function () {};

/*
ARL.Action.prototype
*/

ARL.Action.prototype.handleCurrentTurn = function () {
    SIG('compelMob', GCON('FLOOR_MAP')[GCON('CURRENT_FLOOR')].fCurMob);
};

ARL.Action.prototype.endCurrentTurn = function () {
    if (!GCON('GAME_OVER')) {
        SIG('updateMobFovOnCurrentFloor');
        // SIG('updateVisibility');
    }
    if (GCON('DIRTY_LOAD').length > 0) {
        SIG('pushDirtyLoad');
    }
    SCON('END_OF_TURN', true);
};

ARL.Action.prototype.makeMobPassTheTurn = function () {
    SIG('endCurrentTurn');
    // IT IS REALLY THAT EASY RIGHT NOW, LMAO
};

ARL.Action.prototype.moveMobNorth = function (aMob) {
    SIG('tryToMoveMobInDir', [aMob, 'N']);
};

ARL.Action.prototype.moveMobEast = function (aMob) {
    SIG('tryToMoveMobInDir', [aMob, 'E']);
};

ARL.Action.prototype.moveMobSouth = function (aMob) {
    SIG('tryToMoveMobInDir', [aMob, 'S']);
};

ARL.Action.prototype.moveMobWest = function (aMob) {
    SIG('tryToMoveMobInDir', [aMob, 'W']);
};

ARL.Action.prototype.movePlayerNorth = function () {
    SIG('tryToMoveMobInDir', [GCON('PLAYER_MOB').mIdentity.iEid, 'N']);
};

ARL.Action.prototype.movePlayerEast = function () {
    SIG('tryToMoveMobInDir', [GCON('PLAYER_MOB').mIdentity.iEid, 'E']);
};

ARL.Action.prototype.movePlayerSouth = function () {
    SIG('tryToMoveMobInDir', [GCON('PLAYER_MOB').mIdentity.iEid, 'S']);
};

ARL.Action.prototype.movePlayerWest = function () {
    SIG('tryToMoveMobInDir', [GCON('PLAYER_MOB').mIdentity.iEid, 'W']);
};

ARL.Action.prototype.useStairs = function () {};

ARL.Action.prototype.pursueThePlayer = function (aMob) {
    // We can do this simply because of the way our basic-ass shadowcasting works:
    // Any mob that can see the player has line of sight and has no obstacles to avoid.
    
    let [mX, mY] = GET(aMob).mPosition.pLocXY.split(',');
    mX = parseInt(mX);
    mY = parseInt(mY);
    let [pX, pY] = GCON('PLAYER_MOB').mPosition.pLocXY.split(',');
    pX = parseInt(pX);
    pY = parseInt(pY);
    let walkableDirs = new Set(SIG('findWalkableSides', GET(aMob).mPosition.pLocXY));
    let validDirs = [];
    let moveDir = null;
    
    // We may need to/may be able to pull this out as a utility function later in some form
    if (mY > pY) {
        // north
        if (walkableDirs.has('N')) {
            validDirs.push('N');
        }
    }
    else if (mY < pY) {
        // south
        if (walkableDirs.has('S')) {
            validDirs.push('S');
        }
    }
    else {
        // same y coord, nothing
    }
 
    if (mX > pX) {
        // west
        if (walkableDirs.has('W')) {
            validDirs.push('W');
        }
    }
    else if (mX < pX) {
        // east
        if (walkableDirs.has('E')) {
            validDirs.push('E');
        }
    }
    else {
        // same x coord, nothing
    }
        
    if (validDirs.length === 1) {
        moveDir = validDirs[0];
        SIG('tryToMoveMobInDir', [aMob, moveDir]);
    }
    else if (validDirs.length === 2) {
        moveDir = validDirs[SIG('aCoin')];
        SIG('tryToMoveMobInDir', [aMob, moveDir]);
    }
    else if (validDirs.length === 0) {
        SIG('makeMobPassTheTurn');
    }
};

ARL.Action.prototype.wanderInRandomDir = function (aMob) {
    let mLoc = GET(aMob).mPosition.pLocXY;
    let aDir = SIG('findRandomWalkableSide', mLoc);
    SIG('tryToMoveMobInDir', [aMob, aDir]);
};

ARL.Action.prototype.tryToMoveMobInDir = function (mData) {
    // Is there a wall there? If yes, don't move.
    // Is there a mob there? If yes, hit them and don't move.
    // If it's floor and there's nothing there, move there.
    let [aMob, aDir] = mData;
    let locFrom = GET(aMob).mPosition.pLocXY;
    let locTo = GCON('SIDE_REFS')[locFrom][aDir];
    if (locTo === false) {
        // you can't walk off the map
        return;
    }
    let physLocTo = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][locTo];
    if (GCON('TERRAIN_BASE')[physLocTo.aTerrain].tWalkable === false) {
        // can't walk there
        // we immediately return to skip the EOT cleanup, which we only do
        // after performing an action with finality
        return;
    }
    else if (physLocTo.aBody !== false) {
        // ya gotta fite em
        SIG('doAHit', [aMob, physLocTo.aBody]);
    }
    else {
        // move to the new loc
        SIG('moveMobToLoc', [aMob, locFrom, locTo]);
    }
    // if you did a hit or moved, those actions have finality and will trigger
    // the end of the current turn.
    SIG('endCurrentTurn');
};

ARL.Action.prototype.moveMobToLoc = function (mData) {
    let [aMob, locFrom, locTo] = mData;
    let physLocFrom = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][locFrom];
    let physLocTo = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][locTo];
    
    // update anything that needs to be updated, then signal those updates
    GET(aMob).mPosition.pLocXY = locTo;
    physLocFrom.aBody = false;
    physLocTo.aBody = aMob;
    SIG('handleTileUpdates', [locFrom, locTo]);
};

ARL.Action.prototype.doAHit = function (fMobs) {
    let [aMob, aVic] = fMobs;
    let hitDamage = GET(aMob).mState.sStrTotal - GET(aVic).mState.sDefTotal;
    if (hitDamage > 0) {
        // note the mob as the last damage source, TODO
        SIG('changeMobHPCur', [aVic, 0 - hitDamage]);
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
        let dStr = 'The ' + GET(aMob).mIdentity.iType + ' dies!';
        SIG('narrate', dStr);
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