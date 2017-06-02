// ARL.World
// Namespace for the game world

ARL.World = function () {

    // this.wFloorList = [];
    // this.wFloorMap = {};
    
    this.init();
};

/*
ARL.World.prototype.
*/

ARL.World.prototype.init = function () {
    // build the world framework
    SCON('PHYS_MAP', {});
    SCON('FLOOR_DATA', {});
    SCON('ALL_MOBS', []);
    let fList = GCON('FLOOR_LIST').slice();
    let fThis = null;
    while (fList.length > 0) {
        // the order in which we do this is irrelevant, we could use pop()
        fThis = fList.shift();
        // GCON('PHYS_MAP')[fThis] = this.buildBasicFloorMap();
        GCON('PHYS_MAP')[fThis] = this.buildGreatHallFloorMap();
        GCON('FLOOR_DATA')[fThis] = this.buildFloorData(fThis);
        // now with infinity percent more mobs!!!
        if (fThis === GCON('FLOOR_LIST')[0]) {
            this.populateFirstFloor(fThis);
        }
        else {
            this.populateFloor(fThis);
        }
    }
};

ARL.World.prototype.buildFloorData = function (aFloor) {
    // blerg
    let fData = {
        fName: null,
        fMobs: null,
        fLastMob: null,
        fCurMob: null,
        fItems: null,
    };
    fData.fName = aFloor;
    fData.fMobs = [];
    fData.fLastMob = false;
    fData.fCurMob = false;
    fData.fItems = [];

    return fData;
};

ARL.World.prototype.buildBasicFloorMap = function () {
    let newFloorMap = {};
    let newTile = null;
    let newLoc = null;
    let physLocs = GCON('PHYS_LOCS').slice();
    while (physLocs.length) {
        newLoc = physLocs.shift();
        newTile = {
            // string
            locXY: null,
            // mob or bool
            aBody: false,
            // must always be defined as a type
            aTerrain: 'wall',
            // calculated on the fly
            aGlyph: '#',
        };
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
        newTile = {
            // string
            locXY: null,
            // mob or bool
            aBody: false,
            // must always be defined as a type
            aTerrain: 'wall',
            // calculated on the fly
            aGlyph: '#',
        };
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

ARL.World.prototype.populateFirstFloor = function (aFloor) {
    // create the player mob
    let newMobId = this.generatePlayer(aFloor);
    // assign the mob to a location on the floor
    GCON('PLAYER_MOB').mPosition.pLocXY = this.findAWalkableTile(aFloor);
    // note the phys loc as occupied
    GCON('PHYS_MAP')[aFloor][GCON('PLAYER_MOB').mPosition.pLocXY].aBody = newMobId;
    // add the mob to the floor's mob array
    GCON('FLOOR_DATA')[aFloor].fMobs.push(newMobId);
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
        GCON('FLOOR_DATA')[aFloor].fMobs.push(newMobId);
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

/*
    'populateFirstFloor',
    'populateFloor',
    'generatePlayer',
    'generateMobs',
    'generateMob',
*/



/*
*
*
* Courtesy Spaces
*
*
*/