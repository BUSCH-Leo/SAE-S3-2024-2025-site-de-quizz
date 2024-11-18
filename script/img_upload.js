document.getElementById('mediaContainer').addEventListener('click', function() {
        document.getElementById('imageUpload').click();
    });
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('mediaContainer').innerHTML = '<img src="' + event.target.result + '" class="img-fluid rounded">';
            };
            reader.readAsDataURL(file);
        }
    });