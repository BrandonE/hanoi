/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var rainbow = {};

rainbow.bac = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cbc(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.cac(disks - 1, using, from, to);
        }
    ];
};

rainbow.bcb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cab(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.bac(disks - 1, using, from, to);
        }
    ];
};

rainbow.bcd = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cdb(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.bac(disks - 1, using, from, to);
        }
    ];
};

rainbow.bdc = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cbd(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.dac(disks - 1, using, from, to);
        }
    ];
};

rainbow.cab = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cac(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.cbc(disks - 1, using, from, to);
        }
    ];
};

rainbow.cac = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cbc(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.cbc(disks - 1, using, from, to);
        }
    ];
};

rainbow.cad = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cdc(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.cbc(disks - 1, using, from, to);
        }
    ];
};

rainbow.cbc = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks == 1)
    {
        return [from, to];
    }
    return [
        function()
        {
            return rainbow.cab(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return rainbow.bcb(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return rainbow.bac(disks - 1, from, using, to);
        }
    ];
};

rainbow.cbd = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks == 1)
    {
        return [from, to];
    }
    return [
        function()
        {
            return rainbow.cad(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return rainbow.dcb(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return rainbow.bac(disks - 1, from, using, to);
        }
    ];
};

rainbow.cdb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cad(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.dbc(disks - 1, using, from, to);
        }
    ];
};

rainbow.cdc = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cbd(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.dbc(disks - 1, using, from, to);
        }
    ];
};

rainbow.cdd = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cdd(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.dbc(disks - 1, using, from, to);
        }
    ];
};

rainbow.dac = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cbc(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.cdc(disks - 1, using, from, to);
        }
    ];
};

rainbow.dbc = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks == 1)
    {
        return [from, to];
    }
    return [
        function()
        {
            return rainbow.cab(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return rainbow.bcd(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return rainbow.dac(disks - 1, from, using, to);
        }
    ];
};

rainbow.dcb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cab(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.bdc(disks - 1, using, from, to);
        }
    ];
};

rainbow.ddc = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cbd(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.ddc(disks - 1, using, from, to);
        }
    ];
};

rainbow.ddd = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return rainbow.cdd(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return rainbow.ddc(disks - 1, using, from, to);
        }
    ];
};

rainbow.moves = function(disks)
{
    var m = $M(
        [
            [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 2],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
        ]
    );
    var s = $V([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    for (i = 0; i < disks - 1; i++)
    {
        s = m.x(s);
    }
    return s.elements[0];
};