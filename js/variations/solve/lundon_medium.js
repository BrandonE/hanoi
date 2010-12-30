if (!main.shuffle && main.count.stacks == 1)
{
    var solution = 0;
    var func;
    switch (solution)
    {
        case 0:
            func = lundon.medium.clock;
            break;
        case 1:
            func = lundon.medium.counter;
    }
    main.generator = func(main.count.disks, 0, 1, main.count.towers - 1);
}