if (!main.shuffle && main.count.stacks == 1)
{
    main.generator = cyclic.far(main.count.disks, 0, 1, main.count.towers - 1);
}