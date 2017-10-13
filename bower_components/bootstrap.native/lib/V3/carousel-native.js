
/* Native Javascript for Bootstrap 3 | Carousel
----------------------------------------------*/

// CAROUSEL DEFINITION
// ===================
var Carousel = function( element, options ) {

  // initialization element
  element = queryElement( element );

  // set options
  options = options || {};

  // DATA API
  var intervalData = element[getAttribute](dataInterval) === 'false' ? false : parseInt(element[getAttribute](dataInterval)) || 5000, // bootstrap carousel default interval
      pauseData = element[getAttribute](dataPause) === hoverEvent || false,
      keyboardData = element[getAttribute](dataKeyboard) === 'true' || false,
    
      // strings
      component = 'carousel',
      paused = 'paused',
      direction = 'direction',
      dataSlideTo = 'data-slide-to'; 

  this[keyboard] = options[keyboard] === true || keyboardData;
  this[pause] = (options[pause] === hoverEvent || pauseData) ? hoverEvent : false; // false / hover

  if ( !( options[interval] || intervalData ) ) { // determine slide interval
    this[interval] = false;
  } else {
    this[interval] = parseInt(options[interval]) || intervalData; // default slide interval
  }

  // bind, event targets
  var self = this, index = element.index = 0, timer = element.timer = 0, 
    isSliding = false, // isSliding prevents click event handlers when animation is running
    slides = getElementsByClassName(element,'item'), total = slides[length],
    slideDirection = this[direction] = left,
    controls = getElementsByClassName(element,component+'-control'),
    leftArrow = controls[0], rightArrow = controls[1],
    indicator = queryElement( '.'+component+'-indicators', element ),
    indicators = indicator && indicator[getElementsByTagName]( "LI" ) || [];

  // handlers
  var pauseHandler = function () {
      if ( self[interval] !==false && !hasClass(element,paused) ) {
        addClass(element,paused);
        !isSliding && clearInterval( timer );
      }
    },
    resumeHandler = function() {
      if ( self[interval] !== false && hasClass(element,paused) ) {
        removeClass(element,paused);
        !isSliding && clearInterval( timer );
        !isSliding && self.cycle();
      }
    },
    indicatorHandler = function(e) {
      e.preventDefault();
      if (isSliding) return;

      var eventTarget = e[target], activeIndicator = self.getActiveIndex(); // event target | the current active item

      if ( eventTarget && !hasClass(eventTarget,active) && eventTarget[getAttribute](dataSlideTo) ) {
        index = parseInt( eventTarget[getAttribute](dataSlideTo), 10 );
      } else { return false; }

      self.slideTo( index ); //Do the slide
    },
    controlsHandler = function (e) {
      e.preventDefault();
      if (isSliding) return;

      var eventTarget = e.currentTarget || e.srcElement;

      if ( eventTarget === rightArrow ) {
        index++;
      } else if ( eventTarget === leftArrow ) {
        index--;
      }

      self.slideTo( index ); //Do the slide
    },
    keyHandler = function (e) {
      if (isSliding) return;
      switch (e.which) {
        case 39:
          index++;
          break;
        case 37:
          index--;
          break;
        default: return;
      }
      self.slideTo( index ); //Do the slide
    },
    // private methods
    setActivePage = function( pageIndex ) { //indicators
      for ( var i = 0, icl = indicators[length]; i < icl; i++ ) {
        removeClass(indicators[i],active);
      }
      if (indicators[pageIndex]) addClass(indicators[pageIndex], active);
    };


  // public methods
  this.cycle = function() {
    timer = setInterval(function() {
      index++;
      self.slideTo( index );
    }, this[interval]);
  };
  this.slideTo = function( next ) {
    if (isSliding) return; // when controled via methods, make sure to check again    
    var activeItem = this.getActiveIndex(), // the current active
        orientation;
    
    // determine slideDirection first
    if  ( (activeItem < next ) || (activeItem === 0 && next === total -1 ) ) {
      slideDirection = self[direction] = left; // next
    } else if  ( (activeItem > next) || (activeItem === total - 1 && next === 0 ) ) {
      slideDirection = self[direction] = right; // prev
    }

    // find the right next index 
    if ( next < 0 ) { next = total - 1; } 
    else if ( next === total ){ next = 0; }

    // update index
    index = next;
    
    orientation = slideDirection === left ? 'next' : 'prev'; //determine type
    bootstrapCustomEvent.call(element, slideEvent, component, slides[next]); // here we go with the slide

    isSliding = true;
    clearInterval(timer);
    setActivePage( next );

    if ( supportTransitions && hasClass(element,'slide') ) {

      addClass(slides[next],orientation);
      slides[next][offsetWidth];
      addClass(slides[next],slideDirection);
      addClass(slides[activeItem],slideDirection);

      one(slides[activeItem], transitionEndEvent, function(e) {
        var timeout = e[target] !== slides[activeItem] ? e.elapsedTime*1000 : 0;
        setTimeout(function(){
          isSliding = false;

          addClass(slides[next],active);
          removeClass(slides[activeItem],active);

          removeClass(slides[next],orientation);
          removeClass(slides[next],slideDirection);
          removeClass(slides[activeItem],slideDirection);

          bootstrapCustomEvent.call(element, slidEvent, component, slides[next]);

          if ( self[interval] && !hasClass(element,paused) ) {
            self.cycle();
          }
        },timeout+100);
      });

    } else {
      addClass(slides[next],active);
      slides[next][offsetWidth];
      removeClass(slides[activeItem],active);
      setTimeout(function() {
        isSliding = false;
        if ( self[interval] && !hasClass(element,paused) ) {
          self.cycle();
        }
        bootstrapCustomEvent.call(element, slidEvent, component, slides[next]); // here we go with the slid event
      }, 100 );
    }
  };
  this.getActiveIndex = function () {
    return slides[indexOf](getElementsByClassName(element,'item active')[0]) || 0;
  };

  // init
  if ( !(stringCarousel in element ) ) { // prevent adding event handlers twice

    if ( this[pause] && this[interval] ) {
      on( element, mouseHover[0], pauseHandler );
      on( element, mouseHover[1], resumeHandler );
      on( element, 'touchstart', pauseHandler );
      on( element, 'touchend', resumeHandler );
    }
  
    rightArrow && on( rightArrow, clickEvent, controlsHandler );
    leftArrow && on( leftArrow, clickEvent, controlsHandler );
  
    indicator && on( indicator, clickEvent, indicatorHandler, false);
    this[keyboard] === true && on( globalObject, keydownEvent, keyHandler, false);

  }
  if (this.getActiveIndex()<0) {
    slides[length] && addClass(slides[0],active);
    indicators[length] && setActivePage(0);
  }

  if ( this[interval] ){ this.cycle(); }
  element[stringCarousel] = this;
};

// CAROUSEL DATA API
// =================
initializeDataAPI( stringCarousel, Carousel, doc[querySelectorAll]('['+dataRide+'="carousel"]') );

