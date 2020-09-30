const terrainList = [
    'floor',
    'wall',
    'abyss',
    'grate',
    'reeds',
    'uStairs',
    'dStairs',
];

const terrainBase = {
    floor: {
        //tGlyph: '\u00B7',
        //tGlyph: '·',
        tGlyph: '.',
        tName: 'floor',
        tFireThru: true,
        tSeeThru: true,
        tWalkable: true,
    },
    wall: {
        tGlyph: '#',
        tName: 'wall',
        tFireThru: false,
        tSeeThru: false,
        tWalkable: false,
    },
    abyss: {
        tGlyph: '\u2056',
        tName: 'abyss',
        tFireThru: true,
        tSeeThru: true,
        tWalkable: true,
    },
    grate: {
        tGlyph: '\u256B',
        tName: 'grate',
        tFireThru: true,
        tSeeThru: true,
        tWalkable: false,
    },
    reeds: {
        tGlyph: '\u2172',
        tName: 'reeds',
        tFireThru: false,
        tSeeThru: false,
        tWalkable: true,
    },
    // stairs are unimplemented
    uStairs: {
        tGlyph: '<',
        tName: 'stairs',
        tFireThru: true,
        tSeeThru: true,
        tWalkable: true,
    },
    // stairs are unimplemented
    dStairs: {
        tGlyph: '>',
        tName: 'stairs',
        tFireThru: true,
        tSeeThru: true,
        tWalkable: true,
    },
};

ARL.BASE.RefData.terrainList = terrainList;
ARL.BASE.RefData.terrainBase = terrainBase;

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */