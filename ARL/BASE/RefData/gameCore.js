const gameCore = {
    // 30 fps gets really bogged down with multiple mobs, let's try faster
    // loopDelay: (1000/30),
    // loopDelay: (1000/60),
    loopDelay: (1000/120),

    // Flags
    listenNumpad: true,
    playerTurn: false,
    readyForTurn: false,

};

ARL.BASE.RefData.loopDelay = gameCore.loopDelay;
ARL.BASE.RefData.listenNumpad = gameCore.listenNumpad;
ARL.BASE.RefData.playerTurn = gameCore.playerTurn;
ARL.BASE.RefData.readyForTurn = gameCore.readyForTurn;

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */