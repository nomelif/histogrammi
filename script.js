
    function axis(ctx){
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.moveTo(20,365);
        ctx.lineTo(570,365);
        ctx.lineTo(560,375);
        ctx.moveTo(570,365);
        ctx.lineTo(560,355);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.moveTo(30,375);
        ctx.lineTo(30,20);
        ctx.lineTo(20,30);
        ctx.moveTo(30,20);
        ctx.lineTo(40,30);
        ctx.stroke();
        ctx.restore();
    }

    function sanitizeFloat(flt){
        var result = flt.replace(/&nbsp;/g, "").replace(/\u00A0/g, "").replace(",", ".").replace(/\s/g, "").replace("<br>", "");
        var ok = /^[0-9]+([.,][0-9]+)?$/;
        if(ok.test(result)){
            result = parseFloat(result);
            return result;
        }else{
            alert("Virhe kohdassa '"+flt+"'. Halutaan kokonais- tai desimaaliluku.");
        }
    }

    function sanitizeInterval(interval){
        var result = interval.split("-");
        var a = sanitizeFloat(result[0]);
        var b = sanitizeFloat(result[1]);
        if(b - a > 0){
            return b - a;
        }else{
            alert(unescape("Virhe kohdassa '"+interval+"'. Halutaan lukuv%E4li muodossa <pienempi luku>-<suurempi luku>."));
        }
    }

    function plot(){
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');ctx.beginPath();

        var vals = [];

        var divs = document.getElementsByTagName("div");
        var clean = /^[0-9]+-[1-9]+[0-9]*$/;
        for(var i = 1; i < divs.length/2; i++){
            //do something to each div like
            if(clean.test(divs[i*2-2].innerHTML)){
                vals.push([sanitizeInterval(divs[i*2-2].innerHTML), sanitizeFloat(divs[i*2-1].innerHTML)]);
            }else{
                if(/^$/.test(divs[i*2-2].innerHTML)){

                }else{
                    alert(unescape("Virhe kohdassa '"+divs[i*2-2].innerHTML+"'. Halutaan lukuv%E4li muodossa <pienempi luku>-<suurempi luku>."));
                }
            }

           

        }
        var kerroin_x = 0;
        var sum_x = 0;
        var kerroin_y = 0;
        var sum_y = 0;

        for(var i = 0; i < vals.length; i++){
           //do something to each div like

           sum_x += vals[i][0];
           if(sum_y < vals[i][1]){
                sum_y = vals[i][1];
           }
           
        }

        kerroin_x = 520. / sum_x;
        kerroin_y = 325. / sum_y;

        var width = 0;
        var colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];
        var c = Math.floor(Math.random()*colors.length);

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