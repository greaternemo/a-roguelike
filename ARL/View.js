// ARL.View
// For your draws

ARL.View = function () {
    this.panelMap = null;
    this.panelStats = null;
    this.panelFeed = null;

    // any time we touch a physical loc, we throw it in the dirty pile
    // on each loop, we redraw the dirty pile
    this.dirtyMap = [];
    this.drawDelay = (1000/30);
    
    // refactor this, for now I just want to see it work tho
    this.mapLocs = ARL.BASE.RefData.viewLocs;
    this.mapElems = ARL.BASE.RefData.viewElems;
    this.lineEnds = ARL.BASE.RefData.lineEnds;
    //this.floorLocs = ARL.BASE.RefData.physLocs;
    this.floorData = ARL.BASE.RefData.physData;
    this.aPlayer = {
        atLoc: '10,10',
        glyph: '@',
    };
    
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
    this.panelMap = document.getElementById('map_panel');
    let locList = this.mapLocs.slice();
    let cx = null;
    let cy = null;
    let curLoc = null;
    //console.log(this.floorData);
    while (locList.length) {
        curLoc = locList.shift();
        if (this.lineEnds.indexOf(curLoc) === -1) {
            cx = curLoc.split(',')[0];
            cy = curLoc.split(',')[1];
            this.panelMap.appendChild(this.mapElems[curLoc].vElem);
            //console.log('curLoc = ' + curLoc);

            if((cx === '0' || cx === '29') || (cy === '0' || cy === '29')) {
                this.floorData[curLoc].aTerrain = 'wall';
                this.mapElems[curLoc].vElem.textContent = GCON('TERRAIN_BASE').wall.tGlyph;
            } else {
                this.floorData[curLoc].aTerrain = 'floor';
                this.mapElems[curLoc].vElem.textContent = GCON('TERRAIN_BASE').floor.tGlyph;
            }
        } else {
            // GOTTA ADD THOSE LINE BREAKS YO
            this.panelMap.appendChild(this.mapElems[curLoc].vElem);
            // console.log('ignoring line end loc: ' + curLoc);
        }
    }
    // place player on the finished map
    this.floorData[this.aPlayer.atLoc].aBody = this.aPlayer;
    this.redrawTile(this.aPlayer.atLoc);
};



ARL.View.prototype.moveNorth = function () { return this.moveInDir('N'); };
ARL.View.prototype.moveEast  = function () { return this.moveInDir('E'); };
ARL.View.prototype.moveSouth = function () { return this.moveInDir('S'); };
ARL.View.prototype.moveWest  = function () { return this.moveInDir('W'); };

ARL.View.prototype.moveInDir = function (aDir) {
    let hereLoc = this.aPlayer.atLoc;
    let thereLoc = ARL.BASE.RefData.sideRefs[hereLoc][aDir];
    if (thereLoc === false) {
        return;
    }
    if (this.floorData[thereLoc].aTerrain === 'wall') {
        return;
    }
    this.floorData[hereLoc].aBody = false;
    this.redrawTile(hereLoc);
    this.floorData[thereLoc].aBody = this.aPlayer;
    this.aPlayer.atLoc = thereLoc;
    this.redrawTile(thereLoc);
};

ARL.View.prototype.redrawTile = function (tileLoc) {
    let tileElem = this.mapElems[tileLoc].vElem;
    let tilePhys = this.floorData[tileLoc];
    if (tilePhys.aBody === false) {
        tileElem.textContent = GCON('TERRAIN_BASE')[tilePhys.aTerrain].tGlyph;
    } else {
        tileElem.textContent = tilePhys.aBody.glyph;
    }
};



/*
*
*
* Courtesy Spaces
*
*
*/