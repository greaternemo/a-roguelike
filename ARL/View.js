// ARL.View
// For your draws

ARL.View = function () {
    this.viewLoop = null;
    
    this.init();
};

/*
ARL.View.prototype.
*/

ARL.View.prototype.init = function () {
    let viewLocs = GCON('VIEW_LOCS').slice();
    let viewMap = {};
    let curLoc = null;
    let curLocXY = null;
    let mapCanvas = SIG('byId', 'map_canvas');
    mapCanvas.getContext('2d').fillStyle = 'lightgreen';
    mapCanvas.getContext('2d').fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    
    // so first we create the VIEW_MAP
    while (viewLocs.length > 0) {
        // order is irrelevant, but I like to do it all by index ascending
        curLoc = viewLocs.shift();
        curLocXY = curLoc.split(',');
        viewMap[curLoc] = {
            vElem: {
                eOriginX: parseInt(curLocXY[0]),
                eOriginY: parseInt(curLocXY[1]),
            },
            vGlyph: '#',
            // false should be default, enabled true for testing
            // vKnown: true,
            vKnown: false,
            // vVisible: false,
            vCursor: false,
            vColorFG: 'lightgray',
            // vColorBG: '#384148',
            vColorBG: 'black',
        };
    }
    SCON('VIEW_MAP', viewMap);
    curLoc = null;
        
    // then we create our DIRTY_LOCS array
    SCON('DIRTY_LOCS', ['all']);
    SCON('DIRTY_LOAD', []);
    
    // then we build our view loop
    SCON('READY_TO_DRAW', true);
    SCON('DEATH_CAM', false);
    this.viewLoop = new ARL.Loop(function () {
        return SIG('drawPhysMap');
    }, GCON('LOOP_DELAY'));
};

ARL.View.prototype.drawPhysMap = function () {
    // we don't draw unless we're ready
    if (GCON('READY_TO_DRAW')) {
        SCON('READY_TO_DRAW', false);
        // we don't draw unless we have something to draw
        if (GCON('DIRTY_LOCS').length > 0) {
            let dirtyLocs = GCON('DIRTY_LOCS');
            let mapCanvas = SIG('byId', 'map_canvas');
            let mapBuffer = SIG('byId', 'map_buffer');
            let physCurFloor = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')];
            let curLoc = null;
            while (dirtyLocs.length > 0) {
                // order is irrelevant, but I'm always going to shift to test for 'all'
                curLoc = dirtyLocs.shift();
                if (curLoc === 'all') {
                    // running handleTileUpdates on all phys locs does 2 things for us:
                    // 1: it updates the glyph on all tiles of the current floor, and
                    // 2: it autofills DIRTY_LOCS with every phys loc.
                    SIG('handleTileUpdates', GCON('PHYS_LOCS').slice());
                    SIG('pushDirtyLoad');
                    dirtyLocs = GCON('DIRTY_LOCS');
                }
                else {
                    SIG('handleCellUpdates', {
                        targetTile: physCurFloor[curLoc],
                        targetLoc: curLoc,
                    });
                    SIG('drawTileToMap', {
                        targetMap: mapBuffer,
                        targetTile: GCON('VIEW_MAP')[curLoc],
                        targetLoc: curLoc,
                    });
                }
            }
            mapCanvas.getContext('2d').drawImage(mapBuffer, 0, 0);
        }
        SCON('READY_TO_DRAW', true);
    }
};

ARL.View.prototype.handleCellUpdates = function (params) {
    let targetTile = params.targetTile;
    let targetLoc = params.targetLoc;
    let viewMap = GCON('VIEW_MAP');
    let viewTarget = viewMap[targetLoc];
    let glyphBase = GCON('GLYPH_BASE');
    
    // We're going to check the state of the physical tile
    // and translate that into the state of the view tile.
    viewTarget.vGlyph = targetTile.aGlyph;
    viewTarget.vKnown = targetTile.aKnown;
    
    // If we don't know what the tile even is, we straight up BAIL
    if (viewTarget.vKnown === false) {
        viewTarget.vColorBG = 'black';
        viewTarget.vColorFG = 'black';
    }
    else if (targetTile.aVisible === false) {
        viewTarget.vColorBG = 'black';
        viewTarget.vColorFG = 'darkgray';
    } else {
        //viewTarget.vColorBG = 'khaki';
        //viewTarget.vColorBG = glyphBase[targetTile.aGlyph].gColorBG;
        viewTarget.vColorBG = glyphBase[GCON('TERRAIN_BASE')[targetTile.aTerrain].tGlyph].gColorBG;
        viewTarget.vColorFG = glyphBase[targetTile.aGlyph].gColorFG;
    }
    
    // This will need to be significantly refactored later.
};

ARL.View.prototype.drawTileToMap = function (params) {
    let targetMap = params.targetMap.getContext('2d');
    let targetTile = params.targetTile;
    let targetLoc = params.targetLoc;
    let viewBase = GCON('VIEW_BASE');
    let locX = parseInt(targetLoc.split(',')[0]);
    let locY = parseInt(targetLoc.split(',')[1]);
    // We start our draw at the top left.
    let drawOrigin = {
        oX: null,
        oY: null,
    };
    // We start our text write at the bottom left.
    let textOrigin = {
        oX: null,
        oY: null,
    };
    
    drawOrigin.oX = (viewBase.cellSize.cWidth * locX);
    drawOrigin.oY = (viewBase.cellSize.cHeight * locY);
    textOrigin.oX = viewBase.cellOffset.cLeft + (viewBase.cellSize.cWidth * locX);
    textOrigin.oY = (viewBase.cellSize.cHeight * locY) + viewBase.cellSize.cHeight;
    
    // We always wipe the zone before redrawing.
    targetMap.fillStyle = 'black';
    targetMap.fillRect(
        drawOrigin.oX, 
        drawOrigin.oY, 
        viewBase.cellSize.cWidth, 
        viewBase.cellSize.cHeight
    );
    
    // We always fill the BG color
    targetMap.fillStyle = targetTile.vColorBG;
    targetMap.fillRect(
        drawOrigin.oX, 
        drawOrigin.oY, 
        viewBase.cellSize.cWidth, 
        viewBase.cellSize.cHeight
    );
    
    // We only fill the FG color and text if the tile is known
    if (targetTile.vKnown === true) {
        targetMap.font = '16px monospace';
        targetMap.textBaseline = 'bottom';
        targetMap.fillStyle = targetTile.vColorFG;
        targetMap.fillText(
            targetTile.vGlyph,
            textOrigin.oX,
            textOrigin.oY
        );
    }
    
    // We only draw the 'cursor' if it's there and always last if it is
    if (targetTile.vCursor === true) {
        targetMap.lineWidth = 2;
        targetMap.strokeStyle = 'limegreen';
        targetMap.strokeRect(
            drawOrigin.oX,
            drawOrigin.oY,
            viewBase.cellSize.cWidth,
            viewBase.cellSize.cHeight
        );
    }
    
    // This will also need refactoring later to use more config data and less hard-coding.
};

ARL.View.prototype.addToDirtyLoad = function (params) {
    // params should always be an array of locs, even if it's just one
    let aLoc = null;
    let dirtyLoad = GCON('DIRTY_LOAD');
    while (params.length > 0) {
        aLoc = params.shift();
        if (dirtyLoad.indexOf(aLoc) === -1) {
            dirtyLoad.push(aLoc);
        }
    }
};

ARL.View.prototype.pushDirtyLoad = function () {
    let dirtyLoad = GCON('DIRTY_LOAD');
    let dirtyLocs = GCON('DIRTY_LOCS');
    while (dirtyLoad.length > 0) {
        dirtyLocs.push(dirtyLoad.shift());
    }
};

ARL.View.prototype.addCursorAtLoc = function (aLoc) {
    // I'm not going to validate this input because I should be verifying it prior
    SCON('CURSOR_LOC', aLoc);
    // I can probably rig this up to auto-update the VIEW_MAP just by setting the CURSOR_LOC
    // I'll mark that TODO
    GCON('VIEW_MAP')[aLoc].vCursor = true;
    if (GCON('DIRTY_LOCS').indexOf(aLoc) === -1) {
        GCON('DIRTY_LOCS').push(aLoc);
    }
};

ARL.View.prototype.delCursorAtLoc = function (aLoc) {
    GCON('VIEW_MAP')[aLoc].vCursor = false;
    // We check this here so we don't overwrite the currect CURSOR_LOC if we've already set it
    if (GCON('CURSOR_LOC') === aLoc) {
        SCON('CURSOR_LOC', false);
    }
    let plusLocs = SIG('getPlusForLoc', aLoc);
    let thisLoc = null;
    while (plusLocs.length > 0) {
        thisLoc = plusLocs.shift();
        if (GCON('DIRTY_LOCS').indexOf(thisLoc) === -1) {
            GCON('DIRTY_LOCS').push(thisLoc);
        }
    }
};

ARL.View.prototype.tryToMoveCursorInDir = function (aDir) {
    // Look, we're going to keep this simple right now, and that means it'll be rigid.
    // This will probably need to be refactored at some point as I find more cursor uses, idk
    let validLocs = new Set();
    let playerLoc = GCON('PLAYER_MOB').mPosition.pLocXY;
    let allDirs = GCON('ALL_DIRS').slice();
    let thisDir = null;
    let destLoc = null;
    
    // We build a set of the player's current loc and the 4 adjacent cardinal locs
    // If the destination loc is in that set, we move the cursor.
    validLocs.add(playerLoc);
    while (allDirs.length > 0) {
        thisDir = allDirs.shift();
        validLocs.add(GCON('SIDE_REFS')[playerLoc][thisDir]);
    }
    destLoc = GCON('SIDE_REFS')[GCON('CURSOR_LOC')][aDir];
    if (validLocs.has(destLoc)) {
        SIG('moveCursorToLoc', destLoc);
    }
};

ARL.View.prototype.moveCursorToLoc = function (aLoc) {
    let oldLoc = GCON('CURSOR_LOC');
    SIG('delCursorAtLoc', oldLoc);
    SIG('addCursorAtLoc', aLoc);
};



/*
*
*
* Courtesy Spaces
*
*
*/