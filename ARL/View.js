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
    let lineEnds = GCON('LINE_ENDS').slice();
    let viewMap = {};
    let curLoc = null;
    let mapPanel = SIG('byId', 'map_panel');
    
    // so first we create the VIEW_MAP
    while (viewLocs.length > 0) {
        // order is irrelevant, but I like to do it all by index ascending
        curLoc = viewLocs.shift();
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
    }
    SCON('VIEW_MAP', viewMap);
    curLoc = null;
    
    // then we draw the VIEW_MAP to the map panel
    // slice off another copy of VIEW_LOCS
    viewLocs = GCON('VIEW_LOCS').slice();
    while (viewLocs.length > 0) {
        // order is ABSOLUTELY IMPORTANT here.
        curLoc = viewLocs.shift();
        mapPanel.appendChild(GCON('VIEW_MAP')[curLoc].vElem);
    }
    
    // then we create our DIRTY_LOCS array
    SCON('DIRTY_LOCS', ['all']);
    
    // then we build our view loop
    this.viewLoop = new ARL.Loop(function () {
        return SIG('drawPhysMap');
    }, GCON('LOOP_DELAY'));
};

ARL.View.prototype.drawPhysMap = function () {
    // we gon get drawn af
    let dirtyLocs = GCON('DIRTY_LOCS');
    let curLoc = null;
    let physCurFloor = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')];
    while (dirtyLocs.length > 0) {
        // order is irrelevant, but I'm always going to shift to test for 'all'
        curLoc = dirtyLocs.shift();
        if (curLoc === 'all') {
            // running handleTileUpdates on all phys locs does 2 things for us:
            // 1: it updates the glyph on all tiles of the current floor, and
            // 2: it autofills DIRTY_LOCS with every phys loc.
            SIG('handleTileUpdates', GCON('PHYS_LOCS').slice());
            dirtyLocs = GCON('DIRTY_LOCS');
        }
        else {
            GCON('VIEW_MAP')[curLoc].vElem.textContent = physCurFloor[curLoc].aGlyph;
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