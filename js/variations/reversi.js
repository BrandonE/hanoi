/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var reversi = {};

reversi.baab = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return reversi.babb(disks - 1, from, to, using, extra);
        },
        from,
        using,
        using,
        to,
        function()
        {
            return reversi.babb(disks - 1, extra, using, from, to);
        }
    ];
};

reversi.baad = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return reversi.bbbd(disks - 1, from, using, to, extra);
        },
        from,
        using,
        function()
        {
            return reversi.baad(disks - 1, extra, using, from, to);
        }
    ];
};

reversi.baba = function(disks, from, using, extra, to)
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
            return reversi.baba(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        from,
        to,
        function()
        {
            return reversi.baba(disks - 2, using, to, extra, from);
        },
        extra,
        using,
        using,
        to,
        function()
        {
            return reversi.baba(disks - 2, from, using, extra, to);
        }
    ];
};

reversi.babb = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks == 1)
    {
        return [from, using, using, to];
    }
    return [
        function()
        {
            return reversi.babb(disks - 2, from, using, extra, to);
        },
        from,
        extra,
        from,
        using,
        function()
        {
            return reversi.babb(disks - 2, to, extra, using, from);
        },
        using,
        to,
        extra,
        to,
        function()
        {
            return reversi.babb(disks - 2, from, using, extra, to);
        }
    ];
};

reversi.babe = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.badb(disks - 2, from, using, to, extra);
        },
        from,
        to,
        to,
        using,
        from,
        to,
        using,
        to,
        function()
        {
            return reversi.baba(disks - 2, extra, using, from, to);
        }
    ];
};

reversi.bada = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.bada(disks - 2, from, using, extra, to);
        },
        from,
        extra,
        extra,
        using,
        function()
        {
            return reversi.babe(disks - 2, to, using, from, extra);
        },
        from,
        to,
        using,
        to,
        function()
        {
            return reversi.daba(disks - 2, extra, using, from, to);
        }
    ];
};

reversi.badb = function(disks, from, using, extra, to)
{
    if (disks < 5)
    {
        return [
            function()
            {
                return reversi.babb(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.babe(disks - 1, from, to, using, extra);
        },
        from,
        using,
        using,
        to,
        function()
        {
            return reversi.daba(disks - 1, extra, using, from, to);
        }
    ];
};

reversi.bade = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.badf(disks - 2, from, using, to, extra);
        },
        from,
        to,
        to,
        using,
        from,
        to,
        using,
        to,
        function()
        {
            return reversi.daba(disks - 2, extra, using, from, to);
        }
    ];
};

reversi.badf = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return reversi.babb(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.bada(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        extra,
        to,
        from,
        extra,
        to,
        from,
        extra,
        to,
        from,
        to,
        function()
        {
            return reversi.bada(disks - 2, using, from, extra, to);
        }
    ];
};

reversi.bbad = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return reversi.bbad(disks - 1, from, using, to, extra);
        },
        from,
        to,
        function()
        {
            return reversi.bbbd(disks - 1, extra, from, using, to);
        }
    ];
};

reversi.bbbd = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return reversi.baad(disks - 1, from, using, to, extra);
        },
        from,
        extra,
        extra,
        to,
        function()
        {
            return reversi.bbad(disks - 1, using, extra, from, to);
        }
    ];
};

reversi.bdba = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.babe(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        from,
        to,
        function()
        {
            return reversi.daba(disks - 2, using, to, extra, from);
        },
        extra,
        using,
        using,
        to,
        function()
        {
            return reversi.bdba(disks - 2, from, using, extra, to);
        }
    ];
};

reversi.bdbe = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.badb(disks - 2, from, to, using, extra);
        },
        from,
        to,
        to,
        using,
        from,
        to,
        using,
        to,
        function()
        {
            return reversi.bdba(disks - 2, extra, using, from, to);
        }
    ];
};

reversi.bdbf = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return reversi.babb(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.badb(disks - 2, from, to, using, extra);
        },
        from,
        using,
        using,
        to,
        from,
        using,
        to,
        from,
        using,
        to,
        from,
        to,
        function()
        {
            return reversi.babb(disks - 2, extra, using, from, to);
        }
    ];
};

reversi.bdde = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.bdde(disks - 2, from, to, extra, using);
        },
        from,
        to,
        to,
        extra,
        from,
        to,
        extra,
        to,
        function()
        {
            return reversi.dadb(disks - 2, using, from, extra, to);
        }
    ];
};

reversi.bddf = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return reversi.babb(disks, from, using, extra, to);
            }
        ];
    }
    if (disks == 4)
    {
        return [
            from, extra, from, to, from, using, extra, using, from, extra, to,
            from, extra, to, using, extra, using, to, from, using, using, to,
            extra, to
        ];
    }
    return [
        function()
        {
            return reversi.bdde(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        extra,
        to,
        from,
        extra,
        to,
        from,
        extra,
        to,
        from,
        to,
        function()
        {
            return reversi.dada(disks - 2, using, from, extra, to);
        }
    ];
};

reversi.daba = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.baba(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function()
        {
            return reversi.badb(disks - 2, using, extra, from, to);
        }
    ];
};

reversi.dada = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.bada(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function()
        {
            return reversi.badb(disks - 2, using, from, extra, to);
        }
    ];
};

reversi.dadb = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return reversi.babb(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.bdba(disks - 2, from, extra, to, using);
        },
        from,
        to,
        from,
        extra,
        to,
        from,
        extra,
        to,
        from,
        extra,
        extra,
        to,
        function()
        {
            return reversi.bada(disks - 2, using, extra, from, to);
        }
    ];
};

reversi.ddba = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.babe(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function()
        {
            return reversi.dadb(disks - 2, using, extra, from, to);
        }
    ];
};

reversi.ddbb = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return reversi.babb(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.babb(disks - 2, from, using, to, extra);
        },
        from,
        to,
        from,
        using,
        to,
        from,
        using,
        to,
        from,
        using,
        using,
        to,
        function()
        {
            return reversi.badb(disks - 2, extra, using, from, to);
        }
    ];
};

reversi.ddda = function(disks, from, using, extra, to)
{
    if (disks < 4)
    {
        return [
            function()
            {
                return reversi.baba(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            if (disks % 2)
            {
                return reversi.badf(disks - 2, from, to, extra, using);
            }
            return reversi.bade(disks - 2, from, to, extra, using);
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function()
        {
            if (disks % 2)
            {
                return reversi.ddda(disks - 2, using, extra, from, to);
            }
            return reversi.dddb(disks - 2, using, extra, from, to);
        }
    ];
};

reversi.dddb = function(disks, from, using, extra, to)
{
    if (disks < 3)
    {
        return [
            function()
            {
                return reversi.babb(disks, from, using, extra, to);
            }
        ];
    }
    if (disks == 4)
    {
        return [
            from, using, from, extra, extra, to, from, extra, using, extra,
            from, using, to, from, using, to, extra, using, extra, to, from,
            to, using, to
        ];
    }
    return [
        function()
        {
            return reversi.bdbe(disks - 2, from, extra, to, using);
        },
        from,
        to,
        from,
        extra,
        to,
        from,
        extra,
        to,
        from,
        extra,
        extra,
        to,
        function()
        {
            return reversi.ddda(disks - 2, using, extra, from, to);
        }
    ];
};

reversi.ddde = function(disks, from, using, extra, to)
{
    if (disks < 5)
    {
        return [
            function()
            {
                return reversi.ddda(disks, from, using, extra, to);
            }
        ];
    }
    if (disks == 5)
    {

        return [
            from, using, from, to, from, extra, using, extra, from, using, to,
            using, from, to, using, to, using, from, to, using, from, to,
            extra, to, extra, from, to, extra, from, to, using, to, extra, to
        ];
    }
    return [
        function()
        {
            return reversi.bdde(disks - 3, from, extra, to, using);
        },
        from,
        extra,
        extra,
        to,
        from,
        extra,
        to,
        extra,
        from,
        to,
        extra,
        to,
        extra,
        from,
        to,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function()
        {
            return reversi.dddb(disks - 3, using, extra, from, to);
        }
    ];
};

reversi.dddf = function(disks, from, using, extra, to)
{
    if (disks < 6)
    {
        return [
            function()
            {
                return reversi.dddb(disks, from, using, extra, to);
            }
        ];
    }
    return [
        function()
        {
            return reversi.bdde(disks - 3, from, extra, to, using);
        },
        from,
        to,
        to,
        extra,
        from,
        to,
        extra,
        to,
        from,
        extra,
        to,
        extra,
        to,
        from,
        extra,
        to,
        to,
        from,
        extra,
        to,
        from,
        to,
        from,
        extra,
        to,
        from,
        extra,
        to,
        from,
        extra,
        extra,
        to,
        function()
        {
            return reversi.ddda(disks - 3, using, extra, from, to);
        }
    ];
};

reversi.eddd = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    if (disks == 1)
    {
        return [from, using, using, extra, extra, from];
    }
    if (disks == 2)
    {
        return [
            from, to, from, using, using, extra, extra, from, to, using, using,
            from
        ];
    }
    if (disks < 7)
    {
        return [
            function()
            {
                return reversi.bddf(disks - 2, from, using, extra, to);
            },
            from,
            extra,
            from,
            using,
            extra,
            from,
            using,
            extra,
            from,
            using,
            extra,
            from,
            using,
            extra,
            extra,
            from,
            function()
            {
                return reversi.ddda(disks - 2, to, extra, using, from);
            }
        ];
    }
    return [
        function()
        {
            return reversi.bddf(disks - 3, from, using, extra, to);
        },
        from,
        extra,
        extra,
        using,
        from,
        extra,
        using,
        from,
        extra,
        using,
        from,
        using,
        from,
        extra,
        using,
        from,
        from,
        extra,
        using,
        from,
        extra,
        from,
        extra,
        using,
        from,
        extra,
        extra,
        using,
        from,
        extra,
        using,
        extra,
        using,
        from,
        extra,
        using,
        extra,
        from,
        using,
        extra,
        extra,
        from,
        function()
        {
            return reversi.ddda(disks - 3, to, extra, using, from);
        }
    ];
};

reversi.g = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return reversi.g(disks - 1, from, to, extra, using);
        },
        from,
        extra,
        extra,
        to,
        function()
        {
            return reversi.g(disks - 1, using, from, extra, to);
        }
    ];
};