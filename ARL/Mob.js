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
    // I hate this.
    this.mActionState = {
        asCur: null,
        asVerb: null,
        asClock: 0,
    };
    /*
    We can and probably should refactor a bunch of this eventually.
    Not just doing away with ARL.Mob as a namespace/type but also resorting some of the
    stat groupings that we're using to generalize them.
    
    I'm talking about things like:
    this.mSenses = {
        sCanSee: true,
        sCanHear: true,
        sCanSmell: true,
        sVisionRange: 5,
        sHearingRange: 8,
    };
    this.mMemory = {
        mKnownLocs: [],
        mInViewLocs: [],
        mOtherShit: [],
    };
    
    */
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