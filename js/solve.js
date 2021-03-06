/*
Copyright (C) 2010-2011 Brandon Evans.
http://www.brandonevans.org/
*/
var solve = {
    'cyclic': {
        'more': {},
        'seq': {
            'clock': {
                'longer': [],
                'shorter': [],
                'using': []
            },
            'counter': {
                'longer': [],
                'shorter': [],
                'using': []
            }
        },
        'three': {}
    },
    'different': {
        'three': {
            'three': {
                'home': {},
                'medium': {}
            }
        },
        'two': {
            'three': {}
        }
    },
    'fact': [1, 1],
    'linear': {
        'antwerp': {
            'two': {
                'three': {}
            }
        },
        'three': {}
    },
    'multi': {},
    'none': {
        'antwerp': {
            'three': {
                'three': {}
            },
            'two': {
                'three': {}
            }
        },
        'four': {},
        'more': {},
        'three': {}
    },
    'same': {
        'change': {
            'two': {
                'three': {}
            }
        },
        'stay': {
            'three': {
                'three': {}
            },
            'two': {
                'three': {}
            }
        }
    },
    'star': {
        'fk': [],
        'using': {
            'four': {}
        }
    }
};

solve.binomial = function(x, y)
{
    var ans = 1;
    var i = 0;
    while (i < y) {
        ans *= (x - i) / (i + 1);
        i++;
    }
    return ans;
};

solve.cyclic.more.clock = function(disks, from, to, towers)
{
    var direction = 1;
    var moves = [];
    var tower = from;
    var using = from;
    if (disks < 1) {
        return [];
    }
    if (towers === undefined) {
        towers = solve.towers(from);
    }
    if (main.restriction === 'counter') {
        direction = -1;
    }
    do {
        using = main.cycle(using + direction);
    } while (towers.index(using) === -1);
    tower = main.cycle(from + direction);
    while (tower !== to) {
        while (towers.index(tower) === -1) {
            tower = main.cycle(tower + direction);
        }
        moves.push(tower);
        do {
            tower = main.cycle(tower + direction);
        } while (towers.index(tower) === -1);
        moves.push(tower);
    }
    return [
        function() {
            return solve.cyclic.more.clock(disks - 1, from, to, towers);
        },
        from,
        using,
        function() {
            if (
                main.count.stacks > 1 &&
                (!main.size || main.restriction === 'clock')
            ) {
                return [
                    function() {
                        return solve.cyclic.more.clock(
                            disks - 1, to, using, towers
                        );
                    },
                    function() {
                        return solve.cyclic.more.clock(
                            disks - 1, using, from, towers
                        );
                    }
                ];
            }
            return solve.cyclic.more.counter(disks - 1, to, from, towers);
        },
        moves,
        function() {
            return solve.cyclic.more.clock(disks - 1, from, to, towers);
        }
    ];
};

solve.cyclic.more.counter = function(disks, from, to, towers)
{
    var direction = 1;
    var moves = [];
    var tower = from;
    var using = from;
    if (disks < 1) {
        return [];
    }
    if (towers === undefined) {
        towers = solve.towers(from);
    }
    if (main.restriction === 'counter') {
        direction = -1;
    }
    do {
        using = main.cycle(using - direction);
    } while (towers.index(using) === -1);
    while (tower !== to) {
        while (towers.index(tower) === -1) {
            tower = main.cycle(tower + direction);
        }
        moves.push(tower);
        do {
            tower = main.cycle(tower + direction);
        } while (towers.index(tower) === -1);
        moves.push(tower);
    }
    return [
        function() {
            return solve.cyclic.more.clock(disks - 1, from, using, towers);
        },
        moves,
        function() {
            return solve.cyclic.more.clock(disks - 1, using, to, towers);
        }
    ];
};

solve.cyclic.moves = function(disks, towers, counter, longer, using)
{
    var i;
    var item;
    var offset = 0;
    var one;
    var seq = solve.cyclic.seq.clock;
    if (counter) {
        seq = solve.cyclic.seq.counter;
    }
    if (using) {
        seq = seq.using;
    }
    else if (longer) {
        seq = seq.longer;
    } else {
        seq = seq.shorter;
    }
    for (i = seq.length; i < towers + 1; i++) {
        one = i - 1;
        if (counter) {
            one = 1;
            if (using) {
                one = i - 2;
            }
        }
        else if (using) {
            one = 2;
        }
        seq.push([0, one]);
    }
    seq = seq[towers];
    for (i = seq.length; i < disks + 1; i++) {
        if (longer) {
            if (counter) {
                offset = (towers - 3) * (i - 2);
            }
            if (offset < 0) {
                offset = 0;
            }
            item = (4 * seq[i - 1]) - offset + 1;
            if (!counter) {
                item++;
            }
            seq.push(item);
        } else {
            offset = (towers - 3) * (i - 2);
            if (offset < 0) {
                offset = 0;
            }
            if (counter || using) {
                offset = -offset;
            }
            if (using) {
                offset *= 2;
            }
            seq.push((2 * seq[i - 1]) + (2 * seq[i - 2]) + towers - offset);
        }
    }
    return seq[disks];
};

solve.cyclic.three.clock = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.cyclic.three.clock(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            if (
                main.count.stacks > 1 &&
                (!main.size || main.restriction === 'clock')
            ) {
                return [
                    function() {
                        return solve.cyclic.three.clock(
                            disks - 1, to, from, using
                        );
                    },
                    function() {
                        return solve.cyclic.three.clock(
                            disks - 1, using, to, from
                        );
                    }
                ];
            }
            return solve.cyclic.three.counter(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.cyclic.three.clock(disks - 1, from, using, to);
        }
    ];
};

solve.cyclic.three.counter = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.cyclic.three.clock(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.cyclic.three.clock(disks - 1, using, from, to);
        }
    ];
};

solve.different.three.three.home.dark = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.cyclic.three.counter(
                disks - 1, from, to, using
            );
        },
        from,
        to,
        to,
        from,
        function() {
            return solve.cyclic.three.counter(
                disks - 1, using, to, from
            );
        }
    ];
};

solve.different.three.three.home.light = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.cyclic.three.clock(
                disks - 1, from, to, using
            );
        },
        solve.different.three.three.same(from, to),
        to,
        from,
        function() {
            return solve.cyclic.three.clock(
                disks - 1, using, to, from
            );
        }
    ];
};

solve.different.three.three.medium.clock = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.cyclic.three.counter(
                disks - 1, from, to, using
            );
        },
        function() {
            return solve.different.three.three.same(from, to);
        },
        function() {
            return solve.cyclic.three.clock(
                disks - 1, using, from, to
            );
        }
    ];
};

solve.different.three.three.medium.counter = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.cyclic.three.clock(
                disks - 1, from, to, using
            );
        },
        function() {
            return solve.different.three.three.same(from, to);
        },
        function() {
            return solve.cyclic.three.counter(
                disks - 1, using, from, to
            );
        }
    ];
};

solve.different.three.three.same = function(from, to)
{
    return [from, to, to, from, from, to];
};

solve.different.two.three.aab = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.aba(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.aab(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.aba = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.aba(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.aba(disks - 1, from, using, to);
        }
    ];
};

solve.different.two.three.abb = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.abb(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.aba(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.abe = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.adb(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.aba(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.abf = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.abe(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.aba(disks - 1, from, using, to);
        }
    ];
};

solve.different.two.three.adb = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.abe(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.dba(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.ade = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.ade(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.dba(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.adf = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.aba(disks - 1, from, using, to);
        }
    ];
};

solve.different.two.three.dab = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.aba(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.adb(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.dba = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.abe(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.dab(disks - 1, from, using, to);
        }
    ];
};

solve.different.two.three.dbf = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.abe(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.dba(disks - 1, from, using, to);
        }
    ];
};

solve.different.two.three.dda = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.aba(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.abe(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.ddb(disks - 1, from, using, to);
        }
    ];
};

solve.different.two.three.ddb = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.abf(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.ddb(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.dde = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.ade(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.different.two.three.dda(disks - 1, using, from, to);
        }
    ];
};

solve.different.two.three.ddf = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.dda(disks - 1, from, using, to);
        }
    ];
};

solve.different.two.three.edd = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.different.two.three.ade(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.different.two.three.dab(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.different.two.three.dab(disks - 1, from, to, using);
        },
        to,
        from,
        function() {
            return solve.different.two.three.dda(disks - 1, using, to, from);
        }
    ];
};

solve.factorial = function(n)
{
    var i;
    for (i = solve.fact.length; i < n + 1; i++) {
        solve.fact.push(n * solve.fact[i - 1]);
    }
    return solve.fact[n];
};

solve.linear.antwerp.two.three.big = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, x, y, z);
        },
        x,
        y,
        x,
        y,
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, z, y, x);
        },
        y,
        z,
        y,
        z,
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, x, y, z);
        }
    ];
};

solve.linear.antwerp.two.three.compress = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.linear.antwerp.two.three.compress(disks - 1, z, y, x);
        },
        y,
        z,
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, x, y, z);
        },
        function() {
            if (x === 0) {
                return [
                    x,
                    y,
                    function() {
                        return solve.linear.antwerp.two.three.big(
                            disks - 1, z, y, x
                        );
                    },
                    y,
                    z,
                    function() {
                        return solve.linear.antwerp.two.three.big(
                            disks - 1, x, y, z
                        );
                    }
                ];
            }
            return [];
        }
    ];
};

solve.linear.antwerp.two.three.rebuild = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, x, y, z);
        },
        x,
        y,
        function() {
            if (x === 2) {
                return [
                    function() {
                        return solve.linear.antwerp.two.three.big(
                            disks - 1, z, y, x
                        );
                    },
                    y,
                    z,
                    function() {
                        return solve.linear.antwerp.two.three.big(
                            disks - 1, x, y, z
                        );
                    },
                    x,
                    y
                ];
            }
            return [];
        },
        function() {
            return solve.linear.antwerp.two.three.rebuild(disks - 1, z, y, x);
        }
    ];
};

solve.linear.antwerp.two.three.solve = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.linear.antwerp.two.three.compress(disks - 1, x, y, z);
        },
        x,
        y,
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, z, y, x);
        },
        y,
        z,
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, x, y, z);
        },
        y,
        x,
        function() {
            return solve.linear.antwerp.two.three.big(disks - 1, z, y, x);
        },
        z,
        y,
        function() {
            return solve.linear.antwerp.two.three.rebuild(disks - 1, x, y, z);
        }
    ];
};

solve.linear.more = function(disks, from, to, towers)
{
    var direction = 1;
    var first;
    var moves = [];
    var tower = from;
    if (disks < 1) {
        return [];
    }
    if (towers === undefined) {
        towers = solve.towers(from);
    }
    if (to === towers[0]) {
        direction = -1;
    }
    while (tower !== to) {
        while (towers.index(tower) === -1) {
            tower = main.cycle(tower + direction);
        }
        moves.push(tower);
        do {
            tower = main.cycle(tower + direction);
        } while (towers.index(tower) === -1);
        moves.push(tower);
    }
    first = moves.splice(0, 2);
    return [
        function() {
            return solve.linear.more(disks - 1, from, to, towers);
        },
        first,
        function() {
            return solve.linear.more(disks - 1, to, from, towers);
        },
        moves,
        function() {
            return solve.linear.more(disks - 1, from, to, towers);
        }
    ];
};

solve.linear.moves = function(disks, towers)
{
    if (towers === undefined) {
        towers = main.count.per;
    }
    return (Math.pow(3, disks) - 1) * (1 + ((towers - 3) * 0.5));
};

solve.linear.three.iter = function(disks, from, using, to, clock)
{
    var frower = from;
    var last;
    var tower = using;
    if (clock === undefined) {
        clock = 0;
    }
    if (clock === solve.linear.three.moves(disks)) {
        return [];
    }
    if (clock % 2) {
        frower = using;
        tower = to;
    }
    last = main.towers[frower].disks[main.towers[frower].disks.length - 1];
    if (!main.movable(last, tower, true)) {
        frower = frower ^ tower;
        tower = frower ^ tower;
        frower = frower ^ tower;
    }
    return [
        frower,
        tower,
        function() {
            return solve.linear.three.iter(disks, from, using, to, clock + 1);
        }
    ];
};

solve.linear.three.rec = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.linear.three.rec(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.linear.three.rec(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.linear.three.rec(disks - 1, from, using, to);
        }
    ];
};

solve.multi.four = function(func, from, using, extra, to)
{
    var i;
    var mult = main.count.per - 1;
    var stacks = [];
    for (i = 1; i < main.count.stacks; i++) {
        stacks.push([
            func(
                main.count.disks,
                main.cycle(mult * i + from),
                main.cycle(mult * i + using),
                main.cycle(mult * i + extra),
                main.cycle(mult * i + to)
            )
        ]);
    }
    return stacks;
};

solve.multi.more = function(func, from, to, towers)
{
    var adjusted;
    var i;
    var j;
    var mult = main.count.per - 1;
    var stacks = [];
    for (i = 1; i < main.count.stacks; i++) {
        adjusted = towers.slice(0);
        for (j = 0; j < adjusted.length; j++) {
            adjusted[j] = main.cycle(mult * i + adjusted[j]);
        }
        stacks.push([
            func(
                main.count.disks,
                main.cycle(mult * i + from),
                main.cycle(mult * i + to),
                adjusted
            )
        ]);
    }
    return stacks;
};

solve.multi.three = function(func, from, using, to)
{
    var i;
    var mult = main.count.per - 1;
    var stacks = [];
    for (i = 1; i < main.count.stacks; i++) {
        stacks.push([
            func(
                main.count.disks,
                main.cycle(mult * i + from),
                main.cycle(mult * i + using),
                main.cycle(mult * i + to)
            )
        ]);
    }
    return stacks;
};

solve.none.antwerp.three.three.compress = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.none.antwerp.three.three.compress(disks - 1, x, z, y);
        },
        x,
        z,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, y, z, x);
        },
        y,
        z,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, x, y, z);
        }
    ];
};

solve.none.antwerp.three.three.extract = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, y, x, z);
        },
        x,
        y,
        function() {
            return solve.none.antwerp.three.three.extract(disks - 1, z, y, x);
        }
    ];
};

solve.none.antwerp.three.three.one = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        x,
        z,
        x,
        z,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, y, x, z);
        }
    ];
};

solve.none.antwerp.three.three.solve = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    if (disks === 1) {
        return [z, x, y, z, x, z, x, y, z, x];
    }
    return [
        function() {
            return solve.none.antwerp.three.three.compress(disks - 1, x, z, y);
        },
        x,
        z,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, y, x, z);
        },
        y,
        x,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, z, y, x);
        },
        z,
        y,
        z,
        y,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, x, z, y);
        },
        x,
        z,
        function() {
            return solve.none.antwerp.three.three.one(disks - 1, y, x, z);
        },
        y,
        x,
        function() {
            return solve.none.antwerp.three.three.extract(disks - 1, z, y, x);
        }
    ];
};

solve.none.antwerp.two.three.big = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, x, z, y);
        },
        x,
        y,
        x,
        y,
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, z, y, x);
        }
    ];
};

solve.none.antwerp.two.three.other = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.none.antwerp.two.three.spare(disks - 1, x, y, z);
        },
        y,
        x,
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, z, x, y);
        }
    ];
};

solve.none.antwerp.two.three.rebuild = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    if (disks < 2 && x === 1) {
        return [x, z];
    }
    return [
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, x, y, z);
        },
        x,
        z,
        function() {
            return solve.none.antwerp.two.three.big(disks - 2, y, z, x);
        },
        y,
        x,
        function() {
            return solve.none.antwerp.two.three.big(disks - 2, z, x, y);
        },
        y,
        z,
        function() {
            return solve.none.antwerp.two.three.rebuild(disks - 2, x, y, z);
        }
    ];
};

solve.none.antwerp.two.three.solve = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.none.antwerp.two.three.other(disks - 1, x, y, z);
        },
        y,
        z,
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, x, z, y);
        },
        x,
        y,
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, z, y, x);
        },
        z,
        x,
        function() {
            return solve.none.antwerp.two.three.rebuild(disks - 1, y, z, x);
        }
    ];
};

solve.none.antwerp.two.three.spare = function(disks, x, y, z)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.none.antwerp.two.three.other(disks - 1, x, y, z);
        },
        y,
        z,
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, x, y, z);
        },
        x,
        z,
        function() {
            return solve.none.antwerp.two.three.big(disks - 1, y, z, x);
        }
    ];
};

solve.none.four.k = function(disks)
{
    return Math.round(Math.sqrt(2 * disks));
};

solve.none.four.rec = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    k = solve.none.four.k(disks);
    return [
        function() {
            return solve.none.four.rec(disks - k, from, to, extra, using);
        },
        function() {
            return solve.none.three.rec(
                disks, from, extra, to, disks - k + 1
            );
        },
        function() {
            return solve.none.four.rec(disks - k, using, from, extra, to);
        }
    ];
};

solve.none.more.calc = function(disks, towers)
{
    var disks_0;
    var disks_1;
    var k;
    var k_0 = 1;
    var k_1;
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
    disks_0 = Math.round(solve.binomial(t + towers - 3, towers - 2));
    disks_1 = disks_0 * (t + towers - 2) / t;
    while (disks >= disks_1) {
        t++;
        disks_0 = disks_1;
        disks_1 = disks_0 * (t + towers - 2) / t;
    }
    while (disks < disks_0) {
        t--;
        disks_1 = disks_0;
        disks_0 = disks_1 * t / (t + towers - 2);
    }
    if (t + towers !== 3) {
        k_0 = disks_0 * (towers - 2) / (t + towers - 3);
    }
    k_1 = disks_1 * (towers - 2) / (t + towers - 2);
    k = Math.max(k_0, k_1 - disks_1 + disks);
    return {
        't': t,
        'disks_0': disks_0,
        'disks_1': disks_1,
        'k_0': k_0,
        'k_1': k_1,
        'k': k
    };
};

solve.none.more.first = function(func)
{
    var to = main.count.per - 1;
    return [
        function() {
            return func(main.count.disks, 0, 1);
        },
        function() {
            return func(main.count.disks, 1, to);
        }
    ];
};

solve.none.more.moves = function(disks, towers)
{
    var ans = 0;
    var ant;
    var calc = solve.none.more.calc(disks, towers);
    var disks_0 = calc.disks_0;
    var i;
    var mult = 1;
    var t = calc.t;
    if (disks < 1 || !towers) {
        return 0;
    }
    for (i = 0; i < towers - 2; i++) {
        ans += mult * Math.round(
            solve.binomial(t + towers - 3, towers - 3 - i)
        );
        mult *= -2;
    }
    ans = (ans + disks - disks_0) * Math.round(
        Math.pow(2, t)
    ) + 1 - towers % 2 * 2;
    ant = 0;
    mult = 1;
    for (i = 0; i < t; i++) {
        ant += mult * Math.round(
            solve.binomial(i + towers - 3, towers - 3)
        );
        mult *= 2;
    }
    ant += (disks - disks_0) * Math.round(
        Math.pow(2, t)
    );
    if (ant === -2) {
        ant = ans;
    }
    return ant;
};

solve.none.more.rec = function(disks, from, to, towers)
{
    var i;
    var k;
    var last;
    var removed = [];
    var tower;
    var using;
    if (disks < 1 || towers.length < 2) {
        return [];
    }
    if (towers.length === 2) {
        return [from, to];
    }
    k = solve.none.more.calc(disks, towers.length).k;
    last = main.towers[from].disks[main.towers[from].disks.length - 1];
    for (i = 0; i < towers.length; i++) {
        using = towers[i];
        if (
            using !== from &&
            using !== to &&
            main.movable(last, using, true)
        ) {
            break;
        }
    }
    for (i = 0; i < towers.length; i++) {
        tower = towers[i];
        if (tower !== using) {
            removed.push(tower);
        }
    }
    return [
        function() {
            return solve.none.more.rec(disks - k, from, using, towers);
        },
        function() {
            return solve.none.more.rec(k, from, to, removed);
        },
        function() {
            return solve.none.more.rec(disks - k, using, to, towers);
        }
    ];
};

solve.none.three.first = function(func)
{
    var to = main.count.per - 1;
    return [
        function() {
            return func(main.count.disks, 0, to, 1);
        },
        function() {
            return func(main.count.disks, 1, 0, to);
        }
    ];
};

solve.none.three.iter = function(disks, from, using, to, clock)
{
    var frower = from;
    var last;
    var tower = to;
    if (clock === undefined) {
        clock = 0;
    }
    if (clock === solve.none.three.moves(disks)) {
        return [];
    }
    if (disks % 2) {
        if (clock % 3 === 1) {
            frower = using;
            tower = from;
        }
        if (clock % 3 === 2) {
            frower = to;
            tower = using;
        }
    } else {
        tower = using;
        if (clock % 3 === 1) {
            frower = to;
            tower = from;
        }
        if (clock % 3 === 2) {
            frower = using;
            tower = to;
        }
    }
    last = main.towers[frower].disks[main.towers[frower].disks.length - 1];
    if (!main.movable(last, tower, true)) {
        frower = frower ^ tower;
        tower = frower ^ tower;
        frower = frower ^ tower;
    }
    return [
        frower,
        tower,
        function() {
            return solve.none.three.iter(disks, from, using, to, clock + 1);
        }
    ];
};

solve.none.three.moves = function(disks)
{
    return Math.pow(2, disks) - 1;
};

solve.none.three.rec = function(disks, from, using, to, limit)
{
    if (!limit) {
        limit = 1;
    }
    if (limit > disks) {
        return [];
    }
    return [
        function() {
            return solve.none.three.rec(disks - 1, from, to, using, limit);
        },
        from,
        to,
        function() {
            return solve.none.three.rec(disks - 1, using, from, to, limit);
        }
    ];
};

solve.none.three.shortcut = function(func)
{
    var to = main.count.per - 1;
    return [
        function() {
            return func(main.count.disks - 1, 0, 1, to);
        },
        0,
        1,
        function() {
            return func(main.count.disks - 1, to, 1, 0);
        },
        1,
        to,
        function() {
            return func(main.count.disks - 1, 0, 1, to);
        }
    ];
};

solve.pick = function(stacks, shortcut, stack, phase, disks)
{
    /*
    Create a generator that returns the moves from the stacks in the order that
    it picks.

    ``stacks``
        list - The generators for each stack.

    ``shortcut``
        bool - Whether or not this should pick using the shortcut.

    ``stack``
        int - The current picked stack (Optional. Default: 0).

    ``phase``
        str - The phase of picking (Optional. Default: 'break').

    ``disks``
        int - The amount of disks to track (Optional. Default: 1).

    Returns: list - The generator.
    */
    var i;
    var mult;
    var to;
    var using;
    if (stack === undefined) {
        stack = 0;
        if (main.count.disks % 2 === 0) {
            stack = main.count.stacks - 1;
        }
    }
    if (phase === undefined) {
        phase = 'break';
    }
    if (disks === undefined) {
        disks = 1;
    }
    // A stack only needs to be picked if there is more than one stack.
    if (main.count.stacks > 1) {
        mult = main.count.per - 1;
        to = main.cycle(mult * stack + mult);
        using = 0;
        for (i = mult * stack + 1; i < mult * stack + mult; i++) {
            using += main.towers[i].disks.length;
        }
        if (
            phase === 'shortcut' &&
            main.towers[0].disks.length === main.count.disks
        ) {
            phase = 'base';
            stack = main.count.stacks - 1;
        }
        if (phase === 'last' && main.towers[0].disks.length === 1) {
            phase = 'shortcut';
            stack = 0;
            if (main.count.disks === 1) {
                phase = 'base';
                stack = main.count.stacks - 1;
            }
        }
        if (
            phase === 'break' &&
            shortcut &&
            main.count.stacks > 2 &&
            main.towers[1].disks.length === 1 &&
            main.towers[1].disks[0].size === main.count.disks - 1
        ) {
            phase = 'last';
            stack = main.count.stacks - 1;
        } else if (phase === 'base' && main.towers[to].disks.length === 1) {
            stack--;
            if (stack === 0) {
                phase = 'build';
                disks = main.towers[to].disks.length + 1;
            }
        } else if (
            (
                phase === 'break' &&
                using === disks
            ) ||
            (
                phase === 'build' &&
                (
                    (
                        main.ordered(to) &&
                        main.towers[to].disks.length >= disks &&
                        using === main.count.disks - disks
                    ) ||
                    main.towers[to].disks.length === main.count.disks
                )
            )
        ) {
            stack--;
            if (stack < 0) {
                stack = main.count.stacks - 1;
                disks++;
            }
            if (stack === 0) {
                disks++;
            }
            if (
                phase === 'break' &&
                using === main.count.disks
            ) {
                phase = 'build';
                disks = 1;
            }
        }
    }
    main.exhaust(stacks[stack]);
    /*
    If this generator contains moves, return a generator containing the next
    move of it and repeat the picking process.
    */
    if (stacks[stack].length) {
        return [
            main.next(stacks[stack]),
            function() {
                return solve.pick(stacks, shortcut, stack, phase, disks);
            }
        ];
    }
    return [];
};

solve.same.change.two.three.baab = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.change.two.three.babb(
                disks - 1, from, to, using, extra
            );
        },
        from,
        using,
        using,
        to,
        function() {
            return solve.same.change.two.three.babb(
                disks - 1, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.baad = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.change.two.three.bbbd(
                disks - 1, from, using, to, extra
            );
        },
        from,
        using,
        function() {
            return solve.same.change.two.three.baad(
                disks - 1, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.baba = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    if (disks === 1) {
        return [from, to];
    }
    return [
        function() {
            return solve.same.change.two.three.baba(
                disks - 2, from, to, extra, using
            );
        },
        from,
        extra,
        from,
        to,
        function() {
            return solve.same.change.two.three.baba(
                disks - 2, using, to, extra, from
            );
        },
        extra,
        using,
        using,
        to,
        function() {
            return solve.same.change.two.three.baba(
                disks - 2, from, using, extra, to
            );
        }
    ];
};

solve.same.change.two.three.babb = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    if (disks === 1) {
        return [from, using, using, to];
    }
    return [
        function() {
            return solve.same.change.two.three.babb(
                disks - 2, from, using, extra, to
            );
        },
        from,
        extra,
        from,
        using,
        function() {
            return solve.same.change.two.three.babb(
                disks - 2, to, extra, using, from
            );
        },
        using,
        to,
        extra,
        to,
        function() {
            return solve.same.change.two.three.babb(
                disks - 2, from, using, extra, to
            );
        }
    ];
};

solve.same.change.two.three.babe = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.badb(
                disks - 2, from, using, to, extra
            );
        },
        from,
        to,
        to,
        using,
        from,
        to,
        using,
        to,
        function() {
            return solve.same.change.two.three.baba(
                disks - 2, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.bada = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bada(
                disks - 2, from, using, extra, to
            );
        },
        from,
        extra,
        extra,
        using,
        function() {
            return solve.same.change.two.three.babe(
                disks - 2, to, using, from, extra
            );
        },
        from,
        to,
        using,
        to,
        function() {
            return solve.same.change.two.three.daba(
                disks - 2, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.badb = function(disks, from, using, extra, to)
{
    if (disks < 5) {
        return [
            function() {
                return solve.same.change.two.three.babb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.babe(
                disks - 1, from, to, using, extra
            );
        },
        from,
        using,
        using,
        to,
        function() {
            return solve.same.change.two.three.daba(
                disks - 1, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.bade = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.badf(
                disks - 2, from, using, to, extra
            );
        },
        from,
        to,
        to,
        using,
        from,
        to,
        using,
        to,
        function() {
            return solve.same.change.two.three.daba(
                disks - 2, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.badf = function(disks, from, using, extra, to)
{
    if (disks < 3) {
        return [
            function() {
                return solve.same.change.two.three.babb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bada(
                disks - 2, from, to, extra, using
            );
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
        function() {
            return solve.same.change.two.three.bada(
                disks - 2, using, from, extra, to
            );
        }
    ];
};

solve.same.change.two.three.bbad = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.change.two.three.bbad(
                disks - 1, from, using, to, extra
            );
        },
        from,
        to,
        function() {
            return solve.same.change.two.three.bbbd(
                disks - 1, extra, from, using, to
            );
        }
    ];
};

solve.same.change.two.three.bbbd = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.change.two.three.baad(
                disks - 1, from, using, to, extra
            );
        },
        from,
        extra,
        extra,
        to,
        function() {
            return solve.same.change.two.three.bbad(
                disks - 1, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.bdba = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.babe(
                disks - 2, from, to, extra, using
            );
        },
        from,
        extra,
        from,
        to,
        function() {
            return solve.same.change.two.three.daba(
                disks - 2, using, to, extra, from
            );
        },
        extra,
        using,
        using,
        to,
        function() {
            return solve.same.change.two.three.bdba(
                disks - 2, from, using, extra, to
            );
        }
    ];
};

solve.same.change.two.three.bdbe = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.badb(
                disks - 2, from, to, using, extra
            );
        },
        from,
        to,
        to,
        using,
        from,
        to,
        using,
        to,
        function() {
            return solve.same.change.two.three.bdba(
                disks - 2, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.bdbf = function(disks, from, using, extra, to)
{
    if (disks < 3) {
        return [
            function() {
                return solve.same.change.two.three.babb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.badb(
                disks - 2, from, to, using, extra
            );
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
        function() {
            return solve.same.change.two.three.babb(
                disks - 2, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.bdde = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bdde(
                disks - 2, from, to, extra, using
            );
        },
        from,
        to,
        to,
        extra,
        from,
        to,
        extra,
        to,
        function() {
            return solve.same.change.two.three.dadb(
                disks - 2, using, from, extra, to
            );
        }
    ];
};

solve.same.change.two.three.bddf = function(disks, from, using, extra, to)
{
    if (disks < 3) {
        return [
            function() {
                return solve.same.change.two.three.babb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    if (disks === 4) {
        return [
            from, extra, from, to, from, using, extra, using, from, extra, to,
            from, extra, to, using, extra, using, to, from, using, using, to,
            extra, to
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bdde(
                disks - 2, from, to, extra, using
            );
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
        function() {
            return solve.same.change.two.three.dada(
                disks - 2, using, from, extra, to
            );
        }
    ];
};

solve.same.change.two.three.daba = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.baba(
                disks - 2, from, to, extra, using
            );
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function() {
            return solve.same.change.two.three.badb(
                disks - 2, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.dada = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bada(
                disks - 2, from, to, extra, using
            );
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function() {
            return solve.same.change.two.three.badb(
                disks - 2, using, from, extra, to
            );
        }
    ];
};

solve.same.change.two.three.dadb = function(disks, from, using, extra, to)
{
    if (disks < 3) {
        return [
            function() {
                return solve.same.change.two.three.babb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bdba(
                disks - 2, from, extra, to, using
            );
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
        function() {
            return solve.same.change.two.three.bada(
                disks - 2, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.ddba = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.babe(
                disks - 2, from, to, extra, using
            );
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function() {
            return solve.same.change.two.three.dadb(
                disks - 2, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.ddbb = function(disks, from, using, extra, to)
{
    if (disks < 3) {
        return [
            function() {
                return solve.same.change.two.three.babb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.babb(
                disks - 2, from, using, to, extra
            );
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
        function() {
            return solve.same.change.two.three.badb(
                disks - 2, extra, using, from, to
            );
        }
    ];
};

solve.same.change.two.three.ddda = function(disks, from, using, extra, to)
{
    if (disks < 4) {
        return [
            function() {
                return solve.same.change.two.three.baba(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            if (disks % 2) {
                return solve.same.change.two.three.badf(
                    disks - 2, from, to, extra, using
                );
            }
            return solve.same.change.two.three.bade(
                disks - 2, from, to, extra, using
            );
        },
        from,
        extra,
        from,
        to,
        extra,
        from,
        from,
        to,
        function() {
            if (disks % 2) {
                return solve.same.change.two.three.ddda(
                    disks - 2, using, extra, from, to
                );
            }
            return solve.same.change.two.three.dddb(
                disks - 2, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.dddb = function(disks, from, using, extra, to)
{
    if (disks < 3) {
        return [
            function() {
                return solve.same.change.two.three.babb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    if (disks === 4) {
        return [
            from, using, from, extra, extra, to, from, extra, using, extra,
            from, using, to, from, using, to, extra, using, extra, to, from,
            to, using, to
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bdbe(
                disks - 2, from, extra, to, using
            );
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
        function() {
            return solve.same.change.two.three.ddda(
                disks - 2, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.ddde = function(disks, from, using, extra, to)
{
    if (disks < 5) {
        return [
            function() {
                return solve.same.change.two.three.ddda(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    if (disks === 5) {

        return [
            from, using, from, to, from, extra, using, extra, from, using, to,
            using, from, to, using, to, using, from, to, using, from, to,
            extra, to, extra, from, to, extra, from, to, using, to, extra, to
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bdde(
                disks - 3, from, extra, to, using
            );
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
        function() {
            return solve.same.change.two.three.dddb(
                disks - 3, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.dddf = function(disks, from, using, extra, to)
{
    if (disks < 6) {
        return [
            function() {
                return solve.same.change.two.three.dddb(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bdde(
                disks - 3, from, extra, to, using
            );
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
        function() {
            return solve.same.change.two.three.ddda(
                disks - 3, using, extra, from, to
            );
        }
    ];
};

solve.same.change.two.three.eddd = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    if (disks === 1) {
        return [from, using, using, extra, extra, from];
    }
    if (disks === 2) {
        return [
            from, to, from, using, using, extra, extra, from, to, using, using,
            from
        ];
    }
    if (disks < 7) {
        return [
            function() {
                return solve.same.change.two.three.bddf(
                    disks - 2, from, using, extra, to
                );
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
            function() {
                return solve.same.change.two.three.ddda(
                    disks - 2, to, extra, using, from
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.change.two.three.bddf(
                disks - 3, from, using, extra, to
            );
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
        function() {
            return solve.same.change.two.three.ddda(
                disks - 3, to, extra, using, from
            );
        }
    ];
};

solve.same.change.two.three.g = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.change.two.three.g(
                disks - 1, from, to, extra, using
            );
        },
        from,
        extra,
        extra,
        to,
        function() {
            return solve.same.change.two.three.g(
                disks - 1, using, from, extra, to
            );
        }
    ];
};

solve.same.stay.three.three.bac = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cbc(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.cac(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.bcb = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cab(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.bac(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.bcd = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cdb(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.bac(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.bdc = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cbd(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.dac(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.cab = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cac(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.cbc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.cac = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cbc(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.cbc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.cad = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cdc(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.cbc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.cbc = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    if (disks === 1) {
        return [from, to];
    }
    return [
        function() {
            return solve.same.stay.three.three.cab(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.same.stay.three.three.bcb(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.same.stay.three.three.bac(disks - 1, from, using, to);
        }
    ];
};

solve.same.stay.three.three.cbd = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    if (disks === 1) {
        return [from, to];
    }
    return [
        function() {
            return solve.same.stay.three.three.cad(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.same.stay.three.three.dcb(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.same.stay.three.three.bac(disks - 1, from, using, to);
        }
    ];
};

solve.same.stay.three.three.cdb = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cad(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.dbc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.cdc = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cbd(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.dbc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.cdd = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cdd(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.dbc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.dac = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cbc(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.cdc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.dbc = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    if (disks === 1) {
        return [from, to];
    }
    return [
        function() {
            return solve.same.stay.three.three.cab(disks - 1, from, using, to);
        },
        from,
        using,
        function() {
            return solve.same.stay.three.three.bcd(disks - 1, to, using, from);
        },
        using,
        to,
        function() {
            return solve.same.stay.three.three.dac(disks - 1, from, using, to);
        }
    ];
};

solve.same.stay.three.three.dcb = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cab(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.bdc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.ddc = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cbd(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.ddc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.three.three.ddd = function(disks, from, using, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.same.stay.three.three.cdd(disks - 1, from, to, using);
        },
        from,
        to,
        function() {
            return solve.same.stay.three.three.ddc(disks - 1, using, from, to);
        }
    ];
};

solve.same.stay.two.three.baab = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    if (disks < 3) {
        return [
            function() {
                return solve.none.three.rec(disks, from, using, to);
            }
        ];
    }
    k = solve.none.four.k(disks);
    k += 1 - k % 2;
    return [
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, from, to, using, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, extra, from, using, to
            );
        }
    ];
};

solve.same.stay.two.three.babb = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    if (disks < 3) {
        return [
            function() {
                return solve.none.three.rec(disks, from, using, to);
            }
        ];
    }
    k = solve.none.four.k(disks);
    k += k % 2;
    return [
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.same.stay.two.three.badb = function(disks, from, using, extra, to)
{
    if (solve.none.four.k(disks) % 2) {
        return [
            function() {
                return solve.same.stay.two.three.baab(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.stay.two.three.babb(
                disks, from, using, extra, to
            );
        }
    ];
};

solve.same.stay.two.three.badd = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    k = solve.none.four.k(disks);
    if (k % 2) {
        return [
            function() {
                return solve.same.stay.two.three.bdbd(
                    disks - k, from, to, using, extra
                );
            },
            function() {
                return solve.none.three.rec(k, from, using, to);
            },
            function() {
                return solve.same.stay.two.three.babb(
                    disks - k, extra, from, using, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.stay.two.three.badd(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.same.stay.two.three.bbab = function(disks, from, using, extra, to, clock)
{
    var frower;
    var last;
    var total;
    var tower;
    if (clock === undefined) {
        clock = 0;
    }
    if (disks % 2) {
        total = Math.pow(3, Math.floor((disks - 1) / 2)) * 4;
    } else {
        total = Math.pow(3, Math.floor(disks / 2)) * 2;
    }
    total -= 2;
    if (clock === total) {
        return [];
    }
    switch (disks % 2 * 8 + clock % 8) {
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
    last = main.towers[frower].disks[main.towers[frower].disks.length - 1];
    if (!main.movable(last, tower, true)) {
        frower = frower ^ tower;
        tower = frower ^ tower;
        frower = frower ^ tower;
    }
    return [
        frower,
        tower,
        function() {
            return solve.same.stay.two.three.bbab(
                disks, from, using, extra, to, clock + 1
            );
        }
    ];
};

solve.same.stay.two.three.bdbd = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 3) {
        return [
            function() {
                return solve.none.three.rec(disks, from, using, to);
            }
        ];
    }
    k = solve.none.four.k(disks);
    k += k % 2;
    return [
        function() {
            return solve.same.stay.two.three.bddb(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.same.stay.two.three.bddb = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    k = solve.none.four.k(disks);
    if (k % 2) {
        return [
            function() {
                return solve.same.stay.two.three.badd(
                    disks - k, from, to, using, extra
                );
            },
            function() {
                return solve.none.three.rec(k, from, using, to);
            },
            function() {
                return solve.same.stay.two.three.dadb(
                    disks - k, extra, from, using, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.stay.two.three.bdbd(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.ddbb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.same.stay.two.three.bddd = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    k = solve.none.four.k(disks);
    return [
        function() {
            return solve.same.stay.two.three.bddd(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            if (k % 2) {
                return solve.same.stay.two.three.dadb(
                    disks - k, extra, from, using, to
                );
            }
            return solve.same.stay.two.three.ddbb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.same.stay.two.three.dabd = function(disks, from, using, extra, to)
{
    if (solve.none.four.k(disks) % 2) {
        return [
            function() {
                return solve.same.stay.two.three.baab(
                    disks, from, using, extra, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.stay.two.three.babb(
                disks, from, using, extra, to
            );
        }
    ];
};

solve.same.stay.two.three.dadb = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    k = solve.none.four.k(disks);
    if (k % 2) {
        return [
            function() {
                return solve.same.stay.two.three.babb(
                    disks - k, from, to, using, extra
                );
            },
            function() {
                return solve.none.three.rec(k, from, using, to);
            },
            function() {
                return solve.same.stay.two.three.ddbb(
                    disks - k, extra, from, using, to
                );
            }
        ];
    }
    return [
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.dadb(
                disks - k, extra, using, from, to);
        }
    ];
};

solve.same.stay.two.three.ddbb = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 3) {
        return [
            function() {
                return solve.none.three.rec(disks, from, using, to);
            }
        ];
    }
    k = solve.none.four.k(disks);
    k += k % 2;
    return [
        function() {
            return solve.same.stay.two.three.babb(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.bddb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.same.stay.two.three.dddb = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    k = solve.none.four.k(disks);
    return [
        function() {
            if (k % 2) {
                return solve.same.stay.two.three.badd(
                    disks - k, from, to, using, extra
                );
            }
            return solve.same.stay.two.three.bdbd(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.dddb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.same.stay.two.three.dddd = function(disks, from, using, extra, to)
{
    var k;
    if (disks < 1) {
        return [];
    }
    k = solve.none.four.k(disks);
    return [
        function() {
            return solve.same.stay.two.three.bddd(
                disks - k, from, using, to, extra
            );
        },
        function() {
            return solve.none.three.rec(k, from, using, to);
        },
        function() {
            return solve.same.stay.two.three.dddb(
                disks - k, extra, using, from, to
            );
        }
    ];
};

solve.star.using.four.rec = function(disks, from, using, extra, to)
{
    if (disks < 1) {
        return [];
    }
    return [
        function() {
            return solve.star.using.four.rec(
                disks - solve.star.fk[disks], from, using, to, extra
            );
        },
        function() {
            return solve.different.two.three.aba(
                solve.star.fk[disks], from, using, to
            );
        },
        function() {
            return solve.star.using.four.rec(
                disks - solve.star.fk[disks], extra, using, from, to
            );
        }
    ];
};

solve.start = function()
{
    var bdi;
    var bdj;
    var disks = main.count.disks;
    var fij;
    var func = solve.none.three.rec;
    var group = solve.none.three;
    var i;
    var j;
    var log2;
    var log3;
    var m;
    var minus;
    var s;
    var stacks = [];
    var star = false;
    var using;
    var to = main.count.per - 1;
    var towers = [];
    if (!main.random && !main.shuffle) {
        if (main.restriction === 'linear') {
            if (main.antwerp) {
                if (main.count.stacks !== 2) {
                    return;
                }
                main.generator = solve.linear.antwerp.two.three.solve(
                    disks, 0, 1, 2
                );
                main.minimum = 10 * Math.pow(3, disks - 1) - (4 * disks) - 2;
                return;
            }
            group = solve.linear;
            func = group.more;
            main.generator = solve.pick(
                [func(disks, 0, to)].concat(
                    solve.multi.more(func, 0, to, solve.towers())
                )
            );
            main.minimum = group.moves(disks) * main.count.stacks;
            return;
        }
        if (main.restriction === 'clock') {
            if (main.antwerp) {
                return;
            }
            group = solve.cyclic;
            if (main.count.stacks === 1) {
                stacks = [group.more.clock(disks, 0, to)];
                main.minimum = solve.cyclic.moves(disks, main.count.per);
            } else {
                stacks = [
                    solve.none.more.first(group.more.counter)
                ].concat(
                    solve.multi.more(group.more.clock, 0, to, solve.towers())
                );
                main.minimum = group.moves(
                    disks, main.count.per, true, true
                ) + group.moves(disks, main.count.per, true, true, true) + (
                    group.moves(disks, main.count.per, false, true) * (
                        main.count.stacks - 1
                    )
                );
            }
            main.generator = solve.pick(stacks);
            return;
        }
        if (main.restriction === 'counter') {
            if (main.antwerp) {
                return;
            }
            group = solve.cyclic;
            if (main.count.stacks === 1) {
                stacks = [group.more.counter(disks, 0, to)];
                main.minimum = solve.cyclic.moves(disks, main.count.per, true);
            } else {
                stacks = [
                    solve.none.more.first(group.more.clock)
                ].concat(
                    solve.multi.more(group.more.counter, 0, to, solve.towers())
                );
                main.minimum = group.moves(
                    disks, main.count.per, false, false, true
                ) + group.moves(disks, main.count.per) + (
                    group.moves(disks, main.count.per, true) * (
                        main.count.stacks - 1
                    )
                );
            }
            main.generator = solve.pick(stacks);
            return;
        }
        if (
            main.restriction === 'different' &&
            main.change &&
            main.count.shades > 1
        ) {
            if (main.antwerp) {
                return;
            }
            if (main.count.shades === 2) {
                group = solve.different.two.three;
                m = $M(
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
                s = $V([1, 2, 3, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1]);
                for (i = 0; i < disks - 1; i++) {
                    s = m.x(s);
                }
                if (main.home) {
                    if (main.count.stacks !== 1) {
                        return;
                    }
                    main.generator = group.edd(disks, 0, 1, to);
                    main.minimum = s.elements[2];
                    return;
                }
                if (main.count.stacks === 1) {
                    if (main.top === '2' || main.top === 'Any') {
                        main.generator = group.dde(disks, 0, 1, to);
                        main.minimum = s.elements[0];
                    }
                    if (main.top === '1') {
                        main.generator = group.ddf(disks, 0, 1, to);
                        main.minimum = s.elements[1];
                    }
                    return;
                }
                towers = [0, 1, to];
                if (main.top === '2') {
                    if (main.count.per === 3) {
                        return;
                    }
                    towers = [0, 1, 2, to];
                }
                group = solve.linear;
                func = group.more;
                main.generator = solve.pick(
                    [func(disks, 0, to, towers)].concat(
                        solve.multi.more(func, 0, to, towers)
                    )
                );
                main.minimum = group.moves(
                    disks, towers.length
                )  * main.count.stacks;
                return;
            }
            if (main.count.shades === 3) {
                group = solve.different.three.three;
                if (main.home) {
                    if (main.count.stacks !== 1) {
                        return;
                    }
                    if (main.top === '2') {
                        main.generator = group.home.light(disks, 0, 1, to);
                        main.minimum = solve.cyclic.moves(
                            disks - 1, 3
                        ) + solve.cyclic.moves(disks - 1, 3) + 4;
                    }
                    if (main.top === '3') {
                        main.generator = group.home.dark(disks, 0, 1, to);
                        main.minimum = solve.cyclic.moves(
                            disks - 1, 3, true
                        ) + solve.cyclic.moves(
                            disks - 1, 3, true
                        ) + 2;
                    }
                    return;
                }
                if (
                    main.top === '1' ||
                    (
                        main.top === 'Any' && main.count.stacks === 1
                    )
                ) {
                    if (main.count.stacks !== 1) {
                        return;
                    }
                    main.generator = group.medium.clock(disks, 0, 1, to);
                    main.minimum = solve.cyclic.moves(
                        disks - 1, 3
                    ) + solve.cyclic.moves(disks - 1, 3, true) + 3;
                }
                if (main.top === '2') {
                    if (main.count.stacks !== 1) {
                        return;
                    }
                    main.generator = solve.cyclic.three.counter(
                        disks, 0, 1, to
                    );
                    main.minimum = solve.cyclic.moves(disks, 3, true);
                }
                if (
                    main.top === '3' ||
                    (
                        main.top === 'Any' && main.count.stacks !== 1
                    )
                ) {
                    group = solve.cyclic;
                    if (main.count.stacks === 1) {
                        stacks = [group.three.clock(disks, 0, 1, to)];
                        main.minimum = group.moves(disks, 3);
                    } else {
                        stacks = [
                            solve.none.three.first(group.three.counter)
                        ].concat(
                            solve.multi.three(group.three.clock, 0, 1, to)
                        );
                        main.minimum = (
                            group.moves(disks, 3, true, true) * 2
                        ) + (
                            group.moves(disks, 3, false, true) * (
                                main.count.stacks - 1
                            )
                        );
                    }
                    main.generator = solve.pick(stacks);
                }
                return;
            }
        }
        if (main.restriction === 'same' || main.restriction === 'group') {
            if (main.antwerp) {
                return;
            }
            if (!main.change && main.count.shades === 2) {
                if (main.count.per === 3 || main.count.stacks > 1) {
                    if (main.count.stacks === 1) {
                        stacks = [func(disks, 0, 1, to)];
                    } else {
                        stacks = [solve.none.three.first(func)].concat(
                            solve.multi.three(func, 0, 1, to)
                        );
                    }
                    main.generator = solve.pick(stacks);
                    main.minimum = solve.none.three.moves(disks);
                    if (main.count.stacks > 1) {
                        main.minimum *= main.count.stacks + 1;
                    }
                    return;
                }
                main.generator = solve.same.stay.two.three.dddd(
                    disks, 0, 1, 2, to
                );
            }
            if (
                !main.change &&
                main.count.shades === 3 &&
                main.restriction === 'same'
            ) {
                func = solve.same.stay.three.three.ddd;
                if (main.count.stacks === 1) {
                    stacks = [func(disks, 0, 1, to)];
                } else {
                    stacks = [solve.none.three.first(func)].concat(
                        solve.multi.three(func, 0, 1, to)
                    );
                }
                main.generator = solve.pick(stacks);
                m = $M(
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
                s = $V([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
                for (i = 0; i < disks - 1; i++) {
                    s = m.x(s);
                }
                main.minimum =  s.elements[0];
                if (main.count.stacks > 1) {
                    main.minimum *= main.count.stacks + 1;
                }
            }
            if (main.change && main.count.shades === 2) {
                group = solve.same.change.two.three;
                if (main.home) {
                    main.generator = group.eddd(disks, 0, 1, 2, to);
                    return;
                }
                if (main.top === '1') {
                    main.generator = group.dddf(disks, 0, 1, 2, to);
                }
                if (main.top === '2' || main.top === 'Any') {
                    main.generator = group.ddde(disks, 0, 1, 2, to);
                }
            }
            return;
        }
        if (
            main.stars.length &&
            main.stars.length < main.count.towers - 1
        ) {
            for (i = 1; i < main.count.per - 2; i++) {
                if (main.stars.index(i) !== -1) {
                    star = i;
                    break;
                }
            }
            if (star === false) {
                return;
            }
            if (main.count.per === 3 || main.count.stacks > 1) {
                towers = [0, 1, to];
                group = solve.linear;
                func = group.more;
                main.generator = solve.pick(
                    [func(disks, 0, to, towers)].concat(
                        solve.multi.more(func, 0, to, towers)
                    )
                );
                main.minimum = group.moves(
                    disks, towers.length
                ) * main.count.stacks;
                return;
            }
            group = solve.star;
            using = 2;
            if (star === 2) {
                using = 1;
            }
            main.generator = group.using.four.rec(disks, 0, star, using, to);
            log2 = Math.log(2.0);
            log3 = Math.log(3.0);
            bdi = Math.floor(
                Math.sqrt(2 * disks * log2 / log3)
            ) + 1;
            bdj = Math.floor(
                Math.sqrt(2 * disks * log3 / log2)
            ) + 1;
            fij = [];
            for (i = 0; i < bdi; i++) {
                for (j = 0; j < bdj; j++) {
                    fij.push(j * log2 / log3 + i);
                }
            }
            fij[bdi * bdj - 1] = -1;
            fij.sort(
                function(a, b) {
                    return a - b;
                }
            );
            main.minimum = 0;
            group.fk = [];
            for (i = 0; i < disks + 1; i++) {
                main.minimum += Math.floor(Math.exp(fij[i] * log3) + 0.5);
                group.fk.push(Math.floor(fij[i]) + 1);
            }
            main.minimum *= 2;
            return;
        }
        if (main.count.stacks === 1) {
            stacks = [solve.none.more.rec(disks, 0, to, solve.towers())];
            main.minimum = solve.none.more.moves(disks, main.count.towers);
        } else if (main.antwerp) {
            group = solve.none.antwerp;
            if (main.count.stacks === 2) {
                main.generator = group.two.three.solve(disks, 0, 1, 2);
                minus = 11;
                if (disks % 2) {
                    minus = 10;
                }
                main.minimum = (
                    7 * Math.pow(2, disks + 1) - 9 * disks - minus
                ) / 3;
            }
            if (main.count.stacks === 3) {
                main.generator = group.three.three.solve(disks, 0, 1, 2);
                main.minimum = 5;
                if (disks > 1) {
                    main.minimum = 12 * Math.pow(2, disks) - (8 * disks) - 10;
                }
            }
            return;
        } else {
            main.minimum = group.moves(disks);
            if (main.count.stacks === 2) {
                stacks = [group.first(func)];
                main.minimum *= 3;
            }
            if (main.count.stacks > 2) {
                stacks = [group.shortcut(func)];
                main.minimum = (
                    main.count.stacks * main.minimum
                ) + group.moves(disks - 1) + 1;
            }
            stacks = stacks.concat(solve.multi.three(func, 0, 1, to));
        }
        main.generator = solve.pick(stacks, true);
    }
};

solve.towers = function() {
    var i;
    var towers = [];
    for (i = 0; i < main.count.per; i++) {
        towers.push(i);
    }
    return towers;
};

solve.xor = function(a, b)
{
    return ((a || b) && !(a && b));
};