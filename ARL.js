// ARL
// rl build thing

var ARL = {
    // Core bits
    aRouter: null,
    aRegistry: null,
    
    // Systems
    aAction: null,
    aAgent: null,
    aFov: null,
    aGame: null,
    aInput: null,
    aMapgen: null,
    aNarr: null,
    aTurner: null,
    aUtil: null,
    aView: null,
    aWorld: null,
};

ARL.init = function () {
    // Import order is VERY IMPORTANT here.
    ARL.aRouter = new ARL.Router(ARL.BASE);

    ARL.aRegistry = new ARL.Registry(ARL.BASE);
    ARL.aRouter.import('Registry', ARL.aRegistry);
    //console.log('Imported Registry');

    ARL.aUtil = new ARL.Util();
    ARL.aRouter.import('Util', ARL.aUtil);
    //console.log('Imported Util');

    ARL.aView = new ARL.View();
    ARL.aRouter.import('View', ARL.aView);
    //console.log('Imported View');

    ARL.aNarr = new ARL.Narrator();
    ARL.aRouter.import('Narrator', ARL.aNarr);
    //console.log('Imported Narrator');
    
    ARL.aMapgen = new ARL.Mapgen();
    ARL.aRouter.import('Mapgen', ARL.aMapgen);
    //console.log('Imported Mapgen');

    ARL.aWorld = new ARL.World();
    ARL.aRouter.import('World', ARL.aWorld);
    //console.log('Imported World');
    // I don't know why I didn't think of this sooner
    ARL.aWorld.init();
    //console.log('Initialized World');
    
    ARL.aFov = new ARL.Fov();
    ARL.aRouter.import('Fov', ARL.aFov);
    //console.log('Imported Fov');

    ARL.aAction = new ARL.Action();
    ARL.aRouter.import('Action', ARL.aAction);
    //console.log('Imported Action');

    ARL.aAgent = new ARL.Agent();
    ARL.aRouter.import('Agent', ARL.aAgent);
    //console.log('Imported Agent');

    ARL.aTurner = new ARL.Turner();
    ARL.aRouter.import('Turner', ARL.aTurner);
    //console.log('Imported Turner');
    
    ARL.aInput = new ARL.Input();
    ARL.aRouter.import('Input', ARL.aInput);
    //console.log('Imported Input');

    ARL.aGame = new ARL.Game();
    ARL.aRouter.import('Game', ARL.aGame);
    //console.log('Imported Game');
    
    // We have some init bits that need to be done out of import order
    SIG('updateVisibility');
    SIG('drawPhysMap');

    // DON'T FORGET TO DO THIS
    ARL.aInput.inputLoop.engage();
    ARL.aView.viewLoop.engage();
    ARL.aGame.gameLoop.engage();
};

ARL.restInPeace = function () {
    // stop the loops
    ARL.aInput.inputLoop.hardReset();
    ARL.aView.viewLoop.hardReset();
    ARL.aGame.gameLoop.hardReset();
    // clear anything relevant
    // we very do not need this anymore
    /*
    let mPanel = SIG('byId', 'map_panel');
    while (mPanel.hasChildNodes() === true) {
        mPanel.removeChild(mPanel.firstChild);
    }
    */
    SIG('clearMsgPanel');
    // and then do the whole thing all over again
    return ARL.init();
};

function SIG(rSig, rParams) {
    return ARL.aRouter.reroute(rSig, rParams);
}

function GCON(aConst) {
    return SIG('getConst', aConst);
}

function SCON(aConst, aValue) {
    return SIG('setConst', [aConst, aValue]);
}

function GET(anEid) {
    return SIG('getEid', anEid);
}

function SET(anEid, aValue) {
    return SIG('setEid', [anEid, aValue]);
}

function RIP() {
    return ARL.restInPeace();
}

// hurk



/*
*
*
*
* Courtesy Space
*
*
*
*/