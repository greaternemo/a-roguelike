const layoutList = [
    'basic',
    'greatHall',
    'gobboctagon',
    'standard',
];

const layoutBase = {
    //complexityThreshold: 30,
    complexityThreshold: 10,
    basic: {},
    greatHall: {},
    gobboctagon: {},
    standard: {
        locOffset: {
            wOffset: 1,
            hOffset: 1,
        },
        gridSize: {
            //gWidth: 7,
            //gHeight: 7,
            gWidth: 4,
            gHeight: 4,
        },
        gridLocs: [],
        nodeSize: {
            //nWidth: 4,
            //nHeight: 4,
            nWidth: 7,
            nHeight: 7,
        },
        nodeLocs: [],
    },
};
  
const mapgenBase = {
    /*
    baseLayout: [
        "#..#",
        "....",
        "....",
        "#..#",
    ],
    emptyLayout: [
        "....",
        "....",
        "....",
        "....",
    ],
    fullLayout: [
        "####",
        "####",
        "####",
        "####",
    ],
    */
    baseLayout: [
        "#.....#",
        ".......",
        ".......",
        ".......",
        ".......",
        ".......",
        "#.....#",
    ],
    emptyLayout: [
        ".......",
        ".......",
        ".......",
        ".......",
        ".......",
        ".......",
        ".......",
    ],
    fullLayout: [
        "#######",
        "#######",
        "#######",
        "#######",
        "#######",
        "#######",
        "#######",
    ],

    /*
    nodeLayouts: {
        '000A': [
            [
                "....",
                "....",
                "....",
                "....",
            ],
            [
                "....",
                ".##.",
                ".##.",
                "....",
            ],
            [
                "#...",
                ".##.",
                "....",
                "#..#",
            ],
            [
                "...#",
                ".#..",
                ".#..",
                "#..#",
            ],
            [
                "#..#",
                "....",
                ".##.",
                "...#",
            ],
            [
                "#..#",
                "..#.",
                "..#.",
                "#...",
            ],
            [
                "#..#",
                "....",
                ".#..",
                "...#",
            ],
            [
                "...#",
                ".#..",
                "....",
                "#..#",
            ],
            [
                "#...",
                "..#.",
                "....",
                "#..#",
            ],
            [
                "#..#",
                "....",
                "..#.",
                "#...",
            ],
        ],
        '0000': [
            [
                "#..#",
                "....",
                "....",
                "#..#",
            ],
            [
                "....",
                "....",
                "....",
                "....",
            ],
            [
                "#..#",
                ".#..",
                "....",
                "#...",
            ],
            [
                "#..#",
                "..#.",
                "....",
                "...#",
            ],
            [
                "...#",
                "....",
                "..#.",
                "#..#",
            ],
            [
                "#...",
                "....",
                ".#..",
                "#..#",
            ],
        ],
        '0001': [
            [
                "#..#",
                "#...",
                "#...",
                "#..#",
            ],
            [
                "#..#",
                "##..",
                "##..",
                "#..#",
            ],
            [
                "#...",
                "#.#.",
                "#.#.",
                "#...",
            ],
            [
                "#...",
                "###.",
                "###.",
                "#...",
            ],
            [
                "#...",
                "#...",
                "#...",
                "#...",
            ],
            [
                "#..#",
                "#...",
                "#.#.",
                "#..#",
            ],
            [
                "#..#",
                "#.#.",
                "#...",
                "#..#",
            ],
        ],
        '0010': [
            [
                "#..#",
                "....",
                "....",
                "####",
            ],
            [
                "#..#",
                "....",
                ".##.",
                "####",
            ],
            [
                "....",
                ".##.",
                "....",
                "####",
            ],
            [
                "....",
                ".##.",
                ".##.",
                "####",
            ],
            [
                "....",
                "....",
                "....",
                "####",
            ],
            [
                "#..#",
                "..#.",
                "....",
                "####",
            ],
            [
                "#..#",
                ".#..",
                "....",
                "####",
            ],
        ],
        '0011': [
            [
                "#..#",
                "#...",
                "#...",
                "####",
            ],
            [
                "#..#",
                "#.#.",
                "#...",
                "####",
            ],
            [
                "#...",
                "#...",
                "#...",
                "####",
            ],
            [
                "#..#",
                "##..",
                "###.",
                "####",
            ],
            [
                "#...",
                "##..",
                "###.",
                "####",
            ],
            [
                "#...",
                "#.#.",
                "#...",
                "####",
            ],
        ],
        '0100': [
            [
                "#..#",
                "...#",
                "...#",
                "#..#",
            ],
            [
                "#..#",
                "..##",
                "..##",
                "#..#",
            ],
            [
                "...#",
                ".#.#",
                ".#.#",
                "...#",
            ],
            [
                "...#",
                ".###",
                ".###",
                "...#",
            ],
            [
                "...#",
                "...#",
                "...#",
                "...#",
            ],
            [
                "#..#",
                ".#.#",
                "...#",
                "#..#",
            ],
            [
                "#..#",
                "...#",
                ".#.#",
                "#..#",
            ],
        ],
        '0101': [
            [
                "#..#",
                "#..#",
                "#..#",
                "#..#",
            ],
            [
                "#..#",
                "#.##",
                "#.##",
                "#..#",
            ],
            [
                "#..#",
                "##.#",
                "##.#",
                "#..#",
            ],
            [
                "#..#",
                "##.#",
                "#..#",
                "#..#",
            ],
            [
                "#..#",
                "#..#",
                "##.#",
                "#..#",
            ],
            [
                "#..#",
                "#..#",
                "#.##",
                "#..#",
            ],
            [
                "#..#",
                "#.##",
                "#..#",
                "#..#",
            ],
        ],
        '0110': [
            [
                "#..#",
                "...#",
                "...#",
                "####",
            ],
            [
                "#..#",
                ".#.#",
                "...#",
                "####",
            ],
            [
                "...#",
                "...#",
                "...#",
                "####",
            ],
            [
                "#..#",
                "..##",
                ".###",
                "####",
            ],
            [
                "...#",
                "..##",
                ".###",
                "####",
            ],
            [
                "...#",
                ".#.#",
                "...#",
                "####",
            ],
        ],
        '0111': [
            [
                "#..#",
                "#..#",
                "#..#",
                "####",
            ],
        ],
        '1000': [
            [
                "####",
                "....",
                "....",
                "#..#",
            ],
            [
                "####",
                ".##.",
                "....",
                "#..#",
            ],
            [
                "####",
                "....",
                ".##.",
                "....",
            ],
            [
                "####",
                ".##.",
                ".##.",
                "....",
            ],
            [
                "####",
                "....",
                "....",
                "....",
            ],
            [
                "####",
                "....",
                ".#..",
                "#..#",
            ],
            [
                "####",
                "....",
                "..#.",
                "#..#",
            ],
        ],
        '1001': [
            [
                "####",
                "#...",
                "#...",
                "#..#",
            ],
            [
                "####",
                "#...",
                "#.#.",
                "#..#",
            ],
            [
                "####",
                "#...",
                "#...",
                "#...",
            ],
            [
                "####",
                "###.",
                "##..",
                "#..#",
            ],
            [
                "####",
                "###.",
                "##..",
                "#...",
            ],
            [
                "####",
                "#...",
                "#.#.",
                "#...",
            ],
        ],
        '1010': [
            [
                "####",
                "....",
                "....",
                "####",
            ],
            [
                "####",
                ".##.",
                "....",
                "####",
            ],
            [
                "####",
                "....",
                ".##.",
                "####",
            ],
            [
                "####",
                ".#..",
                "....",
                "####",
            ],
            [
                "####",
                "..#.",
                "....",
                "####",
            ],
            [
                "####",
                "....",
                "..#.",
                "####",
            ],
            [
                "####",
                "....",
                ".#..",
                "####",
            ],
        ],
        '1011': [
            [
                "####",
                "#...",
                "#...",
                "####",
            ],
        ],
        '1100': [
            [
                "####",
                "...#",
                "...#",
                "#..#",
            ],
            [
                "####",
                "...#",
                ".#.#",
                "#..#",
            ],
            [
                "####",
                "...#",
                "...#",
                "...#",
            ],
            [
                "####",
                ".###",
                "..##",
                "#..#",
            ],
            [
                "####",
                ".###",
                "..##",
                "...#",
            ],
            [
                "####",
                "...#",
                ".#.#",
                "...#",
            ],
        ],
        '1101': [
            [
                "####",
                "#..#",
                "#..#",
                "#..#",
            ],
        ],
        '1110': [
            [
                "####",
                "...#",
                "...#",
                "####",
            ],
        ],
        '1111': [
            [
                "####",
                "####",
                "####",
                "####",
            ],
        ],
    },
    */
    nodeLayouts: {
        '000A': [
            [
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
            ],
        ],
        '0000': [
            [
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
            ],
        ],
        '0001': [
            [
                "#.....#",
                "#......",
                "#......",
                "#......",
                "#......",
                "#......",
                "#.....#",
            ],
        ],
        '0010': [
            [
                "#.....#",
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
                "#######",
            ],
        ],
        '0011': [
            [
                "#.....#",
                "#......",
                "#......",
                "#......",
                "#......",
                "#......",
                "#######",
            ],
        ],
        '0100': [
            [
                "#.....#",
                "......#",
                "......#",
                "......#",
                "......#",
                "......#",
                "#.....#",
            ],
        ],
        '0101': [
            [
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
            ],
        ],
        '0110': [
            [
                "#.....#",
                "......#",
                "......#",
                "......#",
                "......#",
                "......#",
                "#######",
            ],
        ],
        '0111': [
            [
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#######",
            ],
        ],
        '1000': [
            [
                "#######",
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
                "#.....#",
            ],
        ],
        '1001': [
            [
                "#######",
                "#......",
                "#......",
                "#......",
                "#......",
                "#......",
                "#.....#",
            ],
        ],
        '1010': [
            [
                "#######",
                ".......",
                ".......",
                ".......",
                ".......",
                ".......",
                "#######",
            ],
        ],
        '1011': [
            [
                "#######",
                "#......",
                "#......",
                "#......",
                "#......",
                "#......",
                "#######",
            ],
        ],
        '1100': [
            [
                "#######",
                "......#",
                "......#",
                "......#",
                "......#",
                "......#",
                "#.....#",
            ],
        ],
        '1101': [
            [
                "#######",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
                "#.....#",
            ],
        ],
        '1110': [
            [
                "#######",
                "......#",
                "......#",
                "......#",
                "......#",
                "......#",
                "#######",
            ],
        ],
        '1111': [
            [
                "#######",
                "#######",
                "#######",
                "#######",
                "#######",
                "#######",
                "#######",
            ],
        ],
    },

    layoutTypes: [
        'corridors',
        'ends',
        'corners',
        'junctions',
        'special',
    ],
    layouts: {
        corridors: [
            "1010",
            "0101",
        ],
        ends: [
            "1110",
            "0111",
            "1011",
            "1101",
        ],
        corners: [
            "1001",
            "1100",
            "0110",
            "0011",
        ],
        junctions: [
            "1000",
            "0100",
            "0010",
            "0001",
        ],
        special: [
            "0000",
        ],
    },
    transitions: {
        corridors: ["corridors", "corners", "ends", "junctions"],
        ends: ["corridors", "corners", "junctions"],
        corners: ["corridors", "corners", "junctions", "ends"],
        junctions: ["corridors", "corners", "ends"],
        // We created the special type as a panic mirror of junctions so that normal
        // junction placement rules will hold unless a situation arises wherein the only
        // valid layout is a junction that would connect to another junction.
        // The neat thing about it is that if you have two adjacent spaces that can only
        // be invalid junctions, one will be calculated as invalid and added as a special
        // layout, and then the adjacent one will be calculated as invalid and will also
        // be added as a special layout. It's a solution that can lead to another instance
        // of the same failure that it can recursively solve through its own exception.
        special: ["corridors", "corners", "ends"],
    },
};

ARL.BASE.RefData.layoutList = layoutList;
ARL.BASE.RefData.layoutBase = layoutBase;
ARL.BASE.RefData.mapgenBase = mapgenBase;

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */