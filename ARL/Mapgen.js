// ARL.Mapgen
// For generating floor layouts of varying complexity

ARL.Mapgen = function () {};

/*
ARL.Mapgen.prototype.
*/

// updated, should be good
ARL.Mapgen.prototype.getNodeSides = function (params) {
    let [aLoc, gridSideRefs] = params;
    let allSides = {};
    let allDirs = GCON('ALL_DIRS').slice();
    let aDir = null;
    while (allDirs.length) {
        aDir = allDirs.shift();
        allSides[aDir] = gridSideRefs[aLoc][aDir];
    }
    return allSides;
};

// updated, should be good
ARL.Mapgen.prototype.compareNodeSides = function (params) {
    let [aLayout, bLayout, aDir] = params;
    //console.log("compareNodeSides: " + aLayout + " & " + bLayout);
    let aLay = aLayout.split('');
    let bLay = bLayout.split('');
    let aIdx = GCON('ALL_DIRS').indexOf(aDir);
    let bIdx = GCON('ALL_DIRS').indexOf(GCON('OPPOSING_DIRS')[aDir]);
    if ((aLay[aIdx] === '0') && (bLay[bIdx] === '0')) {
        return true;
    } else {
        return false;
    }
};

// updated, should be good
ARL.Mapgen.prototype.isNodeLayoutSideOpen = function (params) {
    let [aLayout, aDir] = params;
    //console.log("isSideOpen: " + aLayout);
    let aLay = aLayout.split('');
    let aIdx = GCON('ALL_DIRS').indexOf(aDir);
    if (aLay[aIdx] === '0') {
        return true;
    } else {
        return false;
    }
};

// updated, should be good
ARL.Mapgen.prototype.getOpenEndSide = function (aLayout) {
    let allDirs = GCON('ALL_DIRS').slice();
    let aDir = null;
    while (allDirs.length) {
        aDir = allDirs.shift();
        if (SIG('isNodeLayoutSideOpen', [aLayout, aDir])) {
            return aDir;
        }
    }
};

// updated, should be good
ARL.Mapgen.prototype.getValidNodeSides = function (params) {
    let [aLoc, gridSideRefs] = params;
    //console.log("getValidNodeSides: " + aLoc);
    let allDirs = null;
    let finalSides = [];
    let locSides = null;
    let aSide = null;
    let layoutMap = GCON('LAYOUT_MAP');
    //let layoutMap = GCON
    //console.log("GRID_MAP[aLoc]: " + GRID_MAP[aLoc]);
    //console.log(GRID_MAP);

    allDirs = GCON('ALL_DIRS').slice();
    locSides = SIG('getNodeSides', [aLoc, gridSideRefs]);
    while (allDirs.length) {
        aSide = allDirs.shift();
        //console.log("A: locSides[aSide]: " + locSides[aSide]);
        if (locSides[aSide]) {
            //console.log("B: GRID_MAP[locSides[aSide]]: " + GRID_MAP[locSides[aSide]]);
            if (layoutMap[locSides[aSide]]) {
                //console.log("C: trying to compare sides");
                if (SIG('compareNodeSides', [layoutMap[aLoc], layoutMap[locSides[aSide]], aSide])) {
                    //finalSides[aSide] = 'open';
                    finalSides.push(aSide);
                } else {
                    //finalSides[aSide] = 'wall';
                }
            } else {
                if (SIG('isNodeLayoutSideOpen', [layoutMap[aLoc], aSide])) {
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

// updated, should be good
ARL.Mapgen.prototype.getValidNodeLayouts = function (params) {
    let [aLoc, lastLayout] = params;
    //console.log("getValidNodeLayouts: " + aLoc + " & " + lastLayout);
    // for this one, we take a loc with no layout
    // we calculate the possible layouts based on the transition
    // then we find the valid dirs and get a layout that contains the entry side at the very least
    let possibles = [];
    let validated = [];
    let aLasts = null;
    let aLayouts = null;
    let layoutMap = GCON('LAYOUT_MAP');
    let mapgenBase = GCON('MAPGEN_BASE');

    aLasts = mapgenBase.transitions[lastLayout].slice();
    while (aLasts.length) {
        aNext = aLasts.shift();
        aLayouts = mapgenBase.layouts[aNext].slice();
        while (aLayouts.length) {
            possibles.push(aLayouts.shift());
        }
    }

    let allDirs = GCON('ALL_DIRS').slice();
    let locSides = SIG('getNodeSides', aLoc);
    let validSides = {};
    let aDir = null;
    while (allDirs.length) {
        aDir = allDirs.shift();
        validSides[aDir] = null;
        //console.log("A. locSides[aDir]: " + locSides[aDir]);
        if (locSides[aDir]) {
            //console.log("B. GRID_MAP[locSides[aDir]]: " + GRID_MAP[locSides[aDir]]);
            if (layoutMap[locSides[aDir]]) {
                if (SIG('isNodeLayoutSideOpen', [layoutMap[locSides[aDir]], GCON('OPPOSING_DIRS')[aDir]])) {
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
        allDirs = GCON('ALL_DIRS').slice();
        while (allDirs.length) {
            aDir = allDirs.shift();
            aIdx = GCON('ALL_DIRS').indexOf(aDir);
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

// updated, should be good
ARL.Mapgen.prototype.getMapgenLayout = function (aLayout) {
    let layoutNames = GCON('MAPGEN_BASE').layoutTypes.slice();
    let lName = null;
    while (layoutNames.length) {
        lName = layoutNames.shift();
        if (GCON('MAPGEN_BASE').layouts[lName].indexOf(aLayout) != -1) {
            return lName;
        }
    }
};

// updated, should be good
ARL.Mapgen.prototype.generateRandomNodeLayout = function () {
    let layoutStr = '';
    layoutStr += SIG('aCoin').toString();
    layoutStr += SIG('aCoin').toString();
    layoutStr += SIG('aCoin').toString();
    layoutStr += SIG('aCoin').toString();
    return layoutStr;
};

// updated, should be good
ARL.Mapgen.prototype.convertNodeLayoutToSingleArray = function (layoutArr) {
    return layoutArr.slice().join('').split('');
};

// updated, should be good
ARL.Mapgen.prototype.remapNodeLayoutToNodeMap = function (params) {
    let [nodeStr, layoutBase] = params;
    let mapgenBase = GCON('MAPGEN_BASE');
    let baseLayout = convertNodeLayoutToSingleArray(mapgenBase.nodeLayouts[nodeStr]);

    let nodeLocs = layoutBase.nodeLocs.slice();
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
};

// updated, should be good
ARL.Mapgen.prototype.expandLayoutMapNodes = function (params) {
    let [gFlag, layoutBase] = params;
    let gridMap = {};
    let gridLocs = layoutBase.gridLocs.slice();
    let aLoc = null;
    let nodeStr = null;
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        if (gFlag) {
            nodeStr = GCON('LAYOUT_MAP')[aLoc];
        } else {
            // without gFlag = true, the map is generated TOTALLY randomly without validation.
            // this will probably break if you try it.
            nodeStr = SIG('generateRandomNodeLayout');
            if (SIG('aCoin') && SIG('aCoin')) {
                nodeStr = "0000";
            }
            GCON('LAYOUT_MAP')[aLoc] = nodeStr;
        }
        gridMap[aLoc] = SIG('remapNodeLayoutToNodeMap', [nodeStr, layoutBase]);
    }
    return gridMap;
};

// updated, should be good
ARL.Mapgen.prototype.mapLayoutMapToFinishedLayout = function (params) {
    let [floorMap, gridLoc, nodeMap, layoutBase] = params;
    let splitGridLoc = gridLoc.split(',');
    let gLocX = parseInt(splitGridLoc[0]);
    let gLocY = parseInt(splitGridLoc[1]);
    let dX = gLocX * layoutBase.nodeSize.nWidth;
    let dY = gLocY * layoutBase.nodeSize.nHeight;
    let nodeLocs = layoutBase.nodeLocs.slice();
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
};

// updated, should be good
ARL.Mapgen.prototype.mapFinishedLayoutToFloor = function (params) {
    let [layoutType, floorName] = params;
    let floorMap = {};
    let layoutMap = SIG('expandLayoutMapNodes', [true, GCON('LAYOUT_BASE')[layoutType]]);
    let physMap = GCON('PHYS_MAP')[floorName];
    let gridLocs = GCON('LAYOUT_BASE')[layoutType].gridLocs.slice();
    let aLoc = null;
    let terrainBase = GCON('TERRAIN_BASE');
    let terrainList = null;
    let tTerrain = null;
    
    // this first loop should fill floorMap with terrain strings for every phys loc
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        SIG('mapLayoutMapToFinishedLayout', [floorMap, aLoc, layoutMap[aLoc], GCON('LAYOUT_BASE')[layoutType]]);
    }
    //console.log(floorMap);
    
    // this second loop will remap the terrain from floorMap to physMap
    let physLocs = GCON('PHYS_LOCS').slice();
    while (physLocs.length > 0) {
        aLoc = physLocs.shift();
        terrainList = GCON('TERRAIN_LIST').slice();
        while (terrainList.length > 0) {
            tTerrain = terrainList.shift();
            if (terrainBase[tTerrain].tGlyph === floorMap[aLoc]) {
                physMap[aLoc].aTerrain = tTerrain;
            }
        }
    }
    //console.log(PHYS_MAP);
    //updateMapGlyphs();
};

ARL.Mapgen.prototype.generateFloorLayout = function (layoutType) {
    // fuck
    // first wipe the layout map
    SCON('LAYOUT_MAP', {});
    let layoutMap = GCON('LAYOUT_MAP');
    let layoutBase = GCON('LAYOUT_BASE')[layoutType];
    let gridLocs = layoutBase.gridLocs.slice();
    let aLoc = null;
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        layoutMap[aLoc] = false;
    }
    let gridStr = layoutBase.gridSize.gWidth.toString() + 'x' + layoutBase.gridSize.gHeight.toString();
    let gridSideRefs = GCON('GRID_SIDE_REFS')[gridStr];

    let originLoc = null;
    let randLayout = null;
    let nextLoc = null;
    let sLoc = null;
    let sideDirs = null;
    let sDir = null;
    let allNodes = {};
    let lastLoc = null;
    let aLasts = null;
    let aLast = null;
    let nodePath = [];
    let usedNodes = [];
    let deadEnds = [];
    // pick a random node
    // random loc: GRID_LOCS[rand(GRID_LOCS.length)];
    // originLoc = '3,3';
    originLoc = SIG('randFromArray', layoutBase.gridLocs.slice());
    // pick a valid origin layout
    // randLayout = randFromArray(LAYOUTS.ends);
    // randLayout = '0000';
    randLayout = SIG('randFromArray', SIG('getValidNodeLayouts', [originLoc, "corridors"]));
    // save that on our layout map in progress
    layoutMap[originLoc] = randLayout;
    allNodes[originLoc] = {};
    // allNodes[originLoc].layout = "ends";
    // allNodes[originLoc].layout = "junction";
    allNodes[originLoc].layout = SIG('getMapgenLayout', randLayout); 
    if (allNodes[originLoc].layout === "ends") {
        deadEnds.push(originLoc);
    }
    allNodes[originLoc].lasts = [];
    lastLoc = originLoc;
    usedNodes.push(originLoc);
    // calculate the possible adjacent nodes we can move to
    // add those locs to an array of possible locs if they're not already in the array
    sideDirs = SIG('getValidNodeSides', [originLoc, gridSideRefs]);
    // this initial loop should only ever contain a single dir
    while (sideDirs.length) {
        sDir = sideDirs.shift();
        sLoc = gridSideRefs[originLoc][sDir];
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
        randLayout = null;
        randLayout = SIG('randFromArray', SIG('getValidNodeLayouts', [nextLoc, allNodes[lastLoc].layout]));
        // save that on the layout map in progress
        layoutMap[nextLoc] = randLayout;
        allNodes[nextLoc].layout = SIG('getMapgenLayout', randLayout);
        if (allNodes[nextLoc].layout === "ends" && deadEnds.indexOf(nextLoc) === -1) {
            deadEnds.push(nextLoc);
        }
        if (allNodes[nextLoc].lasts.indexOf(lastLoc) === -1) {
            allNodes[nextLoc].lasts.push(lastLoc);
        }
        usedNodes.push(nextLoc);
        // calculate the possible adjacent nodes we can move to
        if (allNodes[nextLoc].layout !== 'ends') {
            sideDirs = SIG('getValidNodeSides', [nextLoc, gridSideRefs]);
            // this initial loop should only ever contain a single dir
            while (sideDirs.length) {
                sDir = sideDirs.shift();
                sLoc = gridSideRefs[nextLoc][sDir];
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
    gridLocs = layoutBase.gridLocs.slice();
    aLoc = null;
    while (gridLocs.length) {
        aLoc = gridLocs.shift();
        if (!layoutMap[aLoc]) {
            layoutMap[aLoc] = '1111';
        }
    }

    // for ensuring a base level of complexity
    if (usedNodes.length < 30) {
        return SIG('generateFloorLayout', layoutType);
    }

    // if we pass the length test, then we fix the dead ends
    let dEnd = null;
    let dSide = null;
    let dSideLoc = null;
    // getOpenEndSide(aLayout)
    while (deadEnds.length) {
        dEnd = deadEnds.shift();
        dSide = SIG('getOpenEndSide', layoutMap[dEnd]);
        dSideLoc = gridSideRefs[dEnd][dSide];
        // replace the dead end layout with a room
        layoutMap[dEnd] = '000A';
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
};




/*
*
*
* Courtesy Spaces
*
*
*/