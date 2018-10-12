// ARL.World
// Namespace for the game world

ARL.World = function () {    
};

/*
ARL.World.prototype.
*/

ARL.World.prototype.init = function () {
    // build the world framework
    SCON('PHYS_MAP', {});
    SCON('FLOOR_MAP', {});
    SCON('ALL_MOBS', []);
    let floorList = GCON('FLOOR_LIST').slice();
    let aFloor = null;
    while (floorList.length > 0) {
        // the order in which we do this is irrelevant, we could use pop()
        aFloor = floorList.shift();
        // GCON('PHYS_MAP')[fThis] = this.buildBasicFloorMap();
        // GCON('PHYS_MAP')[fThis] = this.buildGreatHallFloorMap();
        // GCON('PHYS_MAP')[fThis] = this.buildGobboctagonFloorMap();
        SIG('generateFloor', aFloor);
        //console.log('Generated Floor');
        GCON('FLOOR_MAP')[aFloor] = SIG('buildFloorData', aFloor);
        // now with infinity percent more mobs!!!
        if (aFloor === GCON('FLOOR_LIST')[0]) {
            SIG('populateFirstFloor', aFloor);
        }
        else {
            SIG('populateFloor', aFloor);
        }
    }
};

ARL.World.prototype.generateBasicTile = function () {
    let aTile = {
        // string
        locXY: null,
        // mob or bool
        aBody: false,
        // must always be defined as a type
        aTerrain: 'wall',
        // calculated on the fly
        aGlyph: '#',
        // calculated on the fly
        // false is the default, enabled true for testing
        aKnown: false,
        // aKnown: true,
        // calculated on the fly
        // is the tile visible to the player mob
        aVisible: false,
    };
    return aTile;
};

ARL.World.prototype.buildFloorData = function (aFloor) {
    // blerg
    let fData = {
        fName: aFloor,
        fMobs: [],
        fLastMob: false,
        fCurMob: false,
        fItems: [],
    };
    return fData;
};

ARL.World.prototype.buildBasicFloorMap = function () {
    let newFloorMap = {};
    let newTile = null;
    let newLoc = null;
    let physLocs = GCON('PHYS_LOCS').slice();
    while (physLocs.length) {
        newLoc = physLocs.shift();
        newTile = SIG('generateBasicTile');
        newTile.locXY = newLoc;
        newFloorMap[newLoc] = newTile;
    }
    return newFloorMap;
};

ARL.World.prototype.buildGreatHallFloorMap = function () {
    let newFloorMap = {};
    let newTile = null;
    let newLoc = null;
    let nX = null;
    let nY = null;
    let physLocs = GCON('PHYS_LOCS').slice();
    while (physLocs.length) {
        newLoc = physLocs.shift();
        newTile = SIG('generateBasicTile');
        newTile.locXY = newLoc;
        nX = newLoc.split(',')[0];
        nY = newLoc.split(',')[1];
        // this needs to be refactored so that your values aren't hard-coded
        if((nX === '0' || nX === '29') || (nY === '0' || nY === '29')) {
            newTile.aTerrain = 'wall';
            newTile.aGlyph = '#';
        } else {
            newTile.aTerrain = 'floor';
            newTile.aGlyph = '.';
        }
        newFloorMap[newLoc] = newTile;
    }
    return newFloorMap;
};

ARL.World.prototype.buildGobboctagonFloorMap = function () {
    // WELCOME TO THE GOBBOCTAGON
    let newFloorMap = {};
    let newTile = null;
    let newLoc = null;
    let nX = null;
    let nY = null;
    let physLocs = GCON('PHYS_LOCS').slice();
    let octaLocs = GCON('PHYS_LOCS').slice();
    let octagon = [];
    while (octaLocs.length) {
        newLoc = octaLocs.shift();
        [nX, nY] = newLoc.split(',');
        if ((9 < parseInt(nX) && parseInt(nX) < 20) && (12 < parseInt(nY) && parseInt(nY) < 17)) {
            octagon.push(newLoc);
        }
        else if ((10 < parseInt(nX) && parseInt(nX) < 19) && (11 < parseInt(nY) && parseInt(nY) < 18)) {
            octagon.push(newLoc);
        }
        else if ((11 < parseInt(nX) && parseInt(nX) < 18) && (10 < parseInt(nY) && parseInt(nY) < 19)) {
            octagon.push(newLoc);
        }
        else if ((12 < parseInt(nX) && parseInt(nX) < 17) && (9 < parseInt(nY) && parseInt(nY) < 20)) {
            octagon.push(newLoc);
        }
    }
    while (physLocs.length) {
        newLoc = physLocs.shift();
        newTile = SIG('generateBasicTile');
        newTile.locXY = newLoc;
        // this needs to be refactored so that your values aren't hard-coded
        if(octagon.indexOf(newLoc) === -1) {
            newTile.aTerrain = 'wall';
            newTile.aGlyph = '#';
        } else {
            newTile.aTerrain = 'floor';
            newTile.aGlyph = '.';
        }
        newFloorMap[newLoc] = newTile;
    }
    return newFloorMap;
};

ARL.World.prototype.generateFloor = function (aFloor) {
    // we're gonna hardcode this for now
    let layoutType = 'standard';
    
    GCON('PHYS_MAP')[aFloor] = SIG('buildBasicFloorMap');
    //console.log('Built basic floor map for ' + aFloor);
    SIG('generateFloorLayout', layoutType);
    //console.log('Generated ' + layoutType + ' floor layout for ' + aFloor);
    SIG('mapFinishedLayoutToFloor', [layoutType, aFloor]);
};

ARL.World.prototype.populateFirstFloor = function (aFloor) {
    // create the player mob
    let newMobId = SIG('generatePlayer', aFloor);
    // assign the mob to a location on the floor
    GCON('PLAYER_MOB').mPosition.pLocXY = SIG('findAWalkableTile', aFloor);
    // note the phys loc as occupied
    GCON('PHYS_MAP')[aFloor][GCON('PLAYER_MOB').mPosition.pLocXY].aBody = newMobId;
    // add the mob to the floor's mob array
    GCON('FLOOR_MAP')[aFloor].fMobs.push(newMobId);
    // now do the nonplayer mobs
    SIG('populateFloor', aFloor);
};

ARL.World.prototype.populateFloor = function (aFloor) {
    // right now, we're just gonna generate 3 mobs and place them around the floor.
    // ok time to step it up to... 13 mobs
    let mCnt = 13;
    let newMobId = null;
    for (mCnt; mCnt > 0; mCnt -= 1) {
        newMobId = SIG('generateMob', aFloor);
        GET(newMobId).mPosition.pLocXY = SIG('findAWalkableTile', aFloor);
        GCON('PHYS_MAP')[aFloor][GET(newMobId).mPosition.pLocXY].aBody = newMobId;
        GCON('FLOOR_MAP')[aFloor].fMobs.push(newMobId);
    }
};

ARL.World.prototype.findAWalkableTile = function (aFloor) {
    let wTiles = [];
    let testLoc = null;
    let testTile = null;
    let physLocs = GCON('PHYS_LOCS').slice();
    while (physLocs.length > 0) {
        testLoc = physLocs.shift();
        testTile = GCON('PHYS_MAP')[aFloor][testLoc];
        // REALLY HACKY FIX, hard-coding floor here as "walkable, safe"
        if (GCON('TERRAIN_BASE')[testTile.aTerrain].tName === 'floor') {
            if (testTile.aBody === false) {
                wTiles.push(testLoc);
            }
        }
    }
    if (wTiles.length === 0) {
        console.log("no walkable tiles found on floor: " + aFloor);
    }
    return SIG('randFromArray', wTiles);
};

ARL.World.prototype.findRandomWalkableAndSafeSide = function (aLoc) {
    let walkableDirs = SIG('findWalkableAndSafeSides', aLoc);
    // We need to start validating that there are any walkable dirs at all!
    if (walkableDirs.length) {
        return SIG('randFromArray', walkableDirs);
    }
    else {
        return false;
    }
};

ARL.World.prototype.findRandomWalkableSide = function (aLoc) {
    let walkableDirs = SIG('findWalkableSides', aLoc);
    // We need to start validating that there are any walkable dirs at all!
    if (walkableDirs.length) {
        return SIG('randFromArray', walkableDirs);
    }
    else {
        return false;
    }
};

ARL.World.prototype.findWalkableAndSafeSides = function (aLoc) {
    let allDirs = GCON('ALL_DIRS').slice();
    let aDir = null;
    let walkableDirs = [];
    while (allDirs.length > 0) {
        // order is irrelevant
        aDir = allDirs.shift();
        if (SIG('isSideWalkableAndSafe', [aLoc, aDir]) === true) {
            walkableDirs.push(aDir);
        }
    }
    // RIGHT NOW there is no way in the game for a mob to be standing in a space
    // that is surrounded by impassible terrain on all sides. The mapgen just won't do it.
    // BUT IN THEORY, IF THEY COULD, this would return an empty array, so we need to
    // validate the data that's being returned here.
    return walkableDirs;
};

ARL.World.prototype.findWalkableSides = function (aLoc) {
    let allDirs = GCON('ALL_DIRS').slice();
    let aDir = null;
    let walkableDirs = [];
    while (allDirs.length > 0) {
        // order is irrelevant
        aDir = allDirs.shift();
        if (SIG('isSideWalkable', [aLoc, aDir]) === true) {
            walkableDirs.push(aDir);
        }
    }
    // RIGHT NOW there is no way in the game for a mob to be standing in a space
    // that is surrounded by impassible terrain on all sides. The mapgen just won't do it.
    // BUT IN THEORY, IF THEY COULD, this would return an empty array, so we need to
    // validate the data that's being returned here.
    return walkableDirs;
};

ARL.World.prototype.isSideWalkableAndSafe = function (lData) {
    let [aLoc, aSide] = lData;
    let locToSide = GCON('SIDE_REFS')[aLoc][aSide];
    if (locToSide === false) {
        return false;
    }
    let floorMap = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')];
    const isWalkable = GCON('TERRAIN_BASE')[floorMap[locToSide].aTerrain].tWalkable;
    const isSafe = (() => floorMap[locToSide].aTerrain == 'abyss' ? false : true )();
    if (isWalkable && isSafe) { return true; }
    return false;
}

ARL.World.prototype.isSideWalkable = function (lData) {
    let [aLoc, aSide] = lData;
    let locToSide = GCON('SIDE_REFS')[aLoc][aSide];
    if (locToSide === false) {
        return false;
    }
    let floorMap = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')];
    return GCON('TERRAIN_BASE')[floorMap[locToSide].aTerrain].tWalkable;
};

ARL.World.prototype.generatePlayer = function (aFloor) {
    let newPlayerMob = new ARL.Mob();
    // if I'm checking this anyway, there's no reason to add it to the mob itself
    // I'll worry about it later
    newPlayerMob.mIdentity.iType = GCON('MOB_BASE').player.mType;
    newPlayerMob.mIdentity.iAgent = GCON('MOB_BASE').player.mAgent;
    newPlayerMob.mPosition.pCurFloor = aFloor;
    SCON('CURRENT_FLOOR', aFloor);
    // refactor this into some factory shit
    let newPlayerMobId = SIG('registerEntity', newPlayerMob);
    GET(newPlayerMobId).mIdentity.iEid = newPlayerMobId;
    GCON('ALL_MOBS').push(newPlayerMobId);
    SCON('PLAYER_MOB', newPlayerMobId);
    return newPlayerMobId;
};

ARL.World.prototype.generateMobs = function () {};

ARL.World.prototype.generateMob = function (aFloor) {
    // right now we're just doing gobbos, we need better factory methods
    let newMob = new ARL.Mob();
    newMob.mIdentity.iType = GCON('MOB_BASE').gobbo.mType;
    newMob.mIdentity.iAgent = GCON('MOB_BASE').gobbo.mAgent;
    newMob.mPosition.pCurFloor = aFloor;
    let newMobId = SIG('registerEntity', newMob);
    GET(newMobId).mIdentity.iEid = newMobId;
    GCON('ALL_MOBS').push(newMobId);
    return newMobId;
};

ARL.World.prototype.mobDeath = function (deadMob) {
    // rip in procgen
    let whoami = GET(deadMob).mIdentity.iType;
    // purge the mob from everywhere it exists
    // purge it from ALL_MOBS
    GCON('ALL_MOBS').splice(GCON('ALL_MOBS').indexOf(deadMob), 1);
    // purge it from the floor
    let prevMob = null;
    let prevMobIdx = null;
    let prevPrevMob = null;
    let prevPrevMobIdx = null;
    let mobIdx = null;
    let mobFloor = GET(deadMob).mPosition.pCurFloor;
    let mobFloorData = GCON('FLOOR_MAP')[mobFloor];    
    let mobLoc = GET(deadMob).mPosition.pLocXY;
    let physLoc = GCON('PHYS_MAP')[mobFloor][mobLoc];

    mobIdx = mobFloorData.fMobs.indexOf(deadMob);
    if (mobIdx === 0) {
        prevMobIdx = mobFloorData.fMobs.length - 1;
    }
    else {
        prevMobIdx = mobIdx - 1;
    }
    prevMob = mobFloorData.fMobs[prevMobIdx];
    
    // gotta be sure to update the last/cur mobs so we don't break the turner
    if (mobFloorData.fLastMob === deadMob) {
        mobFloorData.fLastMob = prevMob;
    }
    if (mobFloorData.fCurMob === deadMob) {
        mobFloorData.fCurMob = prevMob;
        if (prevMobIdx === 0 ) {
            prevPrevMobIdx = mobFloorData.fMobs.length - 1;
        }
        else {
            prevPrevMobIdx = prevMobIdx - 1;
        }
        prevPrevMob = mobFloorData.fMobs[prevPrevMobIdx];
        mobFloorData.fLastMob = prevPrevMob;
    }
    
    physLoc.aBody = false;
    mobFloorData.fMobs.splice(mobIdx, 1);
    
    // IT IS DONE
    if (whoami === 'player') {
        SIG('narrate', 'You lose! Press any key to start a new game.');
        SCON('GAME_OVER', true);
    }
    SIG('destroyEntity', deadMob);
    SIG('handleTileUpdates', [mobLoc]);
    
    // Temporary wincon if you kill all the mobs, it just starts over
    if (whoami !== 'player' && mobFloorData.fMobs.length === 1) {
        SIG('narrate', 'You killed all the monsters on this floor!');
        SIG('narrate', 'You win! Press any key to start a new game.');
        SCON('GAME_OVER', true);
    }
};

// This is the main interface via which the the physical map data is reconciled with the UI.
// All the updates we make here are dropped into the DIRTY_LOAD, which is pushed as part of
// the endCurrentTurn function.
ARL.World.prototype.handleTileUpdates = function (uTiles) {
    // the arguments to this function should ALWAYS be an array
    let aLoc = null;
    while (uTiles.length > 0) {
        // order is irrelevant
        aLoc = uTiles.shift();
        if (!GCON('GAME_OVER')) {
            SIG('checkTileVisibility', aLoc);
        }
        SIG('updateCurrentGlyph', aLoc);
        
    }
};

ARL.World.prototype.updateCurrentGlyph = function (aLoc) {
    let physTile = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][aLoc];
    if (physTile.aBody !== false && physTile.aVisible === true) {
        // draw the body if there is one and the tile is visible
        physTile.aGlyph = GCON('MOB_BASE')[GET(physTile.aBody).mIdentity.iType].mGlyph;
    }
    else {
        // just draw the tile otherwise
        physTile.aGlyph = GCON('TERRAIN_BASE')[physTile.aTerrain].tGlyph;
    }
    // mark the tile dirty
    SIG('addToDirtyLoad', [aLoc]);
};

ARL.World.prototype.checkTileVisibility = function (aLoc) {
    let physTile = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')][aLoc];
    let knownLocs = GCON('PLAYER_MOB').mVision.vKnownLocs;
    let inViewLocs = GCON('PLAYER_MOB').mVision.vInViewLocs;
    
    // if we haven't seen it at all, it's shrouded in darkness
    if (knownLocs.indexOf(aLoc) === -1) {
        physTile.aKnown = false;
        physTile.aVisible = false;
    }
    // if we have seen it, it's not dark, but is it in view?
    else {
        physTile.aKnown = true;
        if (inViewLocs.indexOf(aLoc) === -1) {
            physTile.aVisible = false;
        }
        else {
            physTile.aVisible = true;
        }
    }
};



/*
*
*
* Courtesy Spaces
*
*
*/
