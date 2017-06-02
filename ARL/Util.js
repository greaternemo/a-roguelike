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

ARL.Util.prototype.enpair = function (dxv, dyv) {
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

ARL.Util.prototype.entrio = function (dxv, dyv, dzv) {
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





/*
*
*
*
* Courtesy Space
*
*
*
*/