if (!main.shuffle)
{
    var solution = 0;
    var func = classic.three.rec;
    var first = classic.three.first;
    var other = classic.three.other;
    var shortcut = classic.three.shortcut;
    switch (solution)
    {
        case 0:
            if (main.count.stacks == 1)
            {
                func = classic.more.rec;
                other = classic.more.other;
            }
            break;
        case 1:
            if (main.count.stacks == 1 && main.count.per == 4)
            {
                func = classic.four.rec;
                other = classic.four.other;
            }
            break;
        case 2:
            break;
        case 3:
            func = classic.three.iter;
    }
    main.generator = main.pick(
        main.stacks(func, first, other, shortcut),
        classic.three.pick
    );
}