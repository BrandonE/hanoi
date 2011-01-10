/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var checkers = {};

checkers.baab = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks < 3)
    {
        return [
            function()
            {
                return classic.three.rec(disks, from, using, to);
            }
        ];
    }
    var k = classic.four.k(disks);
    k += 1 - k % 2;
    return [
        function()
        {
            return checkers.babb(disks - k, from, to, using, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.babb(disks - k, extra, from, using, to);
        }
    ];
};

checkers.babb = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks < 3)
    {
        return [
            function()
            {
                return classic.three.rec(disks, from, using, to);
            }
        ];
    }
    var k = classic.four.k(disks);
    k += k % 2;
    return [
        function()
        {
            return checkers.babb(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.babb(disks - k, extra, using, from, to);
        }
    ];
};

checkers.badb = function(disks, from, using, extra, to)
{
    if (classic.four.k(disks) % 2)
    {
        return [
            function()
            {
                return checkers.baab(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return checkers.babb(disks, from, using, extra, to);
        }
    ];
};

checkers.badd = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = classic.four.k(disks);
    if (k % 2)
    {
        return [
            function()
            {
                return checkers.bdbd(disks - k, from, to, using, extra);
            },
            function()
            {
                return classic.three.rec(k, from, using, to);
            },
            function()
            {
                return checkers.babb(disks - k, extra, from, using, to);
            }
        ];
    }
    return [
        function()
        {
            return checkers.badd(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.babb(disks - k, extra, using, from, to);
        }
    ];
};

checkers.bbab = function(disks, from, using, extra, to, clock)
{
    if (clock === undefined)
    {
        clock = 0;
    }
    var total;
    if (disks % 2)
    {
        total = Math.pow(3, Math.floor((disks - 1) / 2)) * 4;
    }
    else
    {
        total = Math.pow(3, Math.floor(disks / 2)) * 2;
    }
    total -= 2;
    if (clock == total)
    {
        return [];
    }
    var frower;
    var tower;
    switch (disks % 2 * 8 + clock % 8)
    {
        case 1: case 5: case 8: case 11:
            frower = from;
            tower = using;
            break;
        case 2: case 6: case 9: case 14:
            frower = using;
            tower = to;
            break;
        case 0: case 4: case 10: case 13:
            frower = extra;
            tower = from;
            break;
        case 3: case 7: case 12: case 15:
            frower = to;
            tower = extra;
            break;
    }
    var last = main.towers[frower].disks[main.towers[frower].disks.length - 1];
    if (!main.movable(last, tower, true))
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
            return checkers.bbab(disks, from, using, extra, to, clock + 1);
        }
    ];
};

checkers.bdbd = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return classic.three.rec(disks, from, using, to);
            }
        ];
    }
    var k = classic.four.k(disks);
    k += k % 2;
    return [
        function()
        {
            return checkers.bddb(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.babb(disks - k, extra, using, from, to);
        }
    ];
};

checkers.bddb = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = classic.four.k(disks);
    if (k % 2)
    {
        return [
            function()
            {
                return checkers.badd(disks - k, from, to, using, extra);
            },
            function()
            {
                return classic.three.rec(k, from, using, to);
            },
            function()
            {
                return checkers.dadb(disks - k, extra, from, using, to);
            }
        ];
    }
    return [
        function()
        {
            return checkers.bdbd(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.ddbb(disks - k, extra, using, from, to);
        }
    ];
};

checkers.bddd = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = classic.four.k(disks);
    var steps = [
        function()
        {
            return checkers.bddd(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        }
    ];
    if (k % 2)
    {
        steps.push(
            function()
            {
                return checkers.dadb(disks - k, extra, from, using, to);
            }
        );
        return steps;
    }
    steps.push(
        function()
        {
            return checkers.ddbb(disks - k, extra, using, from, to);
        }
    );
    return steps;
};

checkers.dabd = function(disks, from, using, extra, to)
{
    if (classic.four.k(disks) % 2)
    {
        return [
            function()
            {
                return checkers.baab(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return checkers.babb(disks, from, using, extra, to);
        }
    ];
};

checkers.dadb = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = classic.four.k(disks);
    if (k % 2)
    {
        return [
            function()
            {
                return checkers.babb(disks - k, from, to, using, extra);
            },
            function()
            {
                return classic.three.rec(k, from, using, to);
            },
            function()
            {
                return checkers.ddbb(disks - k, extra, from, using, to);
            }
        ];
    }
    return [
        function()
        {
            return checkers.babb(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.dadb(disks - k, extra, using, from, to);
        }
    ];
};

checkers.ddbb = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return classic.three.rec(disks, from, using, to);
            }
        ];
    }
    var k = classic.four.k(disks);
    k += k % 2;
    return [
        function()
        {
            return checkers.babb(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.bddb(disks - k, extra, using, from, to);
        }
    ];
};

checkers.dddb = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = classic.four.k(disks);
    var steps;
    if (k % 2)
    {
        steps = [
            function()
            {
                return checkers.badd(disks - k, from, to, using, extra);
            }
        ];
    }
    else
    {
        steps = [
            function()
            {
                return checkers.bdbd(disks - k, from, using, to, extra);
            }
        ];
    }
    steps.push([
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.dddb(disks - k, extra, using, from, to);
        }
    ]);
    return steps;
};

checkers.dddd = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = classic.four.k(disks);
    return [
        function()
        {
            return checkers.bddd(disks - k, from, using, to, extra);
        },
        function()
        {
            return classic.three.rec(k, from, using, to);
        },
        function()
        {
            return checkers.dddb(disks - k, extra, using, from, to);
        }
    ];
};