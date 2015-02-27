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
// and macros. Wiew the as such.


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

        // Calculate the exact values of the multipliers

        kerroin_x = 520. / sum_x;
        kerroin_y = 325. / sum_y;

        // Width of the plor so far

        var width = 0;

        // List of colors to use

        var colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];
        
        // Pick a first color at random

        var c = Math.floor(Math.random()*colors.length);

        // Iterate over both colors and bars

        for(var i = 0; i < vals.length; i++){
        
            // Draw the bar

            width += tick(width, ctx, vals[i][1]*kerroin_y, vals[i][0]*kerroin_x, colors[c%colors.length]);
            
            // Increment the iterator for the colors

            c++;
           

        }

        // Draw the axes

        axis(ctx);

        // Prepare fonts for the text

        ctx.font = "16px Roboto";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
         
        // Calculate the order of magnitude for the plot's x-axis

        var i = 1;
        while(Math.pow(10, i) < sum_x){
            i = i + 1;
        }

        // Draw the adequate text to the adequate place

        ctx.fillText( String(Math.pow(10, i-1)), x_move + Math.pow(10, i-1)*kerroin_x + 30, y_move + 352);//       x_move + 370-Math.pow(10, i-1)*kerroin_x, y_move + 352);
        
        // Draw the line indicating scale of the x-axis

        ctx.moveTo(x_move + 370-Math.pow(10, i-1)*kerroin_x, y_move + 355);
        ctx.lineTo(x_move + 370-Math.pow(10, i-1)*kerroin_x, y_move + 375);

        // Draw the x-scale

        vbars(ctx, kerroin_x, i);

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

        // Restore the context's status & save it again

        ctx.restore();
        ctx.save();

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

        ctx.strokeStyle = "black";//"#626262";

        // Iterate over the bars, if the scale is small use more, if it's big, use less

        var ii = 1;
        if(i < 2){

            // If we have a small scale, use nineteen bars

            while(ii < 20){

                //alert(x_move + 25 + Math.pow(10, i-1)*scale*ii/2)

                ctx.moveTo(x_move + Math.pow(10, i-1)*scale*ii/2 + 30,  y_move + 370);
                ctx.lineTo(x_move +  Math.pow(10, i-1)*scale*ii/2 + 30, y_move + 360);
                ii = ii + 1;
            }
        }else{

            // Else use nine bars

            while(ii < 10){

                ///alert(yx_move + 25 + Math.pow(10, i-1)*scale*ii);

                ctx.moveTo(x_move + Math.pow(10, i-1)*scale*ii + 30,  y_move + 370);
                ctx.lineTo(x_move + Math.pow(10, i-1)*scale*ii + 30, y_move + 360);
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

        ctx.strokeStyle = "black";//"#626262";

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
    // -before : how many pixels (of width) are used by previous bars
    // - ctx   : context to use for drawing
    // - height: height (in pixels) of the bar
    // - width : width (in pixels) of the bar
    // - color : color of the bar

    function tick(before, ctx, height, width, color){
        ctx.fillStyle = color;
        ctx.fillRect(x_move + 30 + before, y_move + 364 - height, width + 1, height);
        return width;
    }

    // Function used to re-draw the axes and drawing the names / units seen
    // (This internally rotates the context)

    function updateAxis(){

    // Get the divs containing the names of the units

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
 
    // Specify the font and colour of the text
    ctx.font = "16px Roboto";
    ctx.fillStyle = "black"; // red
     
    // Set alignment of text at writing point (left-align)
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
    alert('Copyright (c) 2014 Th&eacute;o Friberg\n\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the\n&quot;Software&quot;), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\n\nThe above copyright notice and this permission notice shall be included\nin all copies or substantial portions of the Software.\n\n\nTHE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\nCLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\nSOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.');
}

updateAxis();