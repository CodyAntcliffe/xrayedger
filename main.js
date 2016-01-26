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
            canvas.style.visibility = "visible";
            canvasy.style.visibility = "hidden";
        }
        img.src = event.target.result;
        originalImage = img;
    }
    reader.readAsDataURL(e.target.files[0]);
    removeDummy();
}

//Used for removing something
function removeDummy() {
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

}

//Reloads the entire page
function addNewImageButton() {

    location.reload();

}

var comp = document.getElementById('Compare');
comp.addEventListener('click', compareImage, false);

//Toggle-able compare 
function compareImage() {
    var elem = document.getElementById('editCanvas');
    if(elem.style.visibility == "hidden")
        elem.style.visibility = "visible";
    else
        elem.style.visibility = "hidden";
}

//Save function
var saveAs = function() {
    var fileName = prompt("Enter A File Name and Press OK to Save", "myPicture");
    if (fileName != null) {
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