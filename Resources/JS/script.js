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

// These (global) variables define translation on the x- and y-axis.
// They are mainly used to make space for the vertical text.
// Global variables are used here because JS doesn't support #defines
// and macros. View them as such.


var x_move = 27;
var y_move = 0;

    
    // This function draws the co-ordinate axes

function axis(ctx){

        // Begin by saving the state of the context, as we will modify it

        ctx.save();

        // Styling

        ctx.strokeStyle = "black";

        // X-axis

        ctx.moveTo(x_move + 20,  y_move + 365);
        ctx.lineTo(x_move + 570, y_move + 365);
        ctx.lineTo(x_move + 560, y_move + 375);
        ctx.moveTo(x_move + 570, y_move + 365);
        ctx.lineTo(x_move + 560, y_move + 355);

        // Stroke the X-axis

        ctx.stroke();

        // Restore saved state

        ctx.restore();

        // Begin by saving the state of the context, as we will modify it

        ctx.save();

        // Y-axis

        ctx.moveTo(x_move + 30, y_move + 375);
        ctx.lineTo(x_move + 30, y_move + 20 );
        ctx.lineTo(x_move + 20, y_move + 30 );
        ctx.moveTo(x_move + 30, y_move + 20 );
        ctx.lineTo(x_move + 40, y_move + 30 );

        // Stroke the Y-axis

        ctx.stroke();

        // Finish by restoring the state of the context

        ctx.restore();
    }

    // This function sanitizes a float entered as a string. It also informs the user if something goes wrong.

function sanitizeFloat(flt){

        // Regex-based removal of most unwanted characters

        var result = flt.replace(/&nbsp;/g, "").replace(/\u00A0/g, "").replace(",", ".").replace(/\s/g, "").replace("<br>", "");
        
        // If the formatted string matches this regex, it is a valid float, if it doesn't it isn't.

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

    // This function sanitizes an interval. It also informs the user if the interval makes no sense.

function sanitizeInterval(interval){

        // The interval will be split to two floats that go into different variables

        var a = 1;
        var b = 0;

        // Don't try to split the string if it doesn't contain dashes (the interval is given as <first number>-<second number>)

        if(interval.search("\-") != -1){

            // If the string contains dashes, split it

            var result = interval.split("-");

            // Separately treat both floats

            a = sanitizeFloat(result[0]);
            b = sanitizeFloat(result[1]);

        }

        // Did you get meaningful floats? (The lower boundary is indeed smaller than the greater one)

        if(b - a > 0){

            // Yes, return them both.

            return [b, a];

        }else{

            // No, inform the user. Unescape is used here to get finnish characters not covered by ascii (a with a umlautm, html entity &auml;).

            alert(unescape("Virhe kohdassa '"+interval+"'. Halutaan lukuv%E4li muodossa <pienempi luku>-<suurempi luku>."));
        }
    }

    // Main draw-code:
    //    - Draws axes
    //    - Draws the plot
    //    - Draws texts

function plot(){

        // Get the canvas and all the other useful occult arts to start drawing.

        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');ctx.beginPath();

        // Values of the <input type="text">s on the page, very aptly named

        var vals = [];

        // List of the inputs of the page

        var inputs = document.getElementsByClassName("in");

        // Regex to indicate a meaningful content of an input

        var clean = /^[0-9]+-[1-9]+[0-9]*$/;

        // The variable right_range holds the size of the first (and right) interval
        // The variable previous_greater holds the upper boundary of the previous interval

        var right_range = -1;
        var previous_greater = -1;

        // Iterate over the inputs

        for(var i = 1; i < inputs.length/2; i++){

            // Remove <br>s from the input

            inputs[i*2-2].value = inputs[i*2-2].value.replace("<br>", "");

            // Make sure the input's contents make sense

            if(clean.test(inputs[i*2-2].value)){

                // If so, push it to the list

                var val = sanitizeInterval(inputs[i*2-2].value);
                var range = val[0] - val[1]

                // If both the range and lower boundary match

                if(right_range === range && previous_greater === val[1] - 1){

                    // Push the value of the input and update the lower boundary

                    vals.push([range, sanitizeFloat(inputs[i*2-1].value)]);
                    previous_greater = val[0];

                // If this is the first one

                }else if(right_range === -1){

                    // Setup the lower boundary of the range, push the content of the input and setup the range

                    right_range = range;
                    vals.push([range, sanitizeFloat(inputs[i*2-1].value)]);
                    previous_greater = val[0];

                // If something goes wrong

                }else{

                    // Inform the user. Unescape is used here to get finnish characters not covered by ascii (a with a umlautm, html entity &auml;).

                    alert(unescape("Virhe kohdassa '"+inputs[i*2-2].value+"'. Lukuv%E4lien kuuluu olla samat koko kuvaajassa, ja niiden v%E4liss%E4 ei kuulu olla v%E4lej%E4."));

                }

            // If the input doesn't contain a clean interval

            }else{

                // Test if the sanitization-functions already caught the problem

                if(/^$/.test(inputs[i*2-2].innerHTML) == false){

                    // If not, tell the user. Unescape is used here to get finnish characters not covered by ascii (a with a umlautm, html entity &auml;).

                    alert(unescape("Virhe kohdassa '"+inputs[i*2-2].innerHTML+"'. Halutaan lukuv%E4li muodossa <pienempi luku>-<suurempi luku>."));
                
                }
            }

        }

        // Multipliers to:
        //   - Fit the actual plot inside the canvas
        //   - Add an indication of the scale

        var kerroin_x = 0;
        var kerroin_y = 0;

        // Sum of all widths and height of the highest bar, respectively

        var sum_x = 0;
        var sum_y = 0;

        // Iterate over the parsed left half of the spreadsheet

        for(var i = 0; i < vals.length; i++){
           
            // Add the last value to the sum

            sum_x += vals[i][0];

            // Check if this is the highest value (Ie. bar) so far

            if(sum_y < vals[i][1]){

                // If so, rember it.

                sum_y = vals[i][1];
            }
           
        }

        // Calculate the exact values of the multipliers. These are based on the pixel-width of the <canvas> -tag.

        kerroin_x = 520. / sum_x;
        kerroin_y = 325. / sum_y;

        // Width of the plor so far

        var width = 0;

        // List of colors to use. These are from Google's Material Design's palette.

        var colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];
        
        // Pick a first color at random, the following ones go well with it

        var c = Math.floor(Math.random()*colors.length);

        // Iterate over both colors and bars

        for(var i = 0; i < vals.length; i++){
        
            // Draw the bar

            width += tick(width, ctx, vals[i][1]*kerroin_y, vals[i][0]*kerroin_x, colors[c%colors.length]);
            
            // Increment the iterator for the colors. (No pun intended)

            c++;

        }

        // Draw the axes

        axis(ctx);

        // Prepare fonts and alignments for the text

        ctx.font = "16px Roboto";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
         
        // Calculate the order of magnitude for the plot's x-axis

        var i = 1;

        while(Math.pow(10, i) < sum_x){

            i = i + 1;

        }

        // Draw the adequate text to the adequate place (magic)

        if(!document.getElementById("show_vbars").checked)
        ctx.fillText( String(Math.pow(10, i-1)), x_move + Math.pow(10, i-1)*kerroin_x + 30, y_move + 352);
        
        // Draw the line indicating scale of the x-axis

        ctx.moveTo(x_move + Math.pow(10, i-1)*kerroin_x + 30, y_move + 355);
        ctx.lineTo(x_move + Math.pow(10, i-1)*kerroin_x + 30, y_move + 375);

        // Draw the extended x-scale, but only if asked to do so

        if(document.getElementById("show_vbars").checked){

            vbars(ctx, kerroin_x, i);

        }

        // Calculate the order of magnitude for the plot's y-axis

        i = 1;
        
        while(Math.pow(10, i) < sum_y){

            i = i + 1;

        }

        // Change the alignment of the text & draw the text

        ctx.textAlign = "end";
        ctx.fillText( String(Math.pow(10, i-1)), x_move + 15, y_move + 370-Math.pow(10, i-1)*kerroin_y);

        // Draw the line indicating the scale of the y-axis

        ctx.save();
        ctx.moveTo(x_move + 20, y_move + 364-Math.pow(10, i-1)*kerroin_y);
        ctx.lineTo(x_move + 40, y_move + 364-Math.pow(10, i-1)*kerroin_y);

        // Actually draw the paths

        ctx.stroke();

        // Restore the context's status

        ctx.restore();

        // Draw the horizontal bars onto the plot

        hbars(ctx, kerroin_y, i);
    }

    // Function to draw the vertical bars of the plot

function vbars(ctx, scale, i){

        // Save the context

        ctx.save();

        // Start drawing (important)

        ctx.beginPath();

        // Set the color of the path

        ctx.strokeStyle = "black";

        // Iterate over the bars, if the scale is small use more, if it's big, use less

        var ii = 1;

        if(i < 2){

            // If we have a small scale, use nineteen bars

            while(ii < 20){

                ctx.moveTo(x_move + Math.pow(10, i-1)*scale*ii/2 + 30,  y_move + 370);
                ctx.lineTo(x_move +  Math.pow(10, i-1)*scale*ii/2 + 30, y_move + 360);

                // Add text to only every other bar

                if(!(ii%2))
                ctx.fillText( String(Math.pow(10, i-1)*(ii/2)), x_move + Math.pow(10, i-1)*scale*ii/2 + 30, y_move + 350);//       x_move + 370-Math.pow(10, i-1)*kerroin_x, y_move + 352);

                ii = ii + 1;
            }
        }else{

            // Else use nine bars

            while(ii < 10){

                ctx.moveTo(x_move + Math.pow(10, i-1)*scale*ii + 30,  y_move + 370);
                ctx.lineTo(x_move + Math.pow(10, i-1)*scale*ii + 30, y_move + 360);

                // Add text to only every other bar

                if(!(ii%2))
                ctx.fillText( String(Math.pow(10, i-1)*(ii)), x_move + Math.pow(10, i-1)*scale*ii + 30, y_move + 350);//       x_move + 370-Math.pow(10, i-1)*kerroin_x, y_move + 352);

                ii = ii + 1;
            }
        }

        // Stroke the path

        ctx.stroke();

        // Restore the context

        ctx.restore();
    }

    // Function to draw the horizontal bars of the plot

function hbars(ctx, scale, i){

        // Save the context

        ctx.save();

        // Start drawing (important)

        ctx.beginPath();

        // Set the color of the path

        ctx.strokeStyle = "black";

        // Iterate over the bars, if the scale is small use more, if it's big, use less

        var ii = 1;

        if(i < 2){

            // If we have a small scale, use nineteen bars

            while(ii < 20){
                ctx.moveTo(x_move + 25,  y_move + 364-Math.pow(10, i-1)*scale*ii/2);
                ctx.lineTo(x_move + 560, y_move + 364-Math.pow(10, i-1)*scale*ii/2);
                ii = ii + 1;
            }
        }else{

            // Else use nine bars 

            while(ii < 10){
                ctx.moveTo(x_move + 25,  y_move + 364-Math.pow(10, i-1)*scale*ii);
                ctx.lineTo(x_move + 560, y_move + 364-Math.pow(10, i-1)*scale*ii);
                ii = ii + 1;
            }
        }

        // Stroke the path

        ctx.stroke();

        // Restore the context

        ctx.restore();
    }

    // Function to draw a bar of the plot, the args mean:
    // - before : how many pixels (of width) are used by previous bars
    // - ctx    : context to use for drawing
    // - height : height (in pixels) of the bar
    // - width  : width (in pixels) of the bar
    // - color  : color of the bar

function tick(before, ctx, height, width, color){

        ctx.fillStyle = color;
        ctx.fillRect(x_move + 30 + before, y_move + 364 - height, width, height);
        return width;

    }

    // Function used to re-draw the axes and drawing the names / units seen
    // (This internally rotates the context)

function updateAxis(){

    // Get the inputs containing the names of the units

    var left = document.getElementById("vasen");
    var right = document.getElementById("oikea");

    // Get the names of the units

    left = left.options[left.selectedIndex].text;
    right = right.options[right.selectedIndex].text;

    // Get the context of the plot

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    
    // Clear the plot

    ctx.clearRect(0, 0, c.width, c.height)

    // Start by saving the current context (current orientation, origin)

    ctx.save();
 
    // Now rotate the canvas anti-clockwise by 90 degrees

    ctx.rotate( Math.PI / 2 );
 
    // Specify the font and color of the text
    ctx.font = "16px Roboto";
    ctx.fillStyle = "black";
     
    // Set alignment of text (left-align)
    ctx.textAlign = "left";
     
    // Write the text on the right

    ctx.fillText( right, -y_move + 170, - x_move + 20);
     
    // Now restore the canvas flipping it back to its original orientation
    ctx.restore();
    ctx.font = "16px Roboto";
    ctx.fillStyle = "black";
     
    // Write the text on the left
    ctx.fillText( left, x_move + 260, y_move + 385);

    // Scroll back to top

    scroll(0,0);
}

// Function to display copyleft-info

function copyleftInfo(){

    alert(unescape('Copyright (c) 2014 Th%E9o Friberg\n\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the\n"Software"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\n\nThe above copyright notice and this permission notice shall be included\nin all copies or substantial portions of the Software.\n\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\nCLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\nSOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.'));

}

// Run the update axis-method, which runs the rest of the file

updateAxis();
