// ARL.Router

ARL.Router = function (eBase) {
    this.base = eBase;
    this.routes = {};
};

ARL.Router.prototype.import = function (oType, oRef) {
    let oRoutes = this.base.Routes[oType].slice();
    while (oRoutes.length) {
        this.routes[oRoutes.pop()] = oRef;
    }
    //console.log(this);
};

ARL.Router.prototype.reroute = function (rSig, rParams) {
    //console.log(rSig);
    return this.routes[rSig][rSig](rParams);
};

/*
ARE YOU KIDDING ME IS THIS SERIOUSLY IT?
ugh.
*/


/*
*
*
*
* Courtesy Space
*
*
*
*/