var VIEW_LOCS = [];
var PHYS_LOCS = [];
var GRID_LOCS = [];
var NODE_LOCS = [];
var LINE_ENDS = [];
var VIEW_MAP = {};
var PHYS_MAP = {};
var GRID_MAP = {};

var SIDE_REFS = {};
var GRID_SIDE_REFS = {};
var DIR_DELTAS = {
    N: {
        DX: 0,
        DY: -1,
    },
    E: {
        DX: 1,
        DY: 0,
    },
    S: {
        DX: 0,
        DY: 1,
    },
    W: {
        DX: -1,
        DY: 0,
    },
};
var ALL_DIRS = ['N', 'E', 'S', 'W'];
var OPPOSING_DIRS = {
    N: 'S',
    E: 'W',
    S: 'N',
    W: 'E',
};
var GLYPH_BASE = {
    '#': 'wall',
    '.': 'floor',
};
var TERRAIN_BASE = {
    floor: {
        tGlyph: '.',
        tSeeThru: true,
    },
    wall: {
        tGlyph: '#',
        tSeeThru: false,
    },
};
var THE_GUY = {
    gGlyph: '@',
    //gLoc: '7,7',
    gLoc: null,
    gFov: 5,
    gKnownLocs: [],
    gInViewLocs: [],
};

var mapSize = {
    mapWidth: 28,
    mapHeight: 28,
};
var MAP_GRID = {
    nodeW: 4,
    nodeH: 4,
    gridW: 7,
    gridH: 7,
};

var BASE_LAYOUT = [
    "#..#",
    "....",
    "....",
    "#..#",
];
var EMPTY_ROOM = [
    "....",
    "....",
    "....",
    "....",
];
var ALL_WALLS = [
    "####",
    "####",
    "####",
    "####",
];
var NODE_LAYOUTS = {
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
};
var LAYOUT_NAMES = [
    'corridors',
    'ends',
    'corners',
    'junctions',
];
var LAYOUTS = {
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
};
var TRANSITIONS = {
    corridors: ["corridors", "corners", "ends", "junctions"],
    ends: ["corridors", "corners", "junctions"],
    corners: ["corridors", "corners", "junctions", "ends"],
    junctions: ["corridors", "corners", "ends"],
};

var VIEW_ZONE = null;

/*
function buildMapGrid() {
    let dx = null;
    let dy = null;
    let newLoc = null;

    for (dy = 0; dy < MAP_GRID.gridH; dy += 1) {
        for (dx = 0; dx < MAP_GRID.gridW; dx += 1) {
            newLoc = dx.toString() + ',' + dy.toString();
            GRID_LOCS.push(newLoc);
        }
    }

    for (dy = 0; dy < MAP_GRID.nodeH; dy += 1) {
        for (dx = 0; dx < MAP_GRID.nodeW; dx += 1) {
            newLoc = dx.toString() + ',' + dy.toString();
            NODE_LOCS.push(newLoc);
        }
    }
    // console.log(GRID_LOCS);
    // console.log(NODE_LOCS);
};

function generateLocsAndMaps() {
    let dx = null;
    let dy = null;
    let newDir = null;

    for (dy = 0; dy < mapSize.mapHeight; dy += 1) {
        for (dx = 0; dx < mapSize.mapWidth; dx += 1) {
            newDir = dx.toString() + ',' + dy.toString();
            VIEW_LOCS.push(newDir);
            PHYS_LOCS.push(newDir);
        }
        newDir = mapSize.mapWidth.toString() + ',' + dy.toString();
        VIEW_LOCS.push(newDir);
        LINE_ENDS.push(newDir);
    }

    let tempList = null;
    let newLoc = null;
    let newElem = null;
    let newTile = null;

    VIEW_ZONE = document.getElementById('viewzone');

    tempList = VIEW_LOCS.slice();
    while (tempList.length > 0) {
        newLoc = tempList.shift();
        if (PHYS_LOCS.indexOf(newLoc) !== -1) {
            newElem = {
                vElem: document.createElement('code'),
                vText: document.createTextNode('.'),
            };
            newElem.vElem.appendChild(newElem.vText);
            VIEW_MAP[newLoc] = newElem;
            VIEW_ZONE.appendChild(VIEW_MAP[newLoc].vElem);
            VIEW_MAP[newLoc].vElem.className = '';
            VIEW_MAP[newLoc].vElem.classList.add('unknown_hidden');
            newTile = {
                // tTerrain: 'floor',
                tTerrain: 'wall',
                tVisible: true,
                tGlyph: '.',
                tBody: false,
            };
            if (THE_GUY.gLoc === newLoc) {
                newTile.tBody = THE_GUY;
            }
            PHYS_MAP[newLoc] = newTile;
        } else if (LINE_ENDS.indexOf(newLoc) !== -1) {
            newElem = {
                vElem: document.createElement('br'),
                vText: false,
            };
            VIEW_MAP[newLoc] = newElem;
            VIEW_ZONE.appendChild(VIEW_MAP[newLoc].vElem);
        }
    }
    buildMapGrid();
};

function genSideRefs() {
    let allDirs = null;
    let curDir = null;
    let physLocs = PHYS_LOCS.slice();
    let curLoc = null;
    let cX = null;
    let cY = null;
    let nX = null;
    let nY = null;
    while (physLocs.length > 0) {
        curLoc = physLocs.shift();
        allDirs = ALL_DIRS.slice();
        [cX, cY] = curLoc.split(',');
        SIDE_REFS[curLoc] = {};
        while (allDirs.length > 0) {
            curDir = allDirs.shift();
            nX = parseInt(cX) + DIR_DELTAS[curDir].DX;
            nY = parseInt(cY) + DIR_DELTAS[curDir].DY;
            if ((nX < 0 || nY < 0) ||
                (nX >= mapSize.mapWidth || nY >= mapSize.mapHeight)) {
                SIDE_REFS[curLoc][curDir] = false;
            } else {
                SIDE_REFS[curLoc][curDir] = nX.toString() + ',' + nY.toString();
            }
        }
    }

    allDirs = null;
    curDir = null;
    let gridLocs = GRID_LOCS.slice();
    curLoc = null;
    cX = null;
    cY = null;
    nX = null;
    nY = null;
    while (gridLocs.length) {
        curLoc = gridLocs.shift();
        allDirs = ALL_DIRS.slice();
        [cX, cY] = curLoc.split(',');
        GRID_SIDE_REFS[curLoc] = {};
        while (allDirs.length) {
            curDir = allDirs.shift();
            nX = parseInt(cX) + DIR_DELTAS[curDir].DX;
            nY = parseInt(cY) + DIR_DELTAS[curDir].DY;
            if ((nX < 0 || nY < 0) || (nX >= MAP_GRID.gridW || nY >= MAP_GRID.gridH)) {
                GRID_SIDE_REFS[curLoc][curDir] = false;
            } else {
                GRID_SIDE_REFS[curLoc][curDir] = nX.toString() + ',' + nY.toString();
            }
        }
    }
};
*/

function getNodeSides(aLoc) {
    let allSides = {};
    let allDirs = ALL_DIRS.slice();
    let aDir = null;
    while (allDirs.length) {
        aDir = allDirs.shift();
        allSides[aDir] = GRID_SIDE_REFS[aLoc][aDir];
    }
    return allSides;
};

function compareSides(aLayout, bLayout, aDir) {
    //console.log("compareSides: " + aLayout + " & " + bLayout);
    let aLay = aLayout.split('');
    let bLay = bLayout.split('');
    let aIdx = ALL_DIRS.indexOf(aDir);
    let bIdx = ALL_DIRS.indexOf(OPPOSING_DIRS[aDir]);
    if ((aLay[aIdx] === '0') && (bLay[bIdx] === '0')) {
        return true;
    } else {
        return false;
    }
};

function isSideOpen(aLayout, aDir) {
    //console.log("isSideOpen: " + aLayout);
    let aLay = aLayout.split('');
    let aIdx = ALL_DIRS.indexOf(aDir);
    if (aLay[aIdx] === '0') {
        return true;
    } else {
        return false;
    }
};

function getOpenEndSide(aLayout) {
    let allDirs = ALL_DIRS.slice();
    let aDir = null;
    while (allDirs.length) {
        aDir = allDirs.shift();
        if (isSideOpen(aLayout, aDir)) {
            return aDir;
        }
    }
}

function getValidNodeSides(aLoc) {
    //console.log("getValidNodeSides: " + aLoc);
    let allDirs = null;
    let finalSides = [];
    let locSides = null;
    let aSide = null;
    //console.log("GRID_MAP[aLoc]: " + GRID_MAP[aLoc]);
    //console.log(GRID_MAP);

    allDirs = ALL_DIRS.slice();
    locSides = getNodeSides(aLoc);
    while (allDirs.length) {
        aSide = allDirs.shift();
        //console.log("A: locSides[aSide]: " + locSides[aSide]);
        if (locSides[aSide]) {
            //console.log("B: GRID_MAP[locSides[aSide]]: " + GRID_MAP[locSides[aSide]]);
            if (GRID_MAP[locSides[aSide]]) {
                //console.log("C: trying to compare sides");
                if (compareSides(GRID_MAP[aLoc], GRID_MAP[locSides[aSide]], aSide)) {
                    //finalSides[aSide] = 'open';
                    finalSides.push(aSide);
                } else {
                    //finalSides[aSide] = 'wall';
                }
            } else {
                if (isSideOpen(GRID_MAP[aLoc], aSide)) {
                    //finalSides[aSide] = 'none';
                    finalSides.push(aSide);
                }
            }
        } else {
            //finalSides[aSide] = 'off';
        }
    }
    // should return an array of valid dirs for us to move to next
    return finalSides;
};

function getValidNodeLayouts(aLoc, lastLayout) {
    //console.log("getValidNodeLayouts: " + aLoc + " & " + lastLayout);
    // for this one, we take a loc with no layout
    // we calculate the possible layouts based on the transition
    // then we find the valid dirs and get a layout that contains the entry side at the very least
    let possibles = [];
    let validated = [];
    let aLasts = null;
    let aNext = null
    let aLayouts = null;
    let aLayoutStr = null;

    aLasts = TRANSITIONS[lastLayout].slice();
    while (aLasts.length) {
        aNext = aLasts.shift();
        aLayouts = LAYOUTS[aNext].slice();
        while (aLayouts.length) {
            possibles.push(aLayouts.shift());
        }
    }

    let allDirs = ALL_DIRS.slice();
    let locSides = getNodeSides(aLoc);
    let validSides = {};
    let aDir = null;
    while (allDirs.length) {
        aDir = allDirs.shift();
        validSides[aDir] = null;
        //console.log("A. locSides[aDir]: " + locSides[aDir]);
        if (locSides[aDir]) {
            //console.log("B. GRID_MAP[locSides[aDir]]: " + GRID_MAP[locSides[aDir]]);
            if (GRID_MAP[locSides[aDir]]) {
                if (isSideOpen(GRID_MAP[locSides[aDir]], OPPOSING_DIRS[aDir])) {
                    validSides[aDir] = 'open';
                } else {
                    validSides[aDir] = 'wall';
                }
            } else {
                validSides[aDir] = 'none';
            }
        } else {
            validSides[aDir] = 'off';
        }
    }

    // now we test the possibles
    let aPossible = null;
    let vSides = null;
    let vSide = null;
    allDirs = null;
    aDir = null;
    aIdx = null;
    let aOk = 0;
    while (possibles.length) {
        aOk = 0;
        aPossible = possibles.shift();
        vSides = aPossible.split('');
        allDirs = ALL_DIRS.slice();
        while (allDirs.length) {
            aDir = allDirs.shift();
            aIdx = ALL_DIRS.indexOf(aDir);
            vSide = vSides[aIdx];
            if (vSide === '1') {
                // a wall must meet another wall, an empty node, or the grid edge
                if (validSides[aDir] === 'wall' ||
                    validSides[aDir] === 'none' ||
                    validSides[aDir] === 'off') {
                    aOk += 1;
                }
            } else if (vSide === '0') {
                // an opening must meet another opening or an empty node
                if (validSides[aDir] === 'open' ||
                    validSides[aDir] === 'none') {
                    aOk += 1;
                }
            }
        }
        if (aOk === 4) {
            validated.push(aPossible);
        }
    }

    //console.log("returning validated for " + aLoc + ": " + validated);
    return validated;
};

function getLayoutType(aLayout) {
    let layoutNames = LAYOUT_NAMES.slice();
    let lName = null;
    while (layoutNames.length) {
        lName = layoutNames.shift();
        if (LAYOUTS[lName].indexOf(aLayout) != -1) {
            return lName;
        }
    }
};

/////

/*
function updateGlyph(aLoc) {
    if (PHYS_MAP[aLoc].tBody !== false) {
        PHYS_MAP[aLoc].tGlyph = PHYS_MAP[aLoc].tBody.gGlyph;
    } else {
        PHYS_MAP[aLoc].tGlyph = TERRAIN_BASE[PHYS_MAP[aLoc].tTerrain].tGlyph;
    }
    VIEW_MAP[aLoc].vElem.textContent = PHYS_MAP[aLoc].tGlyph;
};

function updateMapGlyphs() {
    let physLocs = PHYS_LOCS.slice();
    let curLoc = null;
    while (physLocs.length > 0) {
        curLoc = physLocs.shift();
        //console.log(curLoc);
        updateGlyph(curLoc);
    }
};

function enpair(anX, aY) {
    let pair = anX.toString() + ',' + aY.toString();
    return pair;
};

// returns a random integer between 0 and max-1
function rand(max) {
    return Math.floor(Math.random() * max);
};

// Separate random number function for die rolls
function aDie(sides) {
    return rand(sides) + 1;
};

function aCoin() {
    return aDie(2) - 1;
};

function d2() {
    return aDie(2);
};

function randFromArray(aArr) {
    return aArr[rand(aArr.length)];
};
*/

function randomNodeLayout() {
    let layoutStr = '';
    layoutStr += aCoin().toString();
    layoutStr += aCoin().toString();
    layoutStr += aCoin().toString();
    layoutStr += aCoin().toString();
    return layoutStr;
};

function convertLayout(layoutArr) {
    return layoutArr.slice().join('').split('');
};

function mapRoomToNode(nodeStr) {
    /*
  let baseLayout = BASE_LAYOUT.slice().join('').split('');
  if (aCoin()) {
  	baseLayout = ALL_WALLS.slice().join('').split('');
  }
  */
    let baseLayout = convertLayout(NODE_LAYOUTS[nodeStr]);

    let nodeLocs = NODE_LOCS.slice();
    if (baseLayout.length != nodeLocs.length) {
        console.log("baseLayout length != nodeLocs length");
    }

    let nodeMap = {};
    let aGlyph = null;
    let aLoc = null;
    while (nodeLocs.length) {
        aGlyph = baseLayout.shift();
        aLoc = nodeLocs.shift();
        nodeMap[aLoc] = aGlyph;
    }
    // console.log(nodeMap);
    return nodeMap;
}

function mapNodesToGrid(gFlag) {
    let gridMap = {};
    let gridLocs = GRID_LOCS.slice();
    let aLoc = null;
    let nodeStr = null
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        if (gFlag) {
            nodeStr = GRID_MAP[aLoc];
        } else {
            nodeStr = randomNodeLayout();
            if (aCoin() && aCoin()) {
                nodeStr = "0000";
            }
            GRID_MAP[aLoc] = nodeStr;
        }
        gridMap[aLoc] = mapRoomToNode(nodeStr);
    }
    return gridMap;
}

function translateNodeToFloor(floorMap, gridLoc, nodeMap) {
    let splitGridLoc = gridLoc.split(',');
    let gLocX = parseInt(splitGridLoc[0]);
    let gLocY = parseInt(splitGridLoc[1]);
    let dX = gLocX * MAP_GRID.nodeW;
    let dY = gLocY * MAP_GRID.nodeH;
    let nodeLocs = NODE_LOCS.slice();
    let aLoc = null;
    let bLoc = null;
    let nLoc = null;
    let nX = null;
    let nY = null;
    while (nodeLocs.length) {
        aLoc = nodeLocs.shift();
        bLoc = aLoc.split(',');
        nX = parseInt(bLoc[0]) + dX;
        nY = parseInt(bLoc[1]) + dY;
        nLoc = '' + nX + ',' + nY;
        floorMap[nLoc] = nodeMap[aLoc];
    }
}

function mapGridToFloor() {
    let floorMap = {};
    let gridMap = mapNodesToGrid(true);
    let gridLocs = GRID_LOCS.slice();
    let aLoc = null;
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        translateNodeToFloor(floorMap, aLoc, gridMap[aLoc]);
    }
    //console.log(floorMap);
    let physLocs = PHYS_LOCS.slice();
    while (physLocs.length) {
        aLoc = physLocs.shift();
        PHYS_MAP[aLoc].tTerrain = GLYPH_BASE[floorMap[aLoc]];
    }
    //console.log(PHYS_MAP);
    updateMapGlyphs();

}

function generateFloorLayout() {
    // fuck
    // first wipe the gridmap
    let gridLocs = GRID_LOCS.slice();
    let aLoc = null;
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        GRID_MAP[aLoc] = false;
    }

    let originLoc = null;
    let randLayout = null;
    let nextLoc = null;
    let sideLocs = null;
    let sLoc = null;
    let sideDirs = null;
    let sDir = null;
    let allNodes = {};
    let lastLoc = null;
    let aLasts = null;
    let aLast = null;
    let hadNext = null;
    let nodePath = [];
    let usedNodes = [];
    let deadEnds = [];
    // pick a random node
    // random loc: GRID_LOCS[rand(GRID_LOCS.length)];
    // originLoc = '3,3';
    originLoc = randFromArray(GRID_LOCS.slice());
    // pick a valid origin layout
    // randLayout = randFromArray(LAYOUTS.ends);
    // randLayout = '0000';
    randLayout = randFromArray(getValidNodeLayouts(originLoc, "corridors"));
    // save that on our grid map in progress
    GRID_MAP[originLoc] = randLayout;
    allNodes[originLoc] = {};
    // allNodes[originLoc].layout = "ends";
    // allNodes[originLoc].layout = "junction";
    allNodes[originLoc].layout = getLayoutType(randLayout);
    if (allNodes[originLoc].layout === "ends") {
        deadEnds.push(originLoc);
    }
    allNodes[originLoc].lasts = [];
    lastLoc = originLoc;
    usedNodes.push(originLoc);
    // calculate the possible adjacent nodes we can move to
    // add those locs to an array of possible locs if they're not already in the array
    sideDirs = getValidNodeSides(originLoc);
    // this initial loop should only ever contain a single dir
    while (sideDirs.length) {
        sDir = sideDirs.shift();
        sLoc = GRID_SIDE_REFS[originLoc][sDir];
        allNodes[sLoc] = {};
        allNodes[sLoc].layout = null;
        allNodes[sLoc].lasts = [];
        // later on, this should be wrapped in a conditional that tests against indexOf
        allNodes[sLoc].lasts.push(originLoc);
        // so should this
        nodePath.push(sLoc);
    }
    while (nodePath.length) {
        // move to the next loc in the array
        nextLoc = nodePath.shift();
        // be sure you properly assign the lastLoc
        aLasts = allNodes[nextLoc].lasts.slice();
        while (aLasts.length) {
            aLast = aLasts.shift();
            if (usedNodes.indexOf(aLast) != -1) {
                lastLoc = aLast;
                aLasts = [];
            }
        }
        // pick a valid node layout
        randLayout = null
        randLayout = randFromArray(getValidNodeLayouts(nextLoc, allNodes[lastLoc].layout));
        // save that on the grid map in progress
        GRID_MAP[nextLoc] = randLayout;
        allNodes[nextLoc].layout = getLayoutType(randLayout);
        if (allNodes[nextLoc].layout === "ends" && deadEnds.indexOf(nextLoc) === -1) {
            deadEnds.push(nextLoc);
        }
        if (allNodes[nextLoc].lasts.indexOf(lastLoc) === -1) {
            allNodes[nextLoc].lasts.push(lastLoc);
        }
        usedNodes.push(nextLoc);
        // calculate the possible adjacent nodes we can move to
        if (allNodes[nextLoc].layout !== 'ends') {
            sideDirs = getValidNodeSides(nextLoc);
            // this initial loop should only ever contain a single dir
            while (sideDirs.length) {
                sDir = sideDirs.shift();
                sLoc = GRID_SIDE_REFS[nextLoc][sDir];
                if (Object.keys(allNodes).indexOf(sLoc) === -1) {
                    allNodes[sLoc] = {};
                    allNodes[sLoc].layout = null;
                    allNodes[sLoc].lasts = [];
                }
                if (nodePath.indexOf(sLoc) === -1 && usedNodes.indexOf(sLoc) === -1) {
                    nodePath.push(sLoc);
                }
                if (allNodes[sLoc].lasts.indexOf(nextLoc) === -1) {
                    allNodes[sLoc].lasts.push(nextLoc);
                }
            }
        }
        // if none: this is a dead end
        // if yes: add them to the array if they're not already there
    }
    // END LOOP:
    // when all your paths have dead ended, you have your floor layout.

    // final pass
    // fills in any untouched nodes with walls
    gridLocs = GRID_LOCS.slice();
    aLoc = null;
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        if (!GRID_MAP[aLoc]) {
            GRID_MAP[aLoc] = '1111';
        }
    }

    // for ensuring a base level of complexity
    if (usedNodes.length < 30) {
        return generateFloorLayout();
    }

    // if we pass the length test, then we fix the dead ends
    let dEnd = null;
    let dSide = null;
    let dSideLoc = null;
    // getOpenEndSide(aLayout)
    while (deadEnds.length) {
        dEnd = deadEnds.shift();
        dSide = getOpenEndSide(GRID_MAP[dEnd]);
        dSideLoc = GRID_SIDE_REFS[dEnd][dSide];
        // replace the dead end layout with a room
        GRID_MAP[dEnd] = '000A';
        // replace the attached edge with a door
    }

    // for AHQ map gen:
    // we start with a corridor with one open side
    // we follow that with 2 straight corridors (1010 or 0101)
    // we follow that with a T junction
    // for each side of the T, we add 1-2? straight corridors
    // after those corridors, we choose a T junction, a corner, or a dead end
    // once we're out of corridors, we add rooms
    // TODO

    // validation:
    // for a given tile, get the dir to each side
    // if the sideref is not undef, get that loc
    // for the loc to each dir, see if there is already a room in that node
    // if there is, see if there is a wall on the opposing dir
    // if there is a wall, note a 1 for that dir
    // if there is no wall, note a 0 for that dir
}


/*
function buildAllOfIt() {
    generateLocsAndMaps();
    genSideRefs();
    updateMapGlyphs();
    generateFloorLayout();
    mapGridToFloor();
}
*/

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */