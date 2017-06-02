// ARL.Narrator

ARL.Narrator = function (params) {
    this.mPanel = SIG("byId", "msg_panel");
    // this.mFeed = SIG("byId", "msg_feed");
    this.mFeed = document.createElement('code');
    this.mFeed.className = "msg_feed";
    this.mPanel.appendChild(this.mFeed);
    this.mFeed.appendChild(document.createTextNode("Welcome to ARL!"));
};

ARL.Narrator.prototype.narrate = function (line) {
    //this.buildMsg();
    this.addLine(line);
};

ARL.Narrator.prototype.colorrate = function (params) {
    this.addColorLine(params);
}

ARL.Narrator.prototype.clearFeed = function () {
    // this.mFeed.innerHTML = 'Starting new game!';
    while (this.mPanel.hasChildNodes()) {
        this.mPanel.removeChild(this.mPanel.firstChild);
    }
    this.mFeed = null;
    this.mFeed = document.createElement('code');
    this.mFeed.className = "msg_feed";
    this.mPanel.appendChild(this.mFeed);
    this.mFeed.appendChild(document.createTextNode("Starting new game!"));
}

// Double spaces the feed, normally between the end of one turn
// and the start of the next
ARL.Narrator.prototype.dub = function () {
    this.mFeed.appendChild(document.createElement('br'));
}

ARL.Narrator.prototype.addLine = function (line) {
    this.dub();
    this.mFeed.appendChild(document.createTextNode(line));
    SIG("scrollToNew", this.mPanel);
};

ARL.Narrator.prototype.addColorLine = function (params) {
    this.dub();
    let cCode = document.createElement('code');
    let cLine = document.createTextNode(params[0]);
    cCode.className = params[1];
    cCode.appendChild(cLine);
    this.mFeed.appendChild(cCode);
    SIG("scrollToNew", this.mPanel);
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