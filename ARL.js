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

    //ARL.aGame = new ARL.Game();
    //ARL.aRouter.import('Game', ARL.aGame);

    //ARL.aNarr = new ARL.Narrator();
    //ARL.aRouter.import('Narrator', ARL.aNarr);

    // DON'T FORGET TO DO THIS
    ARL.aInput.inputLoop.engage();
    // ARL.aGame.gameLoop.engage();
    // ARL.aView.viewLoop.engage();
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