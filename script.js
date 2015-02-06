/*

Copyright (c) 2014 Th&eacute;o Friberg

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// NOTE! -------------------------------------------------------------------------------------------
// This file is actually ran as the LUO KAAVIO -button is hit, so it actually contains runnable code
// at the end!
// -------------------------------------------------------------------------------------------------


    
    // This function draws the co-ordinate axes

    function axis(ctx){

        // Begin by saving the state of the context, as we will modify it

        ctx.save();

        // Styling

        ctx.strokeStyle = "black";

        // X-axis

        ctx.moveTo(20,365);
        ctx.lineTo(570,365);
        ctx.lineTo(560,375);
        ctx.moveTo(570,365);
        ctx.lineTo(560,355);

        // Stroke the X-axis

        ctx.stroke();

        // Restore saved state

        ctx.restore();

        // Begin by saving the state of the context, as we will modify it

        ctx.save();

        // Y-axis

        ctx.moveTo(30,375);
        ctx.lineTo(30,20);
        ctx.lineTo(20,30);
        ctx.moveTo(30,20);
        ctx.lineTo(40,30);

        // Stroke the Y-axis

        ctx.stroke();

        // Finish by restoring the state of the context

        ctx.restore();
    }

    // This function sanitizes a float entered as a string. It also informs the user.

    function sanitizeFloat(flt){

        // Regex-based removal of most unwanted characters

        var result = flt.replace(/&nbsp;/g, "").replace(/\u00A0/g, "").replace(",", ".").replace(/\s/g, "").replace("<br>", "");
        
        // If the formatted string matches this regex, it is a valid float, if it doesn't it isnt.

        var ok = /^[0-9]+([.,][0-9]+)?$/;

        // Does the string match the regex?

        if(ok.test(result)){

            // It does, good. Return it.

            result = parseFloat(result);
            return result;
        }else{

            // It isn't valid, inform the user.

            alert("Virhe kohdassa '"+flt+"'. Halutaan kokonais- tai desimaaliluku.");
        }
    }

    // This function sanitizes an interval. It also informs the user if the float makes no sense.

    function sanitizeInterval(interval){

        // Split the interval to two floats.

        var result = interval.split("-");

        // Separately treat both floats

        var a = sanitizeFloat(result[0]);
        var b = sanitizeFloat(result[1]);

        // Did you get meaniingful floats?

        if(b - a > 0){

            // Yes, return the the size of the interval.

            return b - a;
        }else{

            // No, inform the user. Unescape is used here to get finnish characters not covered by ascii.

            alert(unescape("Virhe kohdassa '"+interval+"'. Halutaan lukuv%E4li muodossa <pienempi luku>-<suurempi luku>."));
        }
    }

    // Main draw-code:
    //    - Draws axes
    //    - Draws the plot
    //    - Draws texts

    function plot(){

        // Get the canvas and other useful occult arts to start drawing.

        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');ctx.beginPath();

        // Values of the <div>s on the page, very aptly named

        var vals = [];

        // List of the divs of the page

        var divs = document.getElementsByTagName("div");

        // Regex to indicate a meaningful content of a div

        var clean = /^[0-9]+-[1-9]+[0-9]*$/;

        // Iterate over the divs

        for(var i = 1; i < divs.length/2; i++){
            
            // Make sure the div's contents make sense

            if(clean.test(divs[i*2-2].innerHTML)){

                // If so, push it to the list

                vals.push([sanitizeInterval(divs[i*2-2].innerHTML), sanitizeFloat(divs[i*2-1].innerHTML)]);
            }else{

                // Else, test if the sanitization-functions already caught the problem

                if(/^$/.test(divs[i*2-2].innerHTML)){

                    // if not, complain

                    }else{
                        alert(unescape("Virhe kohdassa '"+divs[i*2-2].innerHTML+"'. Halutaan lukuv%E4li muodossa <pienempi luku>-<suurempi luku>."));
                    }
            }

        }

        // Multipliers to:
        //   - Fit the actual plot inside the canvas
        //   - Add an indication of the scale

        var kerroin_x = 0;
        var kerroin_y = 0;

        // Sum of all widths and sum of all heights, respectively

        var sum_x = 0;
        var sum_y = 0;

        // Iterate over the already-parsed left half of the spreadsheet

        for(var i = 0; i < vals.length; i++){
           
            // Add the last value to the sum

            sum_x += vals[i][0];

            // Check if this is the highest bar so far
            if(sum_y < vals[i][1]){

                // If so, rember it.

                sum_y = vals[i][1];
            }
           
        }
        
        // Calculate the values of the multipliers based on sum_x and sum_y and the size of the <canvas> used

        kerroin_x = 520. / sum_x;
        kerroin_y = 325. / sum_y;
        
        /*
        ************************************************************
        * TODO: CHECK IF THIS VARIABLE IS USELESS. IF SO REMOVE IT *
        ************************************************************
        */

        var width = 0;
        
        // Colors used in the plot (they are from Google's Material Design). They are done so that
        // colors that are next to each other both offer suffiescent contrast and look good together.
        // The program iterates over the colors so that it comes with a complete sequence of colors,
        // that may, if needed, wrap around the beginning of the array. The program starts the iteration
        // from a random place.
        
        var colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];
        
        // Generate the starting-place's location randomly
        
        var c = Math.floor(Math.random()*colors.length);
        
        // 

        for(var i = 0; i < vals.length; i++){
           //do something to each div like

           width += tick(width, ctx, vals[i][1]*kerroin_y, vals[i][0]*kerroin_x, colors[c%colors.length]);
           c++;
           

        }
        axis(ctx);

        ctx.font = "16px Roboto";
        ctx.fillStyle = "black";
         
        // write the text
        var i = 1;
        while(Math.pow(10, i) < sum_x){
            i = i + 1;
        }
        ctx.textAlign = "center";
        ctx.fillText( String(Math.pow(10, i-1)), 370-Math.pow(10, i-1)*kerroin_x, 352);
        ctx.moveTo(370-Math.pow(10, i-1)*kerroin_x, 355);
        ctx.lineTo(370-Math.pow(10, i-1)*kerroin_x, 375);
        i = 1;
        while(Math.pow(10, i) < sum_y){
            i = i + 1;
        }
        ctx.textAlign = "start";
        ctx.fillText( String(Math.pow(10, i-1)), 41, 370-Math.pow(10, i-1)*kerroin_y);

        ctx.save();
        ctx.moveTo(20, 364-Math.pow(10, i-1)*kerroin_y);
        ctx.lineTo(40, 364-Math.pow(10, i-1)*kerroin_y);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.stroke();
        ctx.restore();
        hbars(ctx, kerroin_y, i);
    }

    function vbars(ctx, scale, i){
        
    }

    function hbars(ctx, scale, i){
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#626262";
        var ii = 1;
        if(i < 2){
            while(ii < 20){
                ctx.moveTo(25, 364-Math.pow(10, i-1)*scale*ii/2);
                ctx.lineTo(520, 364-Math.pow(10, i-1)*scale*ii/2);
                ii = ii + 1;
            }
        }else{
            while(ii < 10){
                ctx.moveTo(25, 364-Math.pow(10, i-1)*scale*ii);
                ctx.lineTo(520, 364-Math.pow(10, i-1)*scale*ii);
                ii = ii + 1;
            }
        }
        //alert(scale);
        ctx.stroke();
        ctx.restore();
    }

    function tick(before, ctx, height, width, color){
        ctx.fillStyle = color;
        ctx.fillRect(30+before,364-height,width+1, height);
        return width;
    }

    function updateAxis(){

    var left = document.getElementById("vasen");
    var right = document.getElementById("oikea");

    left = left.options[left.selectedIndex].text;
    right = right.options[right.selectedIndex].text;

            var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height)
    // start by saving the current context (current orientation, origin)

ctx.save();
 
// when we rotate we will be pinching the
// top-left hand corner with our thumb and finger
ctx.translate( 0, 0 );
 
// now rotate the canvas anti-clockwise by 90 degrees
// holding onto the translate point
ctx.rotate( Math.PI / 2 );
 
// specify the font and colour of the text
ctx.font = "16px Roboto";
ctx.fillStyle = "black"; // red
 
// set alignment of text at writing point (left-align)
ctx.textAlign = "left";
 
// write the text
ctx.fillText( right, 170, -10 );
 
// now restore the canvas flipping it back to its original orientation
ctx.restore();
ctx.font = "16px Roboto";
ctx.fillStyle = "black";
 
// write the text
ctx.fillText( left, 260, 385 );
    }

    updateAxis();
