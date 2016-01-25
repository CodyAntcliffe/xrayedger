var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');

var canvasy = document.getElementById('editCanvas');
var ctxy = canvasy.getContext('2d');

var newImage = document.getElementById('newImage');
    newImage.addEventListener('click', addNewImageButton, false);

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
            toGray();
            canvasy.width = img.width;
            canvasy.height = img.height;
            ctxy.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);  
    removeDummy();   
}

//Used for removing something
function removeDummy() {
 var elem = document.getElementById('TEST');
 elem.parentNode.removeChild(elem);
 elem = document.getElementById('newImage');
 elem.style.visibility = "visible";

}

//Reloads the entire page
function addNewImageButton() {

 location.reload();

}
