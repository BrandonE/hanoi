/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var antwerp = {
    'three': {
        'three': {},
        'two': {}
    }
};

antwerp.three.three.all = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks == 1)
    {
        return [z, x, y, z, x, z, x, y, z, x];
    }
    return [
        function()
        {
            return antwerp.three.three.compress(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return antwerp.three.three.one(disks - 1, y, x, z);
        },
        y,
        x,
        function()
        {
            return antwerp.three.three.one(disks - 1, z, y, x);
        },
        z,
        y,
        z,
        y,
        function()
        {
            return antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return antwerp.three.three.one(disks - 1, y, x, z);
        },
        y,
        x,
        function()
        {
            return antwerp.three.three.extract(disks - 1, z, y, x);
        }
    ];
};

antwerp.three.three.compress = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return antwerp.three.three.compress(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return antwerp.three.three.one(disks - 1, y, z, x);
        },
        y,
        z,
        function()
        {
            return antwerp.three.three.one(disks - 1, x, y, z);
        }
    ];
};

antwerp.three.three.extract = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return antwerp.three.three.one(disks - 1, y, x, z);
        },
        x,
        y,
        function()
        {
            return antwerp.three.three.extract(disks - 1, z, y, x);
        }
    ];
};

antwerp.three.three.one = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        x,
        z,
        x,
        z,
        function()
        {
            return antwerp.three.three.one(disks - 1, y, x, z);
        }
    ];
};

antwerp.three.two.big = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return antwerp.three.two.big(disks - 1, x, z, y);
        },
        x,
        y,
        x,
        y,
        function()
        {
            return antwerp.three.two.big(disks - 1, z, y, x);
        }
    ];
};

antwerp.three.two.other = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return antwerp.three.two.spare(disks - 1, x, y, z);
        },
        y,
        x,
        function()
        {
            return antwerp.three.two.big(disks - 1, z, x, y);
        }
    ];
};

antwerp.three.two.rebuild = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks < 2 && x == 1)
    {
        return [x, z];
    }
    return [
        function()
        {
            return antwerp.three.two.big(disks - 1, x, y, z);
        },
        x,
        z,
        function()
        {
            return antwerp.three.two.big(disks - 2, y, z, x);
        },
        y,
        x,
        function()
        {
            return antwerp.three.two.big(disks - 2, z, x, y);
        },
        y,
        z,
        function()
        {
            return antwerp.three.two.rebuild(disks - 2, x, y, z);
        }
    ];
}

antwerp.three.two.solve = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return antwerp.three.two.other(disks - 1, x, y, z);
        },
        y,
        z,
        function()
        {
            return antwerp.three.two.big(disks - 1, x, z, y);
        },
        x,
        y,
        function()
        {
            return antwerp.three.two.big(disks - 1, z, y, x);
        },
        z,
        x,
        function()
        {
            return antwerp.three.two.rebuild(disks - 1, y, z, x);
        }
    ];
};

antwerp.three.two.spare = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return antwerp.three.two.other(disks - 1, x, y, z);
        },
        y,
        z,
        function()
        {
            return antwerp.three.two.big(disks - 1, x, y, z);
        },
        x,
        z,
        function()
        {
            return antwerp.three.two.big(disks - 1, y, z, x);
        }
    ];
};