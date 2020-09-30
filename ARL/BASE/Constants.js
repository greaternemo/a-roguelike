/*

Constant naming conventions:

dir: A direction. Includes cardinal directions and up/down.
loc: A location, as coordinates. Generally a string in the form 'X,Y' or 'X,Y,Z'.
map: An abstraction meant as a collection of generated and/or state data.

<>_LIST: An array containing all the keys for the corresponding BASE table.
<>_BASE: A table containing base data for object generation.
<>_LOCS: An array containing all relevant locs for a specific map.
<>_MAP: A table containing generated and/or state data

*/

const BaseConstants = [
    // filler line
    'LOOP_DELAY', // ro, float, standard loop delay in ms
    'ALL_DIRS', // ro, array, all 4 cardinal dirs as single character strings
    'DIAG_DIRS', // ro, array, all diagonal dirs as 2-character strings
    'ALL_8_DIRS', // ro, array, all 8 cardinal and ordinal dirs as 1-2 character strings
    'OPPOSING_DIRS', // ro, table, opposing cardinal dirs, keyed by dir
    'SIDE_DELTAS', // ro, table, deltas for each dir
    'SIDE_REFS', // ro, table, adjacent locs for each loc
    'GRID_SIDE_REFS', // ro, table, tables of adjacent locs for each grid loc, keyed by grid dimensions

    'INPUT_BASE', // ro, table, base data for our input system
    'INPUT_CONTEXT', // rw, array, a list of input layers from current to deepest

    'PHYS_BASE', // ro, table, tables of phys map base data
    'PHYS_LOCS', // ro, array, all representable physical locs
    'PHYS_MAP', // rw, table, tables of phys locs, keyed by floor name

    'VIEW_BASE', // ro, table, tables of view map base data
    'VIEW_LOCS', // ro, array, all renderable map locs
    'VIEW_MAP', // rw, table, view elements, keyed by view loc
    'DIRTY_LOCS', // rw, array, view locs that need to be redrawn
    'DIRTY_LOAD', // rw, array, view locs that need to be redrawn
    'READY_TO_DRAW', // rw, bool, is the map ready to attempt a redraw
    'DEATH_CAM', // rw, bool, if the player is dead, has the whole map been revealed
    'CURSOR_LOC', // rw, string, view loc that currently has the cursor on it for targeting
    'TARGETED_LOCS', // rw, map, tiles to highlight for targeting, keyed by mob eid 

    'CURRENT_FLOOR', // rw, string, name of the floor the player is on
    'FLOOR_LIST', // ro, array, floor names as strings
    'FLOOR_BASE', // ro, table, tables of floor base data, keyed by floor name
    'FLOOR_MAP', // rw, table, tables of calculated floor data, keyed by floor name

    'LAYOUT_LIST', // ro, array, map layout names as strings
    'LAYOUT_BASE', // ro, table, tables of map layout data, keyed by floor name
    'LAYOUT_MAP', // rw, table, contains floor layout data as it's being built

    'MAPGEN_BASE', // ro, table, tables of map generation data

    'GLYPH_BASE', // ro, table, tables of glyph appearance data for the view

    'TERRAIN_LIST', // ro, array, terrain types as strings
    'TERRAIN_BASE', // ro, table, tables of terrain data, keyed by terrain name

    'MOB_LIST', // ro, array, mob types as strings
    'MOB_BASE', // ro, table, tables of mob data, keyed by mob type
    'ALL_MOBS', // rw, array, eids for all mobs
    'CUR_MOB_IDX', // rw, int, index of the mob whose turn it is in ALL_MOBS
    'PLAYER_MOB', // rw, int, eid for the player mob

    'GAME_OVER', // rw, bool, is the player dead and do we need to start a new game
    'INPUT_BUFFER', // rw, array, signals waiting to be processed
    'LISTEN_NUMPAD', // rw, bool, are we accepting numpad input
    'PLAYER_TURN', // rw, bool, is it the player's turn
    'END_OF_TURN', // rw, bool, is it time for end of turn cleanup
    'READY_FOR_TURN', // rw, bool, has the last turn completed


];

/*
Additional details for Constants

A)
GRID_MAP was a table with values keyed to grid locs.
The values in GRID_MAP are also tables.
Each of those tables have node locs as the keys and the related phys locs as the values.
GRID_MAP: {
    '0,0': {
        '0,0': '0,0',
        '1,0': '1,0',
        ...
    },
    '1,0': {
        '0,0': '10,0',
        '1,0': '11,0',
        '2,0': '12,0',
        ...
    },
    ...
}

B)
GRID_SIDE_REFS is redundant, all of the locs it contains should be in SIDE_REFS, but it's just way,
WAY less of a hassle to build a separate table of side refs for a smaller grid size than testing everything
against the grid dimensions any time we try to do grid math.
It's just cleaner this way.

*/

ARL.BASE.Constants = BaseConstants;

/*
 *
 *
 * Courtesy Spaces
 *
 *
 */