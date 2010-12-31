if (!main.random && !main.shuffle && main.count.stacks == 1)
{
    main.generator = domino.edd(main.count.disks, 0, 1, main.count.towers - 1);
}