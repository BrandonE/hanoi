if (!main.random && !main.shuffle && main.count.stacks == 1)
{
    main.generator = star.rec(
        main.count.disks, 0, 1, 2, main.count.towers - 1
    );
}