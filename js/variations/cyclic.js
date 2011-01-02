/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var cyclic = {};
cyclic.seq = {
    'clock': [0, 2, 7],
    'counter': [0, 1, 5]
};

cyclic.counter = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return cyclic.clock(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return cyclic.clock(disks - 1, using, from, to);
        }
    ];
};

cyclic.clock = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return cyclic.clock(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return cyclic.counter(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return cyclic.clock(disks - 1, from, using, to);
        }
    ];
};

cyclic.moves = function(disks, counter)
{
    var seq = cyclic.seq.clock;
    if (counter)
    {
        seq = cyclic.seq.counter;
    }
    for (var i = seq.length; i < disks + 1; i++)
    {
        seq.push((3 * seq[i - 1]) - (2 * seq[i - 3]));
    }
    return seq[disks];
};