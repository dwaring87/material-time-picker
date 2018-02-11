
// ================================================== //
//     TIME PICKER
// ================================================== //


let TimePicker = function(PRIMARY_COLOR="#00897b") {

  /* Angles used to calculate number positions */
  let valToDeg = [];
  valToDeg[1] = 60;
  valToDeg[2] = 30;
  valToDeg[3] = 0;
  valToDeg[4] = 30;
  valToDeg[5] = 60;
  valToDeg[6] = 90;
  valToDeg[7] = 60;
  valToDeg[8] = 30;
  valToDeg[9] = 0;
  valToDeg[10] = 30;
  valToDeg[11] = 60;
  valToDeg[12] = 90;

  /* Angles used to rotate the clock hour hand */
  let valToRotate = [];
  valToRotate[1] = 30;
  valToRotate[2] = 60;
  valToRotate[3] = 90;
  valToRotate[4] = 120;
  valToRotate[5] = 150;
  valToRotate[6] = 180;
  valToRotate[7] = 210;
  valToRotate[8] = 240;
  valToRotate[9] = 270;
  valToRotate[10] = 300;
  valToRotate[11] = 330;
  valToRotate[12] = 360;


  /* CLOCK RADIUS */
  let radius = 125 - 20;

  /* Flag set to true when the button row is hidden */
  let TP_NO_BUTTONS = false;


  /**
   * Display the Time Picker
   * @param {Date} datetime The initial Time
   * @param {function} callback Callback function
   * @param {Date} callback.date Date representing the selected Time
   */
  function show(datetime, callback) {
    $("#time-picker").animate(
      {bottom: "10px"},
      500,
      _setup(datetime, callback)
    );
  }

  /**
   * Hide the Time Picker
   */
  function hide() {
    _hideClockFace();
    $("#time-picker").animate({
      bottom: "-900px",
    }, 500);
  }



  /**
   * Initialize the clock and start the display of hours
   * @param {Date} datetime The initial Time
   * @param {function} callback Selected Time callback function
   * @private
   */
  function _setup(datetime, callback) {

    // Hide Header on small screens
    if ( $(window).height() < 600 ) {
      $("#time-picker-header").hide();
    }
    else {
      $("#time-picker-header").show();
    }

    // Hide Button row on even smaller screens
    if ( $(window).height() < 400 ) {
      TP_NO_BUTTONS = true;
      $("#time-picker-buttons").hide();
      $("#time-picker-am-button").css({
        "position": "absolute",
        "left": "5px",
        "bottom": "5px"
      });
      $("#time-picker-pm-button").css({
        "position": "absolute",
        "right": "5px",
        "bottom": "5px"
      });
      $("#time-picker-alt-ok-button").show();
      $("#time-picker-alt-ok-button").css({
        color: PRIMARY_COLOR
      });
    }
    else {
      TP_NO_BUTTONS = false;
      $("#time-picker-buttons").show();
      $("#time-picker-alt-ok-button").hide();
      $("#time-picker-am-button").css({
        "position": "absolute",
        "left": "5px",
        "bottom": "50px"
      });
      $("#time-picker-pm-button").css({
        "position": "absolute",
        "right": "5px",
        "bottom": "50px"
      });
    }

    // Start Clock with Hours
    _setClockFace("hours", datetime, callback);

  }


  /**
   * DISPLAY THE CLOCK FACE
   * @param {string} display hours or mins
   * @param {Date} selected The selected Time
   * @param {function} callback Selected Time callback function
   */
  function _setClockFace(display, selected, callback) {

    // Set factor
    let factor = 1;
    if ( display === "mins" ) {
      factor = 5;
    }

    // Get Time Components
    let comp = _parseTime(selected);



    // Set background color of header
    $(".time-picker-bg").css({
      "background-color": PRIMARY_COLOR,
    });

    // Set Header Time
    $("#time-picker-hour").html(comp.hour + ":");
    $("#time-picker-mins").html(comp.mins);
    $("#time-picker-ampm").html(comp.ampm);
    if ( display === "hours" ) {
      $("#time-picker-hour").fadeTo(0, 0.9);
      $("#time-picker-mins").fadeTo(0, 0.6);
    }
    else if ( display === "mins" ) {
      $("#time-picker-hour").fadeTo(0, 0.6);
      $("#time-picker-mins").fadeTo(0, 0.9);
    }
    $("#time-picker-ampm").fadeTo(0, 0.6);



    // SET CLOCK FACE NUMBERS //
    $(".time-picker-hour").each(function() {
      let val = $(this).attr("data-value");
      val = val * factor;
      val = "" + val;
      if ( val === "60" ) {
        val = "0";
      }
      if ( factor > 1 ) {
        if ( val.length === 1 ) {
          val = "0" + val;
        }
      }

      // Find selected hour
      if ( display === "hours" ) {
        if ( parseInt(val) === parseInt(comp.hour) ) {
          $(this).addClass("selected");
        }
        else {
          $(this).removeClass("selected");
        }
      }
      else if ( display === "mins" ) {
        if ( parseInt(val) === parseInt(comp.mins) ) {
          $(this).addClass("selected");
        }
        else {
          $(this).removeClass("selected");
        }
      }

      // Set Number Value
      $(this).html(val);

      // Set Number Click Listener
      $(this).off('click').on('click', function() {
        _numberSelected(display, val, selected, callback);
      });

    });


    // Move each value
    $(".time-picker-hour").each(function() {
      let val = $(this).attr("data-value");
      let deg = valToDeg[val];
      let x = radius * Math.cos(_getRad(deg));
      let y = radius * Math.sin(_getRad(deg));

      let xd = 1;
      let yd = -1;
      if ( val >= 6 ) {
        xd = -1;
      }
      if ( val > 3 && val < 9 ) {
        yd = 1;
      }

      // Original coordinates to offset from
      let left = 111;
      let top = 112;

      $(this).css({
        "position": "absolute",
        "left": (left + xd * x) + "px",
        "top": (top + yd * y) + "px"
      });

      $(this).animate({
        opacity: 0.9
      }, 0);
    });

    // Set Clock Hand Position
    let selectedVal = $(".time-picker-hour.selected").attr("data-value");
    $("#time-picker-hour-hand").addClass("rotate" + valToRotate[selectedVal]);
    $("#time-picker-hour-hand").delay(250).fadeTo(250, 0.4);

    // Set style for numbers
    $(".time-picker-hour").hover(function(e) {
      $(this).css({
        "background-color": e.type === "mouseenter" ? PRIMARY_COLOR : "transparent",
        "color": e.type === "mouseenter" ? "white" : "black",
        "opacity": e.type === "mouseenter" ? 0.5 : 1.0,
      });
      $(".time-picker-hour.selected").css({
        "background-color": PRIMARY_COLOR,
        "color": "white"
      });
    });
    $(".time-picker-hour.selected").css({
      "background-color": PRIMARY_COLOR,
      "color": "white"
    });


    // Set the AMPM Buttons
    _setAMPMButtons(comp.ampm);

    // Set Button Text Color
    $("#time-picker-reset-button").css("color", PRIMARY_COLOR);
    $("#time-picker-cancel-button").css("color", PRIMARY_COLOR);
    $("#time-picker-ok-button").css("color", PRIMARY_COLOR);


    // Set click listeners
    $("#time-picker-hour").off('click').on('click', function() {
      _hideClockFace();
      _setClockFace("hours", selected, callback);
    });
    $("#time-picker-mins").off('click').on('click', function() {
      _hideClockFace();
      _setClockFace("mins", selected, callback);
    });
    $("#time-picker-am-button").off('click').on('click', function() {
      if ( selected.getHours() > 11 ) {
        selected.setHours(selected.getHours() - 12);
      }
      _hideClockFace();
      _setClockFace(display, selected, callback);
    });
    $("#time-picker-pm-button").off('click').on('click', function() {
      if ( selected.getHours() < 12 ) {
        selected.setHours(selected.getHours() + 12);
      }
      _hideClockFace();
      _setClockFace(display, selected, callback);
    });
    $("#time-picker-cancel-button").off('click').on('click', function() {
      _hideClockFace();
      hide();
    });
    $("#time-picker-ok-button").off('click').on('click', function() {
      hide();
      return callback(selected);
    });
    $("#time-picker-reset-button").off('click').on('click', function() {
      _hideClockFace();
      _setup(new Date(), callback);
    });
    $("#time-picker-alt-ok-button").off('click').on('click', function() {
      hide();
      return callback(selected);
    });
  }


  /**
   * Callback function for a selected clock face number
   * @param {string} display hours or mins
   * @param {number|string} val Value of number selected
   * @param {Date} selected The selected DateTime
   * @param {function} callback Selected Time callback function
   * @private
   */
  function _numberSelected(display, val, selected, callback) {
    console.log("Selected number " + val + " from " + display);

    if ( display === "hours" ) {
      if ( selected.getHours() > 12 ) {
        selected.setHours(parseInt(val) + 12);
      }
      else {
        selected.setHours(parseInt(val));
      }
    }
    else if ( display === "mins" ) {
      selected.setMinutes(parseInt(val));
    }

    _hideClockFace();
    _setClockFace("mins", selected, callback);
  }



  /**
   * Hide the Clock Face and Reset the Styles
   * @private
   */
  function _hideClockFace() {
    // Reset clock hand
    $("#time-picker-hour-hand").fadeTo(0, 0.0);
    for ( let i = 0; i <= 360; i = i + 30 ) {
      $("#time-picker-hour-hand").removeClass("rotate" + i);
    }

    // Reset Header
    $("#time-picker-hour").fadeTo(0, 0.4);
    $("#time-picker-mins").fadeTo(0, 0.4);
    $("#time-picker-ampm").fadeTo(0, 0.4);

    // Move each value
    $(".time-picker-hour").each(function() {
      $(this).removeClass("selected");
      $(this).css({
        "background-color": "transparent",
        "color": "black"
      });
      $(this).animate({
        opacity: 0.4
      }, 0);
    });
  }



  /**
   * Set the selected State and Style of the AM/PM Buttons
   * @param {string} ampm AM or PM
   * @private
   */
  function _setAMPMButtons(ampm) {

    // Set the header value
    $("#time-picker-ampm").html(ampm);

    // AM
    if ( ampm === "AM" ) {
      $("#time-picker-am-button").css({
        "background-color": PRIMARY_COLOR,
        "color": "white"
      });
      $("#time-picker-pm-button").css({
        "background-color": "#e3e6e9",
        "color": "black"
      });

      $("#time-picker-pm-button").hover(function(e) {
        $(this).css({
          "background-color": e.type === "mouseenter" ? PRIMARY_COLOR : "#e3e6e9",
          "color": e.type === "mouseenter" ? "white" : "black",
          "opacity": e.type === "mouseenter" ? 0.5 : 1.0
        });
      });
      $("#time-picker-am-button").hover(function() {
        $(this).css({
          "background-color": PRIMARY_COLOR,
          "color": "white",
          "opacity": 1.0
        });
      });

    }

    // PM
    else if ( ampm === "PM" ) {
      $("#time-picker-pm-button").css({
        "background-color": PRIMARY_COLOR,
        "color": "white"
      });
      $("#time-picker-am-button").css({
        "background-color": "#e3e6e9",
        "color": "black"
      });

      $("#time-picker-am-button").hover(function(e) {
        $(this).css({
          "background-color": e.type === "mouseenter" ? PRIMARY_COLOR : "#e3e6e9",
          "color": e.type === "mouseenter" ? "white" : "black",
          "opacity": e.type === "mouseenter" ? 0.5 : 1.0
        });
      });
      $("#time-picker-pm-button").hover(function() {
        $(this).css({
          "background-color": PRIMARY_COLOR,
          "color": "white",
          "opacity": 1.0
        });
      });
    }

  }



  /**
   * Parse the Date/Time into hour, mins and ampm components
   * @param {Date} datetime The JS Date to parse into time components
   * @returns {{hour: number|string, mins: number|string, ampm: string}}
   * @private
   */
  function _parseTime(datetime) {
    let hour = datetime.getHours();
    let mins = datetime.getMinutes();
    let ampm = "";

    // Get the selected hours and mins
    if ( mins % 5 !== 0 ) {
      mins = mins + (5 - (mins % 5));
    }
    if ( mins === 60 ) {
      mins = 0;
      let d = new Date(datetime);
      d.setTime(d.getTime() + (60 * 60 * 1000));
      hour = d.getHours();
    }
    if ( mins < 10 ) {
      mins = "0" + mins;
    }

    if ( hour > 11 ) {
      ampm = "PM";
    }
    else {
      ampm = "AM";
    }

    if ( hour > 12 ) {
      hour = hour - 12;
    }
    if ( hour === 0 ) {
      hour = 12;
      ampm = "AM";
    }

    // Return the Components
    return {
      hour: hour,
      mins: mins,
      ampm: ampm
    }
  }


  /**
   * Convert Degrees to Radians
   * @param deg Degrees
   * @returns {number} Radians
   * @private
   */
  function _getRad(deg) {
    return deg * Math.PI / 180;
  }




  // Return show and hide functions
  return {
    show: show,
    hide: hide
  }

};