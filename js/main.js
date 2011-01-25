/*
Copyright (C) 2010-2011 Brandon Evans.
http://www.brandonevans.org/
*/
var $;
var alert;
var Base64;
var location;
var main = {
    'alternate': true,
    'antwerp': false,
    'change': false,
    'count': {
        'shades': 2,
        'disks': 8,
        'per': 3,
        'towers': 3,
        'stacks': 1
    },
    'delay': 250,
    'generator': [],
    'home': false,
    'manual': [],
    'minimum': 0,
    'mode': 'Wait',
    'moves': {
        'current': 0,
        'old': 0
    },
    'popped': null,
    'redo': [],
    'random': false,
    'restriction': 'none',
    'running': false,
    'shades': [
        ['red', 'pink', 'darkred'],
        ['blue', 'lightblue', 'darkblue'],
        ['yellow', 'lightyellow', 'gold'],
        ['green', 'lightgreen', 'darkgreen'],
        ['mediumpurple', 'lavender', 'purple']
    ],
    'shuffle': false,
    'size': false,
    'stars': [],
    'steps': [],
    'stopped': true,
    'top': 'Any',
    'towers': []
};
var setTimeout;
var solve;

Array.prototype.index = function(value)
{
    var i;
    for (i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
};

main.color = function(disk, undo)
{
    /*
    Determine the color of a disk after a move to a new tower.

    ``disk``
        dict - The properties of the disk to be moved.

    ``undo``
        bool - Whether or not this move is undoing a previous one.

    Returns: str - The new color.
    */
    var cycle;
    var i;
    var stack;
    if (main.change) {
        for (i = 0; i < main.count.shades; i++) {
            stack = main.shades[disk.stack];
            if (disk.color === stack[i]) {
                cycle = 1;
                if (undo) {
                    cycle = -1;
                }
                return stack[main.cycle(i + cycle, 0, main.count.shades - 1)];
            }
        }
    }
    return disk.color;
};

main.cycle = function(num, start, end)
{
    /*
    Cycle a number in a range.

    ``num``
        int - The number to cycle.

    ``start``
        int - The start of the range (Optional. Default: 0).

    ``end``
        int - The end of the range (Optional. Default: main.count.towers).

    Returns: int - The new number.
    */
    // If no range is provided, assume we are cycling through the towers.
    if (start === undefined) {
        start = 0;
    }
    if (end === undefined) {
        end = main.count.towers - 1;
    }
    num = parseInt(num, 10);
    if (isNaN(num) || start > end) {
        return num;
    }
    // Decrease the number where necessary.
    while (num > end) {
        num += start - end - 1;
    }
    // Increase the number where necessary.
    while (num < start) {
        num += end - start + 1;
    }
    if (start === end) {
        num = start;
    }
    return num;
};

main.exhaust = function(generator)
{
    /*
    Remove everything up to the next move in a generator.

    ``generator``
        list - The generator to exhaust.

    Returns: list - The exhausted generator.
    */
    var current = generator;
    var stack = [];
    var step;
    while (true) {
        // If there are no steps in this level.
        if (!current.length) {
            // If this is the top level, we are done.
            if (!stack.length) {
                break;
            }
            // Go up in the hierarchy.
            current = stack.pop();
        }
        step = current.shift();
        // If this step is a function, convert to its return value.
        if (typeof(step) === 'function') {
            step = step();
        }
        if (typeof(step) !== 'object') {
            current.unshift(step);
            break;
        } else if (step.length) {
            // Put the step back.
            current.unshift(step);
            // Go down in the hierarchy.
            stack.push(current);
            current = step;
        }
    }
    return generator;
};

main.impasse = function()
{
    /*
    Check whether or not the puzzle has reached an impasse.

    Returns: bool - Whether or not the puzzle has reached an impasse.
    */
    /*
    If there a disk has been popped from a tower, assume the puzzle hasn't
    reached an impasse.
    */
    var i;
    var j;
    var last;
    if (main.popped) {
        return false;
    }
    /*
    If a move can be made from any tower to any tower other than itself, the
    puzzle hasn't reached an impasse.
    */
    for (i = 0; i < main.count.towers; i++) {
        for (j = 0; j < main.count.towers; j++) {
            last = main.towers[i].disks[main.towers[i].disks.length - 1];
            if (i !== j && main.movable(last, j)) {
                return false;
            }
        }
    }
    return true;
};

main.limit = function(home, limit) {
    /*
    Force a tower for a stack to limit the number disks placed on it.

    ``home``
        int - The home tower of the stack.

    ``limit``
        int - The amount of disks to limit the tower to.
    */
    var i;
    var mult = 1;
    var offset = 0;
    var tower;
    if (home) {
        offset = 1;
    }
    if (home / main.count.per === main.count.stacks - 1) {
        mult = 2;
    }
    for (i = home; i < home + main.count.per; i++) {
        tower = main.towers[main.cycle(i)];
        if ('limit' in tower && tower.limit === limit) {
            return;
        }
    }
    do {
        tower = main.towers[
            main.cycle(
                home + offset + Math.floor(
                    Math.random() * (main.count.per - (offset * 2))
                )
            )
        ];
    } while ('limit' in tower);
    tower.limit = limit;
};

main.movable = function(disk, tower, size, stay, undo)
{
    /*
    Check if the disk is movable to a given tower.

    ``disk``
        dict - The properties of the disk to be moved.

    ``tower``
        int - The tower to move it to.

    ``size``
        bool - Whether or not we're only checking size rules.

    ``stay``
        bool - Whether or not this disk's color should stay the same.

    ``undo``
        bool - Whether or not this move is undoing a previous one.

    Returns: bool - Whether or not the move can be completed.
    */
    var color;
    var colors;
    var current;
    var cycle;
    var from;
    var i;
    var j;
    var last;
    var length = main.towers[tower].disks.length;
    var mult;
    var next;
    var shades;
    var to;
    // If this disk doesn't exist or the tower is undefined, you can't move it.
    if (!disk || tower === undefined) {
        return false;
    }
    tower = main.cycle(tower);
    // You can always move a disk back to the tower you took it from.
    if (tower === disk.tower) {
        return true;
    }
    color = disk.color;
    if (!stay) {
        color = main.color(disk, undo);
    }
    // Find the last disk of this tower.
    last = main.towers[tower].disks[length - 1];
    mult = main.count.per - 1;
    from = disk.stack * mult;
    to = disk.stack * mult + mult;
    if (main.count.stacks > 1) {
        to = main.cycle(to);
    }
    if (main.restriction === 'clock') {
        cycle = 1;
    }
    if (main.restriction === 'counter') {
        cycle = -1;
    }
    if (cycle !== undefined) {
        if (undo) {
            cycle = -cycle;
        }
        if (cycle === 1 && disk.tower === to) {
            next = from;
        } else if (cycle === -1 && disk.tower === from) {
            next = to;
        } else {
            next = main.cycle(disk.tower + cycle);
        }
    }
    if (main.restriction === 'group' && !size) {
        shades = main.count.shades;
        if (length < shades) {
            shades = length + 1;
        }
        for (i = 0; i <= length - shades + 1; i++) {
            colors = [];
            for (j = i; j < i + shades; j++) {
                current = color;
                if (j < length) {
                    current = main.towers[tower].disks[j].color;
                }
                if (colors.index(current) !== -1) {
                    return false;
                }
                colors.push(current);
            }
        }
    }
    // If there are disks on this tower
    if (length) {
        // If this disk is larger than the last disk, fail.
        if (disk.size > last.size) {
            return false;
        }
        /*
        If this disk is the same size as the last disk, and this is prohibited,
        fail.
        */
        if (!main.size && last.size === disk.size) {
            return false;
        }
        /*
        If this disk is the same color as the last disk, and this is
        prohibited, fail.
        */
        if (main.restriction === 'same' && last.color === color && !size) {
            return false;
        }
        /*
        If this disk is a different color than the last disk, the two disks are
        from the same stack, and this is prohibited, fail.
        */
        if (
            main.restriction === 'different' &&
            last.color !== color &&
            last.stack === disk.stack &&
            !size
        ) {
            return false;
        }
    }
    /*
    If the movement is linear and the target tower isn't next to this one,
    fail.
    */
    if (
        main.restriction === 'linear' &&
        Math.abs(tower - disk.tower) > 1 &&
        (
            disk.tower + 1 !== main.count.towers ||
            tower !== to
        ) &&
        (
            disk.tower - 1 !== -1 ||
            tower !== main.count.towers - 1
        ) &&
        !size
    ) {
        return false;
    }
    /*
    If the movement is cyclical and the target tower isn't next in the cycle,
    fail.
    */
    if (
        next !== undefined &&
        tower !== next &&
        !size
    ) {
        return false;
    }
    // If there are star towers and this move is not from nor to one, fail.
    if (
        main.stars.length &&
        main.stars.index(disk.tower) === -1 &&
        main.stars.index(tower) === -1 &&
        !size
    ) {
        return false;
    }
    colors = ['grey', main.shades[disk.stack][0]];
    // If this disk doesn't belong on this tower, fail.
    if (
        colors.index(main.towers[tower].base) === -1 &&
        colors.index(main.towers[tower].peg) === -1 &&
        !size
    ) {
        return false;
    }
    return true;
};

main.move = function(tower, undo, redo, restoring)
{
    /*
    Move from or to a tower.

    ``tower``
        int - The tower to move from or to.

    ``undo``
        bool - Whether or not this move is undoing a previous one.

    ``redo``
        bool - Whether or not this move is redoing an undone one.

    `restoring``
        bool - Whether or not this move is restoring manual moves.
    */
    var color;
    var disk;
    var i;
    var log = [];
    var hide;
    var parent;
    var show;
    // If this move is futile, restart the puzzle.
    if (main.solved() || (main.impasse() && !undo)) {
        main.setup();
        return;
    }
    tower = main.cycle(parseInt(tower, 10));
    /*
    If the tower is invalid, show an error message with the real tower number
    and stop moving.
    */
    if (isNaN(tower)) {
        alert('Invalid move: ' + (tower + 1));
        main.stop();
        return;
    }
    // If a disk has been popped off a tower
    if (main.popped) {
        if (!main.movable(main.popped, tower, false, false, undo)) {
            // Show an error message with the real tower numbers.
            alert(
                'Invalid move: ' + (main.popped.tower + 1) + '-' + (tower + 1)
            );
            main.stop(true);
            // Place the disk on the tower it came from.
            tower = main.popped.tower;
        } else if (main.popped.tower !== tower) {
            // Adjust the color.
            main.popped.color = main.color(main.popped, undo);
            if (undo) {
                // Reduce the number of moves accordingly.
                main.moves.current--;
                // Add this move to a list of moves that can be redone.
                main.redo.push(main.popped.tower);
                main.redo.push(tower);
            } else {
                // Increase the number of moves accordingly.
                main.moves.current++;
                // Add this move to a list.
                main.steps.push(main.popped.tower);
                main.steps.push(tower);
                if (!redo) {
                    // This move overwrites the undone moves.
                    main.redo = [];
                }
            }
            // Based on the moves made, build the Log.
            for (i = 0; i < main.steps.length; i++) {
                // Group the steps of a move together in the log.
                if (i % 2 === 0) {
                    // Show the real tower numbers.
                    log.push(
                        (main.steps[i] + 1) + '-' + (main.steps[i + 1] + 1)
                    );
                }
            }
            $('#log').val(log.join(',\n'));
            $('#export').val(JSON.stringify(main.steps));
        }
        // Show the top disk of this tower.
        show = '#disk' + tower + '-' + main.towers[tower].disks.length;
        // Hide the popped disk.
        hide = '#disk' + main.popped.tower;
        parent = '#tower' + main.popped.tower;
        disk = main.popped.size;
        color = main.popped.color;
        main.popped.tower = tower;
        // Add the disk to the tower.
        main.towers[tower].disks.push(main.popped);
        main.popped = null;
    } else if (main.towers[tower].disks.length) {
        // Pop the top disk from the tower.
        main.popped = main.towers[tower].disks.pop();
        // Show the popped disk.
        show = '#disk' + tower;
        // Hide the top disk of this tower.
        hide = '#disk' + tower + '-' + main.towers[tower].disks.length;
        parent = '#tower' + tower;
        disk = main.popped.size;
        color = main.color(main.popped, undo);
    } else {
        return;
    }
    $(show).css('visibility', 'visible');
    $(show).css(
        'width', Math.round(($(hide).width() / $(parent).width()) * 100) + '%'
    );
    $(show).css('background-color', color);
    // Only update the text if there previously was text.
    if ($(show).text()) {
        $(show).text(disk + 1);
    }
    $(hide).css('visibility', 'hidden');
    // If this is not a manual move, store the current number of moves.
    if (main.running) {
        main.moves.old = main.moves.current;
    } else if (restoring) {
        // Restore the number of moves.
        main.moves.current = main.moves.old;
    } else {
        // Add the arguments to a list in preparation to be restored.
        main.manual.push(arguments);
    }
    $('#moves').text(main.moves.current);
    $('#redo').hide();
    $('#undo').hide();
    // If the puzzle hasn't been solved
    if (!main.solved()) {
        // Show the redo button if there are moves to be redone.
        if (main.redo.length) {
            $('#redo').show();
        }
        // Show the undo button if there are moves to be undone.
        if (main.steps.length) {
            $('#undo').show();
        }
        // If the puzzle has reached an impasse, show an appropriate message.
        if (main.impasse()) {
            alert('Puzzle has reached an impasse.');
        }
    } else if (!main.running) {
        if (main.minimum === 'N/A' || main.minimum === 'Unsolved') {
            alert('Puzzle solved.');
        } else if (main.moves.current < main.minimum) {
            alert('Puzzle solved in less moves than the current minimum.');
        } else if (main.moves.current === main.minimum) {
            alert('Puzzle solved in the current minimum number of moves.');
        } else {
            alert('Puzzle solved in more moves than the current minimum.');
        }
    }
};

main.next = function(generator)
{
    /*
    Find the next move.

    ``generator``
        list - The generator to exhaust.

    Returns: int - The next move.
    */
    var current = generator;
    var step;
    while (current.length) {
        step = current.shift();
        if (typeof(step) === 'object') {
            // Put the step back.
            current.unshift(step);
            // Go down in the hierarchy.
            current = step;
        } else {
            return step;
        }
    }
};

main.ordered = function(tower)
{
    /*
    Check if a tower's disks are in size order.

    ``tower``
        int - The tower to check.

    Returns: bool - Whether or not tower is ordered.
    */
    var i;
    for (i = 0; i < main.towers[tower].disks.length; i++) {
        if (main.count.disks - i - 1 !== main.towers[tower].disks[i].size) {
            return false;
        }
    }
    return true;
};

main.restart = function()
{
    // Set up the towers and restart the solver.
    // If a disk should be added, add it.
    if (main.mode === 'Increase' && main.count.disks !== 100) {
        main.count.disks++;
        $('#disks').val(main.count.disks);
    }
    main.setup();
    main.start(true);
};

main.run = function(restarting)
{
    /*
    Run through the generator one step at a time.

    ``restarting``
        bool - Whether or not the solver is restarting.
    */
    // Assume the generator is done running.
    main.running = false;
    // If the solver has not been stopped
    if (!main.stopped) {
        main.exhaust(main.generator);
        // If there are steps in the generator
        if (main.generator.length) {
            // The solver isn't done running.
            main.running = true;
            if (!restarting) {
                main.move(main.next(main.generator));
            }
            setTimeout(main.run, main.delay, false);
            return;
        }
        if (main.mode === 'Wait') {
            main.stop();
            return;
        }
        main.restart();
    }
};

main.setup = function()
{
    // Set up the towers.
    var alerted = false;
    var base;
    var calc;
    var checked;
    var color;
    var current;
    var denom;
    var disk;
    var disks;
    var element;
    var height = 20;
    var i;
    var j;
    var k;
    var last;
    var maximum = 100;
    var message;
    var moves = $('#import').val();
    var multistack;
    var num;
    var offset = 0;
    var old = main.count.towers;
    var peg;
    var remainder;
    var same;
    var scale = 10;
    var size;
    var stack;
    var stackable;
    var stacks = [];
    var tower;
    var towers;
    var width;
    main.stop(true);
    // Set the default values.
    main.generator = [];
    main.manual = [];
    main.moves.current = 0;
    main.moves.old = 0;
    main.popped = null;
    main.redo = [];
    main.steps = [];
    main.towers = [];
    main.count.per = parseInt(main.count.per, 10);
    if (isNaN(main.count.per)) {
        alert('Invalid value for towers per stack.');
        main.count.per = 3;
    }
    if (main.count.per < 3) {
        alert('There must be at least three towers per stack.');
        main.count.per = 3;
    }
    main.count.stacks = parseInt(main.count.stacks, 10);
    if (isNaN(main.count.stacks)) {
        alert('Invalid value for stacks.');
        main.count.stacks = 1;
    }
    if (main.antwerp && main.count.stacks < 2) {
        alert('There must be at least two stacks in an Antwerp styled game.');
        main.count.stacks = 2;
    }
    if (main.count.stacks < 1) {
        alert('There must be at least one stack.');
        main.count.stacks = 1;
    }
    if (main.antwerp && !main.size) {
        message = 'Disks must be placed on eachother in an Antwerp styled ';
        message += 'game.';
        alert(message);
        main.size = true;
    }
    if (
        main.restriction === 'counter' &&
        main.count.stacks > 1 &&
        !main.size
    ) {
        message = 'Disks must be placed on eachother in a game with multiple ';
        message += 'stacks in which disks can only move cyclicly ';
        message += 'counterclockwise';
        alert(message);
        main.size = true;
    }
    if (main.antwerp && main.count.stacks > main.count.per) {
        message = 'There can\'t be more stacks than towers in an Antwerp ';
        message += 'styled game';
        alert(message);
        main.count.stacks = main.count.per;
    }
    if (main.count.stacks > 5) {
        alert('There can\'t be more than five stacks.');
        main.count.stacks = 5;
    }
    main.count.disks = parseInt(main.count.disks, 10);
    if (isNaN(main.count.disks)) {
        alert('Invalid value for disks per stack.');
        main.count.disks = 8;
    }
    if (main.count.disks < 1) {
        alert('There must be at least one disk per stack.');
        main.count.disks = 1;
    }
    if (main.size) {
        maximum = Math.floor(100 / main.count.stacks);
    }
    if (main.count.disks > maximum) {
        alert('There can\'t be more than 100 disks per stack on one tower.');
        main.count.disks = maximum;
    }
    main.count.shades = parseInt(main.count.shades, 10);
    if (isNaN(main.count.shades)) {
        alert('Invalid value for shades.');
        main.count.shades = 2;
    }
    if (main.count.shades < 1) {
        alert('There must be at least one shade.');
        main.count.shades = 1;
    }
    if (main.home && main.count.shades < 2) {
        message = 'There must be at least two shades if the game should end ';
        message += 'on the Home tower.';
        alert(message);
        main.count.shades = 2;
    }
    if (main.count.shades > 3) {
        alert('There can\'t be more than 3 shades.');
        main.count.shades = 3;
    }
    if (main.home && (main.top === 'Any' || main.top === '1')) {
        message = 'The top shade can\'t be the first shade if the game ';
        message += 'should be ended on the Home tower.';
        main.top = '2';
        alert(message);
    }
    if (main.restriction === 'different') {
        if (main.alternate) {
            message = 'The disks can\'t alternate if disks can\'t touch ';
            message += 'disks of a different shade.';
            alert(message);
            main.alternate = false;
        }
        if (main.count.shades > main.count.per) {
            message = 'There must be at least as many towers per stack as ';
            message += 'shades if disks can\'t touch disks of a different ';
            message += 'shade.';
            alert(message);
            main.count.per = main.count.shades;
        }
        if (
            main.random &&
            main.count.shades > 2 &&
            main.count.stacks > 1 &&
            !main.size
        ) {
            message = 'Disks must be placed on eachother in a game with more ';
            message += 'than two shades and one stack in which the disks ';
            message += 'should be randomly placed on the towers.';
            alert(message);
            main.size = true;
        }
    }
    if (['same', 'group'].index(main.restriction) !== -1) {
        if (main.count.shades < 2) {
            message = 'There must be at least two shades if disks can\'t ';
            message += 'touch disks of the same shade.';
            alert(message);
            main.count.shades = 2;
        }
        if (!main.alternate) {
            message = 'The disks must alternate if disks can\'t touch disks ';
            message += 'of the same shade.';
            alert(message);
            main.alternate = true;
        }
        if (main.change && main.count.per < 4) {
            message = 'There must be at least four towers per stack if disks ';
            message += 'can\'t touch disks of the same shade and disks ';
            message += 'change shades.';
            alert(message);
            main.count.per = 4;
        }
    }
    if (main.restriction === 'group' && main.count.shades >= main.count.per) {
        message = 'There must be more towers per stack than shades if in any ';
        message += 'group of S = Shades disks, there can\'t be two disks of ';
        message += 'of the same shade.';
        alert(message);
        main.count.per = main.count.shades + 1;
    }
    do {
        main.count.towers = (
            main.count.per * main.count.stacks - main.count.stacks
        );
        if (main.antwerp) {
            // All towers are shared.
            main.count.towers = main.count.per;
        } else if (main.count.stacks === 1) {
            main.count.towers++;
        }
        if (main.count.towers > 25) {
            if (!alerted) {
                alert('There can\'t be more than 25 towers');
                alerted = true;
            }
            main.count.per--;
        }
    } while (main.count.towers > 25);
    // If the tower count has changed, remove all star towers.
    if (old !== main.count.towers) {
        main.stars = [];
    }
    denom = main.count.per - 1;
    for (i = 0; i < main.count.towers; i++) {
        multistack = (main.count.stacks > 1 && !main.antwerp);
        checked = (
            (multistack && main.stars.index(i % denom) !== -1) ||
            (!multistack && main.stars.index(i) !== -1)
        );
        if (main.stars.index(i) !== - 1) {
            main.stars.splice(main.stars.index(i), 1);
        }
        if (checked) {
            main.stars.push(i);
        }
    }
    if (main.stars.length && main.restriction !== 'none') {
        message = 'There must be no star towers if there are additional ';
        message += 'restrictions.';
        alert(message);
        main.stars = [];
    }
    main.minimum = 'N/A';
    denom = main.count.per - 1;
    towers = main.count.towers - 1;
    if (main.antwerp) {
        // Cycle through the towers that hold stacks.
        denom = 1;
        towers = main.count.stacks - 1;
    }
    for (i = 0; i < main.count.towers; i++) {
        // Asssume the base and peg are both grey.
        base = 'grey';
        peg = 'grey';
        remainder = i % denom;
        if (main.count.stacks > 1 || main.antwerp) {
            /*
            If this tower is one of a stack's "using" towers, make the color
            base and peg the same as the stack.
            */
            if (remainder) {
                base = main.shades[(i - remainder) / denom][0];
                peg = base;
            } else {
                color = i / denom;
                if (!main.antwerp) {
                    /*
                    Make the base the same color as the stack that is from this
                    tower.
                    */
                    base = main.shades[color][0];
                }
                color = main.cycle(i - denom, 0, towers) / denom;
                /*
                If this tower is in the cycle, make the peg the same color as
                the stack that should move to this tower.
                */
                if (i < towers + 1) {
                    peg = main.shades[color][0];
                }
            }
        }
        // Add the tower.
        main.towers.push({
            'base': base,
            'disks': [],
            'peg': peg
        });
    }
    // Place a stack on the appropriate towers.
    for (i = 0; i < main.count.towers; i++) {
        if (
            i === 0 ||
            (
                (main.count.stacks > 1) &&
                (
                    (
                        main.antwerp &&
                        i < main.count.stacks
                    ) ||
                    (
                        !main.antwerp &&
                        i % denom === 0
                    )
                )
            )
        ) {
            disks = [];
            if (
                main.change &&
                main.restriction === 'different' &&
                main.count.shades > 1 &&
                (
                    !main.antwerp || !i
                )
            ) {
                main.limit(i, 0);
                if (main.count.shades > 2) {
                    main.limit(i, 1);
                }
            }
            for (j = 0; j < main.count.disks; j++) {
                // The size of disks should shrink as you add them.
                size = main.count.disks - j - 1;
                color = 0;
                if (main.alternate) {
                    color = size % main.count.shades;
                }
                color = main.shades[stacks.length][color];
                // Add the disk.
                disks.push({
                    'color': color,
                    'size': size,
                    'stack': stacks.length
                });
            }
            stacks.push({
                'disks': disks,
                'tower': i
            });
        }
    }
    current = 0;
    while (stacks.length) {
        i = current;
        if (main.shuffle) {
            i = Math.floor(Math.random() * stacks.length);
        }
        stack = stacks[i];
        disks = stack.disks;
        tower = main.towers[stack.tower];
        j = 0;
        if (main.shuffle) {
            j = Math.floor(Math.random() * disks.length);
        }
        disk = disks[j];
        tower.disks.push(disk);
        /*
        If the disks should be randomly placed on the towers, do so without
        automatically solving the puzzle.
        */
        do {
            tower.disks.pop();
            k = stack.tower;
            if (main.random) {
                do {
                    k = main.cycle(
                        stack.tower + Math.floor(
                            Math.random() * main.count.per
                        )
                    );
                    tower = main.towers[k];
                } while (
                    ('limit' in tower && tower.disks.length >= tower.limit) ||
                    (!main.movable(disk, k, false, true) && !main.shuffle)
                );
            }
            // Add the disk.
            disk.tower = k;
            tower.disks.push(disk);
        } while (
            main.solved() &&
            (
                main.count.disks === 1 ||
                !main.shuffle
            )
        );
        disks.splice(j, 1);
        if (!disks.length) {
            stacks.splice(i, 1);
        }
        current++;
        if (current > stacks.length - 1) {
            current = 0;
        }
    }
    for (i = 0; i < main.count.stacks; i++) {
        // Top color
        same = true;
        for (j = i; j < i + main.count.per; j++) {
            last = main.towers[j].disks[main.towers[j].disks.length - 1];
            if (!last || (last.color !== same && same !== true)) {
                same = false;
                break;
            }
            same = last.color;
        }
        if (same && !main.change && !main.shuffle) {
            if (main.restriction === 'same') {
                alert('OK');
            }
            if (main.restriction === 'group') {
                alert('NOK');
            }
        }
    }
    if (main.shuffle) {
        if (same) {
            if (main.restriction === 'same') {
                alert('DOK');
            }
            if (main.restriction === 'group') {
                alert('DNOK');
            }
        }
        if (main.solved()) {
            towers = [];
            for (i = 0; i < main.count.towers; i++) {
                if (main.towers[i].disks) {
                    towers.push(i);
                }
            }
            disks = main.towers[
                Math.floor(Math.random() * towers.length)
            ].disks;
            disk = Math.floor(Math.random() * (disks.length - 1));
            disks.push(disks[disk]);
            disks.splice(disk, 1);
        }
    }
    /*
    if (main.alternate && main.change) {
        // Cycle the colors of each stack.
        for (i = 0; i < main.count.towers; i++) {
            for (
                j = 0;
                j <= main.towers[i].disks.length - main.count.shades;
                j++
            ) {
                colors = [];
                for (k = j; k < j + main.count.shades; k++) {
                    current = main.towers[i].disks[k];
                    while (colors.index(current.color) !== - 1) {
                        current.color = main.color(current);
                    }
                    colors.push(current.color);
                }
            }
        }
    }
    */
    i = 0;
    // Initially hide all of the towers and disks.
    while ($('#tower' + i).length !== 0) {
        $('#tower' + i).hide();
        j = 0;
        while ($('#disk' + i + '-' + j).length !== 0) {
            $('#disk' + i + '-' + j).hide();
            j++;
        }
        i++;
    }
    /*
    Make each tower wide enough so that they take up all of the space in its
    parent while leaving 1% in between the towers.
    */
    width = (101 - main.count.towers) / main.count.towers;
    stackable = main.count.disks;
    if (main.random || main.size) {
        // Count all of the disks.
        stackable *= main.count.stacks;
    }
    /*
    If more than eight disks can be on the same tower, some size adjustments
    must be made.
    */
    if (stackable > 8) {
        /*
        Calculate the height each disk should be so that they can all fit on
        the tower.
        */
        calc = (208 - stackable) / (stackable + 2);
        // The height should be a whole number.
        height = Math.floor(calc);
        // Ofset the lost height by adding to the base.
        offset = Math.round((calc - height) * stackable);
        // Adjust how much the width scales by.
        scale = 80 / stackable;
    } else {
        stackable = 8;
    }
    for (i = 0; i < main.towers.length; i++) {
        element = '#tower' + i;
        // Create the tower if it doesn't already exist.
        if ($(element).length === 0) {
            $(
                '<div />', {
                    'class': 'tower',
                    'id': 'tower' + i
                }
            ).appendTo('#towers');
            $(
                '<input />', {
                    'class': 'star',
                    'id': 'star' + i,
                    'type': 'checkbox'
                }
            ).appendTo(element);
            $('#star' + i).data('tower', i);
            $(
                '<div />', {
                    'class': 'move',
                    'id': 'move' + i
                }
            ).appendTo(element);
            $('#move' + i).data('tower', i);
            $(
                '<div />', {
                    'class': 'disks',
                    'id': 'disks' + i
                }
            ).appendTo('#move' + i);
            $(
                '<div />', {
                    'class': 'popped disk',
                    'id': 'disk' + i
                }
            ).appendTo('#disks' + i);
            $(
                '<ol />', {
                    'class': 'stacked',
                    'id': 'stacked' + i
                }
            ).appendTo('#disks' + i);
            $(
                '<div />', {
                    'class': 'base',
                    'id': 'base' + i
                }
            ).appendTo('#move' + i);
            $(
                '<div />', {
                    'class': 'peg',
                    'id': 'peg' + i
                }
            ).appendTo('#move' + i);
            $(
                '<div />', {
                    'id': 'label' + i,
                    'text': (i + 1)
                }
            ).appendTo('#move' + i);
        }
        $(element).show();
        $(element).css('visibility', 'visible');
        $(element).css('margin-right', '1%');
        $('#tower' + i).css('width', width + '%');
        $('#disk' + i).css('visibility', 'hidden');
        $('#disk' + i).text(' ');
        $('#base' + i).css('background-color', main.towers[i].base);
        $('#base' + i).css('height', height + offset + 'px');
        $('#peg' + i).css('background-color', main.towers[i].peg);
        // If this is the last tower, remove the right margin.
        if (i === main.towers.length - 1) {
            $(element).css('margin-right', '0%');
        }
        for (j = 0; j < stackable; j++) {
            element = '#disk' + i + '-' + j;
            // Create the disk if it doesn't already exist.
            if ($(element).length === 0) {
                $(
                    '<li />', {
                        'class': 'disk',
                        'id': 'disk' + i + '-' + j
                    }
                ).prependTo('#stacked' + i);
            }
            $(element).show();
            $(element).css('visibility', 'hidden');
            $(element).css('height', height + 'px');
            $(element).text(' ');
            if (j < main.towers[i].disks.length) {
                $(element).css('visibility', 'visible');
                disk = main.towers[i].disks[j];
                $(element).css('background-color', disk.color);
                $(element).css(
                    'width',
                    90 - (scale * (main.count.disks - disk.size - 1)) + '%'
                );
                $(element).text(disk.size + 1);
            }
            // Show the number of each disk if possible.
            if (height - 3 < 1) {
                $(element).text('');
            } else {
                $(element).css('font-size', (height - 3) + 'px');
            }
        }
    }
    if (moves) {
        try {
            main.generator = JSON.parse(moves);
            main.minimum = 'Imported';
        } catch (err) {
            alert(err);
            main.generator = [];
        }
        $('#import').val(JSON.stringify(main.generator));
    }
    if (!main.generator.length) {
        solve.start();
    }
    if (!main.generator.length) {
        main.minimum = 'Unsolved';
    }
    if (
        main.change &&
        ['different', 'same', 'group'].index(main.restriction) !== -1
    ) {
        $('.shade').show();
    } else {
        $('.shade').hide();
        main.top = 'Any';
        main.home = false;
    }
    // Update the page accordingly.
    $('#alternate').attr('checked', main.alternate);
    $('#antwerp').attr('checked', main.antwerp);
    $('#change').attr('checked', main.change);
    $('#configuration').val(
        location.href.split('?')[0] + '?' + Base64.encode(JSON.stringify({
            'alternate': main.alternate,
            'antwerp': main.antwerp,
            'change': main.change,
            'count': main.count,
            'home': main.home,
            'random': main.random,
            'restriction': main.restriction,
            'shuffle': main.shuffle,
            'size': main.size,
            'stars': main.stars,
            'top': main.top
        }))
    );
    $('#delay').val(main.delay);
    $('#disks').val(main.count.disks);
    $('#export').val('');
    $('#home').attr('checked', main.home);
    $('#log').val('');
    $('#minimum').text(main.minimum);
    $('#mode').val(main.mode);
    $('#moves').text(main.moves.current);
    $('#per').val(main.count.per);
    $('#random').attr('checked', main.random);
    $('#redo').hide();
    $('#' + main.restriction).attr('checked', true);
    $('#shades').val(main.count.shades);
    $('#shuffle').attr('checked', main.shuffle);
    $('#size').attr('checked', main.size);
    $('#stacks').val(main.count.stacks);
    $('#undo').hide();
    // Populate the top shade list.
    while ($('#top').children().length > main.count.shades + 1) {
        $('#top').children().last().remove();
    }
    while ($('#top').children().length < main.count.shades + 1) {
        num = $('#top').children().length;
        $(
            '<option />', {
                'text': num
            }
        ).appendTo('#top');
    }
    $('#top').val(main.top);
    for (i = 0; i < main.count.towers; i++) {
        checked = (main.stars.index(i) !== -1);
        $('#star' + i).attr('checked', checked);
    }
};

main.solved = function()
{
    /*
    Check whether or not the puzzle has been solved.

    Returns: bool - Whether or not the puzzle has been solved.
    */
    // Assume the puzzle has been solved.
    var i;
    var j;
    var mult = main.count.per - 1;
    var solved = true;
    var target;
    var towers;
    if (main.antwerp) {
        // Cycle through the towers that hold stacks.
        mult = 1;
        towers = main.count.stacks - 1;
    }
    for (i = 0; i < main.count.stacks; i++) {
        // Assume the target tower is the "to" tower.
        target = main.cycle(mult * i + mult, 0, towers);
        if (main.home) {
            target = mult * i;
        }
        /*
        If any of the disks of the target tower belong to a different stack
        than this one, fail.
        */
        for (j = 0; j < main.towers[target].disks.length; j++) {
            if (i !== main.towers[target].disks[j].stack) {
                solved = false;
                break;
            }
        }
        /*
        If the target tower doesn't contain all of the disks of this stack,
        fail.
        */
        if (main.towers[target].disks.length !== main.count.disks) {
            solved = false;
            break;
        }
        if (!main.ordered(target)) {
            solved = false;
            break;
        }
        // If the last disk doesn't have the specified top shade, fail.
        if (
            main.top !== 'Any' &&
            main.towers[target].disks[
                main.towers[target].disks.length - 1
            ].color !== main.shades[i][main.top - 1]
        ) {
            solved = false;
            break;
        }
    }
    return solved;
};

main.start = function(restarting)
{
    /*
    Start the solver.

    ``restarting``
        bool - Whether or not the solver is restarting.
    */
    main.stopped = false;
    // Update the page accordingly.
    $('#switch').val('Stop');
    $('.stopped').hide();
    // Restore to before manual moves were made.
    while (main.manual.length) {
        var args = main.manual.pop();
        // If we are redoing a move, remove it from moves to be redone.
        if (args[1]) {
            main.redo.pop();
        } else if (main.manual.length || main.steps.length % 2) {
            main.steps.pop();
        }
        main.move(args[0], !args[1], args[1], true);
        restarting = true;
    }
    main.redo = [];
    $('#redo').hide();
    // If there are no steps in the generator
    if (!main.generator.length) {
        // If moves have been made, restart.
        if (main.moves.current) {
            main.restart();
            return;
        }
        if (!main.generator.length) {
            alert('No moves to be made.');
            main.stop();
        }
    }
    if (!main.running) {
        main.run(restarting);
    }
};

main.stop = function(stay)
{
    /*
    Stop the solver.

    ``stay``
        bool - Whether or not a popped disk should stay where it is upon
        stopping.
    */
    main.stopped = true;
    // Update the page accordingly.
    $('#switch').val('Start');
    $('.stopped').show();
    main.running = false;
    if (main.popped && !stay) {
        // Place the disk on the tower it came from.
        main.move(main.popped.tower);
    }
};

$(document).ready(
    function() {
        try {
            var value = JSON.parse(Base64.decode(location.href.split('?')[1]));
            var setting;
            for (setting in value) {
                if (setting !== '__prototype__') {
                    main[setting] = value[setting];
                }
            }
        } catch (err) {
        }
        main.setup();
        // Update the page accordingly.
        $('#import').val('');
        $('#other').hide();
        $('#showexport').attr('checked', false);
        $('#showimport').attr('checked', false);
        $('#showlog').attr('checked', false);
        $('.noscript').hide();
        $('.yesscript').show();
        $(document).keypress(
            function(e) {
                // If you are typing a number outside of a textbox, move.
                if (!$(e.target).closest(':input').get(0)) {
                    var tower = parseInt(String.fromCharCode(e.which), 10) - 1;
                    /*
                    If the solver isn't running, make a manual move if the
                    tower is valid.
                    */
                    if (!main.running && !isNaN(tower)) {
                        main.move(tower);
                    }
                }
            }
        );
        $('input[name=restriction]').change(
            function() {
                var value = $('input[name=restriction]:checked').val();
                if (main.restriction !== value) {
                    main.restriction = value;
                    main.setup();
                }
            }
        );
        $('#alternate').change(
            function() {
                main.alternate = ($('#alternate:checked').length);
                main.setup();
            }
        );
        $('#antwerp').change(
            function() {
                main.antwerp = ($('#antwerp:checked').length);
                main.setup();
            }
        );
        $('#change').change(
            function() {
                main.change = ($('#change:checked').length);
                main.setup();
            }
        );
        $('#delay').change(
            function() {
                main.delay = parseInt($('#delay').val(), 10);
                if (isNaN(main.delay) || main.delay < 0) {
                    alert('Invalid value for delay.');
                    main.delay = 250;
                }
                $('#delay').val(main.delay);
            }
        );
        $('#disks').change(
            function() {
                main.count.disks = $('#disks').val();
                main.setup();
            }
        );
        $('#home').change(
            function() {
                main.home = ($('#home:checked').length);
                main.setup();
            }
        );
        $('#import').change(
            function() {
                main.setup();
            }
        );
        $('#mode').change(
            function() {
                var value = $('#mode').val();
                if (main.mode !== value) {
                    main.mode = value;
                }
            }
        );
        $('#per').change(
            function() {
                main.count.per = $('#per').val();
                main.setup();
            }
        );
        $('#random').change(
            function() {
                main.random = ($('#random:checked').length);
                main.setup();
            }
        );
        $('#redo').click(
            function() {
                // Redo a move if possible.
                if (main.redo.length && !main.running) {
                    if (main.popped) {
                        // Place the disk on the tower it came from.
                        main.move(main.popped.tower);
                    }
                    main.move(main.redo.pop(), false, true);
                    main.move(main.redo.pop(), false, true);
                }
            }
        );
        $('#shades').change(
            function() {
                main.count.shades = $('#shades').val();
                main.setup();
            }
        );
        $('#showexport').change(
            function() {
                $('#export').hide();
                if ($('#showexport:checked').length) {
                    $('#export').show();
                }
            }
        );
        $('#showimport').change(
            function() {
                if ($('#import').val()) {
                    $('#import').val('');
                    main.setup();
                }
                $('#import').hide();
                if ($('#showimport:checked').length) {
                    $('#import').show();
                }
            }
        );
        $('#showlog').change(
            function() {
                $('#log').hide();
                if ($('#showlog:checked').length) {
                    $('#log').show();
                }
            }
        );
        $('#showother').click(
            function() {
                if ($('#other').css('display') === 'none') {
                    $('#other').show();
                } else {
                    $('#other').hide();
                }
            }
        );
        $('#shuffle').change(
            function() {
                main.shuffle = ($('#shuffle:checked').length);
                main.setup();
            }
        );
        $('#size').change(
            function() {
                main.size = ($('#size:checked').length);
                main.setup();
            }
        );
        $('#stacks').change(
            function() {
                main.count.stacks = $('#stacks').val();
                main.setup();
            }
        );
        $('#startover').click(
            function() {
                main.setup();
                main.stop();
            }
        );
        $('#switch').click(
            function() {
                if ($('#switch').val() === 'Start') {
                    main.start();
                    return;
                }
                main.stop();
            }
        );
        $('#top').change(
            function() {
                var value = $('#top').val();
                if (main.top !== value) {
                    main.top = value;
                    main.setup();
                }
            }
        );
        $('#undo').click(
            function() {
                // Undo a move if possible.
                if (main.steps.length && !main.running) {
                    if (main.popped) {
                        // Place the disk on the tower it came from.
                        main.move(main.popped.tower);
                    }
                    main.move(main.steps.pop(), true);
                    main.move(main.steps.pop(), true);
                }
            }
        );
        $('.move').live(
            'tap',
            function() {
                // If the solver isn't running, make a manual move.
                if (!main.running) {
                    main.move($(this).data('tower'));
                }
            }
        );
        $('.star').live(
            'change',
            function() {
                var tower = $(this).data('tower');
                var star = tower;
                if (main.count.stacks > 1 && !main.antwerp) {
                    star %= main.count.per - 1;
                }
                if (main.stars.index(star) !== - 1) {
                    main.stars.splice(main.stars.index(star), 1);
                }
                if ($('#star' + tower + ':checked').length) {
                    main.stars.push(star);
                }
                main.setup();
            }
        );
    }
);