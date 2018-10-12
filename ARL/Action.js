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
    }
    if (GCON('DIRTY_LOAD').length > 0) {
        // shit damn this was a smart decision, thanks Neems
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

ARL.Action.prototype.doARangedAttackTowardCursor = function () {
    // If the player selects themselves, fuck off, eh
    if (GCON('CURSOR_LOC') === GCON('PLAYER_MOB').mPosition.pLocXY) {
        SIG('narrate', 'You fire an arrow into the floor at your feet. Wasteful.');
    }
    else {
        // This is going to be really fucking rigid but it's gonna work for now
        let playerLoc = GCON('PLAYER_MOB').mPosition.pLocXY;
        let playerRange = GCON('PLAYER_MOB').mVision.vFov;
        let sideRefs = GCON('SIDE_REFS');
        let allDirs = GCON('ALL_DIRS').slice();
        let thisDir = null;
        let cursorDir = null;
        while (allDirs.length > 0) {
            thisDir = allDirs.shift();
            if (sideRefs[playerLoc][thisDir] === GCON('CURSOR_LOC')) {
                cursorDir = thisDir;
            }
        }
        // Now that we've calculated which dir the cursor is aiming in,
        // we calculate our firing range and see if we hit something.
        let calcPayload = [playerLoc, cursorDir, playerRange];
        let inlineLocs = SIG('getInlineLocsInDir', calcPayload);
        let thisLoc = null;
        let curFloor = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')];
        let fireStr = null;
        // let inViewLocs = new Set(GCON('PLAYER_MOB').mVision.vInViewLocs);
        // One of ??? things will happen here:
        // - If we see unoccupied floor, we keep looking outward.
        // - If we ONLY see unoccupied floor, we just whiff the shot.
        // - If we see a mob, we shoot them.
        // - If we see a wall, we shoot it and whiff the shot.
        while (inlineLocs.length > 0) {
            thisLoc = inlineLocs.shift();
            if (GCON('TERRAIN_BASE')[curFloor[thisLoc].aTerrain].tFireThru === true) {
                // if we can fire through this tile and there's someone here, we shoot them
                if (curFloor[thisLoc].aBody) {
                    let vicType = GET(curFloor[thisLoc].aBody).mIdentity.iType;
                    fireStr = 'You fire an arrow at the ' + vicType + '.';
                    SIG('narrate', fireStr);
                    SIG('doAHit', [GCON('PLAYER_MOB').mIdentity.iEid, curFloor[thisLoc].aBody]);
                    break;
                }
                // if this is the last loc in our targeting line and there's no one here to shoot, we whiff
                else if (inlineLocs.length === 0) {
                    fireStr = 'You fire an arrow and watch it fly away and skid to a stop on the ground.';
                    SIG('narrate', fireStr);
                    break;
                }
                // if we can fire through this tile and there's no one here to hit, we just keep looking
            }
            else {
                // we can't fire through this tile, so we just hit it and whiff
                fireStr = 'You fire an arrow right into the ' + GCON('TERRAIN_BASE')[curFloor[thisLoc].aTerrain].tName;
                fireStr += ' and watch it break.';
                SIG('narrate', fireStr);
                break;
            }
        }
    }
    SIG('endCurrentInputContext');
    SIG('delCursorAtLoc', GCON('CURSOR_LOC'));
    SIG('endCurrentTurn');
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