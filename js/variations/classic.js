/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
classic = {
    'four': {},
    'more': {},
    'three': {}
};

classic.four.first = function(func, stack)
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
classic.four.k = function(disks)
{
    return Math.round(Math.sqrt(2 * disks));
};

classic.four.other = function(func, stack)
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

classic.four.rec = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    var k = classic.four.k(disks);
    return [
        function()
        {
            return classic.four.rec(disks - k, from, to, extra, using);
        },
        function()
        {
            return classic.three.rec(disks, from, extra, to, disks - k + 1);
        },
        function()
        {
            return classic.four.rec(disks - k, using, from, extra, to);
        }
    ];
};

classic.four.shortcut = function(func, stack)
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

classic.more.calc = function(disks, towers)
{
    var t = Math.max(
        1,
        Math.round(
            Math.exp(
                Math.log(
                    main.factorial(towers - 2) * disks
                ) / (towers - 2)
            ) - (towers - 3) / 2
        )
    );
    var disks_0 = Math.round(main.binomial(t + towers - 3, towers - 2));
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

classic.more.moves = function(disks, towers)
{
    if (disks < 1 || !towers)
    {
        return 0;
    }
    var calc = classic.more.calc(disks, towers);
    var t = calc.t;
    var disks_0 = calc.disks_0;
    var ans = 0;
    var mult = 1;
    for (var i = 0; i < towers - 2; i++)
    {
        ans += mult * Math.round(
            main.binomial(t + towers - 3, towers - 3 - i)
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
            main.binomial(i + towers - 3, towers - 3)
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

classic.more.other = function(func, stack)
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

classic.more.rec = function(disks, towers, from, to)
{
    if (disks < 1 || towers.length < 2 || from === undefined || to === undefined)
    {
        return [];
    }
    if (towers.length == 2)
    {
        return [from, to];
    }
    var k = classic.more.calc(disks, towers.length).k;
    var last = main.towers[from].disks[main.towers[from].disks.length - 1];
    var using;
    for (var i = 0; i < towers.length; i++)
    {
        using = towers[i];
        if (
            using != from &&
            using != to &&
            main.movable(last, using)
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
            return new classic.more.rec(disks - k, towers, from, using);
        },
        function()
        {
            return new classic.more.rec(k, removed, from, to);
        },
        function()
        {
            return new classic.more.rec(disks - k, towers, using, to);
        }
    ];
};

classic.three.first = function(func, stack)
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

classic.three.iter = function(disks, from, using, to, clock)
{
    if (clock === undefined)
    {
        clock = 0;
    }
    if (clock == classic.three.moves(disks))
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
            return classic.three.iter(disks, from, using, to, clock + 1);
        }
    ];
};

classic.three.moves = function(disks)
{
    return Math.pow(2, disks) - 1;
};

classic.three.other = function(func, stack)
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

classic.three.pick = function(stack, data)
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
            main.xor(
                stack === 0,
                (
                    main.xor(
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

classic.three.rec = function(disks, from, using, to, limit)
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
            return classic.three.rec(disks - 1, from, to, using, limit);
        },
        from,
        to,
        function()
        {
            return classic.three.rec(disks - 1, using, from, to, limit);
        }
    ];
};

classic.three.shortcut = function(func, stack)
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