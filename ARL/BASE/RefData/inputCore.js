const inputBase = {
    knownKeys: [
        'numpad1',
        'numpad2',
        'numpad3',
        'numpad4',
        'numpad5',
        'numpad6',
        'numpad7',
        'numpad8',
        'numpad9',
        'keyarrowup',
        'keyarrowright',
        'keyarrowdown',
        'keyarrowleft',
        'keyspace',
        'keyescape',
        'keyf',
    ],
    inputContext: {
        allContexts: [
            'movement',
            'targeting',
        ],
        transitions: {
            movement: [
                'targeting',
            ],
            targeting: [],
        },
    },
};

ARL.BASE.RefData.inputBase = inputBase;

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */