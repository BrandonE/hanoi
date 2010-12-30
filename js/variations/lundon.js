/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var lundon = {
    'home': {},
    'medium': {}
};

lundon.home.dark = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return cyclic.close(disks - 1, from, to, using);
        },
        from,
        to,
        to,
        from,
        function()
        {
            return cyclic.close(disks - 1, using, to, from);
        }
    ];
};

lundon.home.light = function(disks, from, using, to)
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
        lundon.same(from, to),
        to,
        from,
        function()
        {
            return cyclic.far(disks - 1, using, to, from);
        }
    ];
};

lundon.medium.clock = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return cyclic.close(disks - 1, from, to, using);
        },
        function()
        {
            return lundon.same(from, to);
        },
        function()
        {
            return cyclic.far(disks - 1, using, from, to);
        }
    ];
};

lundon.medium.counter = function(disks, from, using, to)
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
        function()
        {
            return lundon.same(from, to);
        },
        function()
        {
            return cyclic.close(disks - 1, using, from, to);
        }
    ];
};

lundon.same = function(from, to)
{
    return [from, to, to, from, from, to];
};