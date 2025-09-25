# Project TAM

This project utilizes Gulp to automate various tasks including compiling SCSS to CSS, processing HTML files, minifying CSS and JavaScript, concatenating vendor JavaScript files, and watching for changes. Below is a breakdown of the main functionalities and how to use them.

## Setup

Before running any tasks, ensure you have latest Node.js and npm installed on your machine. Then, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install all the necessary dependencies.

### Folder Structure

```
 Scaffold-2024/
├── dist/
│   ├── css/
│   │   ├── main.css
│   │   └── vendor.css
│   ├── images/
│   │   ├── banner/
│   │   │   └── banner.webp
│   │   └── fav/
│   │       └── fav.png
│   ├── js/
│   │   ├── components/
│   │   │   ├── accordion.js
│   │   │   ├── formHandler.js
│   │   │   ├── select.js
│   │   │   ├── slider.js
│   │   │   └── tab.js
│   │   ├── variables/
│   │   │   └── variables.js
│   │   ├── vendors/
│   │   │   └── swiper.js
│   │   ├── main.js
│   │   └── inner.js
│   ├── index.html
│   └── template.html
├── node_modules/
├── src/
│   ├── fonts/
│   │   └── (all font files, e.g., .ttf, .eot)
│   ├── images/
│   │   ├── fav/
│   │   │   └── fav.png
│   │   ├── banner/
│   │   │   ├── banner.webp
│   │   │   └── innerbanner.webp
│   ├── js/
│   │   ├── components/
│   │   │   ├── accordion.js
│   │   │   ├── formHandler.js
│   │   │   ├── select.js
│   │   │   ├── slider.js
│   │   │   └── tab.js
│   │   ├── variables/
│   │   │   └── variables.js
│   │   ├── vendors/
│   │   │   └── swiper.js
│   │   ├── main.js
│   │   └── inner.js
│   ├── scss/
│   │   ├── abstract/
│   │   │   ├── mixin.scss
│   │   │   ├── placeholder.scss
│   │   │   ├── root.scss
│   │   │   └── variable.scss
│   │   ├── base/
│   │   │   ├── base.scss
│   │   │   ├── button.scss
│   │   │   ├── extend.scss
│   │   │   ├── form.scss
│   │   │   ├── reset.scss
│   │   │   └── typography.scss
│   │   ├── components/
│   │   │   ├── banner/
│   │   │   │   └── banner-default.scss
│   │   │   ├── cards/
│   │   │   │   └── card-default.scss
│   │   │   ├── modules/
│   │   │   │   ├── accordion.scss
│   │   │   │   └── tab.scss
│   │   │   ├── sliders/
│   │   │   │   └── col-one-slider.scss
│   │   ├── layout/
│   │   │   ├── footer.scss
│   │   │   ├── grid.scss
│   │   │   ├── header.scss
│   │   │   └── sidebar.scss
│   │   ├── pages/
│   │   │   ├── home.scss
│   │   │   └── contact.scss
│   │   ├── themes/
│   │   │   ├── dark_theme.scss
│   │   │   └── light.scss
│   │   ├── vendors/
│   │   │   └── swiper.scss
│   │   ├── main.scss
│   │   └── vendor.scss
│   ├── template/
│   │   ├── components/
│   │   │   ├── banners/
│   │   │   │   └── banner_default.html
│   │   │   ├── cards/
│   │   │   │   └── card_default.html
│   │   │   ├── modules/
│   │   │   │   ├── accordion.html
│   │   │   │   └── tab.html
│   │   │   ├── sliders/
│   │   │   │   ├── col_one_slider.html
│   │   │   │   └── col_two_slider.html
│   │   ├── layout/
│   │   │   ├── footer/
│   │   │   │   ├── footer.html
│   │   │   │   └── site-footer.html
│   │   │   ├── grid/
│   │   │   │   └── col-one.html
│   │   │   ├── header/
│   │   │   │   ├── header.html
│   │   │   │   └── site-header.html
│   │   │   └── sidebar/
│   │   │       └── widget.html
│   │   ├── index.html
│   │   └── template.html
├── gulpfile.js
├── package-lock.json
└── README.md

```

## Usage

### 1. Compiling SCSS to CSS

This task compiles SCSS files from the src/scss directory to CSS and saves the output in the dist/css directory.
To compile SCSS files to CSS, use the following command:

```gulp
gulp compileSCSS
```

### 2. Processing HTML Files

This task processes HTML files from the src/templates directory, including file includes, and saves the processed files in the dist directory.

```gulp
gulp processHTML
```

### 3. Minifying CSS

This task compiles SCSS to CSS, adds vendor prefixes using Autoprefixer, minifies the CSS, and saves the minified files in the dist/css directory.
To minify CSS files, execute:

```gulp
 gulp minifyCSS
```

### 4. Minifying JavaScript

This task minifies JavaScript files from the src/js directory and saves the minified files in the dist/js directory.
To minify JavaScript files, use:

```gulp
 gulp minifyJS
```

### 5. Concatenating Vendor JavaScript

This task concatenates JavaScript files from the src/js/vendors directory into a single file named core.js, minifies it, and saves it in the dist/js/vendors directory.
To concatenate vendor JavaScript files into one file, run:

```gulp
 gulp concatVendorJS
```

###

### 6. Watching for Changes

To watch for changes in SCSS, HTML, and JavaScript files and automatically perform the corresponding tasks, use:

```gulp
 gulp watch
```

### 7. Building the Project

To build the entire project, including compiling SCSS, processing HTML, minifying CSS and JavaScript, concatenating vendor JavaScript, and cleaning up unnecessary files, run:

```gulp
 gulp build
```

### 8. Default Task

The default task runs the build task series followed by the watch task. To run the default task, simply use:

```gulp
 gulp
```

### Notes

This README provides an overview of the available tasks and how to use them. For further customization or to extend the functionality, refer to the gulpfile.js file in the project directory. If you encounter any issues or have questions, feel free to reach out to the project maintainers. Happy coding!

### css writing order

When writing CSS, organizing properties in a consistent order can improve readability and maintainability. There are several conventions for ordering CSS properties, but one common approach is the outside-in method. This method groups related properties and orders them from the outside of an element (layout) inward (appearance).

### 1. Positioning

position
top, right, bottom, left
z-index

### 2. Box Model

display
flex, grid (and related properties like flex-direction, grid-template-columns)
float, clear
width, height
padding
margin
border
box-sizing

### 3. Typography

font-family
font-size
font-weight
font-style
line-height
text-align
text-decoration
letter-spacing
color

### 4. Visual

background (and related properties like background-color, background-image)
border-radius
box-shadow
opacity

### . Miscellaneous

cursor
overflow
visibility
transition
transform
animation

```
.element {
    /* Positioning */
    position: relative;
    top: 10px;
    z-index: 10;

    /* Box Model */
    display: flex;
    width: 100%;
    padding: 10px;
    margin: 20px 0;
    border: 1px solid #ccc;
    box-sizing: border-box;

    /* Typography */
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
    text-align: center;
    color: #333;

    /* Visual */
    background-color: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    /* Miscellaneous */
    cursor: pointer;
    transition: background-color 0.3s ease;
}
```
