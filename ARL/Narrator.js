// ARL.Narrator

ARL.Narrator = function () {
    this.init();
};

ARL.Narrator.prototype.init = function () {
    let msgPanel = SIG('byId', 'msg_panel');
    let aMsg = document.createElement('code');
    // aMsg.className = "msg_feed";
    aMsg.appendChild(document.createTextNode('Welcome to ARL!'));
    msgPanel.appendChild(aMsg);
};

ARL.Narrator.prototype.narrate = function(aLine) {
    //this.buildMsg();
    this.addLine(aLine);
};

ARL.Narrator.prototype.colorrate = function (nData) {
    this.addColorLine(nData);
};

ARL.Narrator.prototype.clearMsgPanel = function () {
    let msgPanel = SIG('byId', 'msg_panel');
    while (msgPanel.hasChildNodes() === true) {
        msgPanel.removeChild(msgPanel.firstChild);
    }
    let aMsg = document.createElement('code');
    // aMsg.className = "msg_feed";
    aMsg.appendChild(document.createTextNode('Starting new game!'));
    msgPanel.appendChild(aMsg);
    SIG('lineBreak');
};

ARL.Narrator.prototype.lineBreak = function () {
    let msgPanel = SIG('byId', 'msg_panel');
    msgPanel.appendChild(document.createElement('br'));
};

ARL.Narrator.prototype.addLine = function (aLine) {
    SIG('lineBreak');
    let msgPanel = SIG('byId', 'msg_panel');
    let aMsg = document.createElement('code');
    aMsg.appendChild(document.createTextNode(aLine));
    msgPanel.appendChild(aMsg);
    SIG("scrollToNew", msgPanel);
};

ARL.Narrator.prototype.addColorLine = function (nData) {
    let [aLine, aColor] = nData;
    SIG('lineBreak');
    let msgPanel = SIG('byId', 'msg_panel');
    let aMsg = document.createElement('code');
    aMsg.appendChild(document.createTextNode(aLine));
    aMsg.className = aColor;
    msgPanel.appendChild(aMsg);
    SIG('scrollToNew', msgPanel);
};

ARL.Narrator.prototype.narrateAction = function(params) {
    // This is going to be a new routing point where we'll push individual calls through
    // to functions that will build the narration messages for individual actions
    let[origAction, theDetails] = params;
    let theAction = 'narrate' + origAction;
    SIG(theAction, theDetails);
};



/*
*
*
*
* Courtesy Space
*
*
*
*/