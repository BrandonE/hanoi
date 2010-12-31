/* Hanoi Tower Simulator version 15, W.F.Lunnon (24/11/02) (04/09/05) 13/07/07 */ 
/* 3-pin & 4-pin & m-pin classic, cyclic, rainbow, domino, reversi, checkers, 
  antwerp, serials, Defn.move, Tower(), manual, l-stack Turtle(), Star */ 
/* tracing, wait/cycle/repeat, run/display toggle, double-buffer, move checking, 
  no user defn slot, user_move option, coloured toggles, reconciled dims, 
  Tower draw(), init(), check() disc diam, l,m,n, no Hide or Quit, 
  status field, fin(), auto-min props, J-tools, manual half-moves */ 
/* Compile via " rm *.class; javac -nowarn HanoiVar.java ", 
  run " appletviewer HanoiVar.html & " or " java HanoiVar & " Backup via 
  " cp HanoiVar.java HanoiVar.java.15; cp HanoiLib.java HanoiLib.java.15; cp HanoiDoc.html HanoiDoc.html.15; " */ 
/* HanoiVar.java uses HanoiLib.java, documented in HanoiDoc.html */ 

import java.awt.*; 
import java.awt.event.*; 
import javax.swing.*; // Use J tools 
import javax.swing.event.*; 
import java.applet.Applet; 
import java.lang.Math; 

// Labelled interactive Swing binary toggle button (unsynchronised) 
//   with listener linked to internal variable. 
// With attention on toggle, keyboard SP has same effect as mouse click! 
class JBoggle extends JButton {
  private boolean value; // current status 
  private String labelI, labelT, labelF; // initial, true, false labels 

  public void set (boolean torf) {
    if (value != torf) /*then*/ {value = torf; 
      this.setText(/*if*/ (value) ?/*then*/ labelT :/*else*/ labelF); 
      this.setBackground(/*if*/ (value) 
        ?/*then*/ Color.green :/*else*/ Color.red);}} 
  public boolean get () {return(value);} 

  public JBoggle (boolean torf, String I, String T, String F) {
    labelI = I; labelT = T; labelF = F; 
    value = torf; this.setText(labelI); 

    this.addActionListener(new ActionListener() {
      public void actionPerformed(ActionEvent evt) {
        set(!value);}}); 
    } /* JBoggle() */  

  } /* JBoggle */ 

// labelled interactive Swing text field 
//   with listener linked to internal variable, and flag reset. 
class Counter {
  private int value; boolean flag; // integer value and boolean flag 
  final int size = 10; // field length 
  private JTextField field = new JTextField(size); // I/O text field for counter 

  public void set (int initial) {
    value = initial; 
    field.setText(String.valueOf(value));} 
  public int get () {return(value);} 
  public void put (String mess) {
    field.setText(mess);} 

  public Counter(String label, int initial, boolean reset) {
    HanoiProp.propsPanel.add(new JLabel(label)); 
    HanoiProp.propsPanel.add(field); 
    set(initial); flag = reset; 

    field.addActionListener(new ActionListener() {
      public void actionPerformed(ActionEvent evt) {
        value = Math.max (0, 
          Integer.valueOf(field.getText()).intValue()); 
        field.setText(String.valueOf(value)); 
        HanoiSimul.initFlag = HanoiSimul.initFlag || flag;}});} /* Counter() */  

  } /* Counter */ 

class HanoiProp extends JFrame {
  static JFrame propsFrame; 
  static JComboBox varChoice, firingOption; 
  static JButton hideButton,quitButton,traceButton,movesButton; 
  static JPanel propsPanel; 

  public HanoiProp() {
    super("Hanoi Prop"); 
    propsFrame = this; 
    propsPanel = new JPanel(); 
    getContentPane().add(propsPanel); 
    propsPanel.setLayout(new GridLayout(0,2)); 

    // create variation menu with selected default at top 
    propsPanel.add(new JLabel("Variation")); 
    varChoice = new JComboBox(); 
    int k = HanoiLib.list.length; 
    for (int i = 1; i <= k; i++) /*do*/ varChoice.addItem 
      (HanoiLib.list[(i-2+HanoiSimul.var)%k].name()); 
    propsPanel.add(varChoice); 
    varChoice.addItemListener(new ItemListener() {
      public void itemStateChanged(ItemEvent evt) {
        HanoiSimul.var = varChoice.getSelectedIndex() + 1; 
        HanoiSimul.numDiscs.set(HanoiSimul.numDiscsIn); // reset n,m 
        HanoiSimul.numPins.set(HanoiSimul.numPinsIn); 
        HanoiSimul.initFlag = true;}}); 

    // create mode option menu 
    propsPanel.add(new JLabel("Mode")); 
    firingOption = new JComboBox(); 
    k = HanoiSimul.foList.length; 
    for (int i = 1; i <= k; i++) /*do*/ firingOption.addItem 
      (HanoiSimul.foList[(i-2+HanoiSimul.firing)%k]); 
    propsPanel.add(firingOption); 
    firingOption.addItemListener(new ItemListener() {
      public void itemStateChanged(ItemEvent evt) {
        HanoiSimul.firing = firingOption.getSelectedIndex() + 1;}}); 

    // Set up interactive parameter text fields 
    HanoiSimul.numDiscs = new Counter ("Discs", HanoiSimul.numDiscsIn, true); 
    HanoiSimul.numPins = new Counter ("Pins", HanoiSimul.numPinsIn, true); 
    HanoiSimul.timeCur = new Counter ("Time", HanoiSimul.timeCurIn, true); 
    HanoiSimul.lineDelay = new Counter ("Delay", HanoiSimul.lineDelayIn, false); 

    propsPanel.add(HanoiDefn.traceTog = new 
      JBoggle(false, "Trace Toggle", "Stop Trace", "Start Trace")); 
    propsPanel.add(HanoiDefn.movesTog = new 
      JBoggle(false, "Print Toggle", "Stop Print", "Start Print")); 

    HanoiSimul.status = new Counter ("Status", 0, false); 
    HanoiSimul.status.put(HanoiSimul.statusIn); // status message to user 

    propsPanel.add(HanoiSimul.dispTog = new 
      JBoggle(true, "Draw Toggle", "Stop Draw", "Start Draw")); 
    propsPanel.add(HanoiSimul.contTog = new 
      JBoggle(true, "Run Toggle", "Stop Run", "Start Run")); 

    // Call up properties at mouse click on canvas 
    HanoiDraw.drawFrame.addMouseListener(new MouseAdapter() {
      public void mouseReleased(MouseEvent evt) {
        int x = evt.getX(), y = evt.getY(); 
        HanoiProp.propsFrame.setVisible(true);}}); 

    // Select pin at mouse click on canvas 
    HanoiDraw.drawFrame.addMouseListener(new MouseAdapter() {
      public void mousePressed(MouseEvent evt) {
        int x = evt.getX(), y = evt.getY(); 
        HanoiSimul.inPin(x);}}); 

    // Hide properties via window frame button; also minimise with display 
    //   [remember whether hidden already when hide/restore on minimisation?] 
    addWindowListener(new WindowAdapter() {// hide via window frame button 
      public void windowClosing(WindowEvent evt) {
        propsFrame.setVisible(false);}}); 
    HanoiDraw.drawFrame.addWindowListener(new WindowAdapter() {
      // hide via display minimisation  
      public void windowIconified(WindowEvent evt) {
        propsFrame.setVisible(false);}}); 
    HanoiDraw.drawFrame.addWindowListener(new WindowAdapter() {
      public void windowDeiconified(WindowEvent evt) {
        propsFrame.setVisible(true);}}); 
    setSize(250,300); setLocation(600,250); /* size, offset */ 
    setVisible(true);} /* HanoiProp() */ 

  } /* HanoiProp */ 

abstract class HanoiDefn {
  // n-disc, m-pin, l-stack, move top disc only to another pin, 
  // where top disc wider (or equally wide). 
  // HanoiDefn pin displacements from 0 to m-1, disc diameters from n to 1. 
  abstract String name (); // menu identifier 
  abstract void tran (Tower tower) 
    throws HanoiException; // transfer disc stack 
  static int bascol = 11; // colour index of bases, pins (med grey) 
  int l, m, n; // global number of stacks, pins, discs per stack 

  abstract boolean check (Pin X, Pin Y); // verify move 
  //  {Disc A = X.shaft.below, B = Y.shaft.below; 
  //  return A.diam <= B.diam;} 
  abstract void reshade (Disc disc); // current colour index 
  abstract Tower init (int m, int n, HanoiDefn defn); // initial Tower, discs 
  //  {return (new Tower(m, n, defn));} 
  abstract boolean fin (Tower tower); // check result correct 
  //  {return (true);} 

  static JBoggle traceTog; // tracing print switch: initially false 
  static JBoggle movesTog; // moves print switch: initially false 
    // toggles instantiated in HanoiProp(), else layout wreck ?? 
  static void trace (String name, Disc disc, Pin X, Pin Y, Pin Z) {
    if (traceTog.get()) 
    /*then*/ System.out.println(name + " diam pin (col): " + 
    " disc = " + String.valueOf(disc.diam) + " " + String.valueOf(disc.pin.disp) + 
    " " + String.valueOf(disc.shade) + 
    " X = " + String.valueOf(X.shaft.below.diam) + " " + String.valueOf(X.disp) + 
    " Y = " + String.valueOf(Y.shaft.below.diam) + " " + String.valueOf(Y.disp) + 
    " Z = " + String.valueOf(Z.shaft.below.diam) + " " + String.valueOf(Z.disp) + " "); 
    return;} 
  static void trace (String name, Disc disc, Pin W, Pin X, Pin Y, Pin Z) {
    if (traceTog.get()) 
    /*then*/ System.out.println(name + " diam pin (col): " + 
    " disc = " + String.valueOf(disc.diam) + " " + String.valueOf(disc.pin.disp) + 
    " " + String.valueOf(disc.shade) + 
    " W = " + String.valueOf(W.shaft.below.diam) + " " + String.valueOf(W.disp) + 
    " X = " + String.valueOf(X.shaft.below.diam) + " " + String.valueOf(X.disp) + 
    " Y = " + String.valueOf(Y.shaft.below.diam) + " " + String.valueOf(Y.disp) + 
    " Z = " + String.valueOf(Z.shaft.below.diam) + " " + String.valueOf(Z.disp) + " "); 
    return;} 

  // move top disc from pin X to pin Y: from tran() method 
  void move (Pin X, Pin Y) throws HanoiException {
    if (HanoiSimul.initFlag || HanoiSimul.firing == 4) /*then*/ 
      throw new HanoiException(); 
      // on Manual or Initialise, break out back to startDisc() 

    Disc disc = X.shaft.below, onto = Y.shaft.below, under = disc.below; 
    boolean validFlag = check(X, Y) && (disc != X.base) && (disc != X.shaft); 
    if (!validFlag || movesTog.get()) 
    /*then*/ {// monitor move if faulty or switch on 
      System.out.println(" from/to pins = " + X.disp + "," + Y.disp 
        + ", diams = " + disc.diam + "," + onto.diam 
        + ", shades " + disc.shade + "," + onto.shade);} /*fi*/ 

    // update pins, altitudes, shade (even if faulty) unless pin empty or same 
    if (disc != X.base && X != Y) /*then*/ {// no reshading when X = Y! 
      X.shaft.alti = X.shaft.alti - 1; X.shaft.deep = X.shaft.deep + 1; 
      X.shaft.below = under; under.above = X.shaft; 
      disc.pin = Y; 
      disc.above = Y.shaft; disc.below = onto; 
      onto.above = disc; Y.shaft.below = disc; 
      disc.alti = Y.shaft.alti; 
      Y.shaft.alti = Y.shaft.alti + 1; Y.shaft.deep = Y.shaft.deep - 1; 
      reshade(disc);} 

    HanoiSimul.moveDisc(validFlag); 
    return;} /* move() */ 

  // remove top disc from pin X: from tran_manual() method 
  Disc remove (Pin X) throws HanoiException {
    if (HanoiSimul.initFlag || HanoiSimul.firing == 4) /*then*/ 
      throw new HanoiException(); 
      // on Manual or Initialise, break out back to startDisc() ?? 

    Disc disc = X.shaft.below, under = disc.below; 
    boolean validFlag = (disc != X.base) && (disc != X.shaft); 

    // update old pin, altitude unless pin empty 
    if (disc != X.base && disc != X.shaft) /*then*/ {
      X.shaft.alti = X.shaft.alti - 1; X.shaft.deep = X.shaft.deep + 1; 
      X.shaft.below = under; under.above = X.shaft;} 

    HanoiSimul.moveDisc(validFlag); 
    return disc;} /* remove() */ 

  // replace disc on pin Y: from tran_manual() method 
  void replace (Disc disc, Pin Y) throws HanoiException {
    if (HanoiSimul.initFlag || HanoiSimul.firing == 4) /*then*/ 
      throw new HanoiException(); 
      // on Manual or Initialise, break out back to startDisc() ?? 

    // Replace disc on pin X before checking 
    Pin X = disc.pin; // assume disc properties prior to removal 
    if (disc != X.base && disc != X.shaft) /*then*/ {
      X.shaft.alti = X.shaft.alti + 1; X.shaft.deep = X.shaft.deep - 1; 
      Disc neath = X.shaft.below; X.shaft.below = disc; 
      disc.below = neath; neath.above = disc;} 

    Disc onto = Y.shaft.below, under = disc.below; 
    boolean validFlag = check(X, Y) && disc != X.base && disc != X.shaft; 
    if (!validFlag || movesTog.get()) 
    /*then*/ {// monitor move if faulty or switch on 
      System.out.println(" from/to pins = " + X.disp + "," + Y.disp 
        + ", diams = " + disc.diam + "," + onto.diam 
        + ", shades " + disc.shade + "," + onto.shade);} /*fi*/ 

    // Update both pins, altitudes, shades (even if faulty) unless same 
    if (disc != X.base && disc != X.shaft && disc != X.base 
        && X != Y) /*then*/ {// no reshading when X = Y! 
      X.shaft.alti = X.shaft.alti - 1; X.shaft.deep = X.shaft.deep + 1; 
      X.shaft.below = under; under.above = X.shaft; 
      disc.pin = Y; 
      disc.above = Y.shaft; disc.below = onto; 
      onto.above = disc; Y.shaft.below = disc; 
      disc.alti = Y.shaft.alti; 
      Y.shaft.alti = Y.shaft.alti + 1; Y.shaft.deep = Y.shaft.deep - 1; 
      reshade(disc);} 

    HanoiSimul.moveDisc(validFlag); 
    return;} /* move() */ 

  } /* HanoiDefn */ 

class Disc extends Frame {
  int diam = 0, alti = 0, deep = 1; // diameter, coordinate, height 
  int shade = 0; // current (dynamic) colour index 
  Disc above, below, larger; // next disc up, down on pin, bigger diameter; 
  Pin pin; // current pin 
  HanoiDefn defn; // variation rule 
  static double ecc = 0.25; // aspect ratio of disc 

  public Disc() {;} // dummy else compiler fault 

  public Disc(Pin pin, int diam, HanoiDefn defn) {
    this.pin = pin; this.diam = diam; this.deep = 1; this.defn = defn; 
    defn.reshade(this); /* initialise shade */ 
    above = pin.shaft; below = above.below; 
    below.above = this; above.below = this; 
    alti = above.alti; larger = below; 
    above.alti = above.alti + 1; above.deep = above.deep - 1;} /* Disc() */ 

  public Disc(Pin pin, int diam, int alti, int deep, int shade, HanoiDefn defn) {
    this.pin = pin; this.diam = diam; this.alti = alti; 
    this.deep = deep; this.shade = shade; this.defn = defn; 
    /* below = above = larger = NULL; */} /* Disc() */ 

  // Draw disc, given x- and y- device scales, base offset and margin 
  public void draw(Graphics gc, 
    int width, int height, double xUnit, double yUnit, int bas, int mar) {

    // geometrical data in logical units 
    int alt = alti, 
      dis = (2*pin.disp+1)*(pin.base.diam+Tower.inc_b), 
      rad = /*if*/ (this == pin.shaft) ?/*then*/ Tower.inc_p :/*else*/ 
        /*if*/ (this == pin.base) ?/*then*/ diam+Tower.inc_b :/*else*/ 
        diam+Tower.inc_d, 
      depth = deep; 

      //System.out.println(
      //  "HanoiVar disc: i, alt, dis, rad, depth, shade = " 
      //  + String.valueOf(i) + " " 
      //  + String.valueOf(alt) + " " + String.valueOf(dis) + " " 
      //  + String.valueOf(rad) + " " + String.valueOf(depth) + " " 
      //  + String.valueOf(shade) + " "); 

      // Red,Green,Blue discs, White pins, background outlines. 
      int outline = 2, lin = 3; // edge thick line colour and width 
      int ff = 1; // fudge factor to correct disc artifact 
      gc.setColor(Colour.table [outline]); 
      gc.fillOval (
        (int) Math.round ((dis-rad)*xUnit + mar-lin), 
        (int) Math.round (height - alt*yUnit - rad*ecc*xUnit - lin-mar-bas), 
        (int) Math.round ((2*rad)*xUnit + 2*lin), 
        (int) Math.round (2*rad*ecc*xUnit + 2*lin)); 
      gc.setColor(Colour.table [shade%Colour.table.length]); 
      gc.fillOval (
        (int) Math.round ((dis-rad)*xUnit + mar), 
        (int) Math.round (height - alt*yUnit - rad*ecc*xUnit - mar-bas), 
        (int) Math.round ((2*rad)*xUnit), 
        (int) Math.round (2*rad*ecc*xUnit)); 
      gc.setColor(Colour.table [outline]); 
      gc.fillRect (
        (int) Math.round ((dis-rad)*xUnit + mar-lin), 
        (int) Math.round (height - (alt+depth)*yUnit - mar-bas), 
        (int) Math.round ((2*rad)*xUnit + 2*lin + ff), 
        (int) Math.round ((depth)*yUnit)); 
      gc.setColor(Colour.table [shade%Colour.table.length]); 
      gc.fillRect (
        (int) Math.round ((dis-rad)*xUnit + mar), 
        (int) Math.round (height - (alt+depth)*yUnit - mar-bas), 
        (int) Math.round ((2*rad)*xUnit + ff), 
        (int) Math.round ((depth)*yUnit)); 
      gc.setColor(Colour.table [outline]); 
      gc.fillOval (
        (int) Math.round ((dis-rad)*xUnit + mar-lin), 
        (int) Math.round (height - (alt+depth)*yUnit - rad*ecc*xUnit - lin-mar-bas), 
        (int) Math.round ((2*rad)*xUnit+2*lin), 
        (int) Math.round (2*rad*ecc*xUnit+2*lin)); 
      gc.setColor(Colour.table [shade%Colour.table.length]); 
      gc.fillOval (
        (int) Math.round ((dis-rad)*xUnit + mar), 
        (int) Math.round (height - (alt+depth)*yUnit - rad*ecc*xUnit - mar-bas), 
        (int) Math.round ((2*rad)*xUnit), 
        (int) Math.round (2*rad*ecc*xUnit)); 
    return;} /* draw() */ 

  } /* Disc */ 

class Pin {
  int disp = 0, diam = 0; // displacement, base diameter 
  Disc base, shaft; // base disc, shaft disc 

  public Pin() {;} // dummy else compiler fault 

  public Pin (int disp, int diam, int deep, int shade, HanoiDefn var) {
    this.disp = disp; 
    base = new Disc (this, diam, 0, 1, shade, var); 
    shaft = new Disc (this, 0, 1, deep-1, shade, var); 
    shaft.below = base; base.above = shaft; 
    base.below = base; shaft.above = shaft; 
    base.larger = base; shaft.larger = shaft; 
    } /* Pin() */ 

  } /* Pin */

class Tower {
  int m = 0, n = 0, l = 0; // number of pins, max diameter, height of shafts  
  Pin[] pins; // constituent pins 
  HanoiDefn defn; // variation rule 
  static int inc_p = 1, inc_d = inc_p+3, inc_b = inc_d+1; 
    // radius offsets of pin, disc, base (xUnits) 

  public Tower() {;} // dummy else compiler fault 

  // Set up tower with m pins, first pin loaded with n discs. 
  public Tower (int m, int n, HanoiDefn var) {
      this.pins = new Pin[m]; this.m = m; this.l = n; this.n = n; 
      defn = var; 
      int j = -1; while (j < m-1) /*do*/ {j = j+1; 
        pins[j] = new Pin(j, n+1, l+inc_d, HanoiDefn.bascol, var);} 
      Disc disc = pins[0].base; 
      int i = -1; while (i < l-1) /*do*/ {i = i+1; 
        disc = new Disc(pins[0], l-i, var);} 
    } /* Tower() */ 

  // Set up tower with m pins, pin j loaded with nj[j] discs. 
  public Tower (int m, int l, int[] nj, HanoiDefn var) {
      this.pins = new Pin[m]; this.m = m; this.l = l; 
      defn = var; 
      int j = -1; while (j < m-1) /*do*/ {
        j = j+1; if (n < nj[j]) /*then*/ n = nj[j];} 
      j = -1; while (j < m-1) /*do*/ {j = j+1; 
        pins[j] = new Pin(j, n+1, l+inc_d, HanoiDefn.bascol, var); 
        Disc disc = pins[j].base; 
        int i = -1; while (i < nj[j]-1) /*do*/ {i = i+1; 
          disc = new Disc(pins[j], nj[j]-i, var);}} 
    } /* Tower() */ 

  // Draw tower, given x- and y- device scales, base offset and margin 
  public void draw(Graphics gc, 
    int width, int height, double xUnit, double yUnit, int bas, int mar) {
    // depth-sort discs on each pin and draw 
    int j = -1; while (j < m-1) /*do*/ {j = j+1; 
      Pin pin = pins[j]; Disc disc = pin.base; 
      disc.draw(gc, width, height, xUnit, yUnit, bas, mar); 
      while (disc != pin.shaft) /*do*/ {disc = disc.above; 
        disc.draw(gc, width, height, xUnit, yUnit, bas, mar);}}} /* draw() */ 

  void trace (String name, Disc disc) {
    if (HanoiDefn.traceTog.get()) /*then*/ {String output = name + " diam col pin: " + 
        " disc = " + String.valueOf(disc.diam) + 
        " " + String.valueOf(disc.shade) + 
        " " + String.valueOf(disc.pin.disp); 
      int j = -1; while (j < m-1) /*do*/ {j = j+1; 
        Pin pin = pins[j]; 
        output = output + " Pin" + String.valueOf(j) + 
            " " + String.valueOf(pin.shaft.below.diam) + 
            " " + String.valueOf(pin.shaft.below.shade) + 
            " " + String.valueOf(pin.disp);} 
    System.out.println(output);}} /* trace() */ 

  } /* Tower */

class Colour extends Frame {
  static Color [] table = {Color.lightGray, Color.white, Color.black, 
    Color.red, Color.green, Color.blue, Color.orange, Color.magenta, 
    Color.cyan, Color.yellow, Color.pink, Color.gray, Color.darkGray}; 
  } /* Colour */ 

class HanoiException extends Exception {;} /* break out from recursion */ 

// Simulate as background process. 
class HanoiSimul extends Thread {
  static Thread simulThread, compThread; 
  // Global variables. Counters instantiated in HanoiProp() 
  static Counter numDiscs; static int numDiscsIn = 6; // disc count, default 
  static Counter numPins; static int numPinsIn = 6; // pin count, default 
  static Counter timeCur; static int timeCurIn = 1; 
    // current number of iterations, default 
  static Counter lineDelay; static int lineDelayIn = 500; // 1/2 sec 
    // End-of-Line delay in millisecs, default 
  static Counter status; static String statusIn = "Waiting"; // status message 
  static int busyWait = 50; // wait for input in millisecs: fails Java 1.2 ?? 
  static boolean initFlag = true; /* whether to initialise simulation */ 
  static JBoggle contTog; // run toggle 
  static JBoggle dispTog; // display toggle 
    // toggles instantiated in HanoiProp(), else layout wreck ?? 

  static int var = 1; // index of variation in use, with default 
  static String [] foList = // firing options available 
    {"Wait", "Repeat", "Increase", "Manual"}; 
  static int firing = 1; // index of given option name, with default 
  // local (protected) mirror constants, simulation variables 
  static HanoiDefn varDefn; // local variation 
  static Tower varTow; // local variation 
  static int m, n; // local number of pins, discs 

  // Restart simulation from scratch 
  static void startDisc() {/* initFlag == true */ 
    status.put("Waiting"); 
    while (true) /*do*/ {
      if (initFlag) /*then*/ varDefn = HanoiLib.list[var-1]; // algorithm 
      initFlag = false; timeCur.set(-1); /* reset clock */ 
      try {
        varTow = varDefn.init(numPins.get(), numDiscs.get(), varDefn); 
        numPins.set(varTow.m); numDiscs.set(varTow.n); 
        m = varTow.m; n = varTow.n; // allow overriding by definition 
        moveDisc(true); /* setup and display initial configuration */ 
        if (HanoiDefn.traceTog.get() || HanoiDefn.movesTog.get()) /*then*/ 
          System.out.println("Starting " + varDefn.name() + 
            " m = " + m + " n = " + n); 
        status.put("Running"); 
        varDefn.tran(varTow); // enter recursive simulation 
        if (HanoiDefn.traceTog.get() || HanoiDefn.movesTog.get()) /*then*/ {
          System.out.println("Finishing " + varDefn.name() + 
            " Time = " + timeCur.get()); /*fi*/} 
        if (varDefn.fin(varTow)) /*then*/ {// verify final configuration 
          System.out.println("Success "); status.put("Success");} 
        else {
          System.out.println("Failure "); status.put("Failure");} /*fi*/} 
      catch (HanoiException e) {;} // abort or manual switch 

      // implement firing option 
      if (firing == 4) /*then*/ try {tran_manual();} 
        catch (HanoiException e) {;}  
      if (firing == 0) /*then*/ firing = 4; /* reset if manual */ 
      if (!initFlag) /*then*/ {
        if (firing == 1) /*then*/ {contTog.set(false);} /*fi*/ 
        while (!contTog.get() && !initFlag) /*do*/ {/* hold simulation */ 
          try {Thread.sleep(busyWait);} /* fairly busy wait */ 
          catch (InterruptedException e) {};} 
        if (firing == 2) /*then*/ contTog.set(true); 
        if (firing == 3) /*then*/ {contTog.set(true); 
          n = n+1; numDiscs.set(n);}}} 
    } /* startDisc() */ 

  // Output disc move: called by Disc.move() 
  static void moveDisc (boolean validFlag) throws HanoiException {
    timeCur.set(timeCur.get()+1); // clock tick 
    if (!validFlag) /*then*/ {
      System.out.println(" Invalid move "); 
      HanoiSimul.status.put("Invalid");} /*fi*/ 
    if (dispTog.get()) /*then*/ HanoiDraw.flipDisplay(varTow); 
    contTog.set(contTog.get() && validFlag); /* halt simulation on bad move */
    while (!contTog.get() && !initFlag) /*do*/ {/* hold simulation */ 
      try {Thread.sleep(busyWait);} /* fairly busy wait */ 
      catch (InterruptedException e) {};} 
    return;} /* moveDisc() */ 

  static int pindis; 
    // shared user input pin number, written to by MouseListener in HanoiProp 
  // Select pin nearest mouse --- called by HanoiProp() MouseAdapter() 
  static void inPin (int x) {
    int dist = (int)Math.round(2.0*m*x/HanoiDraw.cols); 
    if (dist%2 == 1) /*then*/ pindis = (dist-1)/2;} /* inPin() */ 

  // Input user moves and feed to chosen initialised variation 
  static void tran_manual () throws HanoiException {
    Disc disc = new Disc(); // anti-nanny dummy 
    firing = 0; // disable breakout from moveDisc() 
    while (firing == 0 && !initFlag) /*do*/ {
      pindis = -1; 
      while (firing == 0 && !initFlag && pindis < 0) /*do*/ {
        try {Thread.sleep(busyWait);} /* fairly busy wait for input*/ 
        catch (InterruptedException e) {};} /*od*/ 
      if (firing == 0 && !initFlag) /*then*/ {
        timeCur.set(timeCur.get()-1); // no clock tick 
        disc = varDefn.remove(varTow.pins[pindis]);} /*fi*/ 
      pindis = -1; 
      while (firing == 0 && !initFlag && pindis < 0) /*do*/ {
        try {Thread.sleep(busyWait);} /* fairly busy wait for input*/ 
        catch (InterruptedException e) {};} /*od*/ 
      if (firing == 0 && !initFlag) /*then*/ 
        varDefn.replace(disc, varTow.pins[pindis]); /*fi*/ 
      status.put("Manual"); // ignoring previous invalid moves ?? 
      if (varDefn.fin(varTow)) /*then*/ {// verify final configuration 
        System.out.println("Success "); status.put("Success"); 
        /*fi*/} /*fi*/} /*od*/ 
    initFlag = true;} /* tran_manual() */ 

  public void start () {
    if (compThread == null) /*then*/ compThread = new Thread(this); 
    compThread.setPriority(Thread.MIN_PRIORITY); /* so I/O may pre-empt */ 
    compThread.start(); /* run() scheduled implicitly */ 
    } /* start() */ 

  public void run () {
   while (true) /*do*/ 
     if (HanoiProp.propsFrame != null) /* check all modules instantiated */ 
     /*then*/ startDisc(); /*fi od*/} /* run() */  

  public HanoiSimul() {
    simulThread = this; 
    /* start(); only after all constructors completed */ 
    } /* HanoiSimul() */

  } /* HanoiSimul */ 

// Display towers 
class HanoiDraw extends Frame {
  static Frame drawFrame; 
  // Global variables. Counters instantiated in HanoiProp() 
  static Counter colDis, rowDis; static int colDisIn = 240, rowDisIn = 180; 
    // Display number of rows and columns, defaults 
  static int cols = 800, rows = 300; /* x,y size of display screen */ 
  static int colOffset = 0, rowOffset = 50; /* x,y offset of display screen */ 
  static int rowCur = 0, colCur = 0; /* current position */ 
  static Disc[] discBuff; /* display buffer for deletion, bases, discs, pins */ 
  static Tower tower; // local tower 

  // Paint screen and compute next move are not synchronised when access discs: 
  //   this shouldn't matter, as user delay occurs before next computation, 
  //   which is very short in real time; also high priority should prevent corruption; 
  //   but still suffer lockout under if delay < 100 and large window. 

  // Consumer for flipDisplay 
  synchronized public void paint (Graphics gc) {
    // check for resized screen and make new buffer 
    int width = getSize().width; int height = getSize().height; 
    if (HanoiSimul.initFlag || offScreen == null || 
      cols != width || rows != height) 
    /*then*/ {cols = width; rows = height; 
      offScreen = createImage (width, height);}  
    gc.setColor(Colour.table[0]); // clear screen 
    gc.fillRect(0, 0, width, height); 

    try {
      int num_pin = tower.m, num_dis = tower.l, dia_dis = tower.n; 
        // number of pins, discs, diam 
      int mar = 20, top = 20; // margin, header, base offsets (abs) 
      double xUnit = 0.5*(cols-2*mar)/(num_pin*(dia_dis+1+Tower.inc_b)); 
        // horiz, vert unit dimensions from frame size: watch real division !! 
      int bas = (int) Math.floor((dia_dis+Tower.inc_b)*Disc.ecc*xUnit + 0.5); 
      double yUnit = 1.0*(rows-2*mar-top-bas)/(num_dis+Tower.inc_d); 

      tower.draw(gc, width, height, xUnit, yUnit, bas, mar);} 
    catch (NullPointerException e) {} 
    catch (ArithmeticException e) {}; // ignore initial null discBuff 
    return;} /* paint() */ 

  /* Double-buffering to reduce flicker and resize */ 
  Image offScreen; 
  public void update (Graphics gc) {//getSize() fails if called here ?? 
    if (offScreen != null) /*then*/ {
      Graphics offgc = offScreen.getGraphics(); 
      paint(offgc); gc.drawImage(offScreen, 0, 0, this); offgc.dispose();} 
    return;} /* update */ 

  /* Producer for paint() */ 
  synchronized public static void flipDisplay (Tower tower) {
    HanoiDraw.tower = tower; 
    drawFrame.repaint(); /* queue paint() and delay for user */ 
    try {Thread.sleep(HanoiSimul.lineDelay.get());} 
    catch (InterruptedException e) {}; 
    return;} /* flipDisplay() */ 

  public HanoiDraw(String title) {super(title); 
    drawFrame = this; /* display window */ 
    addWindowListener(new WindowAdapter() {// exit via window frame 
      public void windowClosing(WindowEvent evt) {System.exit(0);}}); 
    setSize(cols,rows); 
    setLocation(colOffset,rowOffset); /* size and offset */ 
    setVisible(true);
    } /* HanoiDraw() */ 

  } /* HanoiDraw */ 

// Master applet/application interface setting parameters, invoking HanoiDraw(). 
public class HanoiVar extends Applet {

  // Title and version number --- to be updated! 
  public String getAppletInfo() {
    return "Hanoi Variations 15";} 

  /* fetch values of Applet parameters, as set optionally in HTML source */ 
  void appletParams() {
    String param;
    param = getParameter ("Variation"); 
    if (param != null) /*then*/ 
      HanoiSimul.var = Integer.parseInt(param); // supply index+1 
    param = getParameter ("Discs"); 
    if (param != null) /*then*/ 
      HanoiSimul.numDiscs.set(Integer.parseInt(param)); 
    param = getParameter ("Pins"); 
    if (param != null) /*then*/ 
      HanoiSimul.numPins.set(Integer.parseInt(param)); 
    } /* appletParams() */ 

  // Called by HTML applet after constructor() called implicitly 
  public void init() {appletParams();} /* init() */ 

  // Called by CLI application before constructor() called explicitly 
  public static void main (String args[]) {new HanoiVar();} /* main() */ 
  public static void main () {new HanoiVar();} /* else environment failure? */ 

  public HanoiVar() {
    new HanoiSimul(); 
    new HanoiDraw(getAppletInfo());
    new HanoiProp(); // call last; do not add to HanoiDraw() 
    HanoiSimul.simulThread.start(); /* execute after all constructors done */ 
    } /* HanoiVar() */ 

  } /* HanoiVar */ 

// Use wait(), notify() to clean up logic of run() and button flags 
//   trial version of run() generates "Current thread not owner" exceptions ?? 
//   Deitel chap. 15 mentions "locks" --- exec in synchronized method ? 
//   Apparently can only call wait() etc inside synchronised block --- 
/* 
I think your problem is that you can't call wait() or notify() 
unless you are in a synchronized block, which you aren't. 
If you just want a delay, then use Thread.sleep(); 
Or use java.util.Timer + TimerTask 

If you really want to use wait and notify, 
then create youself a lock Object, so something like: 

Object lock = new Object(); 

update(){
          .....
        synchronized(lock){
                lock.wait(500);
         }
}

That way you won't be trying to get a lock on the context/pdu 
or any other stack Objects, which will have their own locks 
in use some of the time. 

ejfried
To call wait() or notify() on an object, the calling thread has to hold the monitor on that object. To be holding the monitor, the calling thread has to be in a synchronized method of that object, or in a synchronized block which is synchronized on that object. Being synchronized on some other object doesn't help.
*/ 

// Couldn't get keyboard input to work --- see Deitel p600 re keyListener. 
// Use Swing / Java2D libraries for graphics? no transparency in Deitel ed.3! 
// Java 1.1 awt --- all sorts of nasties go away when double-buffer! 
// Do we need to override destroy() etc --- e.g. for applets? 
//   Halt all threads on iconification; restart on de-iconification?  
// Netscape: caches applet class (not HTML source) and won't auto reload it !! 
// Compiling HanoiVar.java before HanoiLib.java sprays warnings !! 
// Unix main() CLI interface c.f. geometry/conics.java 
// Instantiate HanoiDefn class dynamically when(ever) selected from menu !! 
// If instantiate Counters, Toggles etc. in HanoiSimul, HanoiDraw --- 
//   have to instantiate HanoiProp first: then layout wrecked (why?) ?? 
//   If not, have to check all modules instantiated before execute any thread!! 
// Intermittant non-fatal initial error message (Apple and PC): 
//   2007-07-04 15:15:23.149 java[5730] _initWithWindowNumber: 
//   error creating graphics ctxt object for ctxt:43243, window:-2021289069 

// Drawing moves: in manual mode, removes disc when pin X input; 
//   maybe hover above old, new peg (both modes); 
//   or redraw (grey?) before move, after move, then in new colour; 
//   or move cont. from old to new without deleting or redrawing rest;  
//   or re-colour old, new pin (when MousePressed during user-move). 
//   Maybe use Disc.alti to float disc above pin; more elaborately, 
//     have 2-part pin and slide disc up it ... 
// 2-D platform for pins: allow x,y displacement, fix isometric perspective ... 
// Maybe allow user to colour bases, initial config, select tranX method? 
// Discs currently coloured from top down --- should be bottom up! 
// Rotate so rear pins partially hidden [?] 
// [Won't redraw when display stopped: can't since dispBuff is out-of-date!] 
// [tran() runs up to the first move even with run toggle off, but only 
//   the first time after it's turned off: 
//   can't prevent this unless delay initial paint()] 
// Sliders for delay (etc) instead of textfields !! 
//   or [Label][<][Value][>] using (output only) buttons; 
//   or scrollbars with reciprocal scale and in/decrement arrows; 
//   timers to rapidly increment value and decide when finalised. 
// GUI: If use Textfields, fix awful font and cursor (PC)! 
//   Later version Choice was cut off at 8 items on PC [cascaded menus failed]; 
//   Property button colours did not work on Macintosh --- both OK via J-tools. 
//   Repeated menu selection of same item did not work on PC. 
// Right-click for properties scrapped: click unambiguous unless Manual mode! 
// Replacing disc on same pin permitted! 

// Next move algorithms from arbitrary current position: see Reversi.txt 
//   Manual/ Single/ Auto/ Error radio button with delay slider maybe. 
// User set initial and final config., clicking on disc to transfer stack above? 
//   Detect disc as highest ellipse containing (x,y) of mouse click. 
//   Easier alternative: input via textfield pin numbers of discs in decr. order, 
//   chopped to n or extended by stacking smaller discs on last chosen pin. 
//   Echo current position in this field: problems if m,n > 10 say? 
//   Need buttons to pre-select initial / final input; display to confirm? 
// Highlight discs / pins selected for move on button press; move on 2nd release. 
// Develop faster methods via bottom-up non-Frame approach; 
//   Simplify by removing initial cases out of top-down DDDE etc; 
//   Does no iterative method for BABA or BAAB exist? 
// Seek mode: Dijkstra search for optimum path from current state to state 
//   satisfying fin(). 
// Trace listing move "to" disc size/col misleading [use disc.pin.below] ?? 
// Increase or Repeat just restarts after halt for error ? 
// Implement base colours in check() methods ?? 
//   Maybe try shading bases (and/or pins?) --- see Turtle, Cyclic, etc. 
// Retain history in Manual mode, and allow move reversal; 
//   Booby prize instead of Success if previous uncorrected invalid moves ?? 

// Re-organise, isolating user interface, display, scheduling, algorithm --- 
//     e.g. Fix Manual to ignore Stop/Run ?? 
//   Fix status = Waiting not Manual after re-initialise with mode = Manual, 
//     nor Running after mode := Manual, or Stop Run ?? 
//   Isolate class Counter from HanoiSimul.initFlag ?? 
//   Introduce state variable to rationalise flags and reflect status: 
//     Reset/Cont, Run/Wait, Manual/Auto, Next/Invalid, Success/Failure;  
//     also Reset mode = Stop/Repeat/Increase ?? 
//   Combine flags: N/I with R/C = Reset denotes Success/Failure?  

// Compile class files under Java 1.1(.4) for browser compatibility !! 
// Refuses to start or to exit under Explorer or Netscape 4 on WFL's PC ??  
//   [exits when kill browser] 
//   under Netscape on WFL's PC, property window duplicated. 
//   under Explorer on MM's PC, runs but won't exit, even if kill Browser ??  
//   under Netscape on WFL's Ultra, 
//    NoClassDefFoundError: java.awt.event.WindowAdaptor ?? 
//      --- maybe Netscape has JDK1.0? Try Object not Applet in html file ... 
//    (or security violation; or browser dies; or ... ) ?? 
// Applet version with Preferences controls along top of canvas, 
//   set via switch in init() ? No resizing of canvas possible ! 
// 100msec delay & full screen: display & all window interaction 
//   eventually freezes on Mac and on Ultra --- memory leak maybe BUG ?? 
// Environment (which?) compiles then "cannot find main" 
//   maybe looking for main() overloaded without arguments --- provided! 

// Stockmeyer's "Variations on the Four-Post Tower of Hanoi Puzzle" 
//   discusses m = 4-pin Cyclic, Adjacent, "Star" Hanoi puzzles. 
// Domino 4-pin; 





