
function p5PlayRebind(){
  (function (root, factory) {

  if (typeof define === 'function' && define.amd)
  define('p5.play', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
  factory(require('../p5'));
  else
  factory(root['p5']);
  }
  (this, function (p5) {
  /**
   * p5.play is a library for p5.js to facilitate the creation of games and gamelike
   * projects. 
   *
   * It provides a flexible Sprite class to manage visual objects in 2D space
   * and features such as animation support, basic collision detection 
   * and resolution, mouse and keyboard interactions, and a virtual camera.
   *  
   * p5.play is not a box2D-derived physics engine, it doesn't use events, and it's 
   * designed to be understood and possibly modified by intermediate programmers.
   *
   * See the examples folder for more info on how to use this library.
   * 
   * @module p5.play
   * @submodule p5.play
   * @for p5.play
   * @main
   */

  // =============================================================================
  //                         p5 additions
  // =============================================================================

  /** 
  * A Group containing all the sprites in the sketch.
  *
  * @property allSprites
  * @type {Group}
  */
  p5.prototype.allSprites = new Group();

  /**
     * A Sprite is the main building block of p5.play:
     * an element able to store images or animations with a set of
     * properties such as position and visibility.
     * A Sprite can have a collider that defines the active area to detect
     * collisions or overlappings with other sprites and mouse interactions.
     * 
     * @method createSprite
     * @param {Number} x Initial x coordinate
     * @param {Number} y Initial y coordinate
     * @param {Number} width Width of the placeholder rectangle and of the
     *                       collider until an image or new collider are set
     * @param {Number} height Height of the placeholder rectangle and of the
     *                       collider until an image or new collider are set
     * @return {Object} The new sprite instance
     */

  p5.prototype.createSprite = function(x, y, width, height) {
    var s = new Sprite(x, y, width, height);
    s.depth = allSprites.maxDepth()+1;
    allSprites.add(s);
    return s;
  }


  /**
     * Removes a Sprite from the sketch. 
     * The removed Sprite won't be drawn or updated anymore.
     * Equivalent to Sprite.remove()
     *
     * @method removeSprite
     * @param {Object} sprite Sprite to be removed
  */
  p5.prototype.removeSprite = function(sprite) {
    sprite.remove();
  }

  /** 
  * Updates all the sprites in the sketch (position, animation...)
  * it's called automatically at every draw().
  * It can be paused by passing a parameter true or false;
  * Note: it does not render the sprites.
  *
  * @method updateSprites
  * @param {Boolean} updating false to pause the update, true to resume 
  */
  p5.prototype.updateSprites = function(upd) {
    
    if(upd==false)
      spriteUpdate = false;
    if(upd==true)
      spriteUpdate = true;
    
    if(spriteUpdate)
    for(var i = 0; i<allSprites.size(); i++)
    {
      allSprites.get(i).update();
    }
  }

  p5.prototype.spriteUpdate = true;

  /** 
  * Returns all the sprites in the sketch as an array
  *
  * @method getSprites
  * @return {Array} Array of Sprites
  */
  p5.prototype.getSprites = function() {

    //draw everything
    if(arguments.length===0)
    {
      return allSprites.toArray();
    }
    else
    {
      var arr = [];
      //for every tag
      for(var j=0; j<arguments.length; j++)
      {
        for(var i = 0; i<allSprites.size(); i++)
        {
          if(allSprites.get(i).isTagged(arguments[j]))
            arr.push(allSprites.get(i));
        }
      }

      return arr;
    }

  }

  /** 
  * Displays a Group of sprites.
  * If no parameter is specified, draws all sprites in the
  * sketch.
  * The drawing order is determined by the Sprite property "depth"
  *
  * @methid drawSprites
  * @param {Group} [group] Group of Sprites to be displayed
  */
  p5.prototype.drawSprites = function(group) {

    //draw everything
    if(arguments.length===0)
    {
      //sort by depth
      allSprites.sort(function(a,b) { 
        return a.depth - b.depth;
      });

      for(var i = 0; i<allSprites.size(); i++)
      {
        allSprites.get(i).display();
      }
    }
    else if(arguments.length===1)
    {
      if(arguments[0] instanceof Array == false)
        throw("Error: with drawSprites you can only draw all sprites or a group");
      else
      {
        arguments[0].draw();
      }

    }
  }

  /** 
  * Displays a Sprite.
  * To be typically used in the main draw function.
  * 
  * @method drawSprite
  * @param {Sprite} sprite Sprite to be displayed
  */
  p5.prototype.drawSprite = function(sprite) {
    if(sprite!=null)
    sprite.display();
  }

  /** 
  * Loads an animation.
  * To be typically used in the preload() function of the sketch.
  * 
  * @method loadAnimation
  * @param {Sprite} sprite Sprite to be displayed
  */
  p5.prototype.loadAnimation = function() {
    return construct(Animation, arguments);
  }

  /** 
  * Displays an animation.
  * 
  * @method animation
  * @param {Animation} anim Animation to be displayed
  * @param {Number} x X coordinate
  * @param {Number} y Y coordinate
  *
  */
  p5.prototype.animation = function(anim, x, y) {
    anim.draw(x, y);
  }

  //variable to detect instant presses
  var keyStates = {};
  var mouseStates = {};
  var KEY_IS_UP = 0;
  var KEY_WENT_DOWN = 1;
  var KEY_IS_DOWN = 2;
  var KEY_WENT_UP = 3;


  /** 
  * Detects if a key was pressed during the last cycle.
  * It can be used to trigger events once, when a key is pressed or released.
  * Example: Super Mario jumping. 
  * 
  * @method keyWentDown
  * @param {Number|String} key Key code or character
  * @return {Boolean} True if the key was pressed
  */
  p5.prototype.keyWentDown = function(key) {
    var keyCode;
    
    if(typeof key == "string")
      keyCode = KEY[key.toUpperCase()];
    else
      keyCode = key;
    
    //if undefined start checking it
    if(keyStates[keyCode]==undefined)
    {
      if(keyIsDown(keyCode))
        keyStates[keyCode] = KEY_IS_DOWN;
      else
        keyStates[keyCode] = KEY_IS_UP;
    }

    return (keyStates[keyCode] == KEY_WENT_DOWN);
  }


  /** 
  * Detects if a key was released during the last cycle.
  * It can be used to trigger events once, when a key is pressed or released.
  * Example: Spaceship shooting. 
  * 
  * @method keyWentUp
  * @param {Number|String} key Key code or character
  * @return {Boolean} True if the key was released
  */
  p5.prototype.keyWentUp = function(key) {
    
    var keyCode;
    
    if(typeof key == "string")
      keyCode = KEY[key.toUpperCase()];
    else
      keyCode = key;
    
    //if undefined start checking it
    if(keyStates[keyCode]===undefined)
    {
      if(keyIsDown(key))
        keyStates[keyCode] = KEY_IS_DOWN;
      else
        keyStates[keyCode] = KEY_IS_UP;
    }

    return (keyStates[keyCode] == KEY_WENT_UP);
  }

  /** 
  * Detects if a key is currently pressed
  * Like p5 keyIsDown but accepts strings and codes
  * 
  * @method keyDown
  * @param {Number|String} key Key code or character
  * @return {Boolean} True if the key is down
  */
  p5.prototype.keyDown = function(key) {
    
    var keyCode;
    
    if(typeof key == "string")
      keyCode = KEY[key.toUpperCase()];
    else
      keyCode = key;
    
    //if undefined start checking it
    if(keyStates[keyCode]===undefined)
    {
      if(keyIsDown(key))
        keyStates[keyCode] = KEY_IS_DOWN;
      else
        keyStates[keyCode] = KEY_IS_UP;
    }

    return (keyStates[keyCode] == KEY_IS_DOWN);
  }

  /** 
  * Detects if a mouse button is currently down
  * Combines mouseIsPressed and mouseButton of p5
  *
  * @method mouseDown
  * @param {Number} button Mouse button constant LEFT, RIGHT or CENTER
  * @return {Boolean} True if the button is down
  */
  p5.prototype.mouseDown = function(buttonCode) {
    
    if(buttonCode == undefined)
      buttonCode = LEFT;
    else
      buttonCode = buttonCode;
    
    //undefined = not tracked yet, start tracking
    if(mouseStates[buttonCode]===undefined)
    {
    if(mouseIsPressed && mouseButton == buttonCode) 
      mouseStates[buttonCode] = KEY_IS_DOWN;
    else
      mouseStates[buttonCode] = KEY_IS_UP;
    } 

    return (mouseStates[buttonCode] == KEY_IS_DOWN);
  }

  /** 
  * Detects if a mouse button is currently up
  * Combines mouseIsPressed and mouseButton of p5 
  *
  * @method mouseUp
  * @param {Number} button Mouse button constant LEFT, RIGHT or CENTER
  * @return {Boolean} True if the button is up
  */
  p5.prototype.mouseUp = function(buttonCode) {
    
    if(buttonCode == undefined)
      buttonCode = LEFT;
    else
      buttonCode = buttonCode;
    
    //undefined = not tracked yet, start tracking
    if(mouseStates[buttonCode]===undefined)
    {
    if(mouseIsPressed && mouseButton == buttonCode) 
      mouseStates[buttonCode] = KEY_IS_DOWN;
    else
      mouseStates[buttonCode] = KEY_IS_UP;
    } 

    return (mouseStates[buttonCode] == KEY_IS_UP);
  }

  /** 
  * Detects if a mouse button was released during the last cycle.
  * It can be used to trigger events once, to be checked in the draw cycle
  *
  * @method mouseWentUp
  * @param {Number} button Mouse button constant LEFT, RIGHT or CENTER
  * @return {Boolean} True if the button was just released
  */
  p5.prototype.mouseWentUp = function(buttonCode) {
    
    if(buttonCode == undefined)
      buttonCode = LEFT;
    else
      buttonCode = buttonCode;
    
    //undefined = not tracked yet, start tracking
    if(mouseStates[buttonCode]===undefined)
    {
    if(mouseIsPressed && mouseButton == buttonCode) 
      mouseStates[buttonCode] = KEY_IS_DOWN;
    else
      mouseStates[buttonCode] = KEY_IS_UP;
    } 

    return (mouseStates[buttonCode] == KEY_WENT_UP);
  }


  /** 
  * Detects if a mouse button was pressed during the last cycle.
  * It can be used to trigger events once, to be checked in the draw cycle
  *
  * @method mouseWentDown
  * @param {Number} button Mouse button constant LEFT, RIGHT or CENTER
  * @return {Boolean} True if the button was just pressed
  */
  p5.prototype.mouseWentDown = function(buttonCode) {
    
    if(buttonCode == undefined)
      buttonCode = LEFT;
    else
      buttonCode = buttonCode;
    
    //undefined = not tracked yet, start tracking
    if(mouseStates[buttonCode]===undefined)
    {
    if(mouseIsPressed && mouseButton == buttonCode) 
      mouseStates[buttonCode] = KEY_IS_DOWN;
    else
      mouseStates[buttonCode] = KEY_IS_UP;
    } 

    return (mouseStates[buttonCode] == KEY_WENT_DOWN);
  }


  /** 
  * An object storing all useful keys for easy access
  * Key.tab = 9
  *
  * @property KEY
  * @type {Group}
  */

  p5.prototype.KEY = {
      'BACKSPACE': 8,
      'TAB': 9,
      'ENTER': 13,
      'SHIFT': 16,
      'CTRL': 17,
      'ALT': 18,
      'PAUSE': 19,
      'CAPS_LOCK': 20,
      'ESC': 27,
      'PAGE_UP': 33,
      'SPACE': 33,
      ' ': 33,
      'PAGE_DOWN': 34,
      'END': 35,
      'HOME': 36,
      'LEFT_ARROW': 37,
      'UP_ARROW': 38,
      'RIGHT_ARROW': 39,
      'DOWN_ARROW': 40,
      'INSERT': 45,
      'DELETE': 46,
      '0': 48,
      '1': 49,
      '2': 50,
      '3': 51,
      '4': 52,
      '5': 53,
      '6': 54,
      '7': 55,
      '8': 56,
      '9': 57,
      'A': 65,
      'B': 66,
      'C': 67,
      'D': 68,
      'E': 69,
      'F': 70,
      'G': 71,
      'H': 72,
      'I': 73,
      'J': 74,
      'K': 75,
      'L': 76,
      'M': 77,
      'N': 78,
      'O': 79,
      'P': 80,
      'Q': 81,
      'R': 82,
      'S': 83,
      'T': 84,
      'U': 85,
      'V': 86,
      'W': 87,
      'X': 88,
      'Y': 89,
      'Z': 90,
      '0NUMPAD': 96,
      '1NUMPAD': 97,
      '2NUMPAD': 98,
      '3NUMPAD': 99,
      '4NUMPAD': 100,
      '5NUMPAD': 101,
      '6NUMPAD': 102,
      '7NUMPAD': 103,
      '8NUMPAD': 104,
      '9NUMPAD': 105,
      'MULTIPLY': 106,
      'PLUS': 107,
      'MINUT': 109,
      'DOT': 110,
      'SLASH1': 111,
      'F1': 112,
      'F2': 113,
      'F3': 114,
      'F4': 115,
      'F5': 116,
      'F6': 117,
      'F7': 118,
      'F8': 119,
      'F9': 120,
      'F10': 121,
      'F11': 122,
      'F12': 123,
      'EQUAL': 187,
      'COMA': 188,
      'SLASH': 191,
      'BACKSLASH': 220
  }



  //pre draw: detect keyStates
  p5.prototype.readPresses = function() {
    for (var key in keyStates) {
      if(keyIsDown(key)) //if is down
      {
        if(keyStates[key] == KEY_IS_UP)//and was up
          keyStates[key] = KEY_WENT_DOWN;
        else 
          keyStates[key] = KEY_IS_DOWN; //now is simply down
      }
      else //if it's up
      {
        if(keyStates[key] == KEY_IS_DOWN)//and was up
          keyStates[key] = KEY_WENT_UP;
        else 
          keyStates[key] = KEY_IS_UP; //now is simply down
      }
    }
    
    //mouse
    for (var btn in mouseStates) {
      
      if(mouseIsPressed && mouseButton == btn) //if is down
      {
        if(mouseStates[btn] == KEY_IS_UP)//and was up
          mouseStates[btn] = KEY_WENT_DOWN;
        else 
          mouseStates[btn] = KEY_IS_DOWN; //now is simply down
      }
      else //if it's up
      {
        if(mouseStates[btn] == KEY_IS_DOWN)//and was up
          mouseStates[btn] = KEY_WENT_UP;
        else 
          mouseStates[btn] = KEY_IS_UP; //now is simply down
      }
    }
    
  }

  /** 
  * Turns the quadTree on or off.
  * A quadtree is a data structure used to optimize collision detection.
  * It can improve performance when there is a large number of Sprites to be
  * checked continuously for overlapping.
  * 
  * p5.play will create and update a quadtree automatically.
  * 
  * @method useQuadTree
  * @param {Boolean} use Pass true to enable, false to disable
  */
  p5.prototype.useQuadTree = function(use) {

    if(quadTree!=undefined)
    {
      if(use==undefined)
        return quadTree.active;
      else if(use)
        quadTree.active = true;
      else
        quadTree.active = false;
    }
    else
      return false;
  }

  //the actual quadTree
  p5.prototype.quadTree = new Quadtree({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }, 4);


  /*
  //framerate independent delta, doesn't really work
  p5.prototype.deltaTime = 1;

  var now = Date.now();
  var then = Date.now();
  var INTERVAL_60 = 0.0166666; //60 fps

  function updateDelta() {
  then = now;
  now = Date.now();
  deltaTime = ((now - then) / 1000)/INTERVAL_60; // seconds since last frame
  }
  */

  }));
}