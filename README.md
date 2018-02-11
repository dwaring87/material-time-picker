# Material Design Time Picker

![screenshot](https://raw.githubusercontent.com/dwaring87/material-time-picker/master/screenshot.png)

This project includes the CSS, HTML and JS required to 
create a Material Design inspired Time Picker. 

## Dependencies

This project works best when included with the [Bootstrap Material Design](https://fezvrasta.github.io/bootstrap-material-design/) 
UI toolkit (which in turn requires [jQuery](https://jquery.com/)).

## Usage

The required files include:

- `timepicker.css` - The Time Picker Style
- `timepicker.js` - The TimePicker() function
- `timepicker.html` - The Time Picker HTML, which should be included at the bottom of any page that 
will use the Time Picker.

### Initialization

When initializing the Time Picker, you can provide the hex color code of the primary accent color of 
the Time Picker.  This color should be dark enough where white text can be clearly displayed in front 
of it.

```javascript
var tp = TimePicker("#0D47A1");
```

### Display

The Time Picker can be displayed using the `show(time, callback)` function, where the `time` argument 
is the currently selected time (as a JS Date object) and `callback` is a function that accepts the newly 
selected time (as a JS Date object)

```javascript
let time = new Date();
tp.show(time, function(selected) {
  console.log("Selected Time:");
  console.log(selected);
});
```

The `hide` function can be used to hide the Time Picker, if needed.

```javascript
tp.hide();
```

## Example

The `example.html` file contains a fully working example of the Time Picker.
