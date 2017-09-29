// ARL.Fov
// Field of view calculation

ARL.Fov = function() {};

/*
ARL.Fov.prototype.
*/

ARL.Fov.prototype.buildRings = function(params) {
    let aLoc = params.aLoc;
    let aRange = params.aRange;
    
    let mapSize = GCON('PHYS_BASE').mapSize;

    let locX = parseInt(aLoc.split(',')[0]);
    let locY = parseInt(aLoc.split(',')[1]);
    let curX = null;
    let curY = null;
    let dX = null;
    let dY = null;
    let fullRange = [
        [aLoc]
    ];
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
        firstLoc = SIG('enpair', [curX, curY]);
        if ((curX > -1 && curX < mapSize.mWidth) && (curY > -1 && curY < mapSize.mHeight)) {
            curLoc = SIG('enpair', [curX, curY]);
        } else {
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
            if ((curX > -1 && curX < mapSize.mWidth) && (curY > -1 && curY < mapSize.mHeight)) {
                curLoc = SIG('enpair', [curX, curY]);
            } else {
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
            if ((curX > -1 && curX < mapSize.mWidth) && (curY > -1 && curY < mapSize.mHeight)) {
                curLoc = SIG('enpair', [curX, curY]);
            } else {
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
            if ((curX > -1 && curX < mapSize.mWidth) && (curY > -1 && curY < mapSize.mHeight)) {
                curLoc = SIG('enpair', [curX, curY]);
            } else {
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
            if (SIG('enpair', [curX, curY]) === firstLoc) {
                continue;
            }
            if ((curX > -1 && curX < mapSize.mWidth) && (curY > -1 && curY < mapSize.mHeight)) {
                curLoc = SIG('enpair', [curX, curY]);
            } else {
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

ARL.Fov.prototype.addArcToRange = function(params) {
    let anArc = params.anArc;
    let aRange = params.aRange;
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
    let newArc = [
        [null, null],
        [null, null]
    ];
    let idxDiff = null;
    if (aRange.length === 0) {
        aRange.push(anArc);
        return aRange;
    }
    if (aRange.length === 1 &&
        SIG('fracEqualTo', [aRange[0][0], [0, 1]]) &&
        SIG('fracEqualTo', [aRange[0][1], [1, 1]])) {
        // everything is shadowed, don't even bother lol
        return aRange;
    }
    for (rangeIdx in aRange) {
        if (aRange[rangeIdx].length === 2) {
            curArc = aRange[rangeIdx];
            // does my arcStart point fall in this range
            if (SIG('fracGreaterOrEqual', [anArc[0], curArc[0]]) && 
                SIG('fracLesserOrEqual', [anArc[0], curArc[1]])) {
                // it does, so we add this index to isWithin
                isWithin.start = rangeIdx;
                isWithin.found += 1;
                arcStart = true;
            }
            // does my arcEnd point fall in this range
            if (SIG('fracGreaterOrEqual', [anArc[1], curArc[0]]) && 
                SIG('fracLesserOrEqual', [anArc[1], curArc[1]])) {
                isWithin.end = rangeIdx;
                isWithin.found += 1;
                arcEnd = true;
            }
            if (arcStart === true && arcEnd === true) {
                // if we got it already, don't even sweat the rest
                break;
            }
        }
    }
    if (isWithin.found === 0) {
        for (rangeIdx in aRange) {
            if (aRange[rangeIdx].length === 2) {
                curArc = aRange[rangeIdx];
                if (aRange.length === 1) {
                    // only one other shadow, we're either before or after it
                    if (SIG('fracGreaterThan', [anArc[0], curArc[0]]) === true) {
                        aRange.push(anArc);
                        return aRange;
                    } else {
                        aRange.unshift(anArc);
                        return aRange;
                    }
                } else {
                    // does anArc come before the first arc in the range?
                    if (parseInt(rangeIdx) === 0 &&
                        SIG('fracLesserThan', [anArc[1], curArc[0]])) {
                        aRange.unshift(anArc);
                        return aRange;
                    }
                    // does anArc come after the last arc in the range?
                    else if (parseInt(rangeIdx) === aRange.length - 1 &&
                        SIG('fracGreaterThan', [anArc[0], curArc[1]])) {
                        aRange.push(anArc);
                        return aRange;
                    }
                    // does anArc fall between two arcs in the range?
                    else if (parseInt(rangeIdx) > 0 &&
                        SIG('fracLesserThan', [anArc[1], curArc[0]]) &&
                        SIG('fracGreaterThan', [anArc[0], aRange[rangeIdx - 1][1]])) {
                        aRange.splice(rangeIdx, 0, anArc);
                        return aRange;
                    }
                }
            }
        }
    } else if (isWithin.found === 1) {
        // does anArc start inside another arc?
        if (arcStart === true) {
            newArc[0] = SIG('fracLesserOf', [anArc[0], aRange[isWithin.start][0]]);
            newArc[1] = SIG('fracGreaterOf', [anArc[1], aRange[isWithin.start][1]]);
            aRange.splice(isWithin.start, 1, newArc);
            return aRange;
        }
        // does anArc end inside another arc?
        else if (arcEnd === true) {
            newArc[0] = SIG('fracLesserOf', [anArc[0], aRange[isWithin.end][0]]);
            newArc[1] = SIG('fracGreaterOf', [anArc[1], aRange[isWithin.end][1]]);
            aRange.splice(isWithin.end, 1, newArc);
            return aRange;
        }
    }
    // doea anArc start in one arc and end inside another?
    else if (isWithin.found === 2) {
        newArc[0] = SIG('fracLesserOf', [anArc[0], aRange[isWithin.start][0]]);
        newArc[1] = SIG('fracGreaterOf', [anArc[1], aRange[isWithin.end][1]]);
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
};

ARL.Fov.prototype.checkRangeForArc = function(params) {
    let anArc = params.anArc;
    let aRange = params.aRange;
    let rangeIdx = null;
    let curArc = null;
    let arcStart = false;
    let arcEnd = false;
    // to be in shadow, the entirety of this range must
    // fall into a single shadow range.
    for (rangeIdx = 0; rangeIdx < aRange.length; rangeIdx += 1) {
        curArc = aRange[rangeIdx];
        arcStart = false;
        arcEnd = false;
        // does my arcStart point fall in this range
        if (SIG('fracGreaterOrEqual', [anArc[0], curArc[0]]) && 
            SIG('fracLesserOrEqual', [anArc[0], curArc[1]])) {
            arcStart = true;
        }
        // does my arcEnd point fall in this range
        if (SIG('fracGreaterOrEqual', [anArc[1], curArc[0]]) && 
            SIG('fracLesserOrEqual', [anArc[1], curArc[1]])) {
            arcEnd = true;
        }
        if (arcStart === true && arcEnd === true) {
            return true;
        }
    }
    // if it's not in any of the ranges, it's visible.
    return false;
};

ARL.Fov.prototype.updateVisibility = function() {
    let fullRange = SIG('buildRings', {
        aLoc: GCON('PLAYER_MOB').mPosition.pLocXY,
        aRange: GCON('PLAYER_MOB').mVision.vFov,
    });
    let oldView = GCON('PLAYER_MOB').mVision.vInViewLocs.slice();
    
    // we mark ANY loc we touch here as dirty.
    let touchedLocs = [];
    
    let curFloor = GCON('PHYS_MAP')[GCON('CURRENT_FLOOR')];
    let newView = [];
    let shadowRange = [];
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
    for (ringIdx in fullRange) {
        if (fullRange[ringIdx].length) {
            aRing = fullRange[ringIdx];
            for (locIdx in aRing) {
                if (aRing[locIdx] === false || aRing[locIdx].split(',').length === 2) {
                    aLoc = aRing[locIdx];
                    // we need this now since our rings are generated to include
                    // false values in the place of any loc that's off the grid
                    if (aLoc === false) {
                        continue;
                    }
                    
                    if (touchedLocs.indexOf(aLoc) === -1) {
                        touchedLocs.push(aLoc);
                    }
        
                    // first we derive our arc size, which is the number of arcs
                    // the current ring is divided into.
                    isArcSplit = false;
                    curArcSize = [1, aRing.length];
                    halfCurArcSize = [1, curArcSize[1] * 2];
                    curAngle = [locIdx, curArcSize[1]];
                    curArc = [
                        [null, null],
                        [null, null]
                    ];
                    // to derive the current arc, we take the curArcSize and
                    // multiply it by 2, then we subtract that from the curAngle
                    // to get our min and add it to the curAngle for the max.
                    curArc[0] = SIG('fracDiff', [curAngle, halfCurArcSize]);
                    // since we always start at the top, at 0 degrees, we never
                    // have to worry about going over 1, only under 0, so we can
                    // do this validation here and then check if our min is >
                    // our max later safely.
                    if (curArc[0][0] < 0) {
                        // if it's negative, adding 1 will just loop us around
                        curArc[0][0] += curArc[0][1];
                    }
                    curArc[1] = SIG('fracSum', [curAngle, halfCurArcSize]);
        
                    // does this arc overlap 0, if yes, split it
                    if (SIG('fracGreaterOf', [curArc[0], curArc[1]]) === curArc[0]) {
                        isArcSplit = true;
                        arcOverlap = [
                            [null, null],
                            [curArc[1][1], curArc[1][1]]
                        ];
                        arcOverlap[0] = curArc.shift();
                        curArc.unshift([0, arcOverlap[1][1]]);
                    }
        
                    if (isArcSplit === true) {
                        // then we check to see if we can see the block
                        if (SIG('checkRangeForArc', {
                                   anArc: curArc, 
                                   aRange: shadowRange
                                }) && 
                            SIG('checkRangeForArc', {
                                    anArc: arcOverlap, 
                                    aRange: shadowRange
                                })
                           ) {
                            // if both return true, it is fully in shadow and we can move on
                            curFloor[aLoc].aVisible = false;
                        } else {
                            curFloor[aLoc].aVisible = true;
                            // then we check to see if the tile blocks LOS
                            if (GCON('TERRAIN_BASE')[curFloor[aLoc].aTerrain].tSeeThru === false) {
                                // add it to the shadow range if it's not already there
                                shadowRange = SIG('addArcToRange', {
                                    anArc: curArc, 
                                    aRange: shadowRange
                                });
                                shadowRange = SIG('addArcToRange', {
                                    anArc: arcOverlap, 
                                    aRange: shadowRange
                                });
                            }
                        }
                    } else {
                        // then we check to see if we can see the block
                        if (SIG('checkRangeForArc', {
                            anArc: curArc, 
                            aRange: shadowRange})
                           ) {
                            // if it returns true, it is fully in shadow and we can move on
                            curFloor[aLoc].aVisible = false;
                        } else {
                            curFloor[aLoc].aVisible = true;
                            // then we check to see if the tile blocks LOS
                            if (GCON('TERRAIN_BASE')[curFloor[aLoc].aTerrain].tSeeThru === false) {
                                // add it to the shadow range if it's not already there
                                shadowRange = SIG('addArcToRange', {
                                    anArc: curArc, 
                                    aRange: shadowRange
                                });
                            }
                        }
                    }
        
                    // if it's visible, you know it now if you didn't already
                    if (curFloor[aLoc].aVisible === true) {
                        newView.push(aLoc);
                        if (GCON('PLAYER_MOB').mVision.vKnownLocs.indexOf(aLoc) === -1) {
                            GCON('PLAYER_MOB').mVision.vKnownLocs.push(aLoc);
                        }
                    }
                    // regardless, we splice it out of oldView if it's there
                    if (oldView.indexOf(aLoc) !== -1) {
                        oldView.splice(oldView.indexOf(aLoc), 1);
                    }
                }
            }
        }
    }
    // then we assign the newView as the new gInViewLocs
    GCON('PLAYER_MOB').mVision.vInViewLocs = newView;
    // then we clean up all the known cells that are now out of view
    while (oldView.length > 0) {
        aLoc = oldView.shift();
        if (touchedLocs.indexOf(aLoc) === -1) {
            touchedLocs.push(aLoc);
        }
    }
    
    // last thing we do here is handle all those updates.
    SIG('handleTileUpdates', touchedLocs);
};



/*
 *
 *
 * Courtesy Spaces
 *
 *
 */