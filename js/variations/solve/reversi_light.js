if (    main.movement == 'any' &&    !main.random &&    !main.shuffle &&    main.count.stacks == 1){    var solution = 0;    var func;    switch (solution)    {        case 0:            func = reversi.ddde;            break;        case 1:            func = reversi.baba;    }    main.generator = func(main.count.disks, 0, 1, 2, main.count.towers - 1);}