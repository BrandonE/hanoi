if (
    !main.random &&
    !main.shuffle &&
    main.count.stacks == 1 &&
    main.count.per == 3
)
{
    main.generator = cyclic.clock(main.count.disks, 0, 1, 2);
}