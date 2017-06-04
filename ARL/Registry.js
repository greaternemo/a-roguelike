// ARL.Registry
// For holding ur datas

ARL.Registry = function (eBase) {
    this.base = eBase;
    // holds all our data keyed to eids
    this.primeMap = new Map();
    // holds all our constants as keys to eids
    this.constMap = new Map();
    this.primeSchema = null;

    this.init();
};

/*
ARL.Registry.prototype
*/

ARL.Registry.prototype.init = function () {
    // import schema
    // build our constants
    this.importConstants(this.base.Constants.slice());
    this.importSchema(this.base.Schema);
};

// Pass in an eid, get back the value assigned to it
ARL.Registry.prototype.getEid = function (anEid) {
    return this.primeMap.get(anEid);
};

// Pass in a new value to assign to an eid
ARL.Registry.prototype.setEid = function (newData) {
    return this.primeMap.set(newData[0], newData[1]);
};

// Pass in a constant name to get the value assigned to it
ARL.Registry.prototype.getConst = function (aConst) {
    return this.chaseDown(this.constMap.get(aConst));
};

// Pass In a new value to assign to a constant
ARL.Registry.prototype.setConst = function (newData) {
    return this.primeMap.set(this.constMap.get(newData[0]), newData[1]);
};

// accepts a list of strings to assign as constants
ARL.Registry.prototype.importConstants = function (cList) {
    let newEid;
    let newConst;
    while (cList.length) {
        newConst = cList.shift();
        newEid = this.generateUeid();
        this.constMap.set(newConst, newEid);
        this.primeMap.set(newEid, false);
    }
};

ARL.Registry.prototype.importSchema = function (pSchema) {
    // Import a schema for understanding all these registries
    // and referencing them properly.
    // The primeSchema should be imported from the prefab data
    // as part of the app init process.
    // this.primeSchema = pSchema;
    let sKeys = Object.keys(pSchema);
    let sCnt;
    for (sCnt = 0; sCnt < sKeys.length; sCnt += 1) {
        // I can't believe this worked on the first try, jeezy chreezy
        this.primeMap.set(this.constMap.get(sKeys[sCnt]), this.base.RefData[pSchema[sKeys[sCnt]]]);
    }

};

ARL.Registry.prototype.registerEntity = function (newEnt) {
    let newid = this.generateUeid();
    // newEnt.eid = newid;
    this.primeMap.set(newid, newEnt);
    return newid;
};

// Generates a string containing a unique 10 digit id
ARL.Registry.prototype.generateUeid = function () {
    let temp;
    let newid;
    while (true) {
        temp = '' + Math.random();
        newid = temp.substring(2, 12);
        // Must be unique, must be 10 characters long
        if (this.primeMap.has(newid) || newid.length !== 10) {
            // NOPE
        }
        else {
            // we good
            return newid;
        }
    }
};

// Recursively locates the relevant Thing at the end of a chain of pointers
ARL.Registry.prototype.chaseDown = function (eid) {
    let myTarget = this.primeMap.get(eid);
    // If the primeMap has() the value of myTarget, it means the value of
    // eid is the key to another value, confirming that eid is a pointer.
    // In that case, we need to go deeper.
    if (this.primeMap.has(myTarget)) {
        return this.chaseDown(myTarget);
    } else {
        return myTarget;
    }
};

// Destroys an object and its eid
ARL.Registry.prototype.destroyEntity = function (eid) {
    this.primeMap.forEach(function (pVal, pKey, pMap) {
        if (pVal === eid) {
            pMap.set(pVal, false);
        }
    });
    this.primeMap.delete(eid);
};



/*
*
*
* Courtesy Spaces
*
*
*/