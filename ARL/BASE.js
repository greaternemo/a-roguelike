// ARL.BASE
// Template and reference data

ARL.BASE = {

    RefData: {

        loopDelay: (1000/30),

        mapSize: {
            xw: 30,
            yh: 30,
        },

        // Flags
        listenNumpad: true,
        playerTurn: false,
        readyForTurn: false,

        // allDirs: ['N', 'E', 'S', 'W', 'U', 'D'],
        allDirs: ['N', 'E', 'S', 'W'],
        dirDeltas: {
            N: {
                x: 0,
                y: -1,
                z: 0,
            },
            E: {
                x: 1,
                y: 0,
                z: 0,
            },
            S: {
                x: 0,
                y: 1,
                z: 0,
            },
            W: {
                x: -1,
                y: 0,
                z: 0,
            },
            U: {
                x: 0,
                y: 0,
                z: 1,
            },
            D: {
                x: 0,
                Y: 0,
                z: -1,
            },
        },
        // gonna populate these

        // ALL loc strings
        allLocs: [],

        // the loc strings that correspond to physical locations
        physLocs: [],

        // refs to the stuff at each loc
        physData: {},
        // REPLACED BY PHYS_MAP

        // the loc strings that correspond to elems
        viewLocs: [],

        // should be keyed to loc strings
        // values should be refs to code elements
        // we'll then dynamically alter the content of those elements
        viewElems: {},
        // REPLACED BY VIEW_MAP

        // the elements at the ends of lines, so we don't mistake them
        // for physical locations that the player can visit
        // **these should never change, these elems should never be updated**
        lineEnds: [],

        // keyed to loc strings
        // values should be objects with loc strings for each adjacent loc
        sideRefs: {},

        terrainBase: {
            floor: {
                tWalkable: true,
                tGlyph: '.',
            },
            wall: {
                tWalkable: false,
                tGlyph: '#',
            },
        },

        mobBase: {
            player: {
                mGlyph: '@',
                mType: 'player',
                mAgent: 'player',
            },
            gobbo: {
                mGlyph: 'g',
                mType: 'gobbo',
                mAgent: 'gobbo',
            },
        },

        floorList: [
                    'floor1',
                    'floor2',
        ],

        worldFloors: {
            floor1: {
                stairsUp: false,
                stairsDown: 'floor2',
            },
            floor2: {
                stairsUp: 'floor1',
                stairsDown: false,
            }
        }

    },
    
    Templates: {

        // NONE OF THESE NEED TEMPLATES
        // NEMO GET YOUR FUCKING LIFE TOGETHERRRRRR
        Arena: {},
        Game: {},
        Narrator: {},
        Util: {},

    },

    Routes: {

        Action: [
                'handleCurrentTurn',
                'moveMobNorth',
                'moveMobEast',
                'moveMobSouth',
                'moveMobWest',
                'movePlayerNorth',
                'movePlayerEast',
                'movePlayerSouth',
                'movePlayerWest',
                'useStairs',
                'tryToMoveMobInDirection',
                'moveMobToLoc',
                'doAHit',
                'changeMobHPCur',
                'changeMobState',
                'changeMobStats',
                'wasMobKilled',
        ],
        Agent: [
                'compelMob',
        ],
        Game: [
                // filler line
                'doTheGame',
                'doNextTurn',
        ],
        Input: [
                'queueInput',
                'handleInput',
                'pressButton',
                'numpad1',
                'numpad2',
                'numpad3',
                'numpad4',
                'numpad5',
                'numpad6',
                'numpad7',
                'numpad8',
                'numpad9',
        ],
        Narrator: [
                'narrate',
                'colorrate',
                'clearFeed',
                'dub',
                'addLine',
                'addColorLine',
        ],
        Registry: [
                'getEid',
                'setEid',
                'getConst',
                'setConst',
                'importConstants',
                'registerEntity',
                'generateUeid',
                'chaseDown',
                'destroyEntity',
        ],
        Turner: [
                // filler line
                'whoseTurnIsIt',
        ],
        Util: [
                'rand',
                'aDie',
                'd2',
                'd4',
                'd6',
                'd8',
                'd10',
                'd12',
                'd20',
                'genNum',
                'randomName',
                'randomNolan',
                'shuffle',
                'randFromArray',
                'cap',
                'byId',
                'scrollToNew',
                'enpair',
                'depair',
                'entrio',
                'detrio',
        ],
        View: [
                'moveNorth',
                'moveEast',
                'moveSouth',
                'moveWest',
        ],
        World: [
                // filler line
                'buildFloorData',
                'buildBasicFloorMap',
                'buildGreatHallFloorMap',
                'populateFirstFloor',
                'populateFloor',
                'findAWalkableTile',
                'generatePlayer',
                'generateMobs',
                'generateMob',
                'mobDeath',
                'handleTileUpdates',
                'updateCurrentGlyph',
                
        ],
    },
    
    Constants: [
                // filler line
                'LOOP_DELAY',       // standard loop delay in ms
                'ALL_DIRS',         // array of all dirs as single character strings
                'SIDE_DELTAS',      // table of deltas for each dir
                'SIDE_REFS',        // table of adjacent locs for each loc
                'PHYS_LOCS',        // array of all representable physical locs
                'VIEW_LOCS',        // array of all renderable map locs
                'LINE_ENDS',        // array of all view locs that are not phys locs
                'PHYS_MAP',         // table of tables of phys locs, keyed by floor name
                'VIEW_MAP',         // table of view locs, keyed by loc
                'DIRTY_LOCS',       // list of view locs that need to be redrawn
                'CURRENT_FLOOR',    // name of the floor the player is on
                'FLOOR_LIST',       // array of floor names as strings
                'FLOOR_DATA',       // table of tables of floor data, keyed by floor name
                'TERRAIN_BASE',     // table of tables of terrain data, keyed by terrain name
                'MOB_BASE',         // table of tables of mob data, keyed by mob type
                'ALL_MOBS',         // array of eids for all mobs
                'PLAYER_MOB',       // eid for the player mob
                'INPUT_BUFFER',     // array of signals
                'LISTEN_NUMPAD',    // bool, are we accepting numpad input
                'PLAYER_TURN',      // bool, is it the player's turn
                'READY_FOR_TURN',   // bool, has the last turn completed

    ],

    Schema: {
        // filler line
        LOOP_DELAY:     'loopDelay',
        ALL_DIRS:       'allDirs',
        SIDE_DELTAS:    'dirDeltas',
        SIDE_REFS:      'sideRefs',
        PHYS_LOCS:      'physLocs',
        VIEW_LOCS:      'viewLocs',
        LINE_ENDS:      'lineEnds',
        FLOOR_LIST:     'floorList',
        TERRAIN_BASE:   'terrainBase',
        MOB_BASE:       'mobBase',
        LISTEN_NUMPAD:  'listenNumpad',
        PLAYER_TURN:    'playerTurn',
        READY_FOR_TURN: 'readyForTurn',
    },
};

// just what it says on the tin
function genSidesFromDeltas(rxyp) {
    // index for sideDirs
    let aIdx = 0;
    // holds depaired direction object
    let adp = null;
    // holds referenced dir from sideDirs[aIdx]
    let aDir = '';
    let sideObj = {};
    let sideDirs = ['N', 'E', 'S', 'W'];
    let dDeltas = ARL.BASE.RefData.dirDeltas;
    for (aIdx = 0; aIdx < sideDirs.length; aIdx += 1) {
        aDir = sideDirs[aIdx];
        adp = {
            x: parseInt(rxyp.split(',')[0]),
            y: parseInt(rxyp.split(',')[1]),
        };
        switch (aDir) {
            case 'N':
                if (adp.y === 0) {
                    sideObj.N = false;
                } else {
                    adp.x += dDeltas[aDir].x;
                    adp.y += dDeltas[aDir].y;
                    sideObj.N = '' + adp.x.toString() + ',' + adp.y.toString();
                }
                break;
            case 'E':
                if (adp.x >= (ARL.BASE.RefData.mapSize.xw - 1)) {
                    sideObj.E = false;
                } else {
                    adp.x += dDeltas[aDir].x;
                    adp.y += dDeltas[aDir].y;
                    sideObj.E = '' + adp.x.toString() + ',' + adp.y.toString();
                }
                break;
            case 'S':
                if (adp.y >= (ARL.BASE.RefData.mapSize.yh - 1)) {
                    sideObj.S = false;
                } else {
                    adp.x += dDeltas[aDir].x;
                    adp.y += dDeltas[aDir].y;
                    sideObj.S = '' + adp.x.toString() + ',' + adp.y.toString();
                }
                break;
            case 'W':
                if (adp.x === 0) {
                    sideObj.W = false;
                } else {
                    adp.x += dDeltas[aDir].x;
                    adp.y += dDeltas[aDir].y;
                    sideObj.W = '' + adp.x.toString() + ',' + adp.y.toString();
                }
                break;
        }
    }
    return sideObj;
}

// generate all the locRef strings as 'x,y' pairs
let dx = 0;
let dy = 0;
let xyp = null;
for (dy = 0; dy < ARL.BASE.RefData.mapSize.yh; dy += 1) {
    for (dx = 0; dx < ARL.BASE.RefData.mapSize.xw; dx += 1) {
        xyp = '' + dx.toString() + ',' + dy.toString();
        // push to allLocs, check
        ARL.BASE.RefData.allLocs.push(xyp);
        // push to physLocs, check
        ARL.BASE.RefData.physLocs.push(xyp);
        // push to viewLocs, check
        ARL.BASE.RefData.viewLocs.push(xyp);
        // add to physData, check
        ARL.BASE.RefData.physData[xyp] = {
            // string
            locXY: null,
            // integer
            aBody: false,
            aTerrain: 'wall',
        };
        ARL.BASE.RefData.physData[xyp].locXY = xyp;
        // add to viewElems, check
        ARL.BASE.RefData.viewElems[xyp] = {
            vElem: document.createElement('code'),
            vText: document.createTextNode('#'),
        };
        // assign text node to element
        ARL.BASE.RefData.viewElems[xyp].vElem.appendChild(
            ARL.BASE.RefData.viewElems[xyp].vText);
    }
    xyp = '' + ARL.BASE.RefData.mapSize.xw.toString() + ',' + dy.toString();
    // push to allLocs, check
    ARL.BASE.RefData.allLocs.push(xyp);
    // do NOT push to physLocs
    // push to viewLocs, check
    ARL.BASE.RefData.viewLocs.push(xyp);
    // do NOT add to physData
    // add to viewElems, check
    ARL.BASE.RefData.viewElems[xyp] = {
        vElem: document.createElement('br'),
        vText: false
    };
    // push to lineEnds, check
    ARL.BASE.RefData.lineEnds.push(xyp);
}

// build the siderefs for those locs
let pLocs = ARL.BASE.RefData.physLocs.slice();
let myLoc = null;
while (pLocs.length) {
    myLoc = pLocs.shift();
    ARL.BASE.RefData.sideRefs[myLoc] = genSidesFromDeltas(myLoc);
}




/*
 *
 *
 *
 * Courtesy Spaces
 *
 *
 *
 */