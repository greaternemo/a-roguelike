// ARL
// rl build thing

var ARL = {
    // Core bits
    aRouter: null,
    aRegistry: null,
    
    // Systems
    aAction: null,
    aAgent: null,
    aGame: null,
    aInput: null,
    aNarr: null,
    aTurner: null,
    aUtil: null,
    aView: null,
    aWorld: null,
};

ARL.init = function () {
    ARL.aRouter = new ARL.Router(ARL.BASE);

    ARL.aRegistry = new ARL.Registry(ARL.BASE);
    ARL.aRouter.import('Registry', ARL.aRegistry);

    ARL.aUtil = new ARL.Util();
    ARL.aRouter.import('Util', ARL.aUtil);

    ARL.aView = new ARL.View();
    ARL.aRouter.import('View', ARL.aView);

    ARL.aNarr = new ARL.Narrator();
    ARL.aRouter.import('Narrator', ARL.aNarr);

    ARL.aWorld = new ARL.World();
    ARL.aRouter.import('World', ARL.aWorld);

    ARL.aAction = new ARL.Action();
    ARL.aRouter.import('Action', ARL.aAction);

    ARL.aAgent = new ARL.Agent();
    ARL.aRouter.import('Agent', ARL.aAgent);

    ARL.aTurner = new ARL.Turner();
    ARL.aRouter.import('Turner', ARL.aTurner);
    
    ARL.aInput = new ARL.Input();
    ARL.aRouter.import('Input', ARL.aInput);

    ARL.aGame = new ARL.Game();
    ARL.aRouter.import('Game', ARL.aGame);

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
    let mPanel = SIG('byId', 'map_panel');
    while (mPanel.hasChildNodes() === true) {
        mPanel.removeChild(mPanel.firstChild);
    }
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