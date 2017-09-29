// ARL.BASE
// Template and reference data

ARL.BASE = {

    RefData: {

        loopDelay: (1000/30),
        
        // Flags
        listenNumpad: true,
        playerTurn: false,
        readyForTurn: false,

        // allDirs: ['N', 'E', 'S', 'W', 'U', 'D'],
        allDirs: ['N', 'E', 'S', 'W'],
        opposingDirs: {
            N: 'S',
            E: 'W',
            S: 'N',
            W: 'E',
        },
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

        // the loc strings that correspond to elems
        viewLocs: [],
        
        // keyed to loc strings
        // values should be objects with loc strings for each adjacent loc
        sideRefs: {},
        
        // keyed to strings representing grid sizes
        // keyed within each table by loc string
        gridSideRefs: {},
        
        // base data for our PHYS_MAP
        physBase: {
            mapSize: {
                mWidth: 30,
                mHeight: 30,
            },
            layoutSize: {
                lWidth: 28,
                lHeight: 28,
            },
            layoutOffset: {
                xOffset: 1,
                yOffset: 1,
            },
        },
        
        // base data for our VIEW_MAP
        viewBase: {
            mapSize: {
                mWidth: 30,
                mHeight: 30,
            },
            cellSize: {
                cWidth: 14,
                cHeight: 16,
            },
            cellOffset: {
                cLeft: 2,
            },
        },
        
        terrainList: [
            'floor',
            'wall',
        ],

        terrainBase: {
            floor: {
                tGlyph: '.',
                tSeeThru: true,
                tWalkable: true,
            },
            wall: {
                tGlyph: '#',
                tSeeThru: false,
                tWalkable: false,
            },
        },
        
        mobList: [
            'player',
            'gobbo',
        ],

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

        floorBase: {
            floor1: {
                stairsUp: false,
                stairsDown: 'floor2',
            },
            floor2: {
                stairsUp: 'floor1',
                stairsDown: false,
            }
        },
        
        layoutList: [
            'basic',
            'greatHall',
            'gobboctagon',
            'standard',
        ],
        
        layoutBase: {
            basic: {},
            greatHall: {},
            gobboctagon: {},
            standard: {
                gridSize: {
                    gWidth: 7,
                    gHeight: 7,
                },
                gridLocs: [],
                nodeSize: {
                    nWidth: 4,
                    nHeight: 4,
                },
                nodeLocs: [],
            },
        },
        
        mapgenBase: {
            baseLayout: [
                "#..#",
                "....",
                "....",
                "#..#",
            ],
            emptyLayout: [
                "....",
                "....",
                "....",
                "....",
            ],
            fullLayout: [
                "####",
                "####",
                "####",
                "####",
            ],
            nodeLayouts: {
                '000A': [
                    "....",
                    "....",
                    "....",
                    "....",
                ],
                '0000': [
                    "#..#",
                    "....",
                    "....",
                    "#..#",
                ],
                '0001': [
                    "#..#",
                    "#...",
                    "#...",
                    "#..#",
                ],
                '0010': [
                    "#..#",
                    "....",
                    "....",
                    "####",
                ],
                '0011': [
                    "#..#",
                    "#...",
                    "#...",
                    "####",
                ],
                '0100': [
                    "#..#",
                    "...#",
                    "...#",
                    "#..#",
                ],
                '0101': [
                    "#..#",
                    "#..#",
                    "#..#",
                    "#..#",
                ],
                '0110': [
                    "#..#",
                    "...#",
                    "...#",
                    "####",
                ],
                '0111': [
                    "#..#",
                    "#..#",
                    "#..#",
                    "####",
                ],
                '1000': [
                    "####",
                    "....",
                    "....",
                    "#..#",
                ],
                '1001': [
                    "####",
                    "#...",
                    "#...",
                    "#..#",
                ],
                '1010': [
                    "####",
                    "....",
                    "....",
                    "####",
                ],
                '1011': [
                    "####",
                    "#...",
                    "#...",
                    "####",
                ],
                '1100': [
                    "####",
                    "...#",
                    "...#",
                    "#..#",
                ],
                '1101': [
                    "####",
                    "#..#",
                    "#..#",
                    "#..#",
                ],
                '1110': [
                    "####",
                    "...#",
                    "...#",
                    "####",
                ],
                '1111': [
                    "####",
                    "####",
                    "####",
                    "####",
                ],
            },
            layoutTypes: [
                'corridors',
                'ends',
                'corners',
                'junctions',
            ],
            layouts: {
                corridors: [
                    "1010",
                    "0101",
                ],
                ends: [
                    "1110",
                    "0111",
                    "1011",
                    "1101",
                ],
                corners: [
                    "1001",
                    "1100",
                    "0110",
                    "0011",
                ],
                junctions: [
                    "1000",
                    "0100",
                    "0010",
                    "0001",
                ],
            },
            transitions: {
                corridors: ["corridors", "corners", "ends", "junctions"],
                ends: ["corridors", "corners", "junctions"],
                corners: ["corridors", "corners", "junctions", "ends"],
                junctions: ["corridors", "corners", "ends"],
            },
        },
    },
    
    Routes: {

        Action: [
                'handleCurrentTurn',
                'endCurrentTurn',
                'makeMobPassTheTurn',
                'moveMobNorth',
                'moveMobEast',
                'moveMobSouth',
                'moveMobWest',
                'movePlayerNorth',
                'movePlayerEast',
                'movePlayerSouth',
                'movePlayerWest',
                'useStairs',
                'tryToMoveMobInDir',
                'moveMobToLoc',
                'doAHit',
                'changeMobHPCur',
                'changeMobState',
                'changeMobStats',
                'wasMobKilled',
        ],
        Agent: [
                'compelMob',
                'compelPlayer',
                'compelGobbo',
        ],
        Fov: [
                // filler line
                'buildRings',
                'addArcToRange',
                'checkRangeForArc',
                'updateVisibility',
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
        Mapgen: [
                // filler line
                'getNodeSides',
                'compareNodeSides',
                'isNodeLayoutSideOpen',
                'getOpenEndSide',
                'getValidNodeSides',
                'getValidNodeLayouts',
                'getMapgenLayout',
                'generateRandomNodeLayout',
                'convertNodeLayoutToSingleArray',
                'remapNodeLayoutToNodeMap',
                'expandLayoutMapNodes',
                'mapLayoutMapToFinishedLayout',
                'mapFinishedLayoutToFloor',
                'generateFloorLayout',
        ],
        Narrator: [
                'narrate',
                'colorrate',
                'clearMsgPanel',
                'lineBreak',
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
                'whoseTurnIsIt',
        ],
        Util: [
                'rand',
                'aDie',
                'aCoin',
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
                'generateLocs',
                'fracSum',
                'fracDiff',
                'fracGreaterOf',
                'fracLesserOf',
                'fracEqualTo',
                'fracGreaterThan',
                'fracLesserThan',
                'fracGreaterOrEqual',
                'fracLesserOrEqual',
                'intGreaterOf',
                'intLesserOf',
        ],
        View: [
                'drawPhysMap',
                'handleCellUpdates',
                'drawTileToMap',
                'addToDirtyLoad',
                'pushDirtyLoad',
        ],
        World: [
                // filler line
                'generateBasicTile',
                'generateGridAndNodeLocs',
                'buildFloorData',
                'buildBasicFloorMap',
                'buildGreatHallFloorMap',
                'buildGobboctagonFloorMap',
                'populateFirstFloor',
                'populateFloor',
                'findAWalkableTile',
                'findRandomWalkableSide',
                'findWalkableSides',
                'isSideWalkable',
                'generatePlayer',
                'generateMobs',
                'generateMob',
                'mobDeath',
                'handleTileUpdates',
                'updateCurrentGlyph',
                'checkTileVisibility',
                
        ],
    },
    
    /*
    
    Constant naming conventions:
    
    dir: A direction. Includes cardinal directions and up/down.
    loc: A location, as coordinates. Generally a string in the form 'X,Y' or 'X,Y,Z'.
    map: An abstraction meant as a collection of generated and/or state data.
    
    <>_LIST: An array containing all the keys for the corresponding BASE table.
    <>_BASE: A table containing base data for object generation.
    <>_LOCS: An array containing all relevant locs for a specific map.
    <>_MAP: A table containing generated and/or state data
    
    */
    
    Constants: [
                // filler line
                'LOOP_DELAY',       // ro, float, standard loop delay in ms
                'ALL_DIRS',         // ro, array, all dirs as single character strings
                'OPPOSING_DIRS',    // ro, table, opposing cardinal dirs, keyed by dir
                'SIDE_DELTAS',      // ro, table, deltas for each dir
                'SIDE_REFS',        // ro, table, adjacent locs for each loc
                'GRID_SIDE_REFS',   // ro, table, tables of adjacent locs for each grid loc, keyed by grid dimensions

                'PHYS_BASE',        // ro, table, tables of phys map base data
                'PHYS_LOCS',        // ro, array, all representable physical locs
                'PHYS_MAP',         // rw, table, tables of phys locs, keyed by floor name

                'VIEW_BASE',        // ro, table, tables of view map base data
                'VIEW_LOCS',        // ro, array, all renderable map locs
                'VIEW_MAP',         // rw, table, view elements, keyed by view loc
                'DIRTY_LOCS',       // rw, array, view locs that need to be redrawn
                'DIRTY_LOAD',       // rw, array, view locs that need to be redrawn
                'READY_TO_DRAW',    // rw, bool, is the map ready to attempt a redraw

                'CURRENT_FLOOR',    // rw, string, name of the floor the player is on
                'FLOOR_LIST',       // ro, array, floor names as strings
                'FLOOR_BASE',       // ro, table, tables of floor base data, keyed by floor name
                'FLOOR_MAP',        // rw, table, tables of calculated floor data, keyed by floor name

                'LAYOUT_LIST',      // ro, array, map layout names as strings
                'LAYOUT_BASE',      // ro, table, tables of map layout data, keyed by floor name
                'LAYOUT_MAP',       // rw, table, contains floor layout data as it's being built

                'TERRAIN_LIST',     // ro, array, terrain types as strings
                'TERRAIN_BASE',     // ro, table, tables of terrain data, keyed by terrain name

                'MOB_LIST',         // ro, array, mob types as strings
                'MOB_BASE',         // ro, table, tables of mob data, keyed by mob type
                'ALL_MOBS',         // rw, array, eids for all mobs
                'CUR_MOB_IDX',      // rw, int, index of the mob whose turn it is in ALL_MOBS
                'PLAYER_MOB',       // rw, int, eid for the player mob

                'GAME_OVER',        // rw, bool, is the player dead and do we need to start a new game
                'INPUT_BUFFER',     // rw, array, signals waiting to be processed
                'LISTEN_NUMPAD',    // rw, bool, are we accepting numpad input
                'PLAYER_TURN',      // rw, bool, is it the player's turn
                'END_OF_TURN',      // rw, bool, is it time for end of turn cleanup
                'READY_FOR_TURN',   // rw, bool, has the last turn completed

    ],
    
    /*
    Additional details for Constants
    
    GRID_MAP was a table with values keyed to grid locs.
    The values in GRID_MAP are also tables.
    Each of those tables have node locs as the keys and the related phys locs as the values.
    GRID_MAP: {
        '0,0': {
            '0,0': '0,0',
            '1,0': '1,0',
            ...
        },
        '1,0': {
            '0,0': '10,0',
            '1,0': '11,0',
            '2,0': '12,0',
            ...
        },
        ...
    }
    
    */

    Schema: {
        // filler line
        LOOP_DELAY:     'loopDelay',
        ALL_DIRS:       'allDirs',
        OPPOSING_DIRS:  'opposingDirs',
        SIDE_DELTAS:    'dirDeltas',
        SIDE_REFS:      'sideRefs',
        GRID_SIDE_REFS: 'gridSideRefs',

        PHYS_BASE:      'physBase',
        PHYS_LOCS:      'physLocs',

        VIEW_BASE:      'viewBase',
        VIEW_LOCS:      'viewLocs',
        LINE_ENDS:      'lineEnds',

        FLOOR_LIST:     'floorList',
        FLOOR_BASE:     'floorBase',

        LAYOUT_LIST:    'layoutList',
        LAYOUT_BASE:    'layoutBase',

        TERRAIN_LIST:   'terrainList',
        TERRAIN_BASE:   'terrainBase',

        MOB_LIST:       'mobList',
        MOB_BASE:       'mobBase',

        LISTEN_NUMPAD:  'listenNumpad',
        PLAYER_TURN:    'playerTurn',
        READY_FOR_TURN: 'readyForTurn',
    },
};

function generateLocs(gInfo) {
    /*
    gInfo should be in this form:
        gInfo = {
            xMin: 0,
            xMax: 10,
            yMin: 0,
            yMax: 10,
        }
    */
    let newLocs = [];
    let dx = null;
    let dy = null;
    let xyp = null;
    for (dy = gInfo.yMin; dy < gInfo.yMax; dy += 1) {
        for (dx = gInfo.xMin; dx < gInfo.xMax; dx += 1) {
            xyp = '' + dx.toString() + ',' + dy.toString();
            newLocs.push(xyp);
        }
    }
    return newLocs;
}

// just what it says on the tin
function genSidesFromDeltas(rxyp, aWidth, aHeight) {
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
                if (adp.x >= (aWidth - 1)) {
                    sideObj.E = false;
                } else {
                    adp.x += dDeltas[aDir].x;
                    adp.y += dDeltas[aDir].y;
                    sideObj.E = '' + adp.x.toString() + ',' + adp.y.toString();
                }
                break;
            case 'S':
                if (adp.y >= (aHeight - 1)) {
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
// IMPORTANT!!!!!
// To keep the lists of locs consistent, we always generate them in the same order:
// The outer loop increments the Y value, the inner loop increments the X.
// Functionally, the list of locs this generates will always start at the top left
// and will go to the right through each row before continuing at the start of the
// next row down.
let dx = 0;
let dy = 0;
let xyp = null;
let rData = ARL.BASE.RefData;
for (dy = 0; dy < rData.viewBase.mapSize.mHeight; dy += 1) {
    for (dx = 0; dx < rData.viewBase.mapSize.mWidth; dx += 1) {
        xyp = '' + dx.toString() + ',' + dy.toString();
        // push to allLocs, check
        rData.allLocs.push(xyp);
        // push to physLocs, check
        rData.physLocs.push(xyp);
        // push to viewLocs, check
        rData.viewLocs.push(xyp);
    }
}

// build the siderefs for those locs
let mSize = rData.viewBase.mapSize;
let pLocs = rData.physLocs.slice();
let myLoc = null;
while (pLocs.length) {
    myLoc = pLocs.shift();
    rData.sideRefs[myLoc] = genSidesFromDeltas(myLoc, mSize.mWidth, mSize.mHeight);
}

let gSize = rData.layoutBase.standard.gridSize;
rData.layoutBase.standard.gridLocs = generateLocs({
    xMin: 0,
    xMax: gSize.gWidth,
    yMin: 0,
    yMax: gSize.gHeight,
});

let gStr = gSize.gWidth.toString() + 'x' + gSize.gHeight.toString();
rData.gridSideRefs[gStr] = {};
// This will populate GRID_SIDE_REFS['7x7']
let gRefs = rData.gridSideRefs[gStr];
let gLocs = rData.layoutBase.standard.gridLocs.slice();
myLoc = null;
while (gLocs.length) {
    myLoc = gLocs.shift();
    gRefs[myLoc] = genSidesFromDeltas(myLoc, gSize.gWidth, gSize.gHeight);
}

let nSize = rData.layoutBase.standard.nodeSize;
rData.layoutBase.standard.nodeLocs = generateLocs({
    xMin: 0,
    xMax: nSize.nWidth,
    yMin: 0,
    yMax: nSize.nHeight,
});




/*
 *
 *
 *
 * Courtesy Spaces
 *
 *
 *
 */