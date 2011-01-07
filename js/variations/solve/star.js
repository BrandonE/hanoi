if (
    main.movement == 'all' &&
    !main.random &&
    !main.shuffle &&
    main.count.stacks == 1
)
{
    if (main.count.per == 3)
    {
        main.generator = domino.adjacent(main.count.disks, 0, 1, 2);
    }
    else
    {
        main.generator = star.rec(
            main.count.disks, 0, 1, 2, main.count.towers - 1
        );
    }
}