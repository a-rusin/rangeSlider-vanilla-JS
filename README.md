# RangeSlider Vanilla JavaScript component
## _Tesk task for Neo Stack Technology company ([NST](https://www.neostk.com/))_
Hello!\
This is my test task for NST company: customizable range slider component (widget) for JavaScript with no external dependencies.\
The slider works as follows. To begin with, the user selects the year range (year switcher), then during the transition to the month section (month switcher), the slider remembers the current values of the minimum and maximum slider dipozone, and accepts them for the second slider (by month) for the minimum and maximum values, respectively. In the second slider, a more precise slider setting is selected (a more accurate date range). But there is a small bug if the user chooses a large range in the first slider, but the second slider will not be able to adequately reflect, since it is impossible to fit all the months into a small block size.

![Example gif](https://i.ibb.co/42xBff2/example-gif.gif)

## Features
- Vanilla JavaScript!
- No dependencies!
- Totally responsive!
- Control over minDate, maxDate and current date values!
- CSS Customization
- Simple API to interact with the value!
- Unlimited use of the slider on the page

## Tested in:
- Chrome 110

Should also work in all major browsers, but need to test.

## Example
![Example picture 1](https://i.ibb.co/PDnrMnY/example-img1.jpg)\
![Example picture 2](https://i.ibb.co/23w4S3T/example-img2.jpg)

An example of default initialization:

```html
<div class="range-slider"></div>
<script>
    new RangeSlider(".range-slider", {
        minDate: 2014,
        maxDate: 2021,
        minSelectedDate: '04-2015', 
        maxSelectedDate: '07-2016',
    });
</script>
```

## Installation
#### Simple download

Download the files and move them to a folder in your project. Attach the script anywhere on your page.\
For example:
```html
<head>
    <link rel="stylesheet" href="rangeSlider/range-slider.css">
</head>
<body>
    <div class="range-slider"></div>
    <script src="rangeSlider/range-slider.js"></script>
    <script>
        new RangeSlider(".range-slider", {
            minDate: 2014,
            maxDate: 2021,
            minSelectedDate: '04-2015', 
            maxSelectedDate: '07-2016',
        });
    </script>
</body>
```

## API

Two mandatory arguments must be placed in the constructor of the class instance: a CSS selector and an object with settings (options)

Example

```javascript
new RangeSlider(CSSSelector, options);
```

##### CSS Selector
Type: `string`\
Enter the CSS selector (tag, .class, #id, [attribute]) where you want to insert the RangeSlider

##### Options 
Type: `object`\
This is an object that accepts the following fields.

## Options
##### minDate 
Type: `number`\
Required field. Minimum value of the year

##### maxDate 
Type: `number`\
Required field. Maximum value of the year

##### minSelectedDate 
Type: `string`\
Required field. A mark for the minimum selected start date, as well as a mark for the minimum value of the tooltip. It must be entered in the format 'month-year'. **Important!** The month index starts from 0, where 0 is January, 11 is December. For example '01-2021' (you can remove the first zero) - February 2021

##### maxSelectedDate 
Type: `string`\
By analogy with minSelectedDate, only the maximum selected date. 

## CSS customization
This component has the ability to customize the slider for your needs. To do this, go to the `range-slider.css` file and change the CSS variable settings for yourself at the beginning of the styles.
- `--color-primary` - color of link (switchers), tooltips text
- `--color-secondary` - color of progress, slider thumb
- `--color-tooltip-bg` - background color tooltips
- `--color-ruler1` - color of rules text 1 (light)
- `--color-ruler2` - color of rules text 2 (dark)
- `--color-slider-bg` - background color slider

## License
MIT

**Free Software, Hell Yeah!**\
Alexandr Rusin, 2023 (c)
