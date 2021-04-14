function handleFileSelect(evt) {
   
   var files = evt.target.files;

   if (parseInt(files.length) > 5 || parseInt(files.length) <= 0){
      this.files = null;
      document.getElementById('list').innerHTML = `
      <p id="image-prev-placeholder">
         Select up to 5 images only!
      </p>
      `;
      return alert("You can only select 5 files!")
   }
   const p = document.getElementById("image-prev-placeholder");

   if (p)
      p.style.display = "none";
   document.getElementById('list').innerHTML = "";

   // Loop through the FileList and render image files as thumbnails.
   for (let i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
         continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
         return function(e) {
            // Render thumbnail.
            var div = document.createElement('div');
            div.innerHTML = [`
            <div id="img-child-container">
               <img class="img-prev" src=${e.target.result} title="${escape(theFile.name)}">
            </div>
            `].join('');

            document.getElementById('list').insertBefore(div, null);
         };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
   }
}

function handleSingleFileSelect(evt) {
   var files = evt.target.files;
   document.getElementById('defaultContainer').innerHTML = "";

   // Loop through the FileList and render image files as thumbnails.
   for (let i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
         continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
         return function(e) {
            // Render thumbnail.
            var div = document.createElement('div');
            div.innerHTML = [`
            <div id="img-child-container">
               <img class="img-prev" src=${e.target.result} title="${escape(theFile.name)}">
            </div>
            `].join('');

            document.getElementById('defaultContainer').insertBefore(div, null);
         };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
   }

}

document.getElementById('defaultImg').addEventListener('change', handleSingleFileSelect, false);
document.getElementById('images').addEventListener('change', handleFileSelect, false);