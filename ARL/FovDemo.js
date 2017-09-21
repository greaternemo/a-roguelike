// Precise Shadowcasting Demo

var VIEW_LOCS = [];
var PHYS_LOCS = [];
var LINE_ENDS = [];
var VIEW_MAP = {};
var PHYS_MAP = {};
var SIDE_REFS = {};
var DIR_DELTAS = {
	N: { DX:  0, DY: -1, },
	E: { DX:  1, DY:  0, },
	S: { DX:  0, DY:  1, },
	W: { DX: -1, DY:  0, },  
};
var ALL_DIRS = ['N', 'E', 'S', 'W'];
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
/*
var THE_GUY = {
	gGlyph: '@',
	gLoc: '7,7',
  gFov: 5,
  gKnownLocs: [],
  gInViewLocs: [],
};
*/

var mapSize = {
	mapWidth: 15,
  mapHeight: 15,
};

var VIEW_ZONE = null;

function generateLocsAndMaps () {
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
        tTerrain: 'floor',
        tVisible: true,
        tGlyph: '.',
        tBody: false,
      };
      if (THE_GUY.gLoc === newLoc) {
        newTile.tBody = THE_GUY;
      }
      PHYS_MAP[newLoc] = newTile;
    }
    else if (LINE_ENDS.indexOf(newLoc) !== -1) {
      newElem = {
        vElem: document.createElement('br'),
        vText: false,
      };
      VIEW_MAP[newLoc] = newElem;
      VIEW_ZONE.appendChild(VIEW_MAP[newLoc].vElem);
    }
  }
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
      }
      else {
      	SIDE_REFS[curLoc][curDir] = nX.toString() + ',' + nY.toString();
      }
    }
  }
};

function updateGlyph(aLoc) {
	if (PHYS_MAP[aLoc].tBody !== false) {
  	PHYS_MAP[aLoc].tGlyph = PHYS_MAP[aLoc].tBody.gGlyph;
  }
  else {
  	PHYS_MAP[aLoc].tGlyph = TERRAIN_BASE[PHYS_MAP[aLoc].tTerrain].tGlyph;
  }
  VIEW_MAP[aLoc].vElem.textContent = PHYS_MAP[aLoc].tGlyph;
};

function updateMapGlyphs() {
	let physLocs = PHYS_LOCS.slice();
  let curLoc = null;
  while (physLocs.length > 0) {
  	curLoc = physLocs.shift();
    updateGlyph(curLoc);
  }
};

function enpair(anX, aY) {
	let pair = anX.toString() + ',' + aY.toString();
  return pair;
};

function buildRings(aLoc, aRange) {
	let locX = parseInt(aLoc.split(',')[0]);
  let locY = parseInt(aLoc.split(',')[1]);
  let curX = null;
  let curY = null;
	let dX = null;
  let dY = null;
  let fullRange = [[aLoc]];
  let fullSet = [];
  let curRange = null;
  let curSet = null;
  let curLoc = null;
  let firstLoc = null;
  
  for (curRange = 1; curRange <= aRange; curRange += 1) {
  	curSet = [];
  	// we start with the northernmost loc and proceed clockwise
    dX = 0;
    dY = 0 - curRange;
    curX = locX + dX;
    curY = locY + dY;
    // we save this here to check it later
    // this way we can test an actual loc instead of a vague false value
    firstLoc = enpair(curX, curY);
    if ((curX > -1 && curX < mapSize.mapWidth) && (curY > -1 && curY < mapSize.mapHeight)) {
	    curLoc = enpair(curX, curY);
    }
    else {
    	curLoc = false;
    }
    curSet.push(curLoc);
    fullSet.push(curLoc);
    // N, go SE until E
    while (dX < curRange) {
    	dX += 1;
      dY += 1;
      curX = locX + dX;
      curY = locY + dY;
      // console.log('dX < curRange: ' + dX + '/' + curRange);
      if ((curX > -1 && curX < mapSize.mapWidth) && (curY > -1 && curY < mapSize.mapHeight)) {
        curLoc = enpair(curX, curY);
      }
      else {
        curLoc = false;
      }
      curSet.push(curLoc);
      fullSet.push(curLoc);
    }
    // E, go SW until S
    while (dY < curRange) {
    	dX -= 1;
      dY += 1;
      curX = locX + dX;
      curY = locY + dY;
      // console.log('dY < curRange: ' + dY + '/' + curRange);
      if ((curX > -1 && curX < mapSize.mapWidth) && (curY > -1 && curY < mapSize.mapHeight)) {
        curLoc = enpair(curX, curY);
      }
      else {
        curLoc = false;
      }
      curSet.push(curLoc);
      fullSet.push(curLoc);
    }
    // S, go NW until W
    while (dX > -curRange) {
    	dX -= 1;
      dY -= 1;
      curX = locX + dX;
      curY = locY + dY;
      // console.log('dX > -curRange: ' + dX + '/' + -curRange);
      if ((curX > -1 && curX < mapSize.mapWidth) && (curY > -1 && curY < mapSize.mapHeight)) {
        curLoc = enpair(curX, curY);
      }
      else {
        curLoc = false;
      }
      curSet.push(curLoc);
      fullSet.push(curLoc);
    }
    // W, go NE until N
    while (dY > -curRange) {
    	dX += 1;
      dY -= 1;
      curX = locX + dX;
      curY = locY + dY;
      // console.log('dY > -curRange: ' + dY + '/' + -curRange);
      // the last loc we generate should be our origin loc
      // we bail out when we get back to it
      if (enpair(curX, curY) === firstLoc) {
      	continue;
      }
      if ((curX > -1 && curX < mapSize.mapWidth) && (curY > -1 && curY < mapSize.mapHeight)) {
        curLoc = enpair(curX, curY);
      }
      else {
        curLoc = false;
      }
      curSet.push(curLoc);
      fullSet.push(curLoc);
    }
    fullRange.push(curSet.slice());
  }
  // console.log(fullSet);
  return fullRange;
};

function addFrac(frA, frB) {
	let frSum = [null, null];
  if (frA[1] === frB[1]) {
  	// matching denominators, we don't have to split these any further
    frSum[0] = frA[0] + frB[0];
    frSum[1] = frA[1];
  }
  else {
    frSum[0] = (frA[0] * frB[1]) + (frB[0] * frA[1]);
    frSum[1] = frA[1] * frB[1];
  }
  return frSum;
};

function subFrac(frA, frB) {
	let frDiff = [null, null];
  if (frA[1] === frB[1]) {
  	// matching denominators, we don't have to split these any further
    frDiff[0] = frA[0] - frB[0];
    frDiff[1] = frA[1];
  }
  else {
    frDiff[0] = (frA[0] * frB[1]) - (frB[0] * frA[1]);
    frDiff[1] = frA[1] * frB[1];
  }
  return frDiff;
};

function greaterFrac(frA, frB) {
	let frY = frA[0] * frB[1];
  let frZ = frB[0] * frA[1];
  if (frY === frZ) { return frB }
  else if (frY > frZ) { return frA; }
  else if (frY < frZ) { return frB; }
};

function lesserFrac(frA, frB) {
	let frY = frA[0] * frB[1];
  let frZ = frB[0] * frA[1];
  if (frY === frZ) { return frB }
  else if (frY > frZ) { return frB; }
  else if (frY < frZ) { return frA; }
};

function fracET(frA, frB) {
	let frY = frA[0] * frB[1];
  let frZ = frB[0] * frA[1];
  if (frY === frZ) {
  	return true;
  }
  else {
	  return false;
  }
};

function fracGT(frA, frB) {
	let frY = frA[0] * frB[1];
  let frZ = frB[0] * frA[1];
  if (frY > frZ) {
  	return true;
  }
  else {
  	return false;
  }
};

function fracLT(frA, frB) {
	let frY = frA[0] * frB[1];
  let frZ = frB[0] * frA[1];
  if (frY < frZ) {
  	return true;
  }
  else {
  	return false;
  }
};

function fracGE(frA, frB) {
	let frY = frA[0] * frB[1];
  let frZ = frB[0] * frA[1];
  if (frY > frZ || frY === frZ) {
  	return true;
  }
  else {
  	return false;
  }
};

function fracLE(frA, frB) {
	let frY = frA[0] * frB[1];
  let frZ = frB[0] * frA[1];
  if (frY < frZ || frY === frZ) {
  	return true;
  }
  else {
  	return false;
  }
};

function greaterOf(intA, intB) {
	if (intA === intB) { return intB; }
  else if (intA > intB) { return intA; }
  else if (intA < intB) { return intB; }
};

function lesserOf(intA, intB) {
	if (intA === intB) { return intB; }
  else if (intA > intB) { return intB; }
  else if (intA < intB) { return intA; }
};

function addArcToRange(anArc, aRange) {
	// arc will be a pair of fractions, e.g.
  // [[1, 8], [3, 8]]
	let rangeIdx = null;
  let curArc = null;
  let arcStart = false;
  let arcEnd = false;
  let isWithin = {
  	found: 0,
  	start: null,
    end: null,
  };
  let newArc = [[null, null], [null, null]];
  let idxDiff = null;
  if (aRange.length === 0) {
  	aRange.push(anArc);
    return aRange;
  }
  if (aRange.length === 1 &&
  		fracET(aRange[0][0], [0, 1]) && 
  		fracET(aRange[0][1], [1, 1])) {
  	// everything is shadowed, don't even bother lol
    return aRange;
  }
  for (rangeIdx in aRange) {
  	curArc = aRange[rangeIdx];
    // does my arcStart point fall in this range
    if (fracGE(anArc[0], curArc[0]) && fracLE(anArc[0], curArc[1])) {
    	// it does, so we add this index to isWithin
      isWithin.start = rangeIdx;
      isWithin.found += 1;
      arcStart = true;
    }
    // does my arcEnd point fall in this range
    if (fracGE(anArc[1], curArc[0]) && fracLE(anArc[1], curArc[1])) {
      isWithin.end = rangeIdx;
      isWithin.found += 1;
      arcEnd = true;
    }
    if (arcStart === true && arcEnd === true) {
    	// if we got it already, don't even sweat the rest
      break;
    }
  }
  if (isWithin.found === 0) {
    for (rangeIdx in aRange) {
      curArc = aRange[rangeIdx];
      if (aRange.length === 1) {
        // only one other shadow, we're either before or after it
        if (fracGT(anArc[0], curArc[0]) === true) {
          aRange.push(anArc);
          return aRange;
        }
        else {
          aRange.unshift(anArc);
          return aRange;
        }
      }
      else {
      	// does anArc come before the first arc in the range?
        if (parseInt(rangeIdx) === 0 && 
        		fracLT(anArc[1], curArc[0])) {
          aRange.unshift(anArc);
          return aRange;
        }
        // does anArc come after the last arc in the range?
        else if (parseInt(rangeIdx) === aRange.length - 1 &&
                 fracGT(anArc[0], curArc[1])) {
          aRange.push(anArc);
          return aRange;
        } 
        // does anArc fall between two arcs in the range?
        else if (parseInt(rangeIdx) > 0 &&
                 fracLT(anArc[1], curArc[0]) &&
                 fracGT(anArc[0], aRange[rangeIdx-1][1])) {
          aRange.splice(rangeIdx, 0, anArc);
          return aRange;
        }
      }
    }
  }
  else if (isWithin.found === 1) {
  	// does anArc start inside another arc?
    if (arcStart === true) {
      newArc[0] = lesserFrac(anArc[0], aRange[isWithin.start][0]);
      newArc[1] = greaterFrac(anArc[1], aRange[isWithin.start][1]);
      aRange.splice(isWithin.start, 1, newArc);
      return aRange;
    }
    // does anArc end inside another arc?
    else if (arcEnd === true) {
      newArc[0] = lesserFrac(anArc[0], aRange[isWithin.end][0]);
      newArc[1] = greaterFrac(anArc[1], aRange[isWithin.end][1]);
      aRange.splice(isWithin.end, 1, newArc);
      return aRange;
    }        
  }
  // doea anArc start in one arc and end inside another?
  else if (isWithin.found === 2) {
    newArc[0] = lesserFrac(anArc[0], aRange[isWithin.start][0]);
    newArc[1] = greaterFrac(anArc[1], aRange[isWithin.end][1]);
    idxDiff = (isWithin.end - isWithin.start) + 1;
    // we pull out everything that we're about to replace
    // then cram in the new stuff
    aRange.splice(isWithin.start, idxDiff, newArc);
    // then we send back the new range
    //console.log('new aRange: ' + aRange);
    return aRange;
  }
  // if all else fails, for the love of god just return aRange
  return aRange;
}

function checkRangeForArc(anArc, aRange) {
	let rangeIdx = null;
  let curArc = null;
  let arcStart = false;
  let arcEnd = false;
  // to be in shadow, the entirety of this range must
  // fall into a single shadow range.
  for (rangeIdx in aRange) {
  	curArc = aRange[rangeIdx];
    arcStart = false;
    arcEnd = false;
    // does my arcStart point fall in this range
    if (fracGE(anArc[0], curArc[0]) && fracLE(anArc[0], curArc[1])) {
      arcStart = true;
    }
    // does my arcEnd point fall in this range
    if (fracGE(anArc[1], curArc[0]) && fracLE(anArc[1], curArc[1])) {
      arcEnd = true;
    }
    if (arcStart === true && arcEnd === true) {
    	return true;
    }
  }
  // if it's not in any of the ranges, it's visible.
  return false;
}

function updateVisibility() {
	let fullRange = buildRings(THE_GUY.gLoc, THE_GUY.gFov);
  let oldView = THE_GUY.gInViewLocs.slice();
  let newView = [];
  let shadowRange = [];
  let shadowIdx = null;
  let arcOverlap = null;
  let aRing = null;
  let ringIdx = null;
  let aLoc = null;
  let locIdx = null;
  let curAngle = null;
  let curArc = null;
  let curArcSize = null;
  let halfCurArcSize = null;
  let isArcSplit = null;
  let splitRange = null;
  for (ringIdx in fullRange) {
    aRing = fullRange[ringIdx];
    for (locIdx in aRing) {
      aLoc = aRing[locIdx];
      // we need this now since our rings are generated to include
      // false values in the place of any loc that's off the grid
      if (aLoc === false) {
      	continue;
      }
      
      // first we derive our arc size, which is the number of arcs
      // the current ring is divided into.
      isArcSplit = false;
      curArcSize = [1, aRing.length];
      halfCurArcSize = [1, curArcSize[1] * 2];
      curAngle = [locIdx, curArcSize[1]];
      curArc = [[null, null], [null, null]];
      // to derive the current arc, we take the curArcSize and
      // multiply it by 2, then we subtract that from the curAngle
      // to get our min and add it to the curAngle for the max.
      curArc[0] = subFrac(curAngle, halfCurArcSize);
      // since we always start at the top, at 0 degrees, we never
      // have to worry about going over 1, only under 0, so we can
      // do this validation here and then check if our min is >
      // our max later safely.
      if (curArc[0][0] < 0) {
      	// if it's negative, adding 1 will just loop us around
				curArc[0][0] += curArc[0][1];
      }
      curArc[1] = addFrac(curAngle, halfCurArcSize);
      
      // does this arc overlap 0, if yes, split it
      if (greaterFrac(curArc[0], curArc[1]) === curArc[0]) {
      	isArcSplit = true;
        arcOverlap = [[null, null], [curArc[1][1], curArc[1][1]]];
        arcOverlap[0] = curArc.shift();
        curArc.unshift([0, arcOverlap[1][1]]);
      }
      
      if (isArcSplit === true) {
        // then we check to see if we can see the block
        if (checkRangeForArc(curArc, shadowRange) && checkRangeForArc(arcOverlap, shadowRange)) {
        	// if both return true, it is fully in shadow and we can move on
          PHYS_MAP[aLoc].tVisible = false;
        }
        else {
        	PHYS_MAP[aLoc].tVisible = true;
          // then we check to see if the tile blocks LOS
          if (TERRAIN_BASE[PHYS_MAP[aLoc].tTerrain].tSeeThru === false) {
            // add it to the shadow range if it's not already there
            shadowRange = addArcToRange(curArc, shadowRange);
            shadowRange = addArcToRange(arcOverlap, shadowRange);
          }
        }
      }
      else {
        // then we check to see if we can see the block
        if (checkRangeForArc(curArc, shadowRange)) {
        	// if it returns true, it is fully in shadow and we can move on
          PHYS_MAP[aLoc].tVisible = false;
        }
        else {
        	PHYS_MAP[aLoc].tVisible = true;
          // then we check to see if the tile blocks LOS
          if (TERRAIN_BASE[PHYS_MAP[aLoc].tTerrain].tSeeThru === false) {
            // add it to the shadow range if it's not already there
            shadowRange = addArcToRange(curArc, shadowRange);
          }
        }
      }
      
      // if it's visible, you know it now if you didn't already
      if (PHYS_MAP[aLoc].tVisible === true) {
      	newView.push(aLoc);
        VIEW_MAP[aLoc].vElem.className = '';
        VIEW_MAP[aLoc].vElem.classList.add('known_visible');
        if (THE_GUY.gKnownLocs.indexOf(aLoc) === -1) {
        	THE_GUY.gKnownLocs.push(aLoc);
        }
      }
      // if it's not visible and you don't know it, you still don't
      else if (PHYS_MAP[aLoc].tVisible === false) {
        if (THE_GUY.gKnownLocs.indexOf(aLoc) === -1) {
        	VIEW_MAP[aLoc].vElem.className = '';
          VIEW_MAP[aLoc].vElem.classList.add('unknown_hidden');
        }
        else {
        	VIEW_MAP[aLoc].vElem.className = '';
          VIEW_MAP[aLoc].vElem.classList.add('known_hidden');
        }
      }
      // regardless, we splice it out of oldView if it's there
      if (oldView.indexOf(aLoc) !== -1) {
        oldView.splice(oldView.indexOf(aLoc), 1);
      }
    }
  }
  // then we assign the newView as the new gInViewLocs
  THE_GUY.gInViewLocs = newView;
  // then we clean up all the known cells that are now out of view
  while (oldView.length > 0) {
  	aLoc = oldView.shift();
    VIEW_MAP[aLoc].vElem.className = '';
    VIEW_MAP[aLoc].vElem.classList.add('known_hidden');
  }
};

function updateAll() {
	updateMapGlyphs();
  updateVisibility();
}

function moveTheGuy(aDir) {
	let aSide = SIDE_REFS[THE_GUY.gLoc][aDir];
  if (aSide !== false && PHYS_MAP[aSide].tTerrain !== 'wall') {
	  PHYS_MAP[THE_GUY.gLoc].tBody = false;
    PHYS_MAP[aSide].tBody = THE_GUY;
    THE_GUY.gLoc = aSide;
    updateAll();
  }
}

function forgetKnown() {
	THE_GUY.gKnownLocs = [];
  let physLocs = PHYS_LOCS.slice();
  for (let aLoc in physLocs) {
  	//console.log("aLoc: " + aLoc);
  	if (THE_GUY.gInViewLocs.indexOf(physLocs[aLoc]) === -1) {
    	VIEW_MAP[physLocs[aLoc]].vElem.className = '';
      VIEW_MAP[physLocs[aLoc]].vElem.classList.add('unknown_hidden');
    }
  }
  updateAll();
}

function moveN() { return moveTheGuy('N') };
function moveE() { return moveTheGuy('E') };
function moveS() { return moveTheGuy('S') };
function moveW() { return moveTheGuy('W') };

function wireUpButtons() {
	let bN = document.getElementById('moveN');
  bN.onclick = moveN;
	let bE = document.getElementById('moveE');
  bE.onclick = moveE;
	let bS = document.getElementById('moveS');
  bS.onclick = moveS;
	let bW = document.getElementById('moveW');
  bW.onclick = moveW;
	let bF = document.getElementById('forget');
  bF.onclick = forgetKnown;
};

function buildWalls() {
	let someWalls = ['8,9', '9,8', '1,2', '2,2', '0,9', '1,9', '2,9', '3,9', '5,9', '6,9', '7,9', '7,10', '7,11', '7,12', '7,13', '7,14'];
  let someMoreWalls = PHYS_LOCS.slice();
  let thisWall = null;
  while (someWalls.length > 0) {
  	thisWall = someWalls.shift();
    PHYS_MAP[thisWall].tTerrain = 'wall';
  }
  while (someMoreWalls.length > 0) {
  	thisWall = someMoreWalls.shift();
    if (parseInt(thisWall.split(',')[0]) === 0 || 
    		parseInt(thisWall.split(',')[0]) === mapSize.mapWidth-1 || 
        parseInt(thisWall.split(',')[1]) === 0 || 
        parseInt(thisWall.split(',')[1]) === mapSize.mapHeight-1) {
    	PHYS_MAP[thisWall].tTerrain = 'wall';
    }
  }
  updateMapGlyphs();
  updateVisibility();
  forgetKnown();
};

function buildAllOfIt() {
  generateLocsAndMaps();
  genSideRefs();
  updateMapGlyphs();
  updateVisibility();
  buildWalls();
  wireUpButtons();
};




/*
*
*
* Courtesy Spaces
*
*
*/