/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var domino = {};

domino.adjacent = function(disks, from, using, to, clock)
{
    if (clock === undefined)
    {
        clock = 0;
    }
    if (clock == Math.pow(3, disks) - 1)
    {
        return [];
    }
    var frower = from;
    var tower = using;
    if (clock % 2)
    {
        frower = using;
        tower = to;
    }
    var last = main.towers[frower].disks[main.towers[frower].disks.length - 1];
    if (!main.movable(last, tower))
    {
        frower = frower ^ tower;
        tower = frower ^ tower;
        frower = frower ^ tower;
    }
    return [
        frower,
        tower,
        function()
        {
            return domino.adjacent(disks, from, using, to, clock + 1);
        }
    ];
};

domino.aab = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.aba(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.aab(disks - 1, using, from, to);
        }
    ];
};

domino.aba = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.aba(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.aba(disks - 1, from, using, to);
        }
    ];
};

domino.abb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.abb(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.aba(disks - 1, using, from, to);
        }
    ];
};

domino.abe = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.adb(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.aba(disks - 1, using, from, to);
        }
    ];
};

domino.abf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.abe(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.aba(disks - 1, from, using, to);
        }
    ];
};

domino.adb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.abe(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.dba(disks - 1, using, from, to);
        }
    ];
};

domino.ade = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.ade(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.dba(disks - 1, using, from, to);
        }
    ];
};

domino.adf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.aba(disks - 1, from, using, to);
        }
    ];
};

domino.dab = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.aba(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.adb(disks - 1, using, from, to);
        }
    ];
};

domino.dba = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.abe(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.dab(disks - 1, from, using, to);
        }
    ];
};

domino.dbf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.abe(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.dba(disks - 1, from, using, to);
        }
    ];
};

domino.dda = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.abe(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.ddb(disks - 1, from, using, to);
        }
    ];
};

domino.ddb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.abf(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.ddb(disks - 1, using, from, to);
        }
    ];
};

domino.dde = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.ade(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return domino.dda(disks - 1, using, from, to);
        }
    ];
};

domino.ddf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.dda(disks - 1, from, using, to);
        }
    ];
};

domino.edd = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return domino.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return domino.dab(disks - 1, from, to, using);
        },
        to,
        from,
        function()
        {
            return domino.dda(disks - 1, using, to, from);
        }
    ];
};