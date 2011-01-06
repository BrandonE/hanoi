if (main.movement == 'any' && !main.random && !main.shuffle)
{
    if (main.count.per == 3)
    {
        main.generator = main.pick(
            main.stacks(
                classic.three.rec, classic.three.first, classic.three.other
            ),
            classic.three.pick,
            {'shortcut': false}
        );
    }
    else if (main.count.stacks == 1)
    {
        var solution = 0;
        var func;
        switch (solution)
        {
            case 0:
                func = checkers.dddd;
                break;
            case 1:
                func = checkers.babb;
                break;
            case 2:
                func = checkers.baab;
                break;
            case 3:
                func = checkers.bbab;
        }
        main.generator = func(
            main.count.disks, 0, 1, 2, main.count.towers - 1
        );
    }
}