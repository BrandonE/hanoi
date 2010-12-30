var solution = 0;
var func = rainbow.ddd;
var first = classic.three.first;
var other = classic.three.other;
switch (solution)
{
    case 0:
        break;
    case 1:
        if (main.count.stacks == 1)
        {
            func = rainbow.bac;
        }
        break;
}
main.generator = main.pick(
    main.stacks(func, first, other),
    classic.three.pick,
    {'shortcut': false}
);