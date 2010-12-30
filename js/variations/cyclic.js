/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var cyclic = {};
cyclic.seq = {
    'close': [0, 1, 5],
    'far': [0, 2, 7]
};

cyclic.close = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return cyclic.far(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return cyclic.far(disks - 1, using, from, to);
        }
    ];
};

cyclic.far = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return cyclic.far(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return cyclic.close(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return cyclic.far(disks - 1, from, using, to);
        }
    ];
};

cyclic.moves = function(disks, close)
{
    var seq = cyclic.seq.far;
    if (close)
    {
        seq = cyclic.seq.close;
    }
    for (var i = seq.length; i < disks + 1; i++)
    {
        seq.push((3 * seq[i - 1]) - (2 * seq[i - 3]));
    }
    return seq[disks];
};