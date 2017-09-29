// ARL.World
// Namespace for the game world

ARL.World = function () {    
    this.init();
};

/*
ARL.World.prototype.
*/

ARL.World.prototype.init = function () {
    // build the world framework
    SCON('PHYS_MAP', {});
    SCON('FLOOR_MAP', {});
    SCON('ALL_MOBS', []);
    let fList = GCON('FLOOR_LIST').slice();
    let fThis = null;
    while (fList.length > 0) {
        // the order in which we do this is irrelevant, we could use pop()
        fThis = fList.shift();
        // GCON('PHYS_MAP')[fThis] = this.buildBasicFloorMap();
        // GCON('PHYS_MAP')[fThis] = this.buildGreatHallFloorMap();
        GCON('PHYS_MAP')[fThis] = this.buildGobboctagonFloorMap();
        GCON('FLOOR_MAP')[fThis] = this.buildFloorData(fThis);
        // now with infinity percent more mobs!!!
        if (fThis === GCON('FLOOR_LIST')[0]) {
            this.populateFirstFloor(fThis);
        }
        else {
            this.populateFloor(fThis);
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
        aVisible: false,
    };
    return aTile;
};

ARL.World.prototype.generateGridAndNodeLocs = function () {
    // generate the node locs and grid locs and the conversion table for them
    let gridSize = GCON('GRID_SIZE');
    SCON('GRID_LOCS', SIG('generateLocs', {
        xMin: 0,
        xMax: gridSize.gWidth,
        yMin: 0,
        yMax: gridSize.gHeight,
    }));

    let nodeSize = GCON('NODE_SIZE');
    // an array of locs between '0,0' and '10,10', inclusive
    // later we'll need to translate these based on the gridLoc
    // e.g., '0,0' in node '1,1' will become '10,10'
    // this will be something like
    // NW corner is (nodeLoc * gridLoc),(nodeLoc * gridLoc)
    // NE corner is ((nodeLoc * (gridLoc + 1)) - 1),(nodeLoc * gridLoc)
    // SE corner is ((nodeLoc * (gridLoc + 1)) - 1),((nodeLoc * (gridLoc + 1)) - 1)
    // SW corner is (nodeLoc * gridLoc),((nodeLoc * (gridLoc + 1)) - 1)
    SCON('NODE_LOCS', SIG('generateLocs', {
        xMin: 0,
        xMax: nodeSize.nWidth,
        yMin: 0,
        yMax: nodeSize.nHeight,
    }));
    
    let gridLocs = GCON('GRID_LOCS').slice();
    let nodeLocs = GCON('NODE_LOCS').slice();
    
    // then we assemble and assign the grid map
    let gridMap = {};
    let aGridLoc = null;
    let aNodeLoc = null;
    let aPhysLoc = null;
    let gIdx = null;
    let gLen = gridLocs.length;
    let nIdx = null;
    let nLen = nodeLocs.length;
    let gdx = null;
    let gdy = null;
    let ndx = null;
    let ndy = null;
    let pdx = null;
    let pdy = null;
    
    for (gIdx = 0; gIdx < gLen; gIdx += 1) {
        aGridLoc = gridLocs[gIdx];
        gridMap[aGridLoc] = {};
        for (nIdx = 0; nIdx < nLen; nIdx += 1) {
            aNodeLoc = nodeLocs[nIdx];
            [gdx, gdy] = aGridLoc.split(',');
            [ndx, ndy] = aNodeLoc.split(',');
            pdx = (parseInt(gdx) * parseInt(ndx)) + parseInt(ndx);
            pdy = (parseInt(gdy) * parseInt(ndy)) + parseInt(ndy);
            aPhysLoc = pdx.toString() + ',' + pdy.toString();
            gridMap[aGridLoc][aNodeLoc] = aPhysLoc;
        }
    }
    SCON('GRID_MAP', gridMap);
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
        newTile = this.generateBasicTile();
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
        newTile = this.generateBasicTile();
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
        newTile = this.generateBasicTile();
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

ARL.World.prototype.generateFloorLayout = function (aFloor) {
    // TODO, moving a lot of the loc generation to ARL.BASE
    
    // Now we start this, the most grave of tasks
    aFloor = null; // fix this ok
    
    // Ok, what in heck do we care about?
    let floorOuterWall = [];
    let roomInnerTiles = [];
    let roomOuterTiles = [];
};

ARL.World.prototype.populateFirstFloor = function (aFloor) {
    // create the player mob
    let newMobId = this.generatePlayer(aFloor);
    // assign the mob to a location on the floor
    GCON('PLAYER_MOB').mPosition.pLocXY = this.findAWalkableTile(aFloor);
    // note the phys loc as occupied
    GCON('PHYS_MAP')[aFloor][GCON('PLAYER_MOB').mPosition.pLocXY].aBody = newMobId;
    // add the mob to the floor's mob array
    GCON('FLOOR_MAP')[aFloor].fMobs.push(newMobId);
    // now do the nonplayer mobs
    this.populateFloor(aFloor);
};

ARL.World.prototype.populateFloor = function (aFloor) {
    // right now, we're just gonna generate 3 mobs and place them around the floor.
    let mCnt = 3;
    let newMobId = null;
    for (mCnt; mCnt > 0; mCnt -= 1) {
        newMobId = this.generateMob(aFloor);
        GET(newMobId).mPosition.pLocXY = this.findAWalkableTile(aFloor);
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
        if (GCON('TERRAIN_BASE')[testTile.aTerrain].tWalkable === true) {
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

ARL.World.prototype.findRandomWalkableSide = function (aLoc) {
    let walkableDirs = SIG('findWalkableSides', aLoc);
    return SIG('randFromArray', walkableDirs);
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
    return walkableDirs;
};

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
        SCON('GAME_OVER', true);
    }
    SIG('destroyEntity', deadMob);
    SIG('handleTileUpdates', [mobLoc]);
};

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
}



/*
*
*
* Courtesy Spaces
*
*
*/