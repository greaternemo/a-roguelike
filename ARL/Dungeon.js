// ARL.Dungeon
// Namespace for our dungeon generation algorithm(s?)

ARL.Dungeon = function () {};

/*
ARL.Dungeon.prototype.
*/

ARL.Dungeon.prototype.buildSingleFloor = function () {
    // asdf
    
};

// ok this needs to be moved into BASE properly
// for now this is going to hold our floor layout prefab blocks
ARL.BASE.RefData = {
    
    // we need our larger 7x7 grid
    floorLocs: [],
    floorMap: {},
    
    // each floor block corresponds to a 4x4 grid
    blockLocs: [],
    blockMap: {},
    
    blockLayouts: {
        allFloor:  ['....',
                    '....',
                    '....',
                    '....'],
        allWall:   ['####',
                    '####',
                    '####',
                    '####'],
    },
    
};

ARL.Dungeon.prototype.buildBlocks = function () {
    
    // each block is 4x4 and also has 4 orientations
    // some blocks are meant to fit together to make multiblock constructs
    
    
    
};



/*
*
*
* Courtesy Spaces
*
*
*/