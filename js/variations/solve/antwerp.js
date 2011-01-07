if (main.movement == 'all' && !main.random && !main.shuffle)
{
    if (main.count.stacks == 2)
    {
        main.generator = antwerp.three.two.solve(main.count.disks, 0, 1, 2);
    }
    if (main.count.stacks == 3)
    {
        main.generator = antwerp.three.three.all(main.count.disks, 0, 1, 2);
    }
}