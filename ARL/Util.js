// ARL.Util

ARL.Util = function () {};

/*
ARL.Util.prototype
*/

// returns a random integer between 0 and max-1
ARL.Util.prototype.rand = function (max) {
    return Math.floor(Math.random() * max);
};

// Separate random number function for die rolls
ARL.Util.prototype.aDie = function (sides) {
    return this.rand(sides) + 1;
};

ARL.Util.prototype.aCoin = function () {
    return this.aDie(2) - 1;
};

ARL.Util.prototype.d2 = function () {
    return this.aDie(2);
};

ARL.Util.prototype.d4 = function () {
    return this.aDie(4);
};

ARL.Util.prototype.d6 = function () {
    return this.aDie(6);
};

ARL.Util.prototype.d8 = function () {
    return this.aDie(8);
};

ARL.Util.prototype.d10 = function () {
    return this.aDie(10);
};

ARL.Util.prototype.d12 = function () {
    return this.aDie(12);
};

ARL.Util.prototype.d20 = function () {
    return this.aDie(20);
};

// Constructs a random number <len> digits long, returns a string
// Mainly built for generating 10-digit ID strings for the registry
ARL.Util.prototype.genNum = function (len) {
    let nLen = len ? len : 10;
    let nStr = '';
    let nCnt = 0;
    let nGen = '';
    for (nCnt; nCnt < nLen; nCnt++) {
        nGen = this.d10().toString();
        nStr += '' + nGen;
    }
    return nStr;
};

ARL.Util.prototype.randomName = function (pNum) {
    let playerNames = [
        'Nemo', 'Shoag', 'Dooty', 'Dagmar', 'Tex',
        'Boo', 'Big Boo', 'King Boo', 'Lakitu', 'Shyguy',
        'Captain Toad', 'Dry Bones', 'BFB', 'Sex Bob-omb',
        'Puppycat', 'Zorbat', 'Dukburg', 'Garbador',
        'Tom Nook', 'DJ K.K.', 'Blathers', 'Waluigi',
        'Nolan', 'Hestu',
    ];
    let ourPlayers = [];
    let rIdx = 0;
    let playa = null;
    while (ourPlayers.length < pNum) {
        rIdx = this.rand(playerNames.length);
        playa = playerNames[rIdx];
        if (playa === 'Nolan') {
            ourPlayers.push(this.randomNolan());
        }
        else {
            ourPlayers.push(playa);
        }
        playerNames.splice(rIdx, 1);
    }
    return ourPlayers;
};

ARL.Util.prototype.randomNolan = function () {
    let rareNolans = [
        'Gold Nolan',
        'Shiny Nolan',
        'Fat Nolan',
        'The Dreaded MEGA BACONOLAN',
        "A Wendy's Baconator",
        'Nolan, as played by Jeff',
        'Nolan, as played by Freddy',
        'Nolan, as played by James Franco',
        'A licened Nolan anime body pillow',
        'A Nolan voodoo doll',
        'Silver Nolan',
        'Tiny Nolan',
        '2 Tiny Nolans in a trenchcoat',
        'A vase or 2 Nolans',
        'Evil Nolan',
        'RoboNolan',
        "An alien in Nolan's skin",
    ];
    if (this.rand(25) === 0) {
        return rareNolans[this.rand(rareNolans.length)];
    }
    else {
        return 'Nolan';
    }
};

// Takes an array, creates a new array, adds the elements of the original
// array to the new array at random, returns the new array.
// Proper usage should look like:
// let xDeck = SIG("shuffle", yDeck);
ARL.Util.prototype.shuffle = function (aDeck) {
    let newDeck = [];
    while (aDeck.length) {
        newDeck.push(aDeck.splice(this.rand(aDeck.length), 1)[0]);
    }
    return newDeck;
};

ARL.Util.prototype.randFromArray = function (rSource) {
    let randSet = rSource.slice();
    return this.shuffle(randSet)[0];
};

ARL.Util.prototype.cap = function (nStr) {
    return nStr.charAt(0).toUpperCase() + nStr.slice(1);
};

ARL.Util.prototype.byId = function (elemId) {
    return document.getElementById(elemId);
};

ARL.Util.prototype.scrollToNew = function (panel) {
    panel.scrollTop = panel.scrollHeight - panel.clientHeight;
    return;
};

ARL.Util.prototype.enpair = function (params) {
    let [dxv, dyv] = params;
    let pairStr = '';
    pairStr += dxv.toString() + ',' + dyv.toString();
    return pairStr;
};

ARL.Util.prototype.depair = function (dxyv) {
    let pairXY = {};
    let pairList = dxyv.split(',');
    pairXY.x = parseInt(pairList[0]);
    pairXY.y = parseInt(pairList[1]);
    return pairXY;
};

ARL.Util.prototype.entrio = function (params) {
    let [dxv, dyv, dzv] = params;
    let trioStr = '';
    trioStr += dxv.toString() + ',';
    trioStr += dyv.toString() + ',';
    trioStr += dzv.toString();
    return trioStr;
};

ARL.Util.prototype.detrio = function (dxyzv) {
    let trioXYZ = {};
    let trioList = dxyzv.split(',');
    trioXYZ.x = parseInt(trioList[0]);
    trioXYZ.y = parseInt(trioList[1]);
    trioXYZ.z = parseInt(trioList[2]);
    return trioXYZ;
};

// IMPORTANT!!!!!
// To keep the lists of locs consistent, we always generate them in the same order:
// The outer loop increments the Y value, the inner loop increments the X.
// Functionally, the list of locs this generates will always start at the top left
// and will go to the right through each row before continuing at the start of the
// next row down.

ARL.Util.prototype.generateLocs = function(gInfo) {
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
};

/*
ARL.Util.prototype.
*/

ARL.Util.prototype.fracSum = function(params) {
    let [frA, frB] = params;
    let frSum = [null, null];
    if (frA[1] === frB[1]) {
        // matching denominators, we don't have to split these any further
        frSum[0] = frA[0] + frB[0];
        frSum[1] = frA[1];
    } else {
        frSum[0] = (frA[0] * frB[1]) + (frB[0] * frA[1]);
        frSum[1] = frA[1] * frB[1];
    }
    return frSum;
};

ARL.Util.prototype.fracDiff = function(params) {
    let [frA, frB] = params;
    let frDiff = [null, null];
    if (frA[1] === frB[1]) {
        // matching denominators, we don't have to split these any further
        frDiff[0] = frA[0] - frB[0];
        frDiff[1] = frA[1];
    } else {
        frDiff[0] = (frA[0] * frB[1]) - (frB[0] * frA[1]);
        frDiff[1] = frA[1] * frB[1];
    }
    return frDiff;
};

ARL.Util.prototype.fracGreaterOf = function(params) {
    let [frA, frB] = params;
    let frY = frA[0] * frB[1];
    let frZ = frB[0] * frA[1];
    if (frY === frZ) {
        return frB
    } else if (frY > frZ) {
        return frA;
    } else if (frY < frZ) {
        return frB;
    }
};

ARL.Util.prototype.fracLesserOf = function(params) {
    let [frA, frB] = params;
    let frY = frA[0] * frB[1];
    let frZ = frB[0] * frA[1];
    if (frY === frZ) {
        return frB
    } else if (frY > frZ) {
        return frB;
    } else if (frY < frZ) {
        return frA;
    }
};

ARL.Util.prototype.fracEqualTo = function(params) {
    let [frA, frB] = params;
    let frY = frA[0] * frB[1];
    let frZ = frB[0] * frA[1];
    if (frY === frZ) {
        return true;
    } else {
        return false;
    }
};

ARL.Util.prototype.fracGreaterThan = function(params) {
    let [frA, frB] = params;
    let frY = frA[0] * frB[1];
    let frZ = frB[0] * frA[1];
    if (frY > frZ) {
        return true;
    } else {
        return false;
    }
};

ARL.Util.prototype.fracLesserThan = function(params) {
    let [frA, frB] = params;
    let frY = frA[0] * frB[1];
    let frZ = frB[0] * frA[1];
    if (frY < frZ) {
        return true;
    } else {
        return false;
    }
};

ARL.Util.prototype.fracGreaterOrEqual = function(params) {
    let [frA, frB] = params;
    let frY = frA[0] * frB[1];
    let frZ = frB[0] * frA[1];
    if (frY > frZ || frY === frZ) {
        return true;
    } else {
        return false;
    }
};

ARL.Util.prototype.fracLesserOrEqual = function(params) {
    let [frA, frB] = params;
    let frY = frA[0] * frB[1];
    let frZ = frB[0] * frA[1];
    if (frY < frZ || frY === frZ) {
        return true;
    } else {
        return false;
    }
};

ARL.Util.prototype.intGreaterOf = function(params) {
    let [intA, intB] = params;
    if (intA === intB) {
        return intB;
    } else if (intA > intB) {
        return intA;
    } else if (intA < intB) {
        return intB;
    }
};

ARL.Util.prototype.intLesserOf = function(params) {
    let [intA, intB] = params;
    if (intA === intB) {
        return intB;
    } else if (intA > intB) {
        return intB;
    } else if (intA < intB) {
        return intA;
    }
};





/*
 *
 *
 *
 * Courtesy Space
 *
 *
 *
 */