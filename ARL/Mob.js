// ARL.Mob
// this really doesn't need to be its own class,
// but we're making it work first and pretty later.

ARL.Mob = function () {
    this.mIdentity = {
        iType: null,
        iAgent: null,
        iEid: null,
    };
    this.mPosition = {
        pLocXY: null,
        pCurFloor: null,
    };
    this.mVision = {
        vFov: 5,
        vKnownLocs: [],
        vInViewLocs: [],
    };
    /*
    this.mInventory = {
        iCarried: null,
        iEquipped: null,
    };
    */
    this.mState = {
        sHPCur: 1,
        sStrTotal: 1,
        sDefTotal: 0,
    };
    this.mStats = {
        sHPMax: 1,
        sStrBase: 1,
        sDefBase: 0,
    };
};