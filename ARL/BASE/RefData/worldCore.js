const worldCore = {
    /* IMPLEMENT THIS:
    allDirs: {
        2d: {
            card: ['N', 'E', 'S', 'W'],
            diag: ['NE', 'SE', 'SW', 'NW'],
            main: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        },
        3d: {
            // YIKES THIS COULD JUST BE A TON, WILL DEAL WITH LATER FOR GROUPINGS
        },
    },
    */
    // allDirs: ['N', 'E', 'S', 'W', 'U', 'D'],
    allDirs: ['N', 'E', 'S', 'W'],
    diagonalDirs: ['NE', 'SE', 'SW', 'NW'],
    all8Dirs: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
    opposingDirs: {
        N: 'S',
        NE: 'SW',
        E: 'W',
        SE: 'NW',
        S: 'N',
        SW: 'NE',
        W: 'E',
        NW: 'SE',
    },
    dirDeltas: {
        N: {
            x: 0,
            y: -1,
            // z: 0,
        },
        NE: {
            x: 1,
            y: -1,
        },
        E: {
            x: 1,
            y: 0,
            // z: 0,
        },
        SE: {
            x: 1,
            y: 1,
        },
        S: {
            x: 0,
            y: 1,
            // z: 0,
        },
        SW: {
            x: -1,
            y: 1,
        },
        W: {
            x: -1,
            y: 0,
            // z: 0,
        },
        NW: {
            x: -1,
            y: -1,
        },
        /*
        U: {
            x: 0,
            y: 0,
            // z: 1,
        },
        D: {
            x: 0,
            Y: 0,
            // z: -1,
        },
        */
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
};

ARL.BASE.RefData.allDirs = worldCore.allDirs;
ARL.BASE.RefData.diagonalDirs = worldCore.diagonalDirs;
ARL.BASE.RefData.all8Dirs = worldCore.all8Dirs;
ARL.BASE.RefData.opposingDirs = worldCore.opposingDirs;
ARL.BASE.RefData.dirDeltas = worldCore.dirDeltas;
ARL.BASE.RefData.allLocs = worldCore.allLocs;
ARL.BASE.RefData.physLocs = worldCore.physLocs;
ARL.BASE.RefData.viewLocs = worldCore.viewLocs;
ARL.BASE.RefData.sideRefs = worldCore.sideRefs;
ARL.BASE.RefData.gridSideRefs = worldCore.gridSideRefs;

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
    // boolean flag to confirm if each direction is valid/on the grid
    // defaults to true on each iteration of the loop
    let validDir = true;

    let sideObj = {};
    // let sideDirs = ['N', 'E', 'S', 'W'];
    let sideDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    let dDeltas = ARL.BASE.RefData.dirDeltas;
    for (aIdx = 0; aIdx < sideDirs.length; aIdx += 1) {
        validDir = true;
        aDir = sideDirs[aIdx];
        adp = {
            x: parseInt(rxyp.split(',')[0]),
            y: parseInt(rxyp.split(',')[1]),
        };
        switch (aDir) {
            case 'N':
                if (adp.y === 0) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
            case 'NE':
                if (adp.y === 0 && adp.x >= (aWidth - 1)) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
            case 'E':
                if (adp.x >= (aWidth - 1)) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
            case 'SE':
                if (adp.y >= (aHeight - 1) && adp.x >= (aWidth - 1)) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
            case 'S':
                if (adp.y >= (aHeight - 1)) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
            case 'SW':
                if (adp.y >= (aHeight - 1) && adp.x === 0) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
            case 'W':
                if (adp.x === 0) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
            case 'NW':
                if (adp.y === 0 && adp.x === 0) {
                    sideObj[aDir] = false;
                    validDir = false;
                }
                break;
        }
        if (validDir) {
            adp.x += dDeltas[aDir].x;
            adp.y += dDeltas[aDir].y;
            sideObj[aDir] = '' + adp.x.toString() + ',' + adp.y.toString();
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
 * Courtesy Spaces
 *
 *
 */