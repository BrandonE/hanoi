if (    main.movement == 'any' &&    !main.random &&    !main.shuffle &&    main.count.stacks == 1){    var solution = 0;    var func;    switch (solution)    {        case 0:            func = reversi.dddf;            break;        case 1:            func = reversi.babb;            break;        case 2:            func = checkers.bbab;            break;        case 3:            func = reversi.baab;            break;        case 4:            func = reversi.bbbd;            break;        case 5:            func = reversi.g;    }    main.generator = func(main.count.disks, 0, 1, 2, main.count.towers - 1);}