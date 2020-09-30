// base data for our VIEW_MAP
const viewBase = {
    mapSize: {
        mWidth: 30,
        mHeight: 30,
    },
    cellSize: {
        //cWidth: 14,
        //cHeight: 16,
        cWidth: 21,
        cHeight: 24,
    },
    cellOffset: {
        cLeft: 2,
    },
    mapStyle: {
        mFont: '24px monospace',
        mFillColor: 'black',
        mTextBaseline: 'bottom',
    },
    cursorStyle: {
        cLineWidth: 2,
        cColor: 'limegreen',
    },
    targetStyle: {
        cLineWidth: 5,
        cColor: 'firebrick',
    },
};

ARL.BASE.RefData.viewBase = viewBase;

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */