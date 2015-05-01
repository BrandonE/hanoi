# Towers of Hanoi Demonstration
### A page containing the puzzle, variations, and solutions.
**By [Brandon Evans](http://www.brandonevans.org/)**

Wikipedia describes [The Towers of Hanoi](http://en.wikipedia.org/wiki/Tower_of_Hanoi) as a mathematical puzzle that has become a popular example of the concept of [recursion](http://en.wikipedia.org/wiki/Recursion_(computer_science)). On this page, we have provided the puzzle, several options used to create variations of it, a method of playing these games manually, and solutions to many of the combinations. We made this program to educate, entertain, and strive for the best solutions to these variations.

## The Puzzle
The classic Towers of Hanoi puzzle has two rules:

* Only one disk shall be moved at a time
* A disk must be moved onto either an empty tower or a bigger disk.

To win, following these rules, transfer all of the disks to the tower farthest to the right in size order. Even in this basic case, this may prove to be much more difficult than expected, and the number of moves it takes to finish grows exponentially as you increase the number of disks.

## How to Use this Page
This page provides several ways to play. These methods can be put into two categories: manual and automatic ones. You can play manually by clicking a tower to take off the top disk and clicking another tower to place it. In addition, you can do the same thing by using the number keys to indicate the tower you want to move to or from, although this doesn't work for towers greater than 9.

For the automatic methods, depending on what options you have provided, there might be a built-in **Solution** that you can watch. To see if we have implemented a solution for this setup, check the *Minimum Moves* field; if it shows something other than "Unsolved", click *Start* to begin the solution and *Stop* to stop it. Also, if you have come up with your own solution and want to save the moves you made, check *Export Moves*, copy the contents of the box that appears, check *Import Moves*, paste the contents into the box that appears, and press Start. It will then execute the moves you did previously. The program will use this method as long as you keep the Import Moves box open and it contains moves. For both of these automatic methods, you can adjust the *Delay* field to change the number of milliseconds the the program will wait in between moves. What happens when the program finishes making the moves depends on the selected *Mode*: selecting "Wait" will make it await further input, "Repeat" will restart the solution with the same options selected, and "Increase" will restart the solution with one additional disk.

We have also provided some additional information fields in the Solution fieldset that deserve mentioning:

* *Moves* shows the number of moves that have been made.
* *Log* shows the moves made. You can show them by checking the checkbox.
* *Minimum Moves* shows the smallest number of moves it takes to finish a given configuration known. In other words, it shows how many moves the built-in solution takes to complete, if this number can be calculated (It shows "N/A" if the puzzle can be solved, but it has no method of calculating the number of moves it would take). This means you can get a solution in less moves than those provided, as few of these configurations have a solution that has been proven optimal.

Once you get a hang of playing the game, you might want to change up the **Settings**. Most programs like this one only have you adjust the number of disks, whereas this one provides many other settings that deserve explaining:

* *Towers per Stack* adjusts how many towers each stack can use. Although increasing this number usually greatly reduces the number of moves needed to win, it also makes the solution much harder to prove optimal.
* *Stacks* adjusts how many different colored stacks get placed on the towers. In the default case, making this number more than one changes the layout of the puzzle so that each stack has its own game, and the games interlock. This introduces a new rule: No disk of a given stack can go on a tower that has a different colored base and peg. This still allows disk of the same color but a different shade, though. Under this configuration, rotate the colored stacks clockwise to win.
* Checking *Antwerp* changes the layout of a game with multiple stacks. Instead of placing towers in between the different stacks, the program places them all next to each other, and each stack can go on any tower. Again, to win, you must rotate the colored stacks clockwise. To enable this, you must also enable *Disks of the same size can be placed on each other* in the restrictions section.
* The *Shades* option adjusts how many shades each stack has, the Alternate option makes the shades of the disks alternate on the stacks, and the *Change* option makes the shade of a disk change when moved. These settings only matter when you enable certain restrictions.
* The *Random* option randomly places disks on the towers, while the *Shuffle* option shuffles the order of the disks. These options might create initial setups that break rules for the given variation. However, in many cases, it's still possible to solve the puzzle if you don't make any illegal moves from that point on. That said, we're still working on these features, so there might be some cases in which they create unsolvable puzzles.

Lastly, you can enable several Restrictions. These restrictions have been labeled in an obvious way, so we won't explain what each of them does. However, if you enable any of the restrictions regarding shade, and you have enabled Change, two additional settings appear:

* *Top Shade* states what shade the top disk of each stack must be to complete the puzzle. This value can either be "Any" or a number. Initially, top disk has the shade 1. If you have set *Shades* to more than 1, then the color that disk changes to upon moving would be shade 2, and so on.
* If you check the *Home* option, then to win, all the stacks must return to where they started with the top disk having a different shade than it originally had. For this reason, when you check this option, there must be at least two *Shades*, and the *Top Shade* can't be "Any" nor 1.

If you don't set any additional restrictions, you can also select Star Towers. To make a tower a star tower, check the checkbox on top of it. If you have selected star towers, moves must either be from or to them.

Finally, if you want to share the options you have set, copy the *URL for this configuration*.
