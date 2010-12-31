/* Tower of Hanoi mark 16, W.F.Lunnon (26/11/02) (13/07/07) (05/06/10) (24/08/10) 17/09/10 */ 
/* Sample user-definable variation rule and solution; pre-defined library: 
  3-pin & 4-pin & m-pin classic, cyclic, rainbow, domino, reversi, antwerp, 
  checkers, turtle, l,m,n, fin() */ 
/* Compile via " javac HanoiLib.java ", 
  run " appletviewer HanoiVar.html & " or " java HanoiVar & " */ 

import java.awt.*; 
import java.awt.event.*; 
import java.applet.Applet; 
import java.lang.Math; 

// Implement base colour in check() methods ?? 
// Rainbow_C etc lack coloured bases --- c.f. Classic_P 

// Update documentation HanoiVar.html with new variations or colour changes !! 
// Variations available --- update with new entries to be displayed on menu !! 
class HanoiLib extends Frame {

  static HanoiDefn [] list = 
    {new Classic(), new Cyclic(), new Rainbow(), new Antwerp(), new Reves(), 
      new Many_Pin(), new Adjacent(), new Domino(), new Checkers(), 
      new Reversi(), new Turtle(), new Multi_Stack(), new Four_Star(), 
      new Lundon(), new Brandonbug(), 
      // new Three_Pin(), new Domino_A(), new Rainbow_D(), // duplicates 
      // new Domino_D(), new Four_Pin(), new Reversi_D(), 
      new Classic_P(), new Adjacent_P(), new Cyclic_L(), new Cyclic_R(), 
      new Rainbow_C(), new Domino_B(), new Domino_E(), new Domino_F(), 
      new Checkers_B(), new Checkers_C(), new Checkers_P(), 
      new Reversi_A(), new Reversi_B(), new Reversi_C(), new Reversi_E(), 
      new Reversi_F(), new Reversi_G(), new Reversi_H(), new Reversi_P(), 
      new Lundon_B(), new Lundon_C()}; 
  } /* HanoiLib */ 

// Reversi_D and all 3-pin variations use X,Y,Z; other 4-pin use W,X,Y,Z. 

abstract class ClassicDefn extends HanoiDefn {
  //String name () {return ("ClassicDefn");} 

  // Three-pin classical 
  void tranC (Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("C", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranC(next, X, Z, Y); move(X, Z); tranC(next, Y, X, Z);}} 

  // Three-pin classical: optimal, iterative. 
  void tranC (Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    int count = 0; // move counter = timeCur.get(); 
    int n = X.base.diam - 1; // number of discs 
    Pin pim = null, pin = null; // pins involved in current move 
    boolean done = (n == 0); // finished 
    while (!done) /*do*/ {// smallest disc: count mod 2 = 0 
      if (n%2 == 1) /*then*/ switch(count%3) /*of*/ {
        case  0: pim = X;  pin = Z; break; 
        case  1: pim = Y;  pin = X; break; 
        case  2: pim = Z;  pin = Y; break;} 
      else switch(count%3) /*of*/ {
        case  0: pim = X;  pin = Y; break; 
        case  1: pim = Z;  pin = X; break; 
        case  2: pim = Y;  pin = Z; break;} 
      if (pim.shaft.below.diam < pin.shaft.below.diam) 
      /*then*/ move(pim, pin); else move(pin, pim); 
      done = (Z.shaft.alti > n); count = count + 1;}} 

  // k-th disc above, k small 
  static Disc next_k (Disc disc, int k) {
    Disc next = disc; while (k > 0) /*do*/ {k = k-1; next = next.above;} 
    return(next);} 

  // k with (k+1)_C_2 <= n < (k+2)_C_2; 
  static int reves_k (int n) {
    return((int) Math.floor((Math.sqrt(2*n+0.25)-0.5)));} 
  // k with |n - (k+1)_C_2| < k/2. 
  static int reves_j (int n) {
    return((int) Math.floor(Math.sqrt(2*n+0.25)));} 

  // Frame's algorithm for Reve's puzzle 
  void tranF (Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("F", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      // next = k-th above disc n, where (k+1)_C_2 nearest to n 
      Disc next = next_k(disc, reves_j (disc.diam)); 
      // transfer bottom k discs via 3-pin, remainder twice via 4-pin 
      tranF(next, W, Z, Y, X); tranC(disc, W, Y, Z); tranF(next, X, W, Y, Z);}} 

  // factorial y!; binomial coefficient x_C_y; power x^y for natural x,y. 
  static double fact (int y) {
    double ans = 1; int i = 1; 
    while (i < y) /*do*/ {i = i+1; ans = ans*i;} 
    return(ans);} 
  static double binom (int x, int y) {// loses precision for y > 40 approx. 
    double ans = 1; int i = 0; 
    while (i < y) /*do*/ {ans = ans*(x-i)/(i+1); i = i+1;} 
    return(ans);} 
  static double power (int x, int y) {double ans; 
    if (x == 0) /*then*/ ans = Math.max(0, 1-y); 
    else ans = Math.round(Math.exp(y*Math.log(x))); 
    return(ans);} 

  // Time = number of moves to transfer n discs using m pins 
  // Change to double ans, ant; ? 
  static void time_mn (int m, int n) {
    int i, j, t = 0, n_0 = 0, n_1 = 0, k_0 = 0, k_1 = 0, k = 0, 
      ans = -2, ant = -2, twoj; 
    if (m == 0) /*then*/ {if (n == 0) /*then*/ ans = 0; else ans = -1;} 
      else if (m == 1) /*then*/ ans = 0; 
      else if (m == 2) /*then*/ {if (n < 2) /*then*/ ans = n; else ans = -1;} 
      else if (n == 0) /*then*/ ans = 0; 

    else {// nontrivial cases 
      // Find t with (t+m-3)_C_(m-2) = n_0 <= n < n_1 = (t+m-2)_C_(m-2); 
      // approx. t = (r! n)^(1/r) with r = m-2; exact t via trial-and-error 
      t = (int) Math.max(1, 
        Math.round(Math.exp(Math.log(fact(m-2)*n)/(m-2)) - (m-3)/2)); 
      n_0 = (int) Math.round(binom(t+m-3, m-2)); n_1 = n_0*(t+m-2)/t; 
      while (n >= n_1) /*do*/ {t = t+1; n_0 = n_1; n_1 = n_0*(t+m-2)/t;} 
      while (n < n_0) /*do*/ {t = t-1; n_1 = n_0; n_0 = n_1 *t/(t+m-2);} 
      // Find k = any value in max(k_0, k_1-n_1+n) <= k <= min(k_1, k_0-n_0+n), 
      // where k_0 = (t+m-4)_C_(m-3), k_1 = (t+m-3)_C_(m-3). 
      k_0 = /*if*/ (t+m == 3) ?/*then*/ 1 :/*else*/ n_0*(m-2)/(t+m-3); 
      k_1 = n_1*(m-2)/(t+m-2); 
      k = Math.max(k_0, k_1-n_1+n); // k smallest in interval 

      // [(n-n_0) + \sum_{j=0}^{j=m-3} (-2)^j {t+m-3}_C_{m-3-j}] 2^t + (-)^m; 
      ans = 0; j = 0; twoj = 1; 
      while (j < m-2) /*do*/ {
        ans = ans + twoj*(int) Math.round(binom(t+m-3, m-3-j)); 
        twoj = twoj*(-2); j = j+1;} 
      ans = (ans + (n-n_0))*(int) Math.round(power(2, t)) + (1-m%2*2); 
      // = [(n-n_0)2^t + \sum_{i=0}^{i=t-1} 2^i {i+m-3}_C_{m-3}] 
      ant = 0; i = 0; twoj = 1; 
      while (i < t) /*do*/ {
        ant = ant + twoj*(int) Math.round(binom(i+m-3, m-3)); 
        twoj = twoj*2; i = i+1;} 
      ant = ant + (n-n_0)*(int) Math.round(power(2, t));} 

    if (ant == -2) /*then*/ ant = ans; // kludge to fix up unset altern ans 
    System.out.println(" Many_Pin" + 
      ", m " + String.valueOf(m) + ", n " + String.valueOf(n) + 
      ", n_0 " + String.valueOf(n_0) + ", n_1 " + String.valueOf(n_1) + 
      ", t " + String.valueOf(t) + ", k " + String.valueOf(k) + " " + 
      ", k_0 " + String.valueOf(k_0) + ", k_1 " + String.valueOf(k_1)); 
    System.out.println(
      " time_s " + String.valueOf(ans) + ", time_t " + String.valueOf(ant) + 
      " ");} 

  // Transfer all consecutive discs from first to last pin using all pins; 
  void tranN (Tower tower) throws HanoiException {
    int m, n, t = 0, n_0 = 0, n_1 = 0; 
    if (tower.m > 0) /*then*/ {Disc disc = tower.pins[0].base.above; 
      if (disc != tower.pins[0].shaft) /*then*/ {
        m = tower.m; n = disc.diam; // number of pins > 0, discs > 0 
      if (traceTog.get()) /*then*/ time_mn(m, n); // trace time formula values  

        // approx. t = (r! n)^(1/r) with r = m-2; exact t via trial-and-error 
        if (m > 2 && n > 0) /*then*/ {// nontrivial cases of t, n_0, n_1 
          t = (int) Math.max(1, 
            Math.round(Math.exp(Math.log(fact(m-2)*n)/(m-2)) - (m-3)/2)); 
          n_0 = (int) Math.round(binom(t+m-3, m-2)); n_1 = n_0*(t+m-2)/t; 
          while (n >= n_1) /*do*/ {t = t+1; n_0 = n_1; n_1 = n_0*(t+m-2)/t;} 
          while (n < n_0) /*do*/ {t = t-1; n_1 = n_0; n_0 = n_1 *t/(t+m-2);}} 
        tranM(disc, tower.pins[m-1], tower, m, n, t, n_0, n_1);}}} 

  // Transfer topmost stack of n discs from disc pin to pin Z using m pins: 
  // t,n_0,n_1 defined by (t+m-3)_C_(m-2) = n_0 <= n < n_1 = (t+m-2)_C_(m-2); 
  // then k_0 = (t+m-4)_C_(m-3), k_1 = (t+m-3)_C_(m-3), and size k of lower 
  // substack should satisfy max(k_0, k_1-n_1+n) <= k <= min(k_1, k_0-n_0+n). 
  // [Passing t,n_0,n_1 as arguments avoids recomputation; no tower creation!] 
  void tranM (Disc disc, Pin Z, Tower tower, 
    int m, int n, int t, int n_0, int n_1) throws HanoiException {
    tower.trace("M", disc); 
    if (n > 0 && m > 1) /*then*/ {
      if (m == 2) /*then*/ move(disc.pin, Z); // assume single disc move 

      else {
        if (disc.pin.shaft.alti != disc.alti + n) 
        /*then*/ move(disc.pin, disc.pin); // verify (some) n-1 discs above 
        else {
          int k_0 = /*if*/ (t+m == 3) ?/*then*/ 1 :/*else*/ n_0*(m-2)/(t+m-3), 
            k_1 = n_1*(m-2)/(t+m-2), 
            k = Math.max(k_0, k_1-n_1+n); // k smallest in interval 

          Disc next = next_k(disc, k); // split stack into two sub-stacks 
          int i = 0; while (tower.pins[i].shaft.below.diam < disc.diam 
            || tower.pins[i] == Z) /*do*/ i = i+1; /*od*/ 
          Pin Y = tower.pins[i]; // first available "via" pin located 

          // transfer m-pin upper n-k discs from pin X to pin Y, 
          //   (m-1)-pin lower k discs from pin X to pin Z, 
          //   m-pin upper n-k discs from pin Y to pin Z. 
          tranM(next, Y, tower, m, n-k, t-1, n_0-k_0, n_1-k_1); 
          tranM(disc, Z, tower, m-1, k, t, k_0, k_1); 
          tranM(next, Z, tower, m, n-k, t-1, n_0-k_0, n_1-k_1);}}}} 

  static final int[] discol = {3, 4}; // red, green 
  void reshade (Disc disc) {
    if (disc.shade == 0) /*then*/ disc.shade = discol[disc.diam%2]; /*fi*/} 

  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam;} 

  // Ensure stack monotonic on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all pins but last empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = m; this.n = n; 
    return (new Tower(this.m, this.n, defn));} 

  } /* ClassicDefn */ 

class Three_Pin extends ClassicDefn {
  // 3-pin; optimal 
  String name () {return ("Three_Pin");} 
  void tran (Tower tower) throws HanoiException {
    tranC(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 
  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    return super.init(3, n, defn);} 
  } /* Three_Pin */ 

class Four_Pin extends ClassicDefn {
  // Classic 4-pin; optimal under Frame's hypothesis 
  String name () {return ("Four_Pin");} 
  void tran (Tower tower) throws HanoiException {
    tranF(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    return super.init(4, n, defn);} 
  } /* Four_Pin */ 

class Many_Pin extends ClassicDefn {
  // Classic m-pin; optimal under Frame's hypothesis. 
  String name () {return ("Many_Pin");} 
  // Transfer all consecutive discs from first to last pin using all pins; 
  void tran (Tower tower) throws HanoiException {
    tranN(tower);} 
  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    return super.init(m, n, defn);} 
  } /* Many_Pin */ 

class Classic_P  extends ClassicDefn {
  // 3-pin; optimal 
  String name () {return ("Classic_P");} 
  // Transfer tower of discs from pin 0 to pin 2, bases coloured BAB 
  void tran (Tower tower) throws HanoiException {
    tranC(tower.pins[0], tower.pins[1], tower.pins[2]);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    Tower tow = super.init(3, n, defn); 
    tow.pins[1].base.shade = tow.pins[0].base.above.shade; // re-colour bases 
    tow.pins[0].base.shade = discol[0]+discol[1] - tow.pins[1].base.shade; 
    tow.pins[2].base.shade = tow.pins[0].base.shade; 
    return tow;} 

  } /* Classic_P */ 

class Classic extends Three_Pin {
  // Menu wrapper 
  String name () {return ("Classic");} 
  } /* Classic */ 

class Reves extends Four_Pin {
  // Menu wrapper 
  String name () {return ("Reves");} 
  } /* Reves */ 

abstract class CyclicDefn extends HanoiDefn {
  // Time = order (1+sqrt3)^n; average density of blue discs = 2-sqrt3. 
  // No short purely periodic iterative strategy. 
  //String name () {return ("CyclicDefn");} 

  void tranL(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("L", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranL(next, X, Y, Z); move(X, Y); 
      tranR(next, Z, Y, X); move(Y, Z); tranL(next, X, Y, Z);}} 

  void tranR(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("R", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranL(next, X, Z, Y); move(X, Z); tranL(next, Y, X, Z);}} 

  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam && (Y.disp - X.disp + 3)%3 == 1;} 

  // Ensure stack monotonic on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// first and second pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  static final int[] discol = {6, 5}; // orange, blue 
  void reshade (Disc disc) {
    if (disc.shade == 0) /*then*/ disc.shade = discol[0]; 
    else if (disc.shade == bascol) 
    /*then*/ disc.shade = discol[0]+discol[1] - disc.shade; 
    else if (disc.larger.shade == discol[0]) 
      /*then*/disc.shade = discol[0]+discol[1] - disc.shade; 
      else disc.shade = discol[0]; /*fi*/} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = 3; this.n = n; 
    return (new Tower(this.m, this.n, defn));} 

  } /* CyclicDefn */ 

class Cyclic_L extends CyclicDefn {
  // 3-pin, move only to rightward pin in cyclic order (X->Y->Z->X), 
  // transfer tower to leftward pin; optimal 
  String name () {return ("Cyclic_L");} 
  void tran (Tower tower) throws HanoiException {
    tranL(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    Tower tow = super.init(3, n, defn); 
    tow.pins[0].base.shade = discol[0]; 
    tow.pins[1].base.shade = discol[0]; 
    tow.pins[2].base.shade = discol[0]; 
    return tow;} 

  } /* Cyclic_L */ 

class Cyclic_R extends CyclicDefn {
  // 3-pin, move only to rightward pin in cyclic order (X->Y->Z->X); optimal 
  // transfer tower to rightward pin; optimal 
  String name () {return ("Cyclic_R");} 
  void tran (Tower tower) throws HanoiException {// note permutation of pins 
    tranR(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[2], tower.pins[1]);} 

  // Ensure stack monotonic on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j != 1) /*then*/ {// first and third pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    Tower tow = super.init(3, n, defn); 
    tow.pins[0].base.shade = discol[1]; 
    tow.pins[1].base.shade = discol[1]; 
    tow.pins[2].base.shade = discol[1]; 
    return tow;} 

  } /* Cyclic_R */ 

class Cyclic extends CyclicDefn {
  String name () {return ("Cyclic");} 

  void reshade (Disc disc) {// no colour flipping 
    if (disc.shade == 0) /*then*/ disc.shade = discol[0]; /*fi*/} 

  void tran (Tower tower) throws HanoiException {
    tranL(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 

  } /* Cyclic */ 

abstract class RainbowDefn extends HanoiDefn {
  // 3-pin, 3-colour, move only to different colour; optimal 
  String name () {return ("Rainbow_D");} 

  void tranDDD(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("DDD", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCDD(next, X, Z, Y); move(X, Z); tranDDC(next, Y, X, Z);}} 

  void tranDDC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("DDC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCBD(next, X, Z, Y); move(X, Z); tranDDC(next, Y, X, Z);}} 

  void tranDCB(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("DCB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCAB(next, X, Z, Y); move(X, Z); tranBDC(next, Y, X, Z);}} 

  void tranDBC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("DBC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      if (disc.diam == 1) /*then*/ move(X, Z); 
      else {tranCAB(next, X, Y, Z); move(X, Y); 
        tranBCD(next, Z, Y, X); move(Y, Z); tranDAC(next, X, Y, Z);}}} 

  void tranDAC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("DAC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCBC(next, X, Z, Y); move(X, Z); tranCDC(next, Y, X, Z);}} 

  void tranCDD(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CDD", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCDD(next, X, Z, Y); move(X, Z); tranDBC(next, Y, X, Z);}} 

  void tranCDC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CDC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCBD(next, X, Z, Y); move(X, Z); tranDBC(next, Y, X, Z);}} 

  void tranCDB(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CDB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCAD(next, X, Z, Y); move(X, Z); tranDBC(next, Y, X, Z);}} 

  void tranCBD(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CBD", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      if (disc.diam == 1) /*then*/ move(X, Z); 
      else {tranCAD(next, X, Y, Z); move(X, Y); 
        tranDCB(next, Z, Y, X); move(Y, Z); tranBAC(next, X, Y, Z);}}} 

  void tranCBC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CBC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      if (disc.diam == 1) /*then*/ move(X, Z); 
      else {tranCAB(next, X, Y, Z); move(X, Y); 
        tranBCB(next, Z, Y, X); move(Y, Z); tranBAC(next, X, Y, Z);}}} 

  void tranCAD(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CAD", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCDC(next, X, Z, Y); move(X, Z); tranCBC(next, Y, X, Z);}} 

  void tranCAC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CAC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCBC(next, X, Z, Y); move(X, Z); tranCBC(next, Y, X, Z);}} 

  void tranCAB(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("CAB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCAC(next, X, Z, Y); move(X, Z); tranCBC(next, Y, X, Z);}} 

  void tranBCD(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("BCD", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCDB(next, X, Z, Y); move(X, Z); tranBAC(next, Y, X, Z);}} 

  void tranBCB(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("BCB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCAB(next, X, Z, Y); move(X, Z); tranBAC(next, Y, X, Z);}} 

  void tranBDC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("BDC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCBD(next, X, Z, Y); move(X, Z); tranDAC(next, Y, X, Z);}} 

  void tranBAC(Disc disc, Pin X, Pin Y, Pin Z) throws HanoiException {
    trace("BAC", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranCBC(next, X, Z, Y); move(X, Z); tranCAC(next, Y, X, Z);}} 

  static final int r = 3, g = 4, b = 5; // red, green, blue
  void reshade (Disc disc) {switch(disc.diam%3) /*of*/ {
    case 0: disc.shade = r; break; 
    case 1: disc.shade = g; break; 
    case 2: disc.shade = b; break;}} 

  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam && A.shade != B.shade;} 

  // Ensure stack monotonic, on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all but last pins empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = 3; this.n = n; 
    return (new Tower(this.m, this.n, defn));} 

  } /* RainbowDefn */ 

class Rainbow_D extends RainbowDefn {
  // 3-pin, 3-colour, move only to different colour; optimal 
  String name () {return ("Rainbow_D");} 
  void tran (Tower tower) throws HanoiException {
    tranDDD(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 
  } /* Rainbow_D */ 

class Rainbow_C extends RainbowDefn {
  // 3-pin, 3-colour, move only to different colour; 
  // bases coloured B,A,C where discs A,B,C,... from base. 
  String name () {return ("Rainbow_C");} 
  void tran (Tower tower) throws HanoiException {
    tranBAC(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 
  } /* Rainbow_C */ 

class Rainbow extends Rainbow_D {
  // Wrapper 
  String name () {return ("Rainbow");} 
  } /* Rainbow */ 

class Antwerp extends HanoiDefn {
  String name () {return ("Antwerp");} 

// Trace listing move "to" disc size/col misleading ?? [use disc.pin.below] 
// No check that final stacks are monochrome ??  
// No separate AntwerpDefn class ?? 

  void tran (Tower tower) throws HanoiException {
    tran33(tower.pins[0].base.above, 
      tower.pins[1].base.above, tower.pins[2].base.above);} 

  // transfer 3 single stacks cyclically X -> Y -> Z, coloured R,W,B resp. 
  // Time = 12.2^n - 8n - 10 for n > 1; 0,5 for n = 0,1; optimal (Minsker) 
  void tran33(Disc discX, Disc discY, Disc discZ) 
    throws HanoiException {Pin X = discX.pin, Y = discY.pin, Z = discZ.pin; 
    trace("33", discX, X, Y, Z); 
    if (discX.diam > 0) /*then*/ {if (discX.diam == 1) 
      /*then*/ {move(Z, X); move(Y, Z); move(X, Z); move(X, Y); move(Z, X);} 
      else {
        Disc nextX = discX.above, nextY = discY.above, nextZ = discZ.above, 
          lastX = discX.below, lastY = discY.below, lastZ = discZ.below; 
        tran31(nextX, nextZ, nextY); // from pins Y,X,Z to Y 
        move(X, Z); tran11(nextY, lastX, lastZ); // from pin Y to Z 
        move(Y, X); tran11(nextZ, lastY, lastX); // from pin Z to X 
        move(Z, Y); move(Z, Y); // double move 
        tran11(nextY, lastZ, lastY); // from pin X to Y 
        move(X, Z); tran11(nextZ, lastX, lastZ); // from pin Y to Z 
        move(Y, X); tran13(nextY, discX, discZ);}}} // from pin Z to Z,Y,X 

  // transfer 3 single stacks from Z,X,Y to 1 triple Z 
  void tran31(Disc discX, Disc discY, Disc discZ) 
    throws HanoiException {Pin X = discX.pin, Y = discY.pin, Z = discZ.pin; 
    trace("31", discX, X, Y, Z); 
    if (discX.diam > 0) /*then*/ {
      Disc nextX = discX.above, nextY = discY.above, nextZ = discZ.above, 
        lastX = discX.below, lastY = discY.below; 
      tran31(nextX, nextZ, nextY); // from pins Y,X,Z to Y 
      move(X, Z); tran11(nextY, discX, lastX); // from pin Y to X 
      move(Y, Z); tran11(nextZ, lastY, discY);}} // from pin X to Z 

  // transfer 1 triple stack from X to 3 single X,Z,Y 
  void tran13(Disc discX, Disc discY, Disc discZ) 
    throws HanoiException {Pin X = discX.pin, Y = discY.pin, Z = discZ.pin; 
    trace("13", discX, X, Y, Z); 
    if (discX.diam > 0) /*then*/ {
      Disc nextX = discX.above.above.above, nextZ = nextX.above.above, 
        lastX = discX.below.below.below; 
      tran11(nextX, discZ, discY); // from pin X to Y 
      move(X, Z); tran11(nextZ, lastX, discZ); // from pin Y to Z 
      move(X, Y); tran13(nextX, discY, lastX);}} // from pin Z to Z,Y,X 

 // transfer 1 triple stack from X via Y to 1 triple Z 
  void tran11(Disc discX, Disc discY, Disc discZ) 
    throws HanoiException {Pin X = discX.pin, Y = discY.pin, Z = discZ.pin; 
    trace("11", discX, X, Y, Z); 
    if (discX.diam > 0) /*then*/ {
      Disc nextX = discX.above.above.above, nextZ = nextX.above.above, 
        lastX = discX.below.below.below; 
      tran11(nextX, discZ, discY); // from pin X to Y 
      move(X, Z); move(X, Z); move(X, Z); // all large discs 
      tran11(nextZ, lastX, discX);}} // from pin Y to Z 

  static final int[] discol = {3, 1, 5}; // red, white, blue 
  void reshade (Disc disc) {
    if (disc.shade == 0) /*then*/ disc.shade = discol[disc.pin.disp]; /*fi*/} 

  boolean check (Pin X, Pin Y) { // equal diameters permitted 
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam;} 

  // Ensure stacks monotonic & monochrome, colours on correct pins 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[(j-1+m)%m]); 
          } /*od*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 3; this.m = 3; this.n = n; 
    int[] nj = new int[m]; int j = 0; 
    while (j < m) /*do*/ {nj[j] = n; j = j+1;} 
    return (new Tower(this.m, l*this.n, nj, this));} // treble height pins 

  } /* Antwerp */ 

abstract class StacksDefn extends HanoiDefn {
  //String name () {return ("StacksDefn");} 

  Tower tower; // global tower 
  Pin H1, H2, R1, R2, A1, A2; // global pins for twin-stack version 

  // Home/Ride/Away pins for i-th stack 
  int H (int i) {return (2*i+0)%m;} 
  int R (int i) {return (2*i+1)%m;} 
  int A (int i) {return (2*i+2)%m;} 

  // Three-pin classical: iterative, transferring stack of n discs 
  void tranC(int n, Pin X, Pin Y, Pin Z) throws HanoiException {
    //if (traceTog.get()) /*then*/ System.out.println(" Classic " + n); /*fi*/ 
    int i = 0, limit = 1, count = 0; // move counter and length 
    while (i < n) /*do*/ {i = i+1; limit = limit+limit;} /*od*/ 
    Pin pim = null, pin = null; // pins involved in current move 
    while (count < limit-1) /*do*/ {
      // smallest disc: count mod 2 = 0 
      if (n%2 == 1) /*then*/ switch(count%3) /*of*/ {
        case 0: pim = X;  pin = Z; break; 
        case 1: pim = Y;  pin = X; break; 
        case 2: pim = Z;  pin = Y; break;} /*esac*/ 
      else switch(count%3) /*of*/ {
        case 0: pim = X;  pin = Y; break; 
        case 1: pim = Z;  pin = X; break; 
        case 2: pim = Y;  pin = Z; break;} /*esac*/ /*fi*/ 
      if (pim.shaft.below.diam < pin.shaft.below.diam) 
      /*then*/ move(pim, pin); else move(pin, pim); /*fi*/ 
      count = count + 1;} /*od*/} 

  // multi-stack transfer: all stacks from Home to Away --- top level 
  void tranHAHA () throws HanoiException { 
    if (traceTog.get()) /*then*/ System.out.println(" HAHA "); /*fi*/ 
    switch(l) /*of*/ {
      case 0: break; // absent stack: done 
      case 1: break; // single stack: done 
      case 2: { // twin stacks: special case 
        tranHAHR(n-1); tranHR(1, 0); 
        tranAR(n-1, 0); tranHA(1, 1); 
        tranRH(n-1, 0); tranRA(1, 0); 
        tranHARA(n-1); break;} 
      default: { // three stacks or more: general case 
        tranHAHR(n-1); tranHR(1, 0); 
        int i = l; while (i > 2) /*do*/ {i = i-1; tranHA(1, i);} /*od*/ 
        tranAH(n-1, 0); tranHA(1, 1); tranRA(1, 0); 
        tranHARA(n-1); break;}} /*esac*/} 

  // multi-stack transfer: first from Home to Away, rest from Home to Ride 
  void tranHAHR (int n) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" HAHR " + n); /*fi*/ 
    if (n > 0) /*then*/ { 
      tranHRHA(n-1); 
      int i = 0; while (i < l-1) /*do*/ {i = i+1; 
        tranHR(1, i); tranAR(n-1, i);} /*od*/ 
      tranHA(1, 0); tranRA(n-1, 0);} /*fi*/} 

  // multi-stack transfer: first from Home to Ride, rest from Home to Away 
  void tranHRHA (int n) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" HRHA " + n); /*fi*/ 
    if (n > 0) /*then*/ { 
      tranHAHR(n-1); 
      tranHR(1, 0); tranAR(n-1, 0); 
      int i = l; while (i > 1) /*do*/ {i = i-1; 
        tranHA(1, i); tranRA(n-1, i);} /*od*/} /*fi*/} 

  // multi-stack transfer: first from Home to Away, rest from Ride to Away 
  void tranHARA (int n) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" HARA " + n); /*fi*/ 
    if (n > 0) /*then*/ { 
      tranHR(n-1, 0); tranHA(1, 0); 
      int i = 0; while (i < l-1) /*do*/ {i = i+1; 
        tranRH(n-1, i); tranRA(1, i);} /*od*/ 
      tranRAHA(n-1);} /*fi*/} 

  // multi-stack transfer: first from Ride to Away, rest from Home to Away 
  void tranRAHA (int n) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" RAHA " + n); /*fi*/ 
    if (n > 0) /*then*/ { 
      int i = l; while (i > 1) /*do*/ {i = i-1; 
        tranHR(n-1, i); tranHA(1, i);} /*od*/ 
      tranRH(n-1, 0); tranRA(1, 0); 
      tranHARA(n-1);} /*fi*/} 

  // single-stack transfer: i-th stack from Home to Ride 
  void tranHR (int n, int i) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" HR " + n + " " + i); /*fi*/ 
    tranC(n, tower.pins[H(i)], tower.pins[A(i)], tower.pins[R(i)]);} 

  // single-stack transfer: i-th stack from Ride to Home 
  void tranRH (int n, int i) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" RH " + n + " " + i); /*fi*/ 
    tranC(n, tower.pins[R(i)],tower.pins[A(i)], tower.pins[H(i)]);} 

  // single-stack transfer: i-th stack from Away to Home 
  void tranAH (int n, int i) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" AH " + n + " " + i); /*fi*/ 
    tranC(n, tower.pins[A(i)], tower.pins[R(i)], tower.pins[H(i)]);} 

  // single-stack transfer: i-th stack from Home to Away 
  void tranHA (int n, int i) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" HA " + n + " " + i); /*fi*/ 
    tranC(n, tower.pins[H(i)], tower.pins[R(i)], tower.pins[A(i)]);} 

  // single-stack transfer: i-th stack from Away to Ride 
  void tranAR (int n, int i) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" AR " + n + " " + i); /*fi*/ 
    tranC(n, tower.pins[A(i)], tower.pins[H(i)], tower.pins[R(i)]);} 

  // single-stack transfer: i-th stack from Ride to Away 
  void tranRA (int n, int i) throws HanoiException {
    if (traceTog.get()) /*then*/ System.out.println(" RA " + n + " " + i); /*fi*/ 
    tranC(n, tower.pins[R(i)], tower.pins[H(i)], tower.pins[A(i)]);} 

  static final int coloff = 4; 
    // colour table offset for Green, Orange, Cyan, Pink, etc 
  void reshade (Disc disc) {
    // Cycle colours available; maybe recolour Ride pins? 
    if (disc.shade == 0) /*then*/ disc.shade = disc.pin.disp + coloff; /*fi*/} 

  boolean check (Pin X, Pin Y) {
    // Target pin is Home, ride, away for source stack; 
    // final disc is strictly larger, on pin distinct from initial; 
    // disallows move to same pin! 
    Disc A = X.shaft.below, B = Y.shaft.below; 
    int reldis = (Y.disp - A.shade + coloff + m)%m; 
    return (A.diam < B.diam && reldis < 3) || X == Y;} 

  // Ensure stacks monotonic & monochrome, colours on correct pins 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j%2 == 1) /*then*/ {// odd pins empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&((disc.shade-coloff+2)%m == j); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.n = n; this.l = (int) Math.floor(m/2); this.m = 2*l; // force m even 
    int[] nj = new int[this.m]; int j = 0; 
    while (j < this.m) /*do*/ {nj[j] = n*(1 - j%2); j = j+1;} 
    tower = new Tower(this.m, this.n, nj, this); 
      // double quantity standard height pins, odd shafts re-shaded  
    j = 0; while (j < l) /*do*/ {
      tower.pins[2*j+1].shaft.shade = 2*j + coloff; j = j+1;} 
    return tower;} 

  } /* StacksDefn */ 

class Turtle extends StacksDefn {
  String name () {return ("Turtle");} 
  void tran (Tower tower) throws HanoiException {
    tranHAHA();} 
  Tower init (int m, int n, HanoiDefn defn) {
    return super.init(4, n, defn);} // 2 stacks 
  } /* Turtle */ 

class Multi_Stack extends StacksDefn {
  String name () {return ("Multi_Stack");} 
  void tran (Tower tower) throws HanoiException {
    tranHAHA();} 
  } /* Multi_Stack */ 

abstract class DominoDefn extends HanoiDefn {
  //String name () {return ("DominoDefn");} 

  // Top level optimal methods (all bases uncoloured) 
  // Not formally proven, but verified for n <= 12. 
  void tranEDD(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// alterns slower or reverse 
    trace("EDD", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranADE(next, X, Y, Z); move(X, Y); 
      tranDAE(next, Z, Y, X); move(Y, Z); 
      tranDAE(next, X, Z, Y); move(Z, X); 
      tranDDA(next, Y, Z, X);}} 

  void tranDDF(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// alterns slower or reverse 
    trace("DDF", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranADE(next, X, Y, Z); move(X, Y); 
      tranDAE(next, Z, Y, X); move(Y, Z); 
      tranDDA(next, X, Y, Z);}} 

  void tranDDE(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// altern reverse 
    trace("DDE", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranADE(next, X, Z, Y); move(X, Z); 
      tranDDA(next, Y, X, Z);}} 

  void tranADE(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// altern slightly slower 
    trace("ADE", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranADE(next, X, Z, Y); move(X, Z); 
      tranDBA(next, Y, X, Z);}} 

  void tranDDB(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// ADE() reversed 
    trace("DDB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABF(next, X, Z, Y); move(X, Z); 
      tranDDB(next, Y, X, Z);}} 

  void tranADF(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// altern slower 
    trace("ADF", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranADE(next, X, Y, Z); move(X, Y); 
      tranDAB(next, Z, Y, X); move(Y, Z); 
      tranADA(next, X, Y, Z);}} 

  void tranDDA(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// ADF() reversed 
    trace("DDA", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranADA(next, X, Y, Z); move(X, Y); 
      tranABE(next, Z, Y, X); move(Y, Z); 
      tranDDB(next, X, Y, Z);}} 

  void tranDBF(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// alterns slower or reverse; UNUSED 
    trace("ABF", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABE(next, X, Y, Z); move(X, Y); 
      tranDAE(next, Z, Y, X); move(Y, Z); 
      tranDBA(next, X, Y, Z);}} 
// Also consider DAF(n) = ADA + 1 + ABE + 1 + DBF + 1 + DBE + 1 + ADA(n-1) !! 

  void tranDBE(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DBE", disc, X, Y, Z); 
    tranABE(disc, X, Y, Z);} 
  void tranDAE(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DAE", disc, X, Y, Z); 
    tranDAB(disc, X, Y, Z);} 

  void tranABF(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// altern = ABA() 
    trace("ABF", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABE(next, X, Y, Z); move(X, Y); 
      tranDAB(next, Z, Y, X); move(Y, Z); 
      tranABA(next, X, Y, Z);}} 

  void tranDBA(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// ABF() reversed 
    trace("DBA", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABA(next, X, Y, Z); move(X, Y); 
      tranABE(next, Z, Y, X); move(Y, Z); 
      tranDAB(next, X, Y, Z);}} 

  void tranADB(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// altern = reverse 
    trace("ADB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABE(next, X, Z, Y); move(X, Z); 
      tranDBA(next, Y, X, Z);}} 

  void tranABE(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("ABE", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranADB(next, X, Z, Y); move(X, Z); 
      tranABA(next, Y, X, Z);}} 

  void tranDAB(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// ABE() reversed
    trace("DAB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABA(next, X, Z, Y); move(X, Z); 
      tranADB(next, Y, X, Z);}} 

  void tranADA(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("ADA", disc, X, Y, Z); 
    tranABA(disc, X, Y, Z);} 
  void tranAAE(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("AAE", disc, X, Y, Z); 
    tranAAB(disc, X, Y, Z);} 
  void tranDBB(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DBB", disc, X, Y, Z); 
    tranABB(disc, X, Y, Z);} 

  // optimal methods for all bases coloured, pin X to Z. 
  void tranABA(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("ABA", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABA(next, X, Y, Z); move(X, Y); 
      tranABA(next, Z, Y, X); move(Y, Z); 
      tranABA(next, X, Y, Z);}} 

  void tranAAB(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("AAB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABA(next, X, Z, Y); move(X, Z); 
      tranAAB(next, Y, X, Z);}} 

  void tranABB(Disc disc, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// AAB() reversed 
    trace("ABB", disc, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranABB(next, X, Z, Y); move(X, Z); 
      tranABA(next, Y, X, Z);}} 

  // Three-pin adjacent: optimal, iterative. 
  void tranA(Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    int count = 0; // move counter = timeCur.get(); 
    int n = X.base.diam - 1; // number of discs 
    Pin pim = null, pin = null; // pins involved in current move 
    boolean done = (n == 0); // finished 
    while (!done) /*do*/ {switch(count%2) /*of*/ {
        case  0: pim = X;  pin = Y; break; 
        case  1: pim = Y;  pin = Z; break;} // smallest disc: count mod 3 = 0,1 
      if (pim.shaft.below.diam < pin.shaft.below.diam) 
      /*then*/ move(pim, pin); else move(pin, pim); 
      done = (Z.shaft.alti > n); count = count + 1;}} 

  static final int[] discol = {10, 8}; // pink, cyan 
  void reshade (Disc disc) {
    if (disc.shade == 0) /*then*/ disc.shade = discol[disc.pin.disp%2]; 
    else disc.shade = (discol[0]+discol[1]) - disc.shade; /*fi*/} 

  // Should be overridden by versions checking base colour ?? 
  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam && (A.shade != B.shade || B == Y.base || X == Y);} 

  // Ensure stack monotonic & monochrome, colour on correct pin; overridden 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all but last pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[0]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = 3; this.n = n; 
    return (new Tower(this.m, this.n, defn));} 

  } /* DominoDefn */ 

class Domino_A extends DominoDefn {
  // 3-pin, 2-colour, move only onto reverse colour and change colour; 
  // from pin X to Z, bases coloured ABA, final colour same. 
  // Time 3^n - 1. 
  String name () {return ("Domino_A");} 
  void tran (Tower tower) throws HanoiException {
    tranABA(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 
  } /* Domino_A */ 

class Domino_B extends DominoDefn {
  // 3-pin, 2-colour, move only onto reverse colour and change colour; 
  // from pin X to Z, bases coloured AAB, final colour reversed. 
  // Time (3^n - 1)/2. 
  String name () {return ("Domino_B");} 
  void tran (Tower tower) throws HanoiException {
    tranAAB(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 

  // Ensure stack monotonic & monochrome, colour on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all but chosen pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[1]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 
  } /* Domino_B */ 

class Domino_D extends DominoDefn {
  // 3-pin, 2-colour, move only onto reverse colour and change colour; 
  // from pin X to same X, assuming all bases uncoloured, final colour reversed. 
  String name () {return ("Domino_D");} 
  void tran (Tower tower) throws HanoiException {
    tranEDD(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 

  // Ensure stack monotonic & monochrome, colour on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j > 0) /*then*/ {// all but chosen pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[1]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 
  } /* Domino_D */ 

class Domino_E extends DominoDefn {
  // 3-pin, 2-colour, move only onto reverse colour and change colour; 
  // from pin X to Z, assuming all bases uncoloured, final colour reversed. 
  String name () {return ("Domino_E");} 
  void tran (Tower tower) throws HanoiException {
    tranDDE(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 

  // Ensure stack monotonic & monochrome, colour on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all but chosen pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[1]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 
  } /* Domino_E */ 

class Domino_F extends DominoDefn {
  // 3-pin, 2-colour, move only onto reverse colour and change colour; 
  // from pin X to Z, assuming all bases uncoloured, final colour same. 
  String name () {return ("Domino_F");} 
  void tran (Tower tower) throws HanoiException {
    tranDDF(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 
  } /* Domino_F */ 

class Adjacent_P extends DominoDefn {
  // 3-pin move only to adjacent pin; optimal 
  String name () {return ("Adjacent_P");} 
  // Transfer tower of discs from pin 0 to pin 2 
  static final int r = 3; // red 
  void tran (Tower tower) throws HanoiException {
    //tower.pins[1].base.shade = tower.pins[0].base.above.shade; // re-colour bases 
    //tower.pins[0].base.shade = tower.pins[1].base.shade; // should be green ?? 
    //tower.pins[2].base.shade = tower.pins[0].base.shade; 
    tranA(tower.pins[0], tower.pins[1], tower.pins[2]);} 
  } /* Adjacent_P  */ 

class Adjacent extends Domino_A {
  // 3-pin, move only to adjacent pin; optimal  
  String name () {return ("Adjacent");} 
  } /* Adjacent */ 

class Domino extends Domino_D {
  // Menu wrapper (in situ with final colours reversed) 
  String name () {return ("Domino");} 
  } /* Domino */ 

abstract class CheckersDefn extends ClassicDefn {
  // Bichromatic 4-pin with alternating colours: suboptimal (Frame). 
  // Optimality established for n < 15; 
  //   DDDD = Reves for |n - [(k+1)^2/2]| <= 2. 
  // [Maybe rename BABB etc BBAB to distinguish from Reversi ?] 
  //String name () {return ("CheckersDefn");} 

  void tranDDDD(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DDDD", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      Disc next = next_k(disc, reves_j(disc.diam)); 
      tranBDDD(next, W, X, Z, Y); tranC(disc, W, X, Z); 
      tranDDDB(next, Y, X, W, Z);}} 

  void tranBDDD(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDDD", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      int k = reves_j(disc.diam); Disc next = next_k(disc, k); 
      tranBDDD(next, W, X, Z, Y); tranC(disc, W, X, Z); 
      if (k%2 == 0) /*then*/ tranDDBB(next, Y, X, W, Z); 
      else tranDADB(next, Y, W, X, Z);}} 

  void tranDDDB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// BDDD reversed 
    trace("DDDB", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      int k = reves_j(disc.diam); Disc next = next_k(disc, k); 
      if (k%2 == 0) /*then*/ tranBDBD(next, W, X, Z, Y); 
      else tranBADD(next, W, Z, X, Y); 
      tranC(disc, W, X, Z); tranDDDB(next, Y, X, W, Z);}} 

  void tranBADD(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BADD", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      int k = reves_j(disc.diam); Disc next = next_k(disc, k); 
      if (k%2 == 0) /*then*/ {tranBADD(next, W, X, Z, Y); 
        tranC(disc, W, X, Z); tranDABB(next, Y, X, W, Z);} 
      else {tranBDBD(next, W, Z, X, Y); 
      tranC(disc, W, X, Z); tranDABB(next, Y, W, X, Z);}}} 
      //else {tranBDDB(next, W, Z, Y, X); // slower !! 
      //tranC(disc, W, Y, Z); tranBADB(next, X, W, Y, Z);}}} 

  void tranDADB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// BADD reversed 
    trace("DADB", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      int k = reves_j(disc.diam); Disc next = next_k(disc, k); 
      if (k%2 == 0) /*then*/ {tranBABD(next, W, X, Z, Y); 
        tranC(disc, W, X, Z); tranDADB(next, Y, X, W, Z);} 
      else {tranBABD(next, W, Z, X, Y); 
      tranC(disc, W, X, Z); tranDDBB(next, Y, W, X, Z);}}} 
      //else {tranBADB(next, W, Z, Y, X); // slower !! 
      //tranC(disc, W, Y, Z); tranBDDB(next, X, W, Y, Z);}}} 

  void tranBDDB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// maybe = BADB when k even ? 
    trace("BDDB", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      int k = reves_j(disc.diam); Disc next = next_k(disc, k); 
      if (k%2 == 0) /*then*/ {tranBDBD(next, W, X, Z, Y); 
        tranC(disc, W, X, Z); tranDDBB(next, Y, X, W, Z);} 
      else {
        tranBADD(next, W, Z, X, Y); 
        tranC(disc, W, X, Z); tranDADB(next, Y, W, X, Z);}}} 

  void tranBDBD(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// OK 
    trace("BDBD", disc, W, X, Y, Z); 
    if (disc.diam <= 2) /*then*/ tranC(disc, W, X, Z); 
    else {
      int k = reves_k(disc.diam); k = k+k%2; // force k > 1 even 
      Disc next = next_k(disc, k); 
      tranBDDB(next, W, X, Z, Y); tranC(disc, W, X, Z); 
      tranBDBB(next, Y, X, W, Z);}} 

  void tranDDBB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// BDBD reversed OK 
    trace("DDBB", disc, W, X, Y, Z); 
    if (disc.diam <= 2) /*then*/ tranC(disc, W, X, Z); 
    else {
      int k = reves_k(disc.diam); k = k+k%2; // force k > 1 even 
      Disc next = next_k(disc, k); 
      tranBDBB(next, W, X, Z, Y); tranC(disc, W, X, Z); 
      tranBDDB(next, Y, X, W, Z);}} 

  void tranDABD(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// UNUSED 
    trace("DABD", disc, W, X, Y, Z); if (reves_j(disc.diam)%2 == 0) 
    /*then*/ tranBABB(disc, W, X, Y, Z); else tranBAAB(disc, W, X, Y, Z);} 
  void tranBADB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// UNUSED 
    trace("BADB", disc, W, X, Y, Z); if (reves_j(disc.diam)%2 == 0) 
    /*then*/ tranBABB(disc, W, X, Y, Z); else tranBAAB(disc, W, X, Y, Z);} 

  void tranBDBB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDBB", disc, W, X, Y, Z); tranBABB(disc, W, X, Y, Z);} 
  void tranBABD(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BABD", disc, W, X, Y, Z); tranBABB(disc, W, X, Y, Z);} 
  void tranDABB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// BABD reversed 
    trace("DABB", disc, W, X, Y, Z); tranBABB(disc, W, X, Y, Z);} 

  void tranBABB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BABB", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      if (disc.diam <= 2) /*then*/ tranC(disc, W, X, Z); 
      else {
        int k = reves_k(disc.diam); k = k+k%2; // force k > 1 even 
        Disc next = next_k(disc, k); 
        tranBABB(next, W, X, Z, Y); tranC(disc, W, X, Z); 
        tranBABB(next, Y, X, W, Z);}}} 

  void tranBAAB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BAAB", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      if (disc.diam <= 2) /*then*/ tranC(disc, W, X, Z); 
      else {
        int k = reves_k(disc.diam); k = k+(1-k%2); // force k > 0 odd 
        Disc next = next_k(disc, k); 
        tranBABB(next, W, Z, X, Y); tranC(disc, W, X, Z); 
        tranBABB(next, Y, W, X, Z);}}} 

  // Transfer from pin W to pin Z, slow periodic iterative, 
  //   copied from ReversiDefn().BBAB() 
  void tranBBAB(Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    int count = 0; // move counter = timeCur.get(); 
    int n = W.base.diam - 1; // number of discs 
    Pin pim = null, pin = null; // pins involved in current move 
    boolean done = (n == 0); // finished 
    while (!done) /*do*/ {switch(n%2*8 + count%8) /*of*/ {
        case 1: case 5: case  8: case 11: pim = W; pin = X; break; 
        case 2: case 6: case  9: case 14: pim = X; pin = Z; break; 
        case 0: case 4: case 10: case 13: pim = Y; pin = W; break; 
        case 3: case 7: case 12: case 15: pim = Z; pin = Y; break;} 
      if (pim.shaft.below.diam < pin.shaft.below.diam) 
      /*then*/ move(pim, pin); else move(pin, pim); 
      done = (Z.shaft.alti > n); count = count + 1;}} 
  // smallest disc move: count%3 = 0 && n%2 = 0 || count%8 = 0,1,4,5 && n%2 = 1. 

  // Should be overridden by versions checking base colour ?? 
  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam && (A.shade != B.shade || B == Y.base);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = 4; this.n = n; 
    return (new Tower(this.m, this.n, defn));} 

  } /* CheckersDefn */ 

class Checkers_P extends CheckersDefn {
  // 4-pin order (sqrt3)^n alternating bichromatic algorithm from Reversi 
  String name () {return ("Checkers_P");} 
  //reversing Reversi = new Reversi(); // tranBABB() not static; 
  //  but calling Reversi.tranBABB() uses wrong reshade() etc !! 
  void tran (Tower tower) throws HanoiException {
    tranBBAB( 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Checkers_P */ 

class Checkers_B extends CheckersDefn {
  // Bichromatic 4-pin with alternating colours: pins colured BABB. 
  String name () {return ("Checkers_B");} 
  void tran (Tower tower) throws HanoiException {
    tranBABB(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Checkers_B */ 

class Checkers_C extends CheckersDefn {
  // Bichromatic 4-pin with alternating colours: pins colured BAAB. 
  String name () {return ("Checkers_C");} 
  void tran (Tower tower) throws HanoiException {
    tranBAAB(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Checkers_C */ 

class Checkers extends CheckersDefn {
  // Bichromatic 4-pin with alternating colours: suboptimal (Frame). 
  String name () {return ("Checkers");} 
  void tran (Tower tower) throws HanoiException {
    tranDDDD(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Checkers */ 

abstract class ReversiDefn extends HanoiDefn {
  //String name () {return ("ReversiDefn");} 

  // Top level fast methods (all bases uncoloured) 
  // Sub-opt: DDDE(6) = 25 < 27 ?? 
  void tranDDDE (Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    // bases DDDE (uncoloured, finally all colours reversed); recursion on n-3. 
    trace("DDDE", disc, W, X, Y, Z); 
    if (disc.diam < 5) /*then*/ tranDDDA(disc, W, X, Y, Z); 
    else {if (disc.diam == 5) /*then*/ {
        move(W, X); move(W, Z); move(W, Y); move(X, Y); move(W, X); move(Z, X); 
        move(W, Z); move(X, Z); move(X, W); move(Z, X); move(W, Z); move(Y, Z); 
        move(Y, W); move(Z, Y); move(W, Z); move(X, Z); move(Y, Z);} 
      else {Disc ante = disc.above.above.above; 
        if (true) // better for even n only 
        /*then*/ tranBDDE(ante, W, Y, Z, X); 
        else tranBDDF(ante, W, Y, Z, X); 
        move(W, Y); move(Y, Z); move(W, Y); move(Z, Y); move(W, Z); move(Y, Z); 
        move(Y, W); move(Z, Y); move(W, Z); move(Y, W); move(W, Z); 
        if (true) // better for even n only 
        /*then*/ tranDDDB(ante, X, Y, W, Z); 
        else tranDDDA(ante, X, Y, W, Z);}}} 

  // Sub-opt: DDDB(6) = DDDF(6) = 28 < 30 moves ?? 
  void tranDDDF (Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// actually DADF 
    // bases DDDE (uncoloured, finally no colours reversed); recursion on n-3. 
    trace("DDDE", disc, W, X, Y, Z); 
    if (disc.diam < 6) /*then*/ tranDDDB(disc, W, X, Y, Z); 
    else {Disc ante = disc.above.above.above; 
      if (true) // better 
      /*then*/ tranBDDE(ante, W, Y, Z, X); 
      else tranBDDF(ante, W, Y, Z, X); 
      move(W, Z); move(Z, Y); move(W, Z); move(Y, Z); move(W, Y); move(Z, Y); 
      move(Z, W); move(Y, Z); move(Z, W); move(Y, Z); move(W, Z); move(W, Y); 
      move(Z, W); move(Y, Z); move(W, Y); move(Y, Z); 
      if (true) // better 
      /*then*/ tranDDDA(ante, X, Y, W, Z); 
      else tranDDDB(ante, X, Y, W, Z);}} 

  // Transfer same pin with colour changed; conjectured furthest for n > 2. 
  // Sub-opt: EDDD(9) = 77 < 79 ?? 
  void tranEDDD (Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("EDDD", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {
      if (disc.diam == 1) /*then*/ {
        move(W, X); move(X, Y); move(Y, W);} 
      else {if (disc.diam == 2) /*then*/ {
        move(W, Z); move(W, X); move(X, Y); move(Y, W); move(Z, X); move(X, W);} 
        else {Disc post = disc.above.above; // 3 <= n <= 6 
          if (disc.diam < 7) /*then*/ {
            tranBDDF(post, W, X, Y, Z); 
            move(W, Y); move(W, X); move(Y, W); move(X, Y); 
            move(W, X); move(Y, W); move(X, Y); move(Y, W); 
            tranDDDA(post, Z, Y, X, W);}
          else {Disc ante = post.above; // n >= 7 
            tranBDDF(ante, W, X, Y, Z); 
            move(W, Y); move(Y, X); move(W, Y); move(X, W); move(Y, X); move(W, X); 
            move(W, Y); move(X, W); move(W, Y); move(X, W); move(Y, W); move(Y, X); 
            move(W, Y); move(Y, X); move(W, Y); move(X, Y); move(X, W); move(Y, X); 
            move(Y, W); move(X, Y); move(Y, W); 
            tranDDDA(ante, Z, Y, X, W);}}}}} 

  void tranBDDE(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDDE", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      if (false) 
      /*then*/ tranBDDE(post, W, Z, Y, X); 
      else tranBDDF(post, W, Y, Z, X); 
      move(W, Z); move(Z, Y); move(W, Z); move(Y, Z); 
      if (false) 
      /*then*/ tranDADB(post, X, W, Y, Z); 
      else tranDDBA(post, X, Y, W, Z);}} 

  void tranBDDF(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// DDDB reversed 
    trace("BDDF", disc, W, X, Y, Z); 
    if (disc.diam < 3) /*then*/ tranBABB(disc, W, X, Y, Z); 
    else {if (disc.diam == 4) /*then*/ {// n = 3 already OK below 
      move(W, Y); move(W, Z); move(W, X); move(Y, X); move(W, Y); move(Z, W); 
      move(Y, Z); move(X, Y); move(X, Z); move(W, X); move(X, Z); move(Y, Z);} 
      else {Disc next = disc.above, post = next.above; 
        if (true) 
        /*then*/ tranBDDE(post, W, Z, Y, X); 
        else tranBDDF(post, W, Y, Z, X); 
        move(W, Y); move(Y, Z); move(W, Y); move(Z, W); move(Y, Z); move(W, Z); 
        if (true) 
        /*then*/ tranDADA(post, X, W, Y, Z); 
        else tranDDBB(post, X, Y, W, Z);}}} 

//   DDDB(6), DDDF(6) should be 28 < 30 moves ??  
  void tranDDDB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DDDB", disc, W, X, Y, Z); 
    if (disc.diam < 3) /*then*/ tranBABB(disc, W, X, Y, Z); 
    else {if (disc.diam == 4) /*then*/ {// n = 3 already OK below 
      move(W, X); move(W, Y); move(Y, Z); move(W, Y); move(X, Y); move(W, X); 
      move(Z, W); move(X, Z); move(Y, X); move(Y, Z); move(W, Z); move(X, Z);}
      else {Disc next = disc.above, post = next.above; 
        if (false) 
        /*then*/ tranBDBF(post, W, Y, Z, X); 
        else tranBDBE(post, W, Y, Z, X); 
        move(W, Z); move(W, Y); move(Z, W); move(Y, Z); move(W, Y); move(Y, Z); 
        if (false) 
        /*then*/ tranDDDB(post, X, Y, W, Z); 
        else tranDDDA(post, X, Y, W, Z);}}} 

//   DDDB n = 4, m = 4 in time 12 moves: 
//   d                                                                       
//   C       C                                                               
//   b       b       b       b                   d       d       d           
//   A       A D     A D c   A D   C A D B C A   B C   a B C c a B            
//   W-X-Y-Z W-X-Y-Z W-X-Y-Z W-X-Y-Z W-X-Y-Z W-X-Y-Z W-X-Y-Z W-X-Y-Z 

//                                         d 
//                                 C       C 
//       d                 b       b       b 
//   c   B A c D B A c D   A   D   A       A    
//   W-X-Y-Z W-X-Y-Z W-X-Y-Z W-X-Y-Z W-X-Y-Z 

  void tranDDDA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DDDA", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
      else {Disc post = disc.above.above; 
        if (disc.diam%2 == 1) 
        /*then*/ tranBADF(post, W, Z, Y, X); 
        else tranBADE(post, W, Z, Y, X); 
        move(W, Y); move(W, Z); move(Y, W); move(W, Z); 
        if (disc.diam%2 == 1) 
        /*then*/ tranDDDA(post, X, Y, W, Z);
        else tranDDDB(post, X, Y, W, Z);}} 

  void tranDADA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DADA", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBADA(post, W, Z, Y, X); move(W, Y); move(W, Z); 
      move(Y, W); move(W, Z); tranBDDB(post, X, W, Y, Z);}} 

  void tranDADB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DADB", disc, W, X, Y, Z); 
    if (disc.diam < 3) /*then*/ tranBABB(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBDBA(post, W, Y, Z, X); move(W, Z); move(W, Y); move(Z, W); 
      move(Y, Z); move(W, Y); move(Y, Z); tranBDDA(post, X, Y, W, Z);}} 

  void tranDDBB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DDBB", disc, W, X, Y, Z); 
    if (disc.diam < 3) /*then*/ tranBABB(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBDBB(post, W, X, Z, Y); move(W, Z); move(W, X); move(Z, W); 
      move(X, Z); move(W, X); move(X, Z); tranBDDB(post, Y, X, W, Z);}} 

  void tranDDBA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("DDBA", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBABE(post, W, Z, Y, X); move(W, Y); move(W, Z); 
      move(Y, W); move(W, Z); tranDADB(post, X, Y, W, Z);}} 

  void tranBDBE(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDBE", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBDDB(post, W, Z, X, Y); move(W, Z); move(Z, X); 
      move(W, Z); move(X, Z); tranBDBA(post, Y, X, W, Z);}} 

 void tranBDBF(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// DDBB reversed 
    trace("BDBF", disc, W, X, Y, Z); 
    if (disc.diam < 3) /*then*/ tranBABB(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBDDB(post, W, Z, X, Y); move(W, X); move(X, Z); move(W, X); 
      move(Z, W); move(X, Z); move(W, Z); tranBDBB(post, Y, X, W, Z);}} 

 void tranBADE(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// DDBA reversed 
    trace("BADE", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBADF(post, W, X, Z, Y); move(W, Z); move(Z, X); 
      move(W, Z); move(X, Z); tranDABA(post, Y, X, W, Z);}} 

 void tranBADF(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// DADB reversed 
    trace("BADF", disc, W, X, Y, Z); 
    if (disc.diam < 3) /*then*/ tranBABB(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBDDA(post, W, Z, Y, X); move(W, Y); move(Y, Z); move(W, Y); 
      move(Z, W); move(Y, Z); move(W, Z); tranBADA(post, X, W, Y, Z);}} 

  void tranBDBA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDBA", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBABE(post, W, Z, Y, X); move(W, Y); move(W, Z); 
      tranDABA(post, X, Z, Y, W); move(Y, X); move(X, Z); 
      tranBDBA(post, W, X, Y, Z);}} 

  void tranBADA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// BDBA reversed 
    trace("BADA", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBADA(post, W, X, Y, Z); move(W, Y); move(Y, X); 
      tranBABE(post, Z, X, W, Y); move(W, Z); move(X, Z); 
      tranDABA(post, Y, X, W, Z);}} 

  void tranBADB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// subopt n = 7,9 
    trace("BADB", disc, W, X, Y, Z); 
    if (disc.diam < 5) /*then*/ tranBABB(disc, W, X, Y, Z); 
    else {Disc next = disc.above; 
    tranBABE(next, W, Z, X, Y); move(W, X); move(X, Z); 
    tranDABA(next, Y, X, W, Z);}} 

  void tranBABE(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// opt n < 9 
    trace("BABE", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBADB(post, W, X, Z, Y); move(W, Z); move(Z, X); 
      move(W, Z); move(X, Z); tranBABA(post, Y, X, W, Z);}} 

  void tranDABA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// BABE reversed 
    trace("DABA", disc, W, X, Y, Z); 
    if (disc.diam < 4) /*then*/ tranBABA(disc, W, X, Y, Z); 
    else {Disc post = disc.above.above; 
      tranBABA(post, W, Z, Y, X); move(W, Y); move(W, Z); 
      move(Y, W); move(W, Z); tranBADB(post, X, Y, W, Z);}} 

  void tranBDDB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDDB", disc, W, X, Y, Z); 
    tranBADB(disc, W, X, Y, Z);} 
  void tranBDDA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDDA", disc, W, X, Y, Z); 
    tranBADA(disc, W, X, Y, Z);} 
  void tranBDBB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BDBB", disc, W, X, Y, Z); 
    tranBABB(disc, W, X, Y, Z);} 

  // optimal methods for all bases coloured, pin W to Z. 
  void tranBABA(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BABA", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      if (disc.diam == 1) /*then*/ move(W, Z); 
      else {Disc post = next.above; 
        tranBABA(post, W, Z, Y, X); move(W, Y); move(W, Z); 
        tranBABA(post, X, Z, Y, W); move(Y, X); move(X, Z); 
        tranBABA(post, W, X, Y, Z);}}} 

  void tranBABB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    trace("BABB", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      if (disc.diam == 1) /*then*/ {
        move(W, X); move(X, Z);} 
      else {Disc post = next.above; 
        tranBABB(post, W, X, Y, Z); move(W, Y); move(W, X); 
        tranBABB(post, Z, Y, X, W); move(X, Z); move(Y, Z); 
        tranBABB(post, W, X, Y, Z);}}} 

  void tranBABB_(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {// equivalent alternative 
    trace("BABB_", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranBABA(next, W, Z, X, Y); move(W, X); move(X, Z); 
      tranBABA(next, Y, X, W, Z);}} 

  void tranBAAB(Disc disc, Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException { // conjectured furthest configuration from start 
    trace("BAAB", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranBABB(next, W, Z, X, Y); move(W, X); move(X, Z); 
      tranBABB(next, Y, X, W, Z);}} 

  // Slow methods: pin X to Z, short pin W used to hold only a single disc; 
  // length round((4/3).2^n); subtract 1 for odd n if final reverse. 

  void tranBBBD(Disc disc, Pin X, Pin Y, Pin Z, Pin W) 
    throws HanoiException {
    trace("BBBD", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranBAAD(next, X, Z, Y, W); move(X, W); 
      move(W, Z); tranBBAD(next, Y, X, Z, W);}} 

  void tranBAAD(Disc disc, Pin X, Pin Y, Pin Z, Pin W) 
    throws HanoiException {
    trace("BAAD", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranBBBD(next, X, Z, Y, W); move(X, Z); tranBAAD(next, Y, X, Z, W);}} 

  void tranBBAD(Disc disc, Pin X, Pin Y, Pin Z, Pin W) 
    throws HanoiException {
    trace("BBAD", disc, W, X, Y, Z); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranBBAD(next, X, Z, Y, W); move(X, Z); tranBBBD(next, Y, X, Z, W);}} 

  // Time 2.2^n - 2: classical 3-pin, alternately change colour on short pin. 
  void tranG(Disc disc, Pin X, Pin Y, Pin Z, Pin W) 
    throws HanoiException {
    trace("G", disc, X, Y, Z, W); 
    if (disc.diam > 0) /*then*/ {Disc next = disc.above; 
      tranG(next, X, Z, Y, W); move(X, W); move(W, Z); tranG(next, Y, X, Z, W);}} 

  // Iterative BABB: for odd n smallest disc moves xySS (S = larger disc move), 
  // pin x = 1 3 2 0; for even n xSS, x = 2 3 1 0 (period). 
  // For odd n, first larger move involves pins NOT landed on 
  // by previous two smallest moves, second involves pins taken off from; 
  // for even n, vice-versa. 
  // Larger moves unique if disallow 0-3 or 1-2, second must not undo first. 
  // Only un-ordered pair is periodic (4,8 as n even,odd); direction is D0LE !! 
  // Iterative BABA (see Reversi.txt): is there a similar algorithm ?! 

  // Transfer from pin W to pin Z, bases coloured BABB: optimal, iterative. 
  void tranBABB(Pin W, Pin X, Pin Y, Pin Z) 
    throws HanoiException {
    int count = 0; // move counter = timeCur.get(); 
    int n = W.base.diam - 1; // number of discs 
    Pin pim = null, pin = null; // pins involved in current move 
    boolean done = (n == 0); // finished 
    while (!done) /*do*/ {switch(n%2*8 + count%8) /*of*/ {
        case 1: case 5: case  8: case 11: pim = W; pin = X; break; 
        case 2: case 6: case  9: case 14: pim = X; pin = Z; break; 
        case 0: case 4: case 10: case 13: pim = Y; pin = W; break; 
        case 3: case 7: case 12: case 15: pim = Z; pin = Y; break;} 
      if (pim.shaft.below.diam < pin.shaft.below.diam) 
      /*then*/ move(pim, pin); else move(pin, pim); 
      done = (Z.shaft.alti > n); count = count + 1;}} 
  // smallest disc move: count%3 = 0 && n%2 = 0 || count%8 = 0,1,4,5 && n%2 = 1. 

  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam && (A.shade == B.shade || B == Y.base || X == Y);} 

  static final int[] discol = {7, 9}; // magenta, yellow 
  void reshade (Disc disc) {
    if (disc.shade == 0) /*then*/ disc.shade = discol[disc.diam%2]; 
    else disc.shade = (discol[0]+discol[1]) - disc.shade; /*fi*/} 

  // Ensure stack monotonic & monochrome, colour on correct pin; overridden 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all but last pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[i%2]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = 4; this.n = n; 
    return (new Tower(this.m, this.n, defn));} 

  } /* ReversiDefn */ 

class Reversi_A extends ReversiDefn {
  // 4-pin, 2-colour, move only onto same colour and change colour. 
  // From pin W to Z, assuming no bases coloured BABA, final colour reversed. 
  // length (1,2).3^{[(n+1/2]} as n odd,even; n even, R_A,R_B(n) same length? 
  String name () {return ("Reversi_A");} 
  void tran (Tower tower) throws HanoiException {
    tranBABA(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 

  // Ensure stack monotonic & monochrome, colour on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all but last pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[1 - i%2]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 
  } /* Reversi_A */ 

class Reversi_B extends ReversiDefn {
  // 4-pin, 2-colour, move only onto same colour and change colour. 
  // From pin W to Z, assuming bases coloured BABB, final colour not reversed. 
  // length (1,2).3^{[(n+1/2)]} as n odd,even; n even, R_A,R_B(n) same length? 
  String name () {return ("Reversi_B");} 
  void tran (Tower tower) throws HanoiException {
    tranBABB(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Reversi_B */ 

class Reversi_C extends ReversiDefn {
  // 4-pin, 2-colour, move only onto same colour and change colour. 
  // From pin W to Z, assuming bases coloured BAAB, final colour not reversed. 
  // length (1,2).3^{[(n+1/2]} as n odd,even; 
  String name () {return ("Reversi_C");} 
  void tran (Tower tower) throws HanoiException {
    tranBAAB(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Reversi_C */ 

class Reversi_D extends ReversiDefn {// Sub-optimal 
  // 4-pin, 2-colour, move only onto same colour and change colour; 
  // from pin W to same W, assuming all bases uncoloured, final colour reversed. 
  String name () {return ("Reversi_D");} 
  void tran (Tower tower) throws HanoiException {
    tranEDDD(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 

  // Ensure stack monotonic & monochrome, colour on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j > 0) /*then*/ {// all but last pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[1 - i%2]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 
  } /* Reversi_D */ 

class Reversi_E extends Reversi_A {// Sub-optimal 
  // 4-pin, 2-colour, move only onto same colour and change colour; 
  // from pin W to Z, assuming all bases uncoloured, final colour reversed. 
  String name () {return ("Reversi_E");} 
  void tran (Tower tower) throws HanoiException {
    tranDDDE(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Reversi_E */ 

class Reversi_F extends ReversiDefn {// Sub-optimal 
  // 4-pin, 2-colour, move only onto same colour and change colour; 
  // from pin W to Z, assuming all bases uncoloured, final colour not reversed. 
  String name () {return ("Reversi_F");} 
  void tran (Tower tower) throws HanoiException {
    tranDDDF(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Reversi_F */ 

class Reversi_G extends ReversiDefn {
  // 4-pin, 2-colour, move only onto same colour and change colour. 
  // From pin X to pin Z, assuming base W uncoloured, final colour not reversed. 
  // "3+pin" W used to hold only a single disc; 
  // Time 2(2^n - 1): classical 3-pin, alternately change colour on short pin. 
  String name () {return ("Reversi_G");} 
  void tran (Tower tower) throws HanoiException {
    tranG(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 

  // Ensure stack monotonic & monochrome, colour on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j != 2) /*then*/ {// all but last pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[i%2]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 
  } /* Reversi_G */ 

class Reversi_H extends Reversi_G {
  // 4-pin, 2-colour, move only onto same colour and change colour. 
  // From pin X to pin Z, assuming base W uncoloured, final colour not reversed. 
  String name () {return ("Reversi_H");} 
  void tran (Tower tower) throws HanoiException {
    tranBBBD(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Reversi_H */ 

class Reversi_P extends ReversiDefn {
  // iterative optimal Reversi BABB, final colour not reversed. 
  String name () {return ("Reversi_P");} 
  // Transfer tower of discs from pin 0 to pin 3, bases coloured BABB 
  static final int m = 7, y = 9; // magenta, yellow 
  void tran (Tower tower) throws HanoiException {
    //tower.pins[1].base.shade = tower.pins[0].base.above.shade; // re-colour bases 
    //tower.pins[0].base.shade = m+y - tower.pins[1].base.shade; 
    //tower.pins[2].base.shade = tower.pins[0].base.shade; 
    //tower.pins[3].base.shade = tower.pins[0].base.shade; 
    tranBABB(tower.pins[0], tower.pins[1], tower.pins[2], tower.pins[3]);} 
  } /* Reversi_P */ 

class Reversi extends Reversi_D {
  // Menu wrapper (in situ with final colours reversed) 
  String name () {return ("Reversi");} 
  } /* Reversi */ 

// Table of times :--- 
//   Discs n =   0, 1, 2,  3,  4,   5,   6,    7,   8,    9,   10,   11,   12 
//   Classic =   0, 1, 3,  7, 15,  31,  63,  127, 255,  511, 1023, 
//  Adjacent =   0, 2, 8, 26, 80, 242, 728, 2186,6560, 
//  Cyclic_L =   0, 2, 7, 21, 59, 163, 447, 1223,3343, 9135,24959, 
//  Cyclic_R =   0, 1, 5, 15, 43, 119, 327,  895,2447, 6687,18271, 
//    Lundon =   0, 3, 6, 15, 39, 105, 285,  777,2121, 5793,15825, 
//   Rainbow =   0, 1, 3,  7, 19,  43,  99,  235, 535, 1239, 2879, 
// RainbowBAC=   0, 1, 3,  9, 23,  51, 123,  287, 655, 1527, 3535, 
//   Antwerp =   0, 5,22, 62,150, 334, 710, 1470,2998, 6062,12198,24478,49046, 
// Four_Star =   0, 2, 6, 12, 20,  32,  48,   66,  90,  122,  158,  206,  260, 
//  Domino_A =   0, 2, 8, 26, 80, 242, 728, 2186,6560, 
//  Domino_B =   0, 1, 4, 13, 40, 121, 364, 1093,3280, 
//  Domino_E =   0, 1, 4, 11, 30,  83, 236,  687,2026, 6023,17984, 53819,161254,
//  Domino_F =   0, 2, 6, 16, 44, 122, 350, 1024,3028, 9018,26950, 80688,241820,
//  Domino_D =   0, 3, 8, 21, 58, 161, 464, 1361,4030,12013,35916,107557,322386,
// Reversi_H =   0, 2, 4, 10, 20,  42,  84,  170, 340,  682, 1364, 
// Reversi_C =   0, 2, 6, 10, 22,  34,  70,  106, 214,  322,  646,  970, 1942, 
// Reversi_B =   0, 2, 4, 10, 16,  34,  52,  106, 160,  322,  484,  970, 1456, 
// Reversi_A =   0, 1, 4,  7, 16,  25,  52,   79, 160,  241,  484,  727, 1456, 
// Reversi_E =   0, 1, 4,  7, 12,  17,  26,   35,  50,   69,  100,  145,  210, 
// Reversi_F =   0, 2, 4,  8, 12,  20,  30,   40,  54,   72,  102,  144,  214, 
// Reversi_D =   0, 3, 6, 11, 16,  23,  32,   45,  60,   79,  110,  155,  228, 
//     Reves =   0, 1, 3,  5,  9, 13, 17, 25, 33, 41, 49, 65, 81, 97, 113, 129, 
//               161, 193, 225, 257, 289, 321, 385, 449, 513, 577, 641, 705, 769, 
//               897, 1025, 1153, 1281, 1409, 1537, 1665, 1793,
// Checkers  =   0, 1, 3,  5,  9, 13, 17, 25, 33, 41, 49, 65, 81, 97, 113, 137, 
//               161, 193, 225, 257, 289, 337, 385, 449, 513, 577, 641, 737, 817, 
//               929, 1025, 1153, 1281, 1409, 1537, 1729, 1897,
// Checkers_B=   0, 1, 3,  5,  9, 13, 21, 25, 33, 41, 57, 65, 81, 97, 129, 145, 
//               177, 193, 225, 257, 321, 353, 417, 449, 513, 577, 705, 769, 897, 
//               961, 1089, 1153, 1281, 1409, 1665, 1793, 2049,
// Checkers_C=   0, 1, 3,  7,  9, 13, 17, 25, 33, 49, 57, 73, 81, 97, 113, 145, 
//               161, 193, 225, 289, 321, 385, 417, 481, 513, 577, 641, 769, 833, 
//               961, 1025, 1153, 1281, 1537, 1665, 1921, 2049,
// BADB v.0  =   0, 2, 4, 10, 16,  30,  52,  86,  160,  242, 484, 
// BADB v.1  =   0, 2, 4, 10, 16,  26,  44,  74,  112,  202, 316, 
// BADB opt  =   0, 2, 4, 10, 16,  26,  44,  68,  112,176/182,304, 
// BABE v.1  =   0, 1, 4,  7, 12,  21,  36,  55,  100, 
// BABE opt  =   0, 1, 4,  7, 12,  21,  36,  55,  100, 

// Optimal times --- need rechecking ? 
//    n = 0, 1, 2,  3,  4,   5,   6,   7,   8,   9,  10,  11,  12 
// DDDE = 0, 1, 4,  7, 12,  17,  24,  35,  50,  67, 
// DDDF = 0, 2, 4,  8, 12,  20,  28,  36,  52,  72, 
// EDDD = 0, 3, 6, 11, 16,  23,  32,  45,  60,  77, 
// BDDE = 0, 1, 4,  7, 12,  19,  28,  41,  62,  91, 
// BDDF = 0, 2, 4,  8, 12,  20,  28,  44,  66,  96, 
// BADB = 0, 2, 4, 10, 16,  26,  44,  68, 112,?176/182, 304, 
// BADA = 0, 1, 4,  7, 14,  23,  38,  57,  96, 143, 254, 
// BAAF = 0, 2, 6, 10, 20,  30,  52,  74, 134, 198, 372, 
//?BDBB = 0, 2, 4, 10, 16,  30,  44,  72, 104, 
// BDBA = BADA reversed 
// BABE = 0, 1, 4,  7, 12,  21,  36,  55, 100, 
// DABA = BABE reversed 
// BABA = 0, 1, 4,  7, 16,  25,  52,  79,?160, 
// BABB = 0, 2, 4, 10, 16,  34,  52, 106,?160, 
// BAAB = 0, 2, 6, 10, 22,  34,  70, 106,?214, 
// DDDD = 0, 1, 3,  5,  9,  13,  17,  25,  33,   41,  49,  65,  81,  97, 

// (Checkers) optimise in layers from BAAB, BABA, BABB to DDDE, DDDF, EDDD. 
// Currently, even program BADB, BADA, BDBB are very far from optimal for n > 4. 
// Start with proof that BAAB, BABA, BABB are optimal? YES! 
// Notice that optimal DDDF and EDDD seem of Frame type, DDDE solutions 
// nearly but not quite, for say 6 <= n <= 9. At some point we may be forced 
// to consider auxiliary functions involving more general configurations. 

class Four_Star extends DominoDefn {
  // Stockmeyer's 3-pin + central pin, all moves via latter; compare Adjacent 
  String name () {return ("Four_Star");} 

  Tower tower; 
  int starpost = 1; // star pin 
  static double [] fij; static int [] fk; static int [] ak; 
    // function tables 

  // k-th disc above, k small 
  static Disc next_k (Disc disc, int k) {
    Disc next = disc; while (k > 0) /*do*/ {k = k-1; next = next.above;} 
    return(next);} 

  // Precompute table of functions 
  public static void tables(int n) {
    double log2 = Math.log(2.0), log3 = Math.log(3.0), dum; 
    int i, j, k, l; 
    int bdi = (int)Math.floor(Math.sqrt(2*n*log3/log2)) + 1, 
      bdj = (int)Math.floor(Math.sqrt(2*n*log2/log3)) + 1, bdn = bdi*bdj; 
    fij = new double [bdn]; fk = new int [n+1]; ak = new int [n+1]; 
    k = -1; // fij[k] = log_3(2^i 3^j), ak[k] = 2^i 3^j 
    j = -1; while (j < bdj-1) /*do*/ {j = j+1; 
      i = -1; while (i < bdi-1) /*do*/ {i = i+1; 
        k = k+1; fij[k] = i*log2/log3 + j;} /*od*/} /*od*/ 
    fij[bdn-1] = -1; // case n = 0 

    // Bubble sort into ascending order --- slow for large n 
    l = -1; while (l < bdn-2) /*do*/ {l = l+1; 
      k = -1; while (k < bdn-l-2) /*do*/ {k = k+1; 
        if (fij[k] > fij[k+1]) /*then*/ {
          dum = fij[k]; fij[k] = fij[k+1]; fij[k+1] = dum;} /*fi*/
      } /*od*/} /*od*/

    k = -1; while (k < n) /*do*/ {k = k+1; 
      fk[k] = (int)Math.floor(fij[k]) + 1; 
      ak[k] = (int)Math.floor(Math.exp(fij[k]*log3) + 0.5);} /*od*/} 

  // k with 3^(k-1) <= a_n < 3^k, where {a(n)} = {2^i 3^j} in ascending order; 
  static int stock (int n) {
    return fk[n];} 
  // time = 2\sum_{i<=n} a(i); overflow for n > 225  
  static int time_n (int n) {
    int res = 0, k = -1; 
    while (k < n) /*do*/ {k = k+1; res = res + ak[k];} /*od*/ 
    return 2*res;} 

  void tran (Tower tower) throws HanoiException { 
    tranS(tower.pins[0].base.above, // starpost wired in! 
      tower.pins[1], tower.pins[0], tower.pins[2], tower.pins[3]);} 

  // Stockmeyer's algorithm for Star puzzle: from A to C via B and star O 
  void tranS(Disc disc, Pin O, Pin A, Pin B, Pin C) 
    throws HanoiException {
    trace("S", disc, O, A, B, C); 
    if (disc.diam > 0) /*then*/ {
      // next = k-th above disc n, where (k+1)_C_2 nearest to n 
      Disc next = next_k(disc, stock(disc.diam)); 
      // transfer bottom k discs via 3-pin, remainder twice via 4-pin 
      tranS(next, O, A, C, B); tranABA(disc, A, O, C); // uses Adjacent 
      tranS(next, O, B, A, C);}} 

  void reshade (Disc disc) {
    if (disc.shade == 0) /*then*/ disc.shade = 1; /*fi*/} // white 

  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    return A.diam <= B.diam && (X.disp == starpost || Y.disp == starpost);} 

  // Ensure stack monotonic on correct pin 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// all pins but last empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = 4; this.n = n; 
    tower = new Tower(this.m, this.n, this); 
    tower.pins[1].shaft.shade = 1; // white 
    tables(n); 
    return tower;} 

  public static void main (String args[]) {
    new Four_Star(); 
    int n = 40; tables(n); 
    double log2 = Math.log(2.0), log3 = Math.log(3.0); 
    int k = -1; while (k < n) /*do*/ {k = k+1; 
      double apps = Math.sqrt(2*k*log2/log3), 
        appt = apps*Math.exp(Math.sqrt(2*log2*log3*k)); 
      System.out.println(k + " " + stock(k) + " " + time_n(k) 
        + " " + apps + " " + appt); 
      } /*od*/} 

  } /* Four_Star */ 

abstract class LundonDefn extends CyclicDefn {
  //String name () {return ("LundonDefn");} 

  // Ensure stack monotonic on correct pin and (initial) colour 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// first and second pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res &(disc.diam == i)&(disc.shade == discol[0]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  static final int[] discol = {4, 1, 6}; // green, white, orange (below) 
  void reshade (Disc disc) {
    if (disc.shade == 0) /*then*/ disc.shade = discol[0]; 
    else {int j = -1; while (j < 2) /*do*/ {j = j+1; // cycle colours 
        if (disc.shade == discol[j]) /*then*/ {
          disc.shade = discol[(j+1)%3]; j = 2; /*fi*/} /*od*/} /*fi*/}} 

  boolean check (Pin X, Pin Y) {
    Disc A = X.shaft.below, B = Y.shaft.below; 
    int Aj = 6, Bj = -6, j = -1; // verify colour cycling 
    while (j < 2) /*do*/ {j = j+1; 
      if (A.shade == discol[j]) /*then*/ Aj = j; /*fi*/ 
      if (B.shade == discol[j]) /*then*/ Bj = j; /*fi*/} /*od*/ 
    return A.diam < B.diam && (B.shade == bascol || (Bj - Aj + 3)%3 == 1);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    this.l = 1; this.m = 3; this.n = n; 
    return (new Tower(this.m, this.n, defn));} 

  } /* LundonDefn */ 

// Orange onto right pin 
class Lundon_C extends LundonDefn {
  // 3-pin, transfer tower left to right pin, colour back 
  String name () {return ("Lundon_C");} 
  void tran (Tower tower) throws HanoiException {
    tranL(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 

  // Ensure stack monotonic on correct pin and colour 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j < m-1) /*then*/ {// first and second pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res & (disc.diam == i) & (disc.shade == discol[2]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    Tower tow = super.init(3, n, defn); 
    return tow;} 

  } /* Lundon_C */ 

class Lundon_B extends LundonDefn {
  // 3-pin, transfer tower left to right pin, advance colour 
  String name () {return ("Lundon_B");} 
  void tran (Tower tower) throws HanoiException {// note permutation of pins 
    tranR(tower.pins[0].base.above, 
      tower.pins[0], tower.pins[1], tower.pins[2]);} 

  // Ensure stack monotonic on correct pin and colour 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j != 2) /*then*/ {// first and second pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res & (disc.diam == i) & (disc.shade == discol[1]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  Tower init (int m, int n, HanoiDefn defn) {// initialise Tower and discs 
    Tower tow = super.init(3, n, defn); 
    return tow;} 

  } /* Lundon_B */ 

class Lundon extends LundonDefn {
  // 3-pin, transfer tower left to right pin, maintain colour 
  String name () {return ("Lundon");} 

  // Ensure stack monotonic on correct pin and colour 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j != 2) /*then*/ {// first and second pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res & (disc.diam == i) & (disc.shade == discol[0]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  void tran (Tower tower) throws HanoiException {
    tranR(tower.pins[0].base.above.above, 
      tower.pins[0], tower.pins[2], tower.pins[1]); 
    move(tower.pins[0], tower.pins[2]); 
    move(tower.pins[2], tower.pins[0]); 
    move(tower.pins[0], tower.pins[2]); 
    tranL(tower.pins[1].base.above, 
      tower.pins[1], tower.pins[0], tower.pins[2]);} 

  } /* Lundon */ 

class Brandonbug extends LundonDefn {
  // As Lundon, but opposite cyclic direction 
  String name () {return ("Brandonbug");} 

  // Ensure stack monotonic on correct pin and colour 
  boolean fin (Tower tower) {
    boolean res = true; 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      if (j != 2) /*then*/ {// first and second pin empty 
        res = res &(tower.pins[j].shaft.below == tower.pins[j].base);} 
      else {int i = 0; Disc disc = tower.pins[j].shaft; 
        while (i < n) /*do*/ {i = i+1; disc = disc.below; 
          res = res & (disc.diam == i) & (disc.shade == discol[0]); 
          } /*od*/} /*fi*/} /*od*/ 
    return (res);} 

  void tran (Tower tower) throws HanoiException {
    tranL(tower.pins[0].base.above.above, 
      tower.pins[0], tower.pins[2], tower.pins[1]); 
    move(tower.pins[0], tower.pins[2]); 
    move(tower.pins[2], tower.pins[0]); 
    move(tower.pins[0], tower.pins[2]); 
    tranR(tower.pins[1].base.above, 
      tower.pins[1], tower.pins[0], tower.pins[2]);} 

  } /* Brandonbug */ 

