if (
    main.movement == 'any' &&
    !main.random &&
    !main.shuffle &&
    main.count.stacks == 1
)
{
    main.generator = lundon.home.light(
        main.count.disks, 0, 1, main.count.towers - 1
    );
}