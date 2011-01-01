/*
Copyright (C) 2010 Brandon Evans.
http://www.brandonevans.org/
*/
var star = {
    'fk': []
};

star.rec = function(disks, from, using, extra, to)
{
    if (disks < 1)
    {
        return [];
    }
    return [
        function()
        {
            return star.rec(disks - star.fk[disks], from, using, to, extra);
        },
        function()
        {
            return domino.aba(star.fk[disks], from, using, to);
        },
        function()
        {
            return star.rec(disks - star.fk[disks], extra, using, from, to);
        }
    ];
};

star.start = function()
{
    var log2 = Math.log(2.0);
    var log3 = Math.log(3.0);
    var bdi = Math.floor(Math.sqrt(2 * main.count.disks * log2 / log3)) + 1;
    var bdj = Math.floor(Math.sqrt(2 * main.count.disks * log3 / log2)) + 1;
    var fij = [];
    for (var i = 0; i < bdi; i++)
    {
        for (var j = 0; j < bdj; j++)
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
    minimum = 0;
    star.fk = [];
    for (i = 0; i < main.count.disks + 1; i++)
    {
        minimum += Math.floor(Math.exp(fij[i] * log3) + 0.5);
        star.fk.push(Math.floor(fij[i]) + 1);
    }
    minimum *= 2;
};