const floorList = [
    'floor1',
    //'floor2',
];

const floorBase = {
    floor1: {
        stairsUp: false,
        stairsDown: 'floor2',
    },
    floor2: {
        stairsUp: 'floor1',
        stairsDown: false,
    }
};

ARL.BASE.RefData.floorList = floorList;
ARL.BASE.RefData.floorBase = floorBase;

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */