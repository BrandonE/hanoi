/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var main = {
    'colors': [
        ['red', 'pink', 'darkred'],
        ['blue', 'lightblue', 'darkblue'],
        ['yellow', 'lightyellow', 'gold'],
        ['green', 'lightgreen', 'darkgreen'],
        ['mediumpurple', 'lavender', 'purple']
    ],
    'count': {
        'disks': 8,
        'per': 3,
        'towers': 3,
        'stacks': 1
    },
    'delay': 250,
    'fact': [1, 1],
    'generator': [],
    'manual': [],
    'minimum': 0,
    'mode': 'Wait',
    'moves': {
        'current': 0,
        'old': 0
    },
    'popped': null,
    'redo': [],
    'running': false,
    'shuffle': false,
    'steps': [],
    'stopped': true,
    'towers': [],
    'variation': 'Classic'
};

Array.prototype.shuffle = function()
{
    var i = this.length;
    while (i--)
    {
        var p = parseInt(Math.random() * this.length, 10);
        var t = this[i];
        this[i] = this[p];
        this[p] = t;
    }
    return this;
};

main.binomial = function(x, y)
{
    var ans = 1;
    var i = 0;
    while (i < y)
    {
        ans *= (x - i) / (i + 1);
        i++;
    }
    return ans;
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
    var color = disk.color;
    var stack = main.colors[disk.stack];
    // Switch between two colors if the variation requires it.
    if (
        main.variation == 'Domino Light' ||
        main.variation == 'Domino Dark' ||
        main.variation == 'Domino Home Light' ||
        main.variation == 'Reversi Light' ||
        main.variation == 'Reversi Dark' ||
        main.variation == 'Reversi Home Light'
    )
    {
        if (color == stack[0])
        {
            return stack[1];
        }
        return stack[0];
    }
    // Switch between three colors if the variation requires it.
    if (
        main.variation == 'Lundon Light' ||
        main.variation == 'Lundon Medium' ||
        main.variation == 'Lundon Dark' ||
        main.variation == 'Lundon Home Light' ||
        main.variation == 'Lundon Home Dark' ||
        main.variation == 'Brandonburg Light' ||
        main.variation == 'Brandonburg Medium' ||
        main.variation == 'Brandonburg Dark' ||
        main.variation == 'Brandonburg Home Light' ||
        main.variation == 'Brandonburg Home Dark'
    )
    {
        if (undo)
        {
            // Go backwards in the cycle.
            if (color == stack[0])
            {
                return stack[2];
            }
            if (color == stack[1])
            {
                return stack[0];
            }
            return stack[1];
        }
        else
        {
            // Go forwards in the cycle.
            if (color == stack[0])
            {
                return stack[1];
            }
            if (color == stack[1])
            {
                return stack[2];
            }
            return stack[0];
        }
    }
    return color;
};

main.cycle = function(tower, start, end)
{
    /*
    Cycle a tower number in a range.

    ``tower``
        int - The tower to range.

    ``start``
        int - The start of the range (Optional. Default: 0).

    ``end``
        int - The end of the range (Optional. Default: main.count.towers).

    Returns: int - The new tower.
    */
    tower = parseInt(tower, 10);
    if (isNaN(tower))
    {
        return tower;
    }
    if (start === undefined)
    {
        start = 0;
    }
    if (end === undefined)
    {
        end = main.count.towers - 1;
    }
    // Decrease the tower number where necessary.
    while (tower > end && (end > start || tower < start))
    {
        tower += start - 1;
        if (end > start)
        {
            tower -= end;
        }
    }
    // Increase the tower number where necessary.
    while (tower < start && end > start)
    {
        tower += end - start + 1;
    }
    return tower;
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
    while (true)
    {
        // If there are no steps in this level.
        if (!current.length)
        {
            // If this is the top level, we are done.
            if (!stack.length)
            {
                break;
            }
            // Go up in the hierarchy.
            current = stack.pop();
        }
        var step = current.shift();
        // If this step is a function, convert to its return value.
        if (typeof(step) == 'function')
        {
            step = step();
        }
        if (typeof(step) != 'object')
        {
            current.unshift(step);
            break;
        }
        else if (step.length)
        {
            // Put the step back.
            current.unshift(step);
            // Go down in the hierarchy.
            stack.push(current);
            current = step;
        }
    }
    return generator;
};

main.factorial = function(n)
{
    for (var i = main.fact.length; i < n + 1; i++)
    {
        main.fact.push(n * main.fact[i - 1]);
    }
    return main.fact[n];
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
    if (main.popped)
    {
        return false;
    }
    /*
    If a move can be made from any tower to any tower other than itself, the
    puzzle hasn't reached an impasse.
    */
    for (var i = 0; i < main.count.towers; i++)
    {
        for (var j = 0; j < main.count.towers; j++)
        {
            var last = main.towers[i].disks[main.towers[i].disks.length - 1];
            if (i != j && main.movable(last, j))
            {
                return false;
            }
        }
    }
    return true;
};

main.load = function()
{
    // Load the appropriate solve source and variation information.
    var name = main.variation.toLowerCase().split(' ');
    var about = name[0];
    name = name.join('_');
    $.ajax(
        {
            'url': 'js/variations/solve/' + name + '.js',
            'dataType': 'text',
            'success': function(data)
            {
                $('#source').val(data);
            }
        }
    );
    $('.variation').hide();
    $('#' + about + '_about').show();
    $('#' + name).show();
};

main.movable = function(disk, tower, undo)
{
    /*
    Check if the disk is movable to a given tower.

    ``disk``
        dict - The properties of the disk to be moved.

    ``tower``
        int - The tower to move it to.

    ``undo``
        bool - Whether or not this move is undoing a previous one.

    Returns: bool - Whether or not the move can be completed.
    */
    // If this disk doesn't exist or the tower is undefined, you can't move it.
    if (!disk || tower === undefined)
    {
        return false;
    }
    tower = main.cycle(tower);
    // You can always move a disk back to the tower you took it from.
    if (tower == disk.tower)
    {
        return true;
    }
    var color = main.color(disk, undo);
    // Find the last disk of this tower.
    var last = main.towers[tower].disks[main.towers[tower].disks.length - 1];
    var mult = main.count.per - 1;
    var to = disk.stack * mult + mult;
    if (main.count.stacks > 1)
    {
        to = main.cycle(to);
    }
    if (
        main.variation == 'Brandonburg Light' ||
        main.variation == 'Brandonburg Medium' ||
        main.variation == 'Brandonburg Dark' ||
        main.variation == 'Brandonburg Home Light' ||
        main.variation == 'Brandonburg Home Dark'
    )
    {
        for (var i = 0; i < main.towers[tower].disks.length; i++)
        {
            var previous;
            // If this isn't the first disk, record the previous disk's color.
            if (i)
            {
                previous = main.towers[tower].disks[i - 1].color;
            }
            var current = main.towers[tower].disks[i].color;
            // Assuming this is the last disk, record the new color.
            var next = color;
            // Otherwise, record the next disk's color.
            if (i != main.towers[tower].disks.length - 1)
            {
                next = main.towers[tower].disks[i + 1].color;
            }
            // If any of these disks have the same color, fail.
            if (previous == current || previous == next || current == next)
            {
                return false;
            }
        }
    }
    // If there are disks on this tower
    if (main.towers[tower].disks.length)
    {
        // If this disk is larger than the last disk, fail.
        if (disk.size > last.size)
        {
            return false;
        }
        /*
        If the variation isn't Antwerp and this disk is the same size as the
        last disk, fail.
        */
        if (main.variation != 'Antwerp' && last.size == disk.size)
        {
            return false;
        }
        /*
        If this disk is the same color as the last disk and this variation
        prohbits disks of the same color touching, fail.
        */
        if (
            (
                main.variation == 'Rainbow' ||
                main.variation == 'Checkers' ||
                main.variation == 'Reversi Light' ||
                main.variation == 'Reversi Dark' ||
                main.variation == 'Reversi Home Light'
            ) &&
            last.color == color
        )
        {
            return false;
        }
        /*
        If this disk is a different color than the last disk, the two disks are
        from the same stack, and this variation prohibits disks of different
        colors from touching, fail.
        */
        if (
            (
                main.variation == 'Domino Light' ||
                main.variation == 'Domino Dark' ||
                main.variation == 'Domino Home Light' ||
                main.variation == 'Lundon Light' ||
                main.variation == 'Lundon Medium' ||
                main.variation == 'Lundon Dark' ||
                main.variation == 'Lundon Home Light' ||
                main.variation == 'Lundon Home Dark'
            ) &&
            last.color != color &&
            last.stack == disk.stack
        )
        {
            return false;
        }
    }
    /*
    If the variation is Cyclic and the target tower isn't next in the cycle,
    fail.
    */
    if (
        main.variation == 'Cyclic' &&
        tower != main.cycle(
            main.cycle(
                disk.tower + 1,
                disk.stack * mult,
                to
            )
        )
    )
    {
        return false;
    }
    /*
    If the variation is Star and this move is not from nor to the star tower,
    fail.
    */
    if (
        main.variation == 'Star' &&
        disk.tower != 1 &&
        tower != 1
    )
    {
        return false;
    }
    /*
    If there are multiple stacks, the variation isn't Antwerp, and this tower
    isn't in the range this disk's stack is allowed to be on, fail.
    */
    if (
        main.count.stacks > 1 &&
        main.variation != 'Antwerp' &&
        (
            tower - disk.stack * mult > mult ||
            tower - disk.stack * mult < 0
        ) &&
        tower != to
    )
    {
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
    // If this move is futile, restart the puzzle.
    if (main.solved() || (main.impasse() && !undo))
    {
        main.setup();
        return;
    }
    tower = main.cycle(parseInt(tower, 10));
    /*
    If the tower is invalid, show an error message with the real tower number
    and stop moving.
    */
    if (isNaN(tower))
    {
        alert('Invalid move: ' + (tower + 1));
        main.stop();
        return;
    }
    var color;
    var disk;
    var i;
    var hide;
    var show;
    // If a disk has been popped off a tower
    if (main.popped)
    {
        if (!main.movable(main.popped, tower, undo))
        {
            // Show an error message with the real tower numbers.
            alert(
                'Invalid move: ' + (main.popped.tower + 1) + '-' + (tower + 1)
            );
            main.stop(true);
            // Place the disk on the tower it came from.
            tower = main.popped.tower;
        }
        /*
        Else, if the move is different tower than the one it was popped off
        from
        */
        else if (main.popped.tower != tower)
        {
            // Adjust the color.
            main.popped.color = main.color(main.popped, undo);
            if (undo)
            {
                // Reduce the number of moves accordingly.
                main.moves.current--;
                // Add this move to a list of moves that can be redone.
                main.redo.push(main.popped.tower);
                main.redo.push(tower);
            }
            else
            {
                // Increase the number of moves accordingly.
                main.moves.current++;
                // Add this move to a list.
                main.steps.push(main.popped.tower);
                main.steps.push(tower);
                if (!redo)
                {
                    // This move overwrites the undone moves.
                    main.redo = [];
                }
            }
            // Based on the moves made, build the Log and Move Source.
            var log = [];
            var movesource = [];
            for (i = 0; i < main.steps.length; i++)
            {
                // Group the steps of a move together in the log.
                if (i % 2 === 0)
                {
                    // Show the real tower numbers.
                    log.push(
                        (main.steps[i] + 1) + '-' + (main.steps[i + 1] + 1)
                    );
                }
                movesource.push(main.steps[i]);
            }
            $('#log').val(log.join(',\n'));
            $('#movesource').val(
                'main.generator = [' + movesource.join(', ') + '];'
            );
        }
        // Show the top disk of this tower.
        show = '#disk' + tower + '-' + main.towers[tower].disks.length;
        // Hide the popped disk.
        hide = '#disk' + main.popped.tower;
        disk = main.popped.size;
        color = main.popped.color;
        main.popped.tower = tower;
        // Add the disk to the tower.
        main.towers[tower].disks.push(main.popped);
        main.popped = null;
    }
    // Else, if there are disks on this tower
    else if (main.towers[tower].disks.length)
    {
        // Pop the top disk from the tower.
        main.popped = main.towers[tower].disks.pop();
        // Show the popped disk.
        show = '#disk' + tower;
        // Hide the top disk of this tower.
        hide = '#disk' + tower + '-' + main.towers[tower].disks.length;
        disk = main.popped.size;
        color = main.color(main.popped, undo);
    }
    // Else, there is nothing to be done.
    else
    {
        return;
    }
    $(show).css('visibility', 'visible');
    $(show).css('width', $(hide).css('width'));
    $(show).css('background-color', color);
    // Only update the text if there previously was text.
    if ($(show).text())
    {
        $(show).text(disk + 1);
    }
    $(hide).css('visibility', 'hidden');
    // If this is not a manual move, store the current number of moves.
    if (main.running)
    {
        main.moves.old = main.moves.current;
    }
    else if (restoring)
    {
        // Restore the number of moves.
        main.moves.current = main.moves.old;
    }
    else
    {
        // Add the arguments to a list in preparation to be restored.
        main.manual.push(arguments);
    }
    $('#moves').text(main.moves.current);
    $('#redo').css('visibility', 'hidden');
    $('#undo').css('visibility', 'hidden');
    // If the puzzle hasn't been solved
    if (!main.solved())
    {
        // Show the redo button if there are moves to be redone.
        if (main.redo.length)
        {
            $('#redo').css('visibility', 'visible');
        }
        // Show the undo button if there are moves to be undone.
        if (main.steps.length)
        {
            $('#undo').css('visibility', 'visible');
        }
    }
    // Else, if the solver isn't running, show an appropriate message.
    else if (!main.running)
    {
        if (main.minimum == 'N/A')
        {
            alert('Puzzle solved.');
        }
        else if (main.moves.current < main.minimum)
        {
            alert('Puzzle solved in less moves than the current minimum.');
        }
        else if (main.moves.current == main.minimum)
        {
            alert('Puzzle solved in the current minimum number of moves.');
        }
        else
        {
            alert('Puzzle solved in more moves than the current minimum.');
        }
    }
    // If the puzzle has reached an impasse, show an appropriate message.
    if (main.impasse())
    {
        alert('Puzzle has reached an impasse.');
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
    while (current.length)
    {
        var step = current.shift();
        if (typeof(step) == 'object')
        {
            // Put the step back.
            current.unshift(step);
            // Go down in the hierarchy.
            current = step;
        }
        else
        {
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
    for (var i = 0; i < main.towers[tower].disks.length; i++)
    {
        if (main.count.disks - i - 1 != main.towers[tower].disks[i].size)
        {
            return false;
        }
    }
    return true;
};

main.pick = function(stacks, func, data, stack)
{
    /*
    Create a generator that returns the moves from the stacks in the order that
    it picks.

    ``stacks``
        list - The generators for each stack.

    ``func``
        func - The function used to pick the stack to return a move from.

    ``data``
        dict - Data for the function to use (Optional. Default: {}).

    ``stack``
        int - The current picked stack (Optional. Default: 0).

    Returns: list - The generator.
    */
    if (data === undefined)
    {
        data = {};
    }
    if (stack === undefined)
    {
        stack = 0;
    }
    // A stack only needs to be picked if there is more than one stack.
    if (main.count.stacks > 1)
    {
        var result = func(stack, data);
        stack = result.stack;
        data = result.data;
    }
    main.exhaust(stacks[stack]);
    /*
    If this generator contains moves, return a generator containing the next
    move of it and repeat the picking process.
    */
    if (stacks[stack].length)
    {
        return [
            main.next(stacks[stack]),
            function()
            {
                return main.pick(stacks, func, data, stack);
            }
        ];
    }
    return [];
};

main.restart = function()
{
    // Set up the towers and restart the solver.
    // If a disk should be added, add it.
    if (main.mode == 'Increase' && main.count.disks != 100)
    {
        main.count.disks++;
        $('#diskcount').val(main.count.disks);
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
    // Assume the generator's done running.
    main.running = false;
    // If the solver has not been stopped
    if (!main.stopped)
    {
        main.exhaust(main.generator);
        // If there are steps in the generator
        if (main.generator.length)
        {
            // The solver isn't done running.
            main.running = true;
            if (!restarting)
            {
                main.move(main.next(main.generator));
            }
            setTimeout(main.run, main.delay);
            return;
        }
        if (main.mode == 'Wait')
        {
            main.stop();
            return;
        }
        main.restart();
    }
};

main.setup = function()
{
    // Set up the towers.
    main.stop();
    // Set the default values.
    main.generator = [];
    main.manual = [];
    main.moves.current = 0;
    main.moves.old = 0;
    main.popped = null;
    main.redo = [];
    main.steps = [];
    main.towers = [];
    // There must be at least three towers per stack.
    if (main.count.per < 3)
    {
        main.count.per = 3;
    }
    // Some variations require at least four towers per stack.
    if (
        main.count.per < 4 &&
        (
            main.variation == 'Reversi Light' ||
            main.variation == 'Reversi Dark' ||
            main.variation == 'Reversi Home Light' ||
            main.variation == 'Star' ||
            main.variation == 'Brandonburg Light' ||
            main.variation == 'Brandonburg Medium' ||
            main.variation == 'Brandonburg Dark' ||
            main.variation == 'Brandonburg Home Light' ||
            main.variation == 'Brandonburg Home Dark'
        )
    )
    {
        main.count.per = 4;
    }
    // There can't be more than six towers per stack.
    if (main.count.per > 6)
    {
        main.count.per = 6;
    }
    var minimum = 1;
    // If this variation is Antwerp, there must be at least two stacks.
    if (main.variation == 'Antwerp')
    {
        minimum = 2;
    }
    if (main.count.stacks < minimum)
    {
        main.count.stacks = minimum;
    }
    // If the variation is Antwerp, there cannot be more stacks than towers.
    if (main.variation == 'Antwerp' && main.count.stacks > main.count.per)
    {
        main.count.stacks = main.count.per;
    }
    // There can't be more than five stacks.
    if (main.count.stacks > 5)
    {
        main.count.stacks = 5;
    }
    // There must be at least one disk.
    if (main.count.disks < 1)
    {
        main.count.disks = 1;
    }
    var maximum = 100;
    // If this variation is Antwerp, adjust the maximum number of disks.
    if (main.variation == 'Antwerp')
    {
        maximum = Math.floor(100 / main.count.stacks);
    }
    // Restrict the disks.
    if (main.count.disks > maximum)
    {
        main.count.disks = maximum;
    }
    /*
    Calculate the number of towers based on the number of stacks and the towers
    per stack.
    */
    main.count.towers = main.count.per * main.count.stacks - main.count.stacks;
    $('#per').text('Towers per Stack');
    // If the variation is Antwerp, all towers are shared.
    if (main.variation == 'Antwerp')
    {
        main.count.towers = main.count.per;
        $('#per').text('Towers');
    }
    else if (main.count.stacks == 1)
    {
        main.count.towers++;
    }
    // Calculate the minimum moves for the this variation.
    main.minimum = 'N/A';
    var i;
    if (!main.shuffle)
    {
        if (main.variation == 'Classic')
        {
            if (main.count.stacks == 1)
            {
                main.minimum = classic.more.moves(
                    main.count.disks, main.count.towers
                );
            }
            else
            {
                main.minimum = classic.three.moves(main.count.disks);
            }
            if (main.count.stacks == 2)
            {
                main.minimum *= 3;
            }
            if (main.count.stacks > 2)
            {
                main.minimum = (
                    main.count.stacks * main.minimum
                ) + classic.three.moves(
                    main.count.disks - 1
                ) + 1;
            }
        }
        if (main.variation == 'Cyclic')
        {
            if (main.count.stacks == 1 && main.count.per == 3)
            {
                main.minimum = cyclic.moves(main.count.disks);
            }
        }
        if (main.variation == 'Rainbow')
        {
            main.minimum = rainbow.moves(main.count.disks);
            if (main.count.stacks > 1)
            {
                main.minimum *= main.count.stacks + 1;
            }
        }
        if (main.variation == 'Antwerp')
        {
            if (main.count.stacks == 2)
            {
                var minus = 11;
                if (main.count.disks % 2)
                {
                    minus = 10;
                }
                main.minimum = (
                    7 * Math.pow(
                        2, main.count.disks + 1
                    ) - 9 * main.count.disks - minus
                ) / 3;
            }
            if (main.count.stacks == 3)
            {
                main.minimum = 5;
                if (main.count.disks > 1)
                {
                    main.minimum = 12 * Math.pow(
                        2, main.count.disks
                    ) - (8 * main.count.disks) - 10;
                }
            }
        }
        if (main.variation == 'Checkers')
        {
            if (main.count.per == 3)
            {
                main.minimum = classic.three.moves(main.count.disks);
                if (main.count.stacks > 1)
                {
                    main.minimum *= main.count.stacks + 1;
                }
            }
        }
        if (main.count.stacks == 1)
        {
            if (
                main.variation == 'Domino Light' ||
                main.variation == 'Domino Dark' ||
                main.variation == 'Domino Home Light'
            )
            {
                var m = $M(
                [
                    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2],
                    [0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 3],
                    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 2],
                    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
                    [0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]]
                );
                var s = $V([1, 2, 3, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1]);
                for (i = 0; i < main.count.disks - 1; i++)
                {
                    s = m.x(s);
                }
                main.minimum = s.elements[0];
                if (main.variation == 'Domino Dark')
                {
                    main.minimum = s.elements[1];
                }
                if (main.variation == 'Domino Home Light')
                {
                    main.minimum = s.elements[2];
                }
            }
            if (main.variation == 'Star')
            {
                star.start();
            }
            if (main.variation == 'Lundon Light')
            {
                main.minimum = cyclic.moves(main.count.disks, true);
            }
            if (main.variation == 'Lundon Medium')
            {
                main.minimum = cyclic.moves(
                    main.count.disks - 1
                ) + cyclic.moves(main.count.disks - 1, true) + 3;
            }
            if (main.variation == 'Lundon Dark')
            {
                main.minimum = cyclic.moves(main.count.disks);
            }
            if (main.variation == 'Lundon Home Light')
            {
                main.minimum = cyclic.moves(
                    main.count.disks - 1
                ) + cyclic.moves(main.count.disks - 1) + 4;
            }
            if (main.variation == 'Lundon Home Dark')
            {
                main.minimum = cyclic.moves(
                    main.count.disks - 1, true
                ) + cyclic.moves(
                    main.count.disks - 1, true
                ) + 2;
            }
        }
    }
    // Update the page accordingly.
    $('#diskcount').val(main.count.disks);
    $('#log').val('');
    $('#minimum').text(main.minimum);
    $('#moves').text(main.moves.current);
    $('#movesource').val('');
    $('#redo').css('visibility', 'hidden');
    $('#source').attr('readonly', '');
    $('#stackcount').val(main.count.stacks);
    $('#percount').val(main.count.per);
    $('#undo').css('visibility', 'hidden');
    // Show additional information if necessary.
    $('#multi').hide();
    $('#shuffling').hide();
    if (main.count.stacks > 1 && main.variation != 'Antwerp')
    {
        $('#multi').show();
    }
    if (main.shuffle)
    {
        $('#shuffling').show();
    }
    var color;
    var denom = main.count.per - 1;
    var towers = main.count.towers - 1;
    // If the variation is Antwerp, cycle through the towers that hold stacks.
    if (main.variation == 'Antwerp')
    {
        denom = 1;
        towers = main.count.stacks - 1;
    }
    for (i = 0; i < main.count.towers; i++)
    {
        // Assume the base and peg of this tower is grey.
        var base = 'grey';
        var peg = 'grey';
        var remainder = i % denom;
        // If there is more than one stack
        if (main.count.stacks > 1 || main.variation == 'Antwerp')
        {
            /*
            If this tower is one of a stack's "using" towers, make the color
            base and peg the same as the stack.
            */
            if (remainder)
            {
                base = main.colors[(i - remainder) / denom][0];
                peg = base;
            }
            else
            {
                color = i / denom;
                /*
                If the variation isn't Antwerp, make the base the same color as
                the stack that is from this tower.
                */
                if (main.variation != 'Antwerp')
                {
                    base = main.colors[color][0];
                }
                color = main.cycle(i - denom, 0, towers) / denom;
                /*
                If this tower is in the cycle, make the peg the same color as
                the stack that should move to this tower.
                */
                if (i < towers + 1)
                {
                    peg = main.colors[color][0];
                }
            }
        }
        /*
        If the variation is Star and the tower is the first one after the
        "from" tower, make the peg white.
        */
        if (main.variation == 'Star' && remainder == 1)
        {
            peg = 'white';
        }
        // Add the tower.
        main.towers.push({
            'base': base,
            'disks': [],
            'peg': peg
        });
    }
    // Place a stack on the appropriate towers.
    var stacks = [0];
    if (main.count.stacks > 1)
    {
        for (i = 1; i < main.count.towers; i++)
        {
            if (
                (
                    main.variation == 'Antwerp' &&
                    i < main.count.stacks
                ) ||
                (
                    main.variation != 'Antwerp' &&
                    i % denom === 0
                )
            )
            {
                stacks.push(i);
            }
        }
    }
    var j;
    for (i = 0; i < stacks.length; i++)
    {
        var stack = stacks[i];
        var shuffle = [];
        /*
        Allow all of the towers in the range to initially be shuffled to.
        */
        for (j = stack; j < stack + main.count.per; j++)
        {
            shuffle.push({'tower': j});
        }
        var tower;
        // If the variation is a Domino variation or a Lundon variation
        if (
            main.variation == 'Domino Light' ||
            main.variation == 'Domino Dark' ||
            main.variation == 'Domino Home Light' ||
            main.variation == 'Lundon Light' ||
            main.variation == 'Lundon Medium' ||
            main.variation == 'Lundon Dark' ||
            main.variation == 'Lundon Home Light' ||
            main.variation == 'Lundon Home Dark'
        )
        {
            // Force a tower to be empty.
            tower = Math.floor(Math.random() * shuffle.length);
            shuffle.splice(tower, 1);
        }
        // If the variation is a Lundon variation
        if (
            main.variation == 'Lundon Light' ||
            main.variation == 'Lundon Medium' ||
            main.variation == 'Lundon Dark' ||
            main.variation == 'Lundon Home Light' ||
            main.variation == 'Lundon Home Dark'
        )
        {
            // Force a tower to contain one disk at maximum.
            tower = Math.floor(Math.random() * shuffle.length);
            shuffle[tower].limit = 1;
        }
        for (j = 0; j < main.count.disks; j++)
        {
            // Assume the disk color is the medium color.
            color = main.colors[i][0];
            // The size of disks should shrink as you add them.
            var size = main.count.disks - j - 1;
            /*
            Switch between three colors if the variation requires it,
            medium color on top.
            */
            if (
                main.variation == 'Rainbow' ||
                main.variation == 'Brandonburg Light' ||
                main.variation == 'Brandonburg Medium' ||
                main.variation == 'Brandonburg Dark' ||
                main.variation == 'Brandonburg Home Light' ||
                main.variation == 'Brandonburg Home Dark'
            )
            {
                if (size % 3 == 1)
                {
                    color = main.colors[i][1];
                }
                if (size % 3 == 2)
                {
                    color = main.colors[i][2];
                }
            }
            /*
            Switch between two colors if the variation requires it, medium
            color on top.
            */
            else if (
                size % 2 &&
                main.variation != 'Antwerp' &&
                main.variation != 'Cyclic' &&
                main.variation != 'Domino Light' &&
                main.variation != 'Domino Dark' &&
                main.variation != 'Domino Home Light' &&
                main.variation != 'Star' &&
                main.variation != 'Lundon Light' &&
                main.variation != 'Lundon Medium' &&
                main.variation != 'Lundon Dark' &&
                main.variation != 'Lundon Home Light' &&
                main.variation != 'Lundon Home Dark'
            )
            {
                color = main.colors[i][1];
            }
            /*
            Assume that we should place the disks on the specified
            tower.
            */
            tower = stack;
            var index = null;
            /*
            If the disks should be shuffled, place the disks in such a way
            that the tower of the disks are randomized, yet the puzzle
            isn't automatically solved.
            */
            do
            {
                if (index !== null)
                {
                    main.towers[tower].disks.pop();
                }
                if (main.shuffle)
                {
                    index = Math.floor(Math.random() * shuffle.length);
                    tower = main.cycle(shuffle[index].tower);
                }
                // Add the disk.
                main.towers[tower].disks.push({
                    'color': color,
                    'size': size,
                    'stack': i,
                    'tower': tower
                });
            }
            while (main.solved() && main.count.disks == 1);
            /*
            If the disks should be shuffled and this tower already contains
            the amount of disks it's allowed to, remove it from the towers
            it can be shuffled to.
            */
            if (
                main.shuffle &&
                main.towers[tower].disks.length == shuffle[index].limit
            )
            {
                shuffle.splice(index, 1);
            }
        }
        /*
        If the disks should be shuffled, shuffle on all of the towers in the
        cycle in such a way that the order of the disks are randomized, yet the
        puzzle isn't automatically solved.
        */
        if (main.shuffle)
        {
            for (j = stack; j < stack + main.count.per; j++)
            {
                tower = main.cycle(j);
                do
                {
                    main.towers[tower].disks.shuffle();
                }
                while (main.solved() && main.count.disks > 1);
            }
        }
    }
    if (
        main.variation == 'Reversi Light' ||
        main.variation == 'Reversi Dark' ||
        main.variation == 'Reversi Home Light' ||
        main.variation == 'Brandonburg Light' ||
        main.variation == 'Brandonburg Medium' ||
        main.variation == 'Brandonburg Dark' ||
        main.variation == 'Brandonburg Home Light' ||
        main.variation == 'Brandonburg Home Dark'
    )
    {
        for (i = 0; i < main.count.towers; i++)
        {
            for (j = 0; j < main.towers[i].disks.length; j++)
            {
                var previous = main.towers[i].disks[j - 1];
                var current = main.towers[i].disks[j];
                var next = main.towers[i].disks[j + 1];
                /*
                While the current disk is the same as the previous one,
                cycle it.
                */
                while (previous && previous.color == current.color)
                {
                    current.color = main.color(current);
                }
                /*
                While the variation is not one of the Reversis and the next
                disk is the same as the previous or current one, cycle it.
                */
                while (
                    main.variation != 'Reversi Light' &&
                    main.variation != 'Reversi Dark' &&
                    main.variation != 'Reversi Home Light' &&
                    next &&
                    (
                        (previous && previous.color == next.color) ||
                        current.color == next.color
                    )
                )
                {
                    next.color = main.color(next);
                }
            }
        }
    }
    i = 0;
    // Initially hide all of the towers and disks.
    while ($('#tower' + i).length !== 0)
    {
        $('#tower' + i).hide();
        j = 0;
        while ($('#disk' + i + '-' + j).length !== 0)
        {
            $('#disk' + i + '-' + j).hide();
            j++;
        }
        i++;
    }
    /*
    Make each tower wide enough so that they take up all of the space in its
    parent while leaving 1% in between the towers.
    */
    var width = (101 - main.count.towers) / main.count.towers;
    var height = 20;
    var offset = 0;
    var scale = 10;
    var stackable = main.count.disks;
    /*
    As all of the stacks can be on the same tower when the disks are shuffled
    and in the Antwerp variation, count all of the disks in either case.
    */
    if (main.shuffle || main.variation == 'Antwerp')
    {
        stackable *= main.count.stacks;
    }
    /*
    If more than eight disks can be on the same tower, some size adjustments
    must be made.
    */
    if (stackable > 8)
    {
        /*
        Calculate the height each disk should be so that they can all fit on
        the tower.
        */
        var calc = (208 - stackable) / (stackable + 2);
        // The height should be a whole number.
        height = Math.floor(calc);
        // Ofset the lost height by adding to the base.
        offset = Math.round((calc - height) * stackable);
        // Adjust how much the width scales by.
        scale = 80 / stackable;
    }
    else
    {
        stackable = 8;
    }
    for (i = 0; i < main.towers.length; i++)
    {
        var element = '#tower' + i;
        // Create the tower if it doesn't already exist.
        if ($(element).length === 0)
        {
            $(
                '<div />',
                {
                    'class': 'tower',
                    'id': 'tower' + i
                }
            ).appendTo('#towers');
            $(element).data('tower', i);
            $(
                '<div />',
                {
                    'class': 'disks',
                    'id': 'disks' + i
                }
            ).appendTo(element);
            $(
                '<div />',
                {
                    'class': 'popped disk',
                    'id': 'disk' + i
                }
            ).appendTo('#disks' + i);
            $(
                '<ol />',
                {
                    'class': 'stacked',
                    'id': 'stacked' + i
                }
            ).appendTo('#disks' + i);
            $(
                '<div />',
                {
                    'class': 'base',
                    'id': 'base' + i
                }
            ).appendTo(element);
            $(
                '<div />',
                {
                    'id': 'label' + i,
                    'text': (i + 1)
                }
            ).appendTo(element);
            $(
                '<div />',
                {
                    'class': 'peg',
                    'id': 'peg' + i
                }
            ).appendTo(element);
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
        if (i == main.towers.length - 1)
        {
            $(element).css('margin-right', '0%');
        }
        for (j = 0; j < stackable; j++)
        {
            element = '#disk' + i + '-' + j;
            // Create the disk if it doesn't already exist.
            if ($(element).length === 0)
            {
                $(
                    '<li />',
                    {
                        'class': 'disk',
                        'id': 'disk' + i + '-' + j
                    }
                ).prependTo('#stacked' + i);
            }
            $(element).show();
            $(element).css('visibility', 'hidden');
            $(element).css('height', height + 'px');
            $(element).text(' ');
            if (j < main.towers[i].disks.length)
            {
                $(element).css('visibility', 'visible');
                var disk = main.towers[i].disks[j];
                $(element).css('background-color', disk.color);
                $(element).css(
                    'width',
                    90 - (scale * (main.count.disks - disk.size - 1)) + '%'
                );
                $(element).text(disk.size + 1);
            }
            // Show the number of each disk if possible.
            if (height - 3 < 1)
            {
                $(element).text('');
            }
            else
            {
                $(element).css('font-size', (height - 3) + 'px');
            }
        }
    }
};

main.solved = function()
{
    /*
    Check whether or not the puzzle has been solved.

    Returns: bool - Whether or not the puzzle has been solved.
    */
    // Assume the puzzle has been solved.
    solved = true;
    var mult = main.count.per - 1;
    var towers;
    // If the variation is Antwerp, cycle through the towers that hold stacks.
    if (main.variation == 'Antwerp')
    {
        mult = 1;
        towers = main.count.stacks - 1;
    }
    for (i = 0; i < main.count.stacks; i++)
    {
        // Assume the target tower is the "to" tower.
        var target = main.cycle(mult * i + mult, 0, towers);
        // Some variations use the "from" tower as the target tower.
        if (
            main.variation == 'Domino Home Light' ||
            main.variation == 'Reversi Home Light' ||
            main.variation == 'Lundon Home Light' ||
            main.variation == 'Lundon Home Dark' ||
            main.variation == 'Brandonburg Home Light' ||
            main.variation == 'Brandonburg Home Dark'
        )
        {
            target = mult * i;
        }
        /*
        If any of the disks of the target tower belong to a different stack
        than this one, fail.
        */
        for (var j = 0; j < main.towers[target].disks.length; j++)
        {
            if (i != main.towers[target].disks[j].stack)
            {
                solved = false;
                break;
            }
        }
        /*
        If the target tower doesn't contain all of the disks of this stack,
        fail.
        */
        if (main.towers[target].disks.length != main.count.disks)
        {
            solved = false;
            break;
        }
        if (!main.ordered(target))
        {
            solved = false;
        }
        // Find the last disk of this tower.
        var last = main.towers[target].disks[
            main.towers[target].disks.length - 1
        ];
        /*
        If the top disk of this stack isn't the medium color and this variation
        requires that it is to win, fail.
        */
        if (
            (
                main.variation == 'Domino Dark' ||
                main.variation == 'Reversi Dark' ||
                main.variation == 'Lundon Medium' ||
                main.variation == 'Brandonburg Medium'
            ) &&
            last.color != main.colors[i][0]
        )
        {
            solved = false;
        }
        /*
        If the top disk of this stack isn't the light color and this variation
        requires that it is to win, fail.
        */
        if (
            (
                main.variation == 'Domino Light' ||
                main.variation == 'Domino Home Light' ||
                main.variation == 'Reversi Light' ||
                main.variation == 'Reversi Light' ||
                main.variation == 'Lundon Light' ||
                main.variation == 'Lundon Home Light' ||
                main.variation == 'Brandonburg Light' ||
                main.variation == 'Brandonburg Home Light'
            ) &&
            last.color != main.colors[i][1]
        )
        {
            solved = false;
        }
        /*
        If the top disk of this stack isn't the dark color and this variation
        requires that it is to win, fail.
        */
        if (
            (
                main.variation == 'Lundon Dark' ||
                main.variation == 'Lundon Home Dark' ||
                main.variation == 'Brandonburg Dark' ||
                main.variation == 'Brandonburg Home Dark'
            ) &&
            last.color != main.colors[i][2]
        )
        {
            solved = false;
        }
        if (!solved)
        {
            break;
        }
    }
    return solved;
};

main.stacks = function(func, first, other, shortcut)
{
    /*
    Create the generators for all of the stacks.

    ``func``
        func - The function used to generate the moves for a single stack game.

    ``first``
        func - The function used to generate the moves for the first stack.

    ``other``
        func - The function used to generate the moves for the other stacks.

    ``shortcut``
        func - The function used to generate the moves for the first stack
        using a shortcut (Optional).

    Returns: list - The generators for each stack.
    */
    var stacks = [];
    for (var i = 0; i < main.count.stacks; i++)
    {
        // If this is the first stack and not the only stack
        if (!i && main.count.stacks > 1)
        {
            /*
            If a shortcut was provided and there are more than two stacks, use
            it.
            */
            if (shortcut && main.count.stacks > 2)
            {
                stacks.push(shortcut(func, i));
            }
            // Else, use the first function.
            else
            {
                stacks.push(first(func, i));
            }
        }
        // Else, use the other function.
        else
        {
            stacks.push(other(func, i));
        }
    }
    return stacks;
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
    $('#delay').attr('readonly', 'readonly');
    $('#source').attr('readonly', 'readonly');
    $('.stopped').hide();
    // Restore to before manual moves were made.
    while (main.manual.length)
    {
        var args = main.manual.pop();
        // If we are redoing a move, remove it from moves to be redone.
        if (args[1])
        {
            main.redo.pop();
        }
        /*
        Else, if this move isn't the last to be restored or there are an odd
        number of steps, remove the move from the steps.
        */
        else if (main.manual.length || main.steps.length % 2)
        {
            main.steps.pop();
        }
        main.move(args[0], !args[1], args[1], true);
        restarting = true;
    }
    // If there are no steps in the generator
    if (!main.generator.length)
    {
        // If moves have been made, restart.
        if (main.moves.current)
        {
            main.restart();
            return;
        }
        try
        {
            // Attempt to evaluate the source.
            eval($('#source').val());
            if (!main.generator.length)
            {
                alert('Error: No moves to be made.');
                main.stop();
            }
        }
        catch (err)
        {
            // Show the resulting error.
            alert(err);
            main.stop();
        }
    }
    if (!main.running)
    {
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
    $('#delay').attr('readonly', '');
    $('.stopped').show();
    main.running = false;
    if (main.popped && !stay)
    {
        // Place the disk on the tower it came from.
        main.move(main.popped.tower);
    }
};

main.xor = function(a, b)
{
    return ((a || b) && !(a && b));
};

$(document).ready(
    function()
    {
        // Populate the list of variations.
        var variations = [
            'Classic', 'Cyclic', 'Rainbow', 'Antwerp', 'Domino Light',
            'Domino Dark', 'Domino Home Light', 'Checkers', 'Reversi Light',
            'Reversi Dark', 'Reversi Home Light', 'Star', 'Lundon Light',
            'Lundon Medium', 'Lundon Dark', 'Lundon Home Light',
            'Lundon Home Dark', 'Brandonburg Light', 'Brandonburg Medium',
            'Brandonburg Dark', 'Brandonburg Home Light',
            'Brandonburg Home Dark'
        ];
        for (var i = 1; i < variations.length; i++)
        {
            $(
                '<option />',
                {
                    'text': variations[i]
                }
            ).appendTo('#variation');
        }
        main.setup();
        main.load();
        // Update the page accordingly.
        $('#delay').val(main.delay);
        $('#draw').attr('checked', true);
        $('#mode').val(main.mode);
        $('#showlog').attr('checked', false);
        $('#showmovesource').attr('checked', false);
        $('#showsource').attr('checked', false);
        $('.source').css('visibility', 'hidden');
        $('.noscript').hide();
        $('.yesscript').show();
        $(document).keypress(
            function(e)
            {
                // If you are typing a number outside of a textbox, move.
                if (!$(e.target).closest(':input').get(0))
                {
                    var tower = parseInt(String.fromCharCode(e.which), 10) - 1;
                    if (!isNaN(tower))
                    {
                        main.move(tower);
                    }
                }
            }
        );
        $('#delay').blur(
            function()
            {
                var value = parseInt($('#delay').val(), 10);
                if (main.delay != value && !isNaN(value))
                {
                    main.delay = value;
                    // The delay can't be a negative number.
                    if (main.delay < 0)
                    {
                        main.delay = 0;
                    }
                }
                $('#delay').val(main.delay);
            }
        );
        $('#diskcount').blur(
            function()
            {
                var value = parseInt($('#diskcount').val(), 10);
                if (main.count.disks != value && !isNaN(value))
                {
                    main.count.disks = value;
                    main.setup();
                }
            }
        );
        $('#draw').change(
            function()
            {
                $('#towers').hide();
                if ($('#draw:checked').length)
                {
                    $('#towers').show();
                }
            }
        );
        $('#mode').change(
            function()
            {
                var value = $('#mode').val();
                if (main.mode != value)
                {
                    main.mode = value;
                }
            }
        );
        $('#redo').click(
            function()
            {
                // Redo a move if possible.
                if (main.redo.length && !main.running)
                {
                    if (main.popped)
                    {
                        // Place the disk on the tower it came from.
                        main.move(main.popped.tower);
                    }
                    main.move(main.redo.pop(), false, true);
                    main.move(main.redo.pop(), false, true);
                }
            }
        );
        $('#reload').click(
            function()
            {
                main.load();
            }
        );
        $('#showlog').change(
            function()
            {
                $('#log').hide();
                if ($('#showlog:checked').length)
                {
                    $('#log').show();
                }
            }
        );
        $('#showmovesource').change(
            function()
            {
                $('#movesource').hide();
                if ($('#showmovesource:checked').length)
                {
                    $('#movesource').show();
                }
            }
        );
        $('#showsource').change(
            function()
            {
                $('.source').css('visibility', 'hidden');
                if ($('#showsource:checked').length)
                {
                    $('.source').css('visibility', 'visible');
                }
            }
        );
        $('#shuffle').change(
            function()
            {
                main.shuffle = ($('#shuffle:checked').length);
                main.setup();
            }
        );
        $('#stackcount').blur(
            function()
            {
                var value = parseInt($('#stackcount').val(), 10);
                if (main.count.stacks != value && !isNaN(value))
                {
                    main.count.stacks = value;
                    main.setup();
                }
            }
        );
        $('#startover').click(
            function()
            {
                main.setup();
                main.stop();
            }
        );
        $('#switch').click(
            function()
            {
                if ($('#switch').val() == 'Start')
                {
                    main.start();
                    return;
                }
                main.stop();
            }
        );
        $('#percount').blur(
            function()
            {
                var value = parseInt($('#percount').val(), 10);
                if (main.count.per != value && !isNaN(value))
                {
                    main.count.per = value;
                    main.setup();
                }
            }
        );
        $('#undo').click(
            function()
            {
                // Undo a move if possible.
                if (main.steps.length && !main.running)
                {
                    if (main.popped)
                    {
                        // Place the disk on the tower it came from.
                        main.move(main.popped.tower);
                    }
                    main.move(main.steps.pop(), true);
                    main.move(main.steps.pop(), true);
                }
            }
        );
        $('#variation').change(
            function()
            {
                var value = $('#variation').val();
                if (main.variation != value)
                {
                    main.variation = value;
                    // Set the default values.
                    main.count.stacks = 1;
                    if (main.variation == 'Antwerp')
                    {
                        main.count.stacks = 3;
                    }
                    main.count.per = 3;
                    main.setup();
                    main.load();
                }
            }
        );
        $('.tower').live(
            'tap',
            function()
            {
                // If the solver isn't running, make a manual move.
                if (!main.running)
                {
                    main.move($(this).data('tower'));
                }
            }
        );
    }
);