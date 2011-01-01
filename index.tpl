<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>The Towers of Hanoi and Variations</title>
<meta name="description" content="A page providing several variations on the
classic Towers of Hanoi puzzle and a graphic solver." />
<meta name="keywords" content="the, towers, of, hanoi, puzzle, classic,
variations, disk, disks, multistack, solver" />
<meta name="author" content="Brandon Evans" />
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8"
/>
<link href="style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/lib/jquery.js"></script>
<script type="text/javascript" src="js/lib/mobile.js"></script>
<script type="text/javascript" src="js/lib/json2.js"></script>
<script type="text/javascript" src="js/lib/sylvester.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript" src="js/variations/classic.js"></script>
<script type="text/javascript" src="js/variations/cyclic.js"></script>
<script type="text/javascript" src="js/variations/rainbow.js"></script>
<script type="text/javascript" src="js/variations/antwerp.js"></script>
<script type="text/javascript" src="js/variations/domino.js"></script>
<script type="text/javascript" src="js/variations/checkers.js"></script>
<script type="text/javascript" src="js/variations/reversi.js"></script>
<script type="text/javascript" src="js/variations/star.js"></script>
<script type="text/javascript" src="js/variations/lundon.js"></script>
<script type="text/javascript" src="js/variations/brandonburg.js"></script>
</head>
<body>
<div style="text-align: center">
    <script type="text/javascript">
    <!--
    google_ad_client = "pub-4664609413658128";
    /* 468x60, created 9/25/10 */
    google_ad_slot = "8979098997";
    google_ad_width = 468;
    google_ad_height = 60;
    //-->
    </script>
    <script type="text/javascript"
    src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
    </script>
</div>
<h1>The Towers of Hanoi and Variations</h1>
<h3>
    A page containing several variations on the classic Towers of Hanoi puzzle
    and a graphic solver.
</h3>
<p>
    <a href="http://en.wikipedia.org/wiki/Tower_of_Hanoi" target="_blank">The
    Tower of Hanoi</a> is a mathematical puzzle that has become a popular
    example of the concept <a
    href="http://en.wikipedia.org/wiki/Recursion_(computer_science)"
    target="_blank">recursion</a>. On this page, we have provided several
    variations of the puzzle, plus solution algorithms for many of them. I made
    this program to educate, entertain, and strive for the best solutions to
    these variations. Please <a href="mailto:admin@brandonevans.org">contact
    me</a> if you have feedback or contributions. You can see the stable
    version of this page <a href="/hanoi/">here</a> and the development version
    <a href="/dev/hanoi/">here</a>. Thanks for visiting.
</p>
<div class="yesscript" style="display: none">
    <div id="towers"></div>
    <div style="clear: both"></div>
    <table style="width: 100%">
        <tr>
            <td><label for="variation">Variation</label></td>
            <td>
                <select id="variation">
                    <option>Classic</option>
                </select>
            </td>
            <td rowspan="11">
                <textarea class="source" id="source" style="width: 100%"
                rows="20" cols="80"></textarea>
            </td>
        </tr>
        <tr>
            <td><label for="mode">Mode</label></td>
            <td>
                <select id="mode">
                    <option>Wait</option>
                    <option>Repeat</option>
                    <option>Increase</option>
                </select>
            </td>
        </tr>
        <tr>
            <td><label for="diskcount">Disks per Stack</label></td>
            <td>
                <input type="text" id="diskcount" />
            </td>
        </tr>
        <tr class="antwerp">
            <td><label id="per" for="percount"></label></td>
            <td>
                <input type="text" id="percount" />
            </td>
        </tr>
        <tr class="antwerp">
            <td><label for="stackcount">Stacks</label></td>
            <td>
                <input type="text" id="stackcount" />
            </td>
        </tr>
        <tr>
            <td><label for="delay">Delay</label></td>
            <td>
                <input type="text" id="delay" />
            </td>
        </tr>
        <tr>
            <td>Moves</td>
            <td>
                <span id="moves"></span>
            </td>
        </tr>
        <tr>
            <td>Minimum Moves</td>
            <td>
                <span id="minimum"></span>
            </td>
        </tr>
        <tr>
            <td>
                <input type="checkbox" id="random" />
                <label for="random">Random</label>
            </td>
            <td>
                <input type="checkbox" id="shuffle" />
                <label for="shuffle">Shuffle</label>
            </td>
        </tr>
        <tr>
            <td>
                <input type="checkbox" id="draw" />
                <label for="draw">Draw</label>
            </td>
            <td>
                <input type="checkbox" id="showsource" />
                <label for="showsource">Source</label>
            </td>
        </tr>
        <tr>
            <td>
                <input type="checkbox" id="showlog" />
                <label for="showlog">Log</label>
            </td>
            <td>
                <textarea id="log" rows="5" cols="17" readonly="readonly"
                style="display: none"></textarea>
            </td>
        </tr>
        <tr>
            <td>
                <input type="checkbox" id="showmovesource" />
                <label for="showmovesource">Move Source</label>
            </td>
            <td>
                <textarea id="movesource" rows="1" cols="17" readonly="readonly"
                style="display: none"></textarea>
            </td>
        </tr>
        <tr>
            <td>
                <input type="button" id="switch" value="Start" />
            </td>
            <td>
                <input type="button" id="startover" value="Start Over" />
            </td>
        </tr>
        <tr>
            <td>
                <div class="stopped">
                    <input type="button" id="undo" value="Undo" />
                </div>
            </td>
            <td>
                <div class="stopped">
                    <input type="button" id="redo" value="Redo" />
                </div>
            </td>
            <td class="source" style="text-align: center">
                <input type="button" id="reload" value="Reload" />
            </td>
        </tr>
    </table>
    <h2>Latest Changeset</h2>
    <p>
        Posted by [var]user[/var] on [var]date[/var]:
    </p>
    <div style="font: 1em/1.2em monospace">
        [var entities="false"]description[/var]
    </div>
    <h2>Instructions</h2>
    <p>
        To begin, choose a <em>Variation</em>. From here, you can select the
        number of <em>Disks per Stack</em>, the <em>Towers per Stack</em>, and
        the number of <em>Stacks</em>. The game will adjust after you click
        outside of the field. You can also make it so that the puzzle randomly
        places disks on the towers by checking <em>Random</em> as well as
        shuffle the order of the disks by checking <em>Shuffle</em>.
    </p>
    <p>
        You can use this program in two ways: manually move the disks or have
        the program solve the puzzle. To move the disks, simply click a tower
        and then the tower you want to move it to. Alternatively, you can press
        the number tower you want to move from / to on the keyboard, and it
        will move if you aren't in a text field. To have the program solve the
        puzzle, press <em>Start</em>, and press <em>Stop</em> to stop it. You
        can also adjust the <em>Delay</em> field to change the amount of
        milliseconds between the moves made by the program. For technical
        purposes, you can't manually move disks while the solution runs, and if
        you stop the program and manually move, you will most likely cause the
        program to make an invalid move. While the the solution isn't running,
        you can also <em>Undo</em> and <em>Redo</em> moves.
    </p>
    <p>
        To show the moves made, the program can do two things: <em>Draw</em>
        the puzzle graphically, or <em>Log</em> the moves. By default, it draws
        but doesn't log. You can toggle both by ticking their respective
        checkboxes.
    </p>
    <p>
        When you  have the program solve the puzzle, what happens upon the
        completion of the moves depends on which mode you pick. If you pick
        <em>Wait</em>, it will do nothing. If you pick <em>Repeat</em>, it will
        start the process over again. Lastly, if you pick <em>Increase</em>, it
        will restart and add a disk to each stack.
    </p>
    <p>
        When the program solves the puzzle, it uses a snippet of
        <a href="http://en.wikipedia.org/wiki/Javascript" target="_blank">
        Javascript</a> code. You can view and modify said snippet by ticking
        the <em>Source</em> checkbox. This snippet runs along with the already
        included Javascript, which you can read <a href="js">here</a>. When you
        press Start for the first time, it runs the snippet and makes the
        textbox read-only. Pressing Stop and Start again will not run the code
        again, but merely continue the solution process.
    </p>
    <p>
        Often, a variation will have multiple solutions, each illustrating a
        different method. For these variations, we have set it up so that you
        can change which solution is used by changing the <em>solution</em>
        variable in the snippet. The solution it uses by default is the best
        solution we know of for the variation. This doesn't mean it is an
        optimal solution, nor a proven one. It simply means that it solves the
        puzzle in less moves than any other solution we know. The <em>Minimum
        Moves</em> field computes the amount of moves this solution makes
        whenever possible. If we haven't found a formula to compute this number
        with, or we have no solution to the given problem, the field is marked
        as <em>N/A</em>.
    </p>
    <p>
        In <em>main.js</em>, you can find some key functions: <em>process</em>,
        which runs one step of a solution
        <a href="http://en.wikipedia.org/wiki/Generator_(computer_science)">
        generator</a> at a time, <em>stacks</em>, which creates generators for
        each stack in a game with multiple stacks, and <em>pick</em>, which
        creates a generator that picks the stack to process at a given point.
        For examples of these generators, see a specific
        <a href="js/variations">variation's Javascript code</a>. All in all,
        these tools allow you to come up with your own solutions to the
        variations.
    </p>
    <p>
        In addition, if you came up with a solution without code and want to
        have the program repeat the process, tick the <em>Move Source</em>
        checkbox, paste its contents into the Source box, and press start.
    </p>
    <h2>General Notes</h2>
    <p>Almost all of the variations have two main rules:</p>
    <ol>
        <li>Only one disk shall be moved at a time</li>
        <li>
            A disk must be moved onto either an empty tower or a bigger disk.
        </li>
    </ol>
    <p>
        Also, unless stated otherwise, To win, transfer all of the
        disks to the tower farthest to the right in size order.
    </p>
    <div class="variation" id="cyclic">
        <h2>Cyclic</h2>
        <p>This variation has one additional rule:</p>
        <ul>
            <li>
                Every disk must move in the same cyclic direction (Clockwise).
                For instance, if you play with three towers, you can only move
                a given disk from the first tower to the second tower to the
                third tower to the first tower again.
            </li>
        </ul>
    </div>
    <div class="variation" id="rainbow">
        <h2>Rainbow</h2>
        <p>This variation has one additional rule:</p>
        <ul>
            <li>No disk may be placed on another of the same color.</li>
        </ul>
    </div>
    <div class="variation" id="antwerp">
        <h2>Antwerp</h2>
        <p>
            This variation replaces the first general rule with the following:
        </p>
        <ul>
            <li>No disk can be moved onto a smaller disk.</li>
        </ul>
        <p>
            Although this might seem to be a subtle difference, it means you
            can stack disks of the same size on top of eachother. To win, 
            rotate all of the stacks clockwise.
        </p>
    </div>
    <div class="variation" id="domino_about">
        <h2>About Domino Variations</h2>
        <p>All of the Domino variations have two additional rules:</p>
        <ol>
            <li>
                Every disk shall flip between two colors as it moves to a new
                tower.
            </li>
            <li>No disk may be placed on a disk of a different color.</li>
        </ol>
    </div>
    <div class="variation" id="domino_light">
        <h2>Domino Light</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make each disk's color light.
        </p>
    </div>
    <div class="variation" id="domino_dark">
        <h2>Domino Dark</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make each disk's color dark.
        </p>
    </div>
    <div class="variation" id="domino_home_light">
        <h2>Domino Home Light</h2>
        <p>
            To win, end with all of the disks on the tower they started on in
            size order and make each disk's color light.
        </p>
    </div>
    <div class="variation" id="checkers">
        <h2>Checkers</h2>
        <p>This variation has one additional rule:</p>
        <ul>
            <li>No disk may be placed on a disk of a different color.</li>
        </ul>
        <p>
            This may seem to be the same as the Classic puzzle, but you have
            more than three towers or multiple stacks, the optimal solution
            might be different.
        </p>
    </div>
    <div class="variation" id="reversi_about">
        <h2>About Reversi Variations</h2>
        <p>All of the Reversi variations have two additional rules:</p>
        <ol>
            <li>
                Every disk shall flip between two colors as it moves to a new
                tower.
            </li>
            <li>No disk may be placed on a disk of the same color.</li>
        </ol>
    </div>
    <div class="variation" id="reversi_light">
        <h2>Reversi Light</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make the color of the disk on the top of
            the stack light.
        </p>
    </div>
    <div class="variation" id="reversi_dark">
        <h2>Reversi Dark</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make the color of the disk on the top of
            the stack dark.
        </p>
    </div>
    <div class="variation" id="reversi_home_light">
        <h2>Reversi Home Light</h2>
        <p>
            To win, end with all of the disks on the tower they started on in
            size order and make the color of the disk on the top of the stack
            light.
        </p>
    </div>
    <div class="variation" id="star">
        <h2>Star</h2>
        <p>This variation has one additional rule:</p>
        <ul>
            <li>
                Every move must be from or to the star tower, indicated by a
                white peg.
            </li>
        </ul>
    </div>
    <div class="variation" id="super">
        <h2>Super</h2>
        <p>
            This variation begins by placeing the disks randomly on the towers.
            Although the placing might not be in size order, the general rules
            apply from that point on.
        </p>
    </div>
    <div class="variation" id="lundon_about">
        <h2>About Lundon Variations</h2>
        <p>All of the Lundon variations have two additional rules:</p>
        <ol>
            <li>
                Every disk shall flip between three colors as it moves to a new
                tower.
            </li>
            <li>No disk may be placed on a disk of a different color.</li>
        </ol>
    </div>
    <div class="variation" id="lundon_light">
        <h2>Lundon Light</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make each disk's color light.
        </p>
    </div>
    <div class="variation" id="lundon_medium">
        <h2>Lundon Medium</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make each disk's color medium.
        </p>
    </div>
    <div class="variation" id="lundon_dark">
        <h2>Lundon Dark</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make each disk's color dark.
        </p>
    </div>
    <div class="variation" id="lundon_home_light">
        <h2>Lundon Home Light</h2>
        <p>
            To win, end with all of the disks on the tower they started on in
            size order and make each disk's color light.
        </p>
    </div>
    <div class="variation" id="lundon_home_dark">
        <h2>Lundon Home Dark</h2>
        <p>
            To win, end with all of the disks on the tower they started on in
            size order and make each disk's color dark.
        </p>
    </div>
    <div class="variation" id="brandonburg_about">
        <h2>About Brandonburg Variations</h2>
        <p>All of the Brandonburg variations have three additional rules:</p>
        <ol>
            <li>
                Every disk shall flip between three colors as it moves to a new
                tower.
            </li>
            <li>
                In any group of three disks, there can never be two of the same
                color.
            </li>
        </ol>
    </div>
    <div class="variation" id="brandonburg_light">
        <h2>Brandonburg Light</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make the color of the disk on the top of
            the stack light.
        </p>
    </div>
    <div class="variation" id="brandonburg_medium">
        <h2>Brandonburg Medium</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make the color of the disk on the top of
            the stack medium.
        </p>
    </div>
    <div class="variation" id="brandonburg_dark">
        <h2>Brandonburg Dark</h2>
        <p>
            To win, end with all of the disks on the tower farthest to the
            right in size order and make the color of the disk on the top of
            the stack dark.
        </p>
    </div>
    <div class="variation" id="brandonburg_home_light">
        <h2>Brandonburg Home Light</h2>
        <p>
            To win, end with all of the disks on the the tower they started on
            in size order and make the color of the disk on the top of the
            stack light.
        </p>
    </div>
    <div class="variation" id="brandonburg_home_dark">
        <h2>Brandonburg Home Dark</h2>
        <p>
            To win, end with all of the disks on the the tower they started on
            in size order and make the color of the disk on the top of the
            stack dark.
        </p>
    </div>
    <div id="multi">
        <h2>Playing with Multiple Stacks</h2>
        <p>
            When playing with multiple stacks, the first and last towers of
            each game join together. In affect, this adds one new rule:
        </p>
            <ul>
                <li>
                    No disk of a given stack can go on a tower that has a
                    different colored base and peg. This doesn't refer to light
                    and dark versions of a color.
                </li>
            </ul>
        <p>
            If, to win a normal game, you have to transfer all of the disks to
            the tower farthest to the right in size order, you now have to
            rotate all of the stacks clockwise.
        </p>
    </div>
    <div id="placing">
        <h2>Playing with Random and Shuffle</h2>
        <p>
            The <em>Random</em> option randomly places disks on the towers
            while the <em>Shuffle</em> option shuffles the order of the disks.
            These options might create initial setups that break rules for the
            given variation. However, in many cases, it's still possible to
            solve the puzzle if you don't make any illegal moves from that
            point on. That said, these features are in the the testing stages,
            so there might be some cases in which they create unsolvable
            puzzles.
        </p>
    </div>
</div>
<div class="noscript">
    <p style="text-align: center">
        <strong>In order to use this page, you must enable Javascript.</strong>
    </p>
</div>
<p style="text-align: center">
    Copyright &copy; 2010-2011 <a href="http://www.brandonevans.org/">Brandon
    Evans</a>. All Rights Reserved.
</p>
<p>
    Special thanks to Fred Lunnon for <a href="java/">his Java implementation I
    based this page on</a>, Victor Mascolo for inventing the original
    Multistack Hanoi puzzle and models (U.S. patent number 7,566,057), Paul
    Stockmeyer and Steve Minsker for their papers on several variations as well
    as other contributions, Alex Munroe for his example of a custom built
    generator as well as other assistance, Chris Santiago for design help,
    James Rhodes and Ian Rahimi for support, and my sister, Lindsay Evans, for
    proposing an alternative solution to the Classic multiple stacks problem,
    and for being supportive with all of my endeavors.
</p>
<div style="text-align: center">
    <p>
        <a href="http://www.suitframework.com/slacks/?referrer=true"
        target="_blank"><img src="images/slacks.png"
        alt="Debug with SLACKS" /></a>
    </p>
    <p>
        <a href="http://www.suitframework.com/" target="_blank"><img
        src="images/poweredby/suit.png" alt="SUIT" /></a>
        <a href="http://www.python.org/" target="_blank"><img
        src="images/poweredby/python.png" alt="Python" /></a>
    </p>
</div>
<div style="text-align: center">
    <script type="text/javascript">
    <!--
    google_ad_client = "pub-4664609413658128";
    /* 468x60, created 9/25/10 */
    google_ad_slot = "8979098997";
    google_ad_width = 468;
    google_ad_height = 60;
    //-->
    </script>
    <script type="text/javascript"
    src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
    </script>
</div>
</body>
</html>