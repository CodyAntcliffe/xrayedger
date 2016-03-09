var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', uploadImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');

var canvasy = document.getElementById('editCanvas');
var ctxy = canvasy.getContext('2d');

var newImage = document.getElementById('newImage');
newImage.addEventListener('click', addNewImageButton, false);


var originalImage;

function uploadImage(e) {
    
    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvasy.width = img.width;
            canvasy.height = img.height;
            ctxy.drawImage(img, 0, 0);
            canvasy.style.visibility = "hidden";
            tagger();
            showButtons();
        }
        img.src = event.target.result;
        originalImage = img;
    }
    reader.readAsDataURL(e.target.files[0]);
    
}

//Used for removing something
function showButtons() {
    var elem = document.getElementById('uploadImage');
    elem.remove(elem);
    elem = document.getElementById('newImage');
    elem.style.visibility = "visible";
    elem = document.getElementById('EdgeButton');
    elem.style.visibility = "visible";
    elem = document.getElementById('Save');
    elem.style.visibility = "visible";
    elem = document.getElementById('Compare');
    elem.style.visibility = "visible";
    elem = document.getElementById('Zoom');
    elem.style.visibility = "visible";

}

//Reloads the entire page
function addNewImageButton() {

    document.location.href = "index.html";

    location.reload();

}

var comp = document.getElementById('Compare');
comp.addEventListener('click', compareImage, false);

//Toggle-able compare 
function compareImage() {
    var elem = document.getElementById('editCanvas');
    if (elem.style.visibility == "hidden")
        elem.style.visibility = "visible";
    else
        elem.style.visibility = "hidden";
}

//Save function
var saveAs = function() {
    //Open a prompt for choosing file name
    bootbox.prompt("Choose A Name For The Image", function(result) {
        if (result === null) {

        } else {
            //Need to save backgroudn color information since sobel and scharr need white.

            //store the current globalCompositeOperation
            var compositeOperation = ctx.globalCompositeOperation;
            //set to draw behind current content
            ctx.globalCompositeOperation = "destination-over";
            //set background color
            ctx.fillStyle = 'white';
            //draw background / rect on entire canvas
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //Now save the entire image
            var img = canvas.toDataURL("image/png");
            var a = document.createElement('a');
            a.href = img;
            a.download = result + ".png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    var fileName = prompt("Enter A File Name and Press OK to Save");
    if (fileName != null) {
        //store the current globalCompositeOperation
        var compositeOperation = ctx.globalCompositeOperation;
        //set to draw behind current content
        ctx.globalCompositeOperation = "destination-over";
        //set background color
        ctx.fillStyle = 'white';

        //draw background / rect on entire canvas
        ctx.fillRect(0,0,canvas.width,canvas.height);
        var img = canvas.toDataURL("image/png");
        var a = document.createElement('a');
        a.href = img;
        a.download = fileName + ".png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }


}

document.getElementById('Save').addEventListener('click', saveAs, false);

function scharr() {
    //Get the dimensions of the photo currently on the canvas
    var width = canvas.width;
    var height = canvas.height;

    var data_type = jsfeat.U8_t | jsfeat.C1_t;
    var img = originalImage;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0);

    var imageData = ctx.getImageData(0, 0, width, height);

    img_u8 = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
    img_gxgy = new jsfeat.matrix_t(width, height, jsfeat.S32C2_t);

    //process the image
    jsfeat.imgproc.grayscale(imageData.data, width, height, img_u8);
    jsfeat.imgproc.scharr_derivatives(img_u8, img_gxgy);

    // render result back to canvas
    var data_u32 = new Uint32Array(imageData.data.buffer);
    var alpha = (0xff << 24);
    var i = img_u8.cols * img_u8.rows,
        pix = 0,
        gx = 0,
        gy = 0;
    while (--i >= 0) {
        gx = Math.abs(img_gxgy.data[i << 1] >> 2) & 0xff;
        gy = Math.abs(img_gxgy.data[(i << 1) + 1] >> 2) & 0xff;
        pix = ((gx + gy) >> 2) & 0xff;
        data_u32[i] = (pix << 24) | (gx << 16) | (0 << 8) | gy;
    }

    ctx.putImageData(imageData, 0, 0);
    tagger();
}


function sobel() {
    //Get the dimensions of the photo currently on the canvas
    var width = canvas.width;
    var height = canvas.height;

    var data_type = jsfeat.U8_t | jsfeat.C1_t;
    var img = originalImage;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0);

    var imageData = ctx.getImageData(0, 0, width, height);

    img_u8 = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
    img_gxgy = new jsfeat.matrix_t(height, height, jsfeat.S32C2_t);

    //process the image
    jsfeat.imgproc.grayscale(imageData.data, width, height, img_u8);
    jsfeat.imgproc.sobel_derivatives(img_u8, img_gxgy);

    // render result back to canvas
    var data_u32 = new Uint32Array(imageData.data.buffer);
    var alpha = (0xff << 24);
    var i = img_u8.cols * img_u8.rows,
        pix = 0,
        gx = 0,
        gy = 0;
    while (--i >= 0) {
        gx = Math.abs(img_gxgy.data[i << 1] >> 2) & 0xff;
        gy = Math.abs(img_gxgy.data[(i << 1) + 1] >> 2) & 0xff;
        pix = ((gx + gy) >> 1) & 0xff;
        data_u32[i] = (pix << 24) | (gx << 16) | (0 << 8) | gy;
    }

    ctx.putImageData(imageData, 0, 0);
    tagger();

}

function canny(b, l, h) {
    document.getElementById('ranges').style.visibility = "visible";

    //Get the dimensions of the photo currently on the canvas
    var width = canvas.width;
    var height = canvas.height;

    var data_type = jsfeat.U8_t | jsfeat.C1_t;
    var img = originalImage;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0);

    var data_buffer = new jsfeat.data_t(width * height);
    var img_u8 = new jsfeat.matrix_t(width, height, data_type, data_buffer);
    var imageData = ctx.getImageData(0, 0, width, height);

    //Convert to grascale(needed for other methods)
    jsfeat.imgproc.grayscale(imageData.data, width, height, img_u8);

    //Control level of detail in edge detection

    var blurLevel;
    var lowThreshold;
    var highThreshhold;

    if (b == undefined)
        blurLevel = 2;
    else
        blurLebel = b;
    if (l == undefined)
        lowThreshold = 40;
    else
        lowThreshold = l;
    if (h == undefined)
        highThreshhold = 100;
    else
        highThreshhold = h;


    //Gaussian Blur to reduce noise
    var r = blurLevel | 0;
    var kernel_size = (r + 1) << 1;
    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

    //Reduce image to edges
    jsfeat.imgproc.canny(img_u8, img_u8, lowThreshold | 0, highThreshhold | 0);

    //Render the image data back to canvas
    var data_u32 = new Uint32Array(imageData.data.buffer);
    var alpha = (0xff << 24);
    var i = img_u8.cols * img_u8.rows,
        pix = 0;
    while (--i >= 0) {
        pix = img_u8.data[i];
        data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
    }

    //Put the edited image on the canvas
    ctx.putImageData(imageData, 0, 0);

    tagger();
}


//This is a current workaround for the fact that all of the image processing requires a canvas element.
//Gets the image from canvas, places it in the img element and then makes it annotatable.
function tagger() {
    var im = canvas.toDataURL();
    document.getElementById("myImage").src = im;
    anno.makeAnnotatable(document.getElementById('myImage'));
    document.getElementById("myImage").style.border = "5px inset black";

  } 
