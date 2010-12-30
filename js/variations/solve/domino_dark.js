if (!main.shuffle && main.count.stacks == 1)
{
    var solution = 0;
    var func;
    switch (solution)
    {
        case 0:
            func = domino.ddf;
            break;
        case 1:
            func = domino.aba;
            break;
        case 2:
            func = domino.adjacent;
    }
    main.generator = func(main.count.disks, 0, 1, main.count.towers - 1);
}