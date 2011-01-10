/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var solve = {
    'antwerp': {
        'three': {
            'three': {},
            'two': {}
        }
    },
    'classic': {
        'four': {},
        'more': {},
        'three': {}
    },
    'cyclic': {
        'seq': {
            'clock': [0, 2, 7],
            'counter': [0, 1, 5]
        }
    },
    'domino': {},
    'fact': [1, 1],
    'star': {
        'fk': []
    }
};

solve.antwerp.three.three.all = function(disks, x, y, z)
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
            return solve.antwerp.three.three.compress(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, y, x, z);
        },
        y,
        x,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, z, y, x);
        },
        z,
        y,
        z,
        y,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, y, x, z);
        },
        y,
        x,
        function()
        {
            return solve.antwerp.three.three.extract(disks - 1, z, y, x);
        }
    ];
};

solve.antwerp.three.three.compress = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.antwerp.three.three.compress(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, y, z, x);
        },
        y,
        z,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, x, y, z);
        }
    ];
};

solve.antwerp.three.three.extract = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, y, x, z);
        },
        x,
        y,
        function()
        {
            return solve.antwerp.three.three.extract(disks - 1, z, y, x);
        }
    ];
};

solve.antwerp.three.three.one = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        x,
        z,
        x,
        z,
        function()
        {
            return solve.antwerp.three.three.one(disks - 1, y, x, z);
        }
    ];
};

solve.antwerp.three.two.big = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.antwerp.three.two.big(disks - 1, x, z, y);
        },
        x,
        y,
        x,
        y,
        function()
        {
            return solve.antwerp.three.two.big(disks - 1, z, y, x);
        }
    ];
};

solve.antwerp.three.two.other = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.antwerp.three.two.spare(disks - 1, x, y, z);
        },
        y,
        x,
        function()
        {
            return solve.antwerp.three.two.big(disks - 1, z, x, y);
        }
    ];
};

solve.antwerp.three.two.rebuild = function(disks, x, y, z)
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
            return solve.antwerp.three.two.big(disks - 1, x, y, z);
        },
        x,
        z,
        function()
        {
            return solve.antwerp.three.two.big(disks - 2, y, z, x);
        },
        y,
        x,
        function()
        {
            return solve.antwerp.three.two.big(disks - 2, z, x, y);
        },
        y,
        z,
        function()
        {
            return solve.antwerp.three.two.rebuild(disks - 2, x, y, z);
        }
    ];
}

solve.antwerp.three.two.solve = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.antwerp.three.two.other(disks - 1, x, y, z);
        },
        y,
        z,
        function()
        {
            return solve.antwerp.three.two.big(disks - 1, x, z, y);
        },
        x,
        y,
        function()
        {
            return solve.antwerp.three.two.big(disks - 1, z, y, x);
        },
        z,
        x,
        function()
        {
            return solve.antwerp.three.two.rebuild(disks - 1, y, z, x);
        }
    ];
};

solve.antwerp.three.two.spare = function(disks, x, y, z)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.antwerp.three.two.other(disks - 1, x, y, z);
        },
        y,
        z,
        function()
        {
            return solve.antwerp.three.two.big(disks - 1, x, y, z);
        },
        x,
        z,
        function()
        {
            return solve.antwerp.three.two.big(disks - 1, y, z, x);
        }
    ];
};

solve.binomial = function(x, y)
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

solve.classic.four.first = function(func, stack)
{
    var mult = main.count.per - 1;
    var from = mult * stack;
    var using = mult * stack + 1;
    var extra = mult * stack + 2;
    var to = mult * stack + mult;
    return [
        function()
        {
            return func(main.count.disks, from, to, extra, using);
        },
        function()
        {
            return func(main.count.disks, using, from, extra, to);
        }
    ];
}
;
solve.classic.four.k = function(disks)
{
    return Math.round(Math.sqrt(2 * disks));
};

solve.classic.four.other = function(func, stack)
{
    var mult = main.count.per - 1;
    return [
        function()
        {
            return func(
                main.count.disks,
                mult * stack,
                mult * stack + 1,
                mult * stack + 2,
                mult * stack + mult
            );
        }
    ];
};

solve.classic.four.rec = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = solve.classic.four.k(disks);
    return [
        function()
        {
            return solve.classic.four.rec(disks - k, from, to, extra, using);
        },
        function()
        {
            return solve.classic.three.rec(
                disks, from, extra, to, disks - k + 1
            );
        },
        function()
        {
            return solve.classic.four.rec(disks - k, using, from, extra, to);
        }
    ];
};

solve.classic.four.shortcut = function(func, stack)
{
    var mult = main.count.per - 1;
    var from = mult * stack;
    var using = mult * stack + 1;
    var extra = mult * stack + 2;
    var to = mult * stack + mult;
    return [
        function()
        {
            return func(main.count.disks - 1, from, using, extra, to);
        },
        from,
        using,
        function()
        {
            return func(main.count.disks - 1, to, using, extra, from);
        },
        using,
        to,
        function()
        {
            return func(main.count.disks - 1, from, using, extra, to);
        }
    ];
};

solve.classic.more.calc = function(disks, towers)
{
    var t = Math.max(
        1,
        Math.round(
            Math.exp(
                Math.log(
                    solve.factorial(towers - 2) * disks
                ) / (towers - 2)
            ) - (towers - 3) / 2
        )
    );
    var disks_0 = Math.round(solve.binomial(t + towers - 3, towers - 2));
    var disks_1 = disks_0 * (t + towers - 2) / t;
    while (disks >= disks_1)
    {
        t++;
        disks_0 = disks_1;
        disks_1 = disks_0 * (t + towers - 2) / t;
    }
    while (disks < disks_0)
    {
        t--;
        disks_1 = disks_0;
        disks_0 = disks_1 * t / (t + towers - 2);
    }
    var k_0 = 1;
    if (t + towers != 3)
    {
        k_0 = disks_0 * (towers - 2) / (t + towers - 3);
    }
    var k_1 = disks_1 * (towers - 2) / (t + towers - 2);
    var k = Math.max(k_0, k_1 - disks_1 + disks);
    return {
        't': t,
        'disks_0': disks_0,
        'disks_1': disks_1,
        'k_0': k_0,
        'k_1': k_1,
        'k': k
    };
};

solve.classic.more.moves = function(disks, towers)
{
    if (disks < 1 || !towers)
    {
        return 0;
    }
    var calc = solve.classic.more.calc(disks, towers);
    var t = calc.t;
    var disks_0 = calc.disks_0;
    var ans = 0;
    var mult = 1;
    for (var i = 0; i < towers - 2; i++)
    {
        ans += mult * Math.round(
            solve.binomial(t + towers - 3, towers - 3 - i)
        );
        mult *= -2;
    }
    ans = (ans + disks - disks_0) * Math.round(
        Math.pow(2, t)
    ) + 1 - towers % 2 * 2;
    var ant = 0;
    mult = 1;
    for (i = 0; i < t; i++)
    {
        ant += mult * Math.round(
            solve.binomial(i + towers - 3, towers - 3)
        );
        mult *= 2;
    }
    ant += (disks - disks_0) * Math.round(
        Math.pow(2, t)
    );
    if (ant == -2)
    {
        ant = ans;
    }
    return ant;
};

solve.classic.more.other = function(func, stack)
{
    var mult = main.count.per - 1;
    var towers = [];
    for (var i = mult * stack; i <= mult * stack + mult; i++)
    {
        towers.push(i);
    }
    return [
        function()
        {
            return func(
                main.count.disks, towers, (mult * stack), (mult * stack + mult)
            );
        }
    ];
};

solve.classic.more.rec = function(disks, towers, from, to)
{
    if (disks < 1 || towers.length < 2)
    {
        return [];
    }
    if (towers.length == 2)
    {
        return [from, to];
    }
    var k = solve.classic.more.calc(disks, towers.length).k;
    var last = main.towers[from].disks[main.towers[from].disks.length - 1];
    var using;
    for (var i = 0; i < towers.length; i++)
    {
        using = towers[i];
        if (
            using != from &&
            using != to &&
            main.movable(last, using, true)
        )
        {
            break;
        }
    }
    var removed = [];
    for (i = 0; i < towers.length; i++)
    {
        var tower = towers[i];
        if (tower != using)
        {
            removed.push(tower);
        }
    }
    return [
        function()
        {
            return solve.classic.more.rec(disks - k, towers, from, using);
        },
        function()
        {
            return solve.classic.more.rec(k, removed, from, to);
        },
        function()
        {
            return solve.classic.more.rec(disks - k, towers, using, to);
        }
    ];
};

solve.classic.three.first = function(func, stack)
{
    var mult = main.count.per - 1;
    var from = mult * stack;
    var using = mult * stack + 1;
    var to = mult * stack + mult;
    return [
        function()
        {
            return func(main.count.disks, from, to, using);
        },
        function()
        {
            return func(main.count.disks, using, from, to);
        }
    ];
};

solve.classic.three.iter = function(disks, from, using, to, clock)
{
    if (clock === undefined)
    {
        clock = 0;
    }
    if (clock == solve.classic.three.moves(disks))
    {
        return [];
    }
    var frower = from;
    var tower = to;
    if (disks % 2)
    {
        if (clock % 3 == 1)
        {
            frower = using;
            tower = from;
        }
        if (clock % 3 == 2)
        {
            frower = to;
            tower = using;
        }
    }
    else
    {
        tower = using;
        if (clock % 3 == 1)
        {
            frower = to;
            tower = from;
        }
        if (clock % 3 == 2)
        {
            frower = using;
            tower = to;
        }
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
            return solve.classic.three.iter(disks, from, using, to, clock + 1);
        }
    ];
};

solve.classic.three.moves = function(disks)
{
    return Math.pow(2, disks) - 1;
};

solve.classic.three.other = function(func, stack)
{
    var mult = main.count.per - 1;
    return [
        function()
        {
            return func(
                main.count.disks,
                mult * stack,
                mult * stack + 1,
                mult * stack + mult
            );
        }
    ];
};

solve.classic.three.pick = function(stack, data)
{
    if (!data.hasOwnProperty('count'))
    {
        if (main.count.disks % 2 === 0)
        {
            stack = main.count.stacks - 1;
        }
        data.count = 0;
        data.phase = 'break';
    }
    if (!data.hasOwnProperty('shortcut'))
    {
        data.shortcut = true;
    }
    var mult = main.count.per - 1;
    var using = mult * stack + 1;
    var to = main.cycle(mult * stack + mult);
    var tower = using;
    if (data.phase == 'build')
    {
        tower = to;
    }
    if (
        data.phase == 'shortcut' &&
        main.towers[0].disks.length === main.count.disks
    )
    {
        data.phase = 'base';
        stack = main.count.stacks - 1;
    }
    if (data.phase == 'last' && main.towers[0].disks.length == 1)
    {
        data.phase = 'shortcut';
        stack = 0;
        if (main.count.disks === 1)
        {
            data.phase = 'base';
            stack = main.count.stacks - 1;
        }
    }
    if (
        data.phase == 'break' &&
        data.shortcut &&
        main.count.stacks > 2 &&
        main.towers[1].disks.length === 1 &&
        main.towers[1].disks[0].size == main.count.disks - 1
    )
    {
        data.phase = 'last';
        stack = main.count.stacks - 1;
    }
    else if (data.phase == 'base' && main.towers[to].disks.length == 1)
    {
        stack--;
        if (stack === 0)
        {
            data.phase = 'build';
            to = main.cycle(mult * stack + mult);
            data.count = main.towers[to].disks.length;
        }
    }
    else if (
        (
            data.phase == 'break' ||
            data.phase == 'build'
        ) &&
        main.towers[tower].disks.length > data.count &&
        (
            solve.xor(
                stack === 0,
                (
                    solve.xor(
                        main.count.disks % 2 === 0 || data.phase == 'build',
                        main.towers[tower].disks.length % 2 === 0
                    )
                )
            ) ||
            main.towers[tower].disks.length == main.count.disks
        ) &&
        (
            data.phase == 'break' ||
            main.ordered(tower)
        )
    )
    {
        stack--;
        if (stack < 0)
        {
            stack = main.count.stacks - 1;
        }
        if (main.towers[1].disks.length == main.count.disks)
        {
            data.phase = 'build';
            tower = to;
        }
        using = mult * stack + 1;
        to = main.cycle(mult * stack + mult);
        tower = using;
        if (data.phase == 'build')
        {
            tower = to;
        }
        data.count = main.towers[tower].disks.length;
    }
    return {
        'stack': stack,
        'data': data
    };
};

solve.classic.three.rec = function(disks, from, using, to, limit)
{
    if (!limit)
    {
        limit = 1;
    }
    if (limit > disks)
    {
        return [];
    }
    return [
        function()
        {
            return solve.classic.three.rec(disks - 1, from, to, using, limit);
        },
        from,
        to,
        function()
        {
            return solve.classic.three.rec(disks - 1, using, from, to, limit);
        }
    ];
};

solve.classic.three.shortcut = function(func, stack)
{
    var mult = main.count.per - 1;
    var from = mult * stack;
    var using = mult * stack + 1;
    var to = mult * stack + mult;
    return [
        function()
        {
            return func(main.count.disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return func(main.count.disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return func(main.count.disks - 1, from, using, to);
        }
    ];
};

solve.cyclic.counter = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.cyclic.clock(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.cyclic.clock(disks - 1, using, from, to);
        }
    ];
};

solve.cyclic.clock = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.cyclic.clock(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.cyclic.counter(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.cyclic.clock(disks - 1, from, using, to);
        }
    ];
};

solve.cyclic.moves = function(disks, counter)
{
    var seq = solve.cyclic.seq.clock;
    if (counter)
    {
        seq = solve.cyclic.seq.counter;
    }
    for (var i = seq.length; i < disks + 1; i++)
    {
        seq.push((3 * seq[i - 1]) - (2 * seq[i - 3]));
    }
    return seq[disks];
};

solve.domino.aab = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.aba(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.aab(disks - 1, using, from, to);
        }
    ];
};

solve.domino.aba = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.aba(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.aba(disks - 1, from, using, to);
        }
    ];
};

solve.domino.abb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.abb(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.aba(disks - 1, using, from, to);
        }
    ];
};

solve.domino.abe = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.adb(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.aba(disks - 1, using, from, to);
        }
    ];
};

solve.domino.abf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.abe(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.aba(disks - 1, from, using, to);
        }
    ];
};

solve.domino.adb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.abe(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.dba(disks - 1, using, from, to);
        }
    ];
};

solve.domino.ade = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.ade(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.dba(disks - 1, using, from, to);
        }
    ];
};

solve.domino.adf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.aba(disks - 1, from, using, to);
        }
    ];
};

solve.domino.dab = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.aba(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.adb(disks - 1, using, from, to);
        }
    ];
};

solve.domino.dba = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.abe(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.dab(disks - 1, from, using, to);
        }
    ];
};

solve.domino.dbf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.abe(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.dba(disks - 1, from, using, to);
        }
    ];
};

solve.domino.dda = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.abe(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.ddb(disks - 1, from, using, to);
        }
    ];
};

solve.domino.ddb = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.abf(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.ddb(disks - 1, using, from, to);
        }
    ];
};

solve.domino.dde = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.ade(disks - 1, from, to, using);
        },
        from,
        to,
        function()
        {
            return solve.domino.dda(disks - 1, using, from, to);
        }
    ];
};

solve.domino.ddf = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.dda(disks - 1, from, using, to);
        }
    ];
};

solve.domino.edd = function(disks, from, using, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.domino.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function()
        {
            return solve.domino.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function()
        {
            return solve.domino.dab(disks - 1, from, to, using);
        },
        to,
        from,
        function()
        {
            return solve.domino.dda(disks - 1, using, to, from);
        }
    ];
};

solve.domino.linear = function(disks, from, using, to, clock)
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
            return solve.domino.linear(disks, from, using, to, clock + 1);
        }
    ];
};

solve.factorial = function(n)
{
    var i;
    for (i = solve.fact.length; i < n + 1; i++)
    {
        solve.fact.push(n * solve.fact[i - 1]);
    }
    return solve.fact[n];
};

solve.pick = function(stacks, func, data, stack)
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
    var result;
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
        result = func(stack, data);
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
                return solve.pick(stacks, func, data, stack);
            }
        ];
    }
    return [];
};

solve.stacks = function(func, first, other, shortcut)
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
    var i;
    var stacks = [];
    for (i = 0; i < main.count.stacks; i++)
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

solve.star.rec = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return solve.star.rec(
                disks - solve.star.fk[disks], from, using, to, extra
            );
        },
        function()
        {
            return solve.domino.aba(solve.star.fk[disks], from, using, to);
        },
        function()
        {
            return solve.star.rec(
                disks - solve.star.fk[disks], extra, using, from, to
            );
        }
    ];
};

solve.start = function()
{
    var bdi;
    var bdj;
    var fij
    var first;
    var func;
    var i;
    var j;
    var log2;
    var log3;
    var other;
    var shortcut;
    if (!main.random && !main.shuffle)
    {
        if (main.restriction === 'none')
        {
            func = solve.classic.three.rec;
            first = solve.classic.three.first;
            other = solve.classic.three.other;
            shortcut = solve.classic.three.shortcut;
            if (main.count.stacks === 1)
            {
                if (
                    main.stars.length &&
                    main.stars.length < main.count.per - 1
                )
                {
                    if (1 in main.stars)
                    {
                        if (main.count.per === 3)
                        {
                            main.generator = solve.domino.linear(
                                main.count.disks, 0, 1, 2
                            );
                            main.minimum = Math.pow(3, main.count.disks) - 1;
                            return;
                        }
                        main.generator = solve.star.rec(
                            main.count.disks, 0, 1, 2, main.count.towers - 1
                        );
                        log2 = Math.log(2.0);
                        log3 = Math.log(3.0);
                        bdi = Math.floor(
                            Math.sqrt(2 * main.count.disks * log2 / log3)
                        ) + 1;
                        bdj = Math.floor(
                            Math.sqrt(2 * main.count.disks * log3 / log2)
                        ) + 1;
                        fij = [];
                        for (i = 0; i < bdi; i++)
                        {
                            for (j = 0; j < bdj; j++)
                            {
                                fij.push(j * log2 / log3 + i);
                            }
                        }
                        fij[bdi * bdj - 1] = -1;
                        fij.sort(
                            function(a, b)
                            {
                                return a - b;
                            }
                        );
                        main.minimum = 0;
                        solve.star.fk = [];
                        for (i = 0; i < main.count.disks + 1; i++)
                        {
                            main.minimum += Math.floor(
                                Math.exp(fij[i] * log3) + 0.5
                            );
                            solve.star.fk.push(Math.floor(fij[i]) + 1);
                        }
                        main.minimum *= 2;
                    }
                    return;
                }
                func = solve.classic.more.rec;
                other = solve.classic.more.other;
                main.minimum = solve.classic.more.moves(
                    main.count.disks, main.count.towers
                );
            }
            else if (main.antwerp)
            {
                if (main.count.stacks === 2)
                {
                    main.generator = solve.antwerp.three.two.solve(
                        main.count.disks, 0, 1, 2
                    );
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
                if (main.count.stacks === 3)
                {
                    main.generator = solve.antwerp.three.three.all(
                        main.count.disks, 0, 1, 2
                    );
                    main.minimum = 5;
                    if (main.count.disks > 1)
                    {
                        main.minimum = 12 * Math.pow(
                            2, main.count.disks
                        ) - (8 * main.count.disks) - 10;
                    }
                }
                return;
            }
            else
            {
                main.minimum = solve.classic.three.moves(main.count.disks);
                if (main.count.stacks === 2)
                {
                    main.minimum *= 3;
                }
                if (main.count.stacks > 2)
                {
                    main.minimum = (
                        main.count.stacks * main.minimum
                    ) + solve.classic.three.moves(
                        main.count.disks - 1
                    ) + 1;
                }
            }
            main.generator = solve.pick(
                solve.stacks(func, first, other, shortcut),
                solve.classic.three.pick
            );
            return;
        }
        if (main.count.per === 3)
        {
            if (main.restriction === 'linear')
            {
                main.generator = solve.domino.linear(
                    main.count.disks, 0, 1, 2
                );
                main.minimum = Math.pow(3, main.count.disks) - 1;
            }
            if (main.restriction === 'clock')
            {
                main.generator = solve.cyclic.clock(
                    main.count.disks, 0, 1, 2
                );
                main.minimum = solve.cyclic.moves(main.count.disks);
            }
            if (main.restriction === 'counter')
            {
                main.generator = solve.cyclic.clock(
                    main.count.disks, 0, 1, 2
                );
                main.minimum = solve.cyclic.moves(main.count.disks, true);
            }
            return;
        }
        if (main.movement === 'any')
        {
            if (main.variation === 'Rainbow')
            {
                main.minimum = rainbow.moves(main.count.disks);
                if (main.count.stacks > 1)
                {
                    main.minimum *= main.count.stacks + 1;
                }
            }
            if (main.variation === 'Checkers')
            {
                if (main.count.per === 3)
                {
                    main.minimum = solve.classic.three.moves(main.count.disks);
                    if (main.count.stacks > 1)
                    {
                        main.minimum *= main.count.stacks + 1;
                    }
                }
            }
            if (main.count.stacks === 1)
            {
                if (
                    main.variation === 'Domino Light' ||
                    main.variation === 'Domino Dark' ||
                    main.variation === 'Domino Home Light'
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
                    if (main.variation === 'Domino Dark')
                    {
                        main.minimum = s.elements[1];
                    }
                    if (main.variation === 'Domino Home Light')
                    {
                        main.minimum = s.elements[2];
                    }
                }
                if (main.variation === 'Star')
                {
                    star.start();
                }
                if (main.variation === 'Lundon Light')
                {
                    main.minimum = solve.cyclic.moves(main.count.disks, true);
                }
                if (main.variation === 'Lundon Medium')
                {
                    main.minimum = solve.cyclic.moves(
                        main.count.disks - 1
                    ) + solve.cyclic.moves(main.count.disks - 1, true) + 3;
                }
                if (main.variation === 'Lundon Dark')
                {
                    main.minimum = solve.cyclic.moves(main.count.disks);
                }
                if (main.variation === 'Lundon Home Light')
                {
                    main.minimum = solve.cyclic.moves(
                        main.count.disks - 1
                    ) + solve.cyclic.moves(main.count.disks - 1) + 4;
                }
                if (main.variation === 'Lundon Home Dark')
                {
                    main.minimum = solve.cyclic.moves(
                        main.count.disks - 1, true
                    ) + solve.cyclic.moves(
                        main.count.disks - 1, true
                    ) + 2;
                }
            }
        }
    }
};

solve.xor = function(a, b)
{
    return ((a || b) && !(a && b));
};