// ARL.View
// For your draws

ARL.View = function () {
    this.viewLoop = null;
    
    this.init();
};

/*
ARL.View.prototype.
*/

// Consider maybe using a table instead of just loose code elems? just sayin

/*
ARL.View.prototype.swapPanes = function () {
    this.preopt.classList.add('hidden');
    this.opt.className = '';
    return this.startGame();
};
*/

ARL.View.prototype.init = function () {
    let viewLocs = GCON('VIEW_LOCS').slice();
    let physLocs = GCON('PHYS_LOCS').slice();
    //let lineEnds = GCON('LINE_ENDS').slice();
    let viewMap = {};
    let curLoc = null;
    let curLocXY = null;
    //let mapPanel = SIG('byId', 'map_panel');
    let mapCanvas = SIG('byId', 'map_canvas');
    mapCanvas.getContext('2d').fillStyle = 'lightgreen';
    mapCanvas.getContext('2d').fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    
    // so first we create the VIEW_MAP
    while (viewLocs.length > 0) {
        // order is irrelevant, but I like to do it all by index ascending
        curLoc = viewLocs.shift();
        curLocXY = curLoc.split(',');
        /*
        if (physLocs.indexOf(curLoc) !== -1) {
            viewMap[curLoc] = {
                vElem: document.createElement('code'),
                vText: document.createTextNode('?'),
            };
            // don't forget to attach the content node to the visible node
            viewMap[curLoc].vElem.appendChild(viewMap[curLoc].vText);
        }
        else if (lineEnds.indexOf(curLoc) !== -1) {
            viewMap[curLoc] = {
                vElem: document.createElement('br'),
                vText: false,
            };
        }
        */
        viewMap[curLoc] = {
            vElem: {
                eOriginX: parseInt(curLocXY[0]),
                eOriginY: parseInt(curLocXY[1]),
            },
            vGlyph: '#',
            vKnown: false,
            // false should be default, enabled true for testing
            // vKnown: true,
            //vVisible: false,
            vColorFG: 'lightgray',
            //vColorBG: '#384148',
            vColorBG: 'black',
        };
    }
    SCON('VIEW_MAP', viewMap);
    curLoc = null;
    
    /*
    // then we draw the VIEW_MAP to the map panel
    // slice off another copy of VIEW_LOCS
    viewLocs = GCON('VIEW_LOCS').slice();
    while (viewLocs.length > 0) {
        // order is ABSOLUTELY IMPORTANT here.
        curLoc = viewLocs.shift();
        mapPanel.appendChild(GCON('VIEW_MAP')[curLoc].vElem);
    }
    */
    
    // then we create our DIRTY_LOCS array
    SCON('DIRTY_LOCS', ['all']);
    SCON('DIRTY_LOAD', []);
    
    // then we build our view loop
    SCON('READY_TO_DRAW', true);
    this.viewLoop = new ARL.Loop(function () {
        return SIG('drawPhysMap');
    }, GCON('LOOP_DELAY'));
    
    // then we do our first map draw so we're not just looking at nothing!
    //SIG('updateVisibility')
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
                    //GCON('VIEW_MAP')[curLoc].vElem.textContent = physCurFloor[curLoc].aGlyph;
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
        viewTarget.vColorBG = 'lightgray';
        viewTarget.vColorFG = 'black';
    } else {
        viewTarget.vColorBG = 'khaki';
        viewTarget.vColorFG = 'black';
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



/*
*
*
* Courtesy Spaces
*
*
*/