///////////////////////////////////////////
// MOBILE MENU BUTTON
///////////////////////////////////////////

function navFunction() {
    var navigation = document.getElementById("nav");
    if (navigation.className === "topnav") {
        navigation.className += " responsive";
    }
    else {
        navigation.className = "topnav";
    }
}

///////////////////////////////////////////
// SMOOTH SCROLLING
///////////////////////////////////////////

$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Adding smooth scrolling with animate
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800);
    }
  });
});

///////////////////////////////////////////
// CHANGE FORM BUTTON ON CLICK
///////////////////////////////////////////

$(document).ready(function() {
    $('#submit').on('click', function(event) {
        // Prevent default behavior from occuring after click
        event.preventDefault();
        // If Submit button reads 'Submit', change the text
        if ($('#submit').val() === 'Submit') {
            $('#submit').val('Thank You!');
        }
        else {
            $('#submit').val('Submit');          
        }
    });
});

///////////////////////////////////////////
// STOP ANCHOR LINKS FROM ADDING A HASH TO URL
///////////////////////////////////////////

$(document).ready(function() {
    $('a').on('click', function(event) {
        event.preventDefault();
    });
});


///////////////////////////////////////////
// BACK END FUNCTIONS 
///////////////////////////////////////////

function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      console.log("Results from getFiles()", res);
      return res;
    })
    .fail(err => {
      console.error("Error in getFiles()", err);
      throw err;
    });
}

function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {

      window.fileList = files;

      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}

//POST or PUT data when form is submitted
function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const fileData = {
    title: $('#file-title').val(),
    description: $('#file-description').val(),
    _id: $('#file-id').val(),
  };

  let method, url;
  if (fileData._id) {
    method = 'PUT';
    url = '/api/file/' + fileData._id;
  } else {
    method = 'POST';
    url = '/api/file';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshFileList();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  resetform();
  setFormData();
  console.log("Your file data", fileData);
}

//Populates form with data from file that is to be edited
function handleEditFileClick(id) {
  const file = window.fileList.find(file => file._id === id);
  if (file) {
    setFormData(file);
  }
}


function setFormData(data) {
  data = data || {};

  const file = {
    title: data.title || '',
    description: data.description || '',
    _id: data._id || '',
  };

  $('#file-title').val(file.title);
  $('#file-description').val(file.description);
  $('#file-id').val(file._id);
}

//Delete file function
function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    deleteFile(id);
  }
}

function deleteFile(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/file/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("File", id, "has been deleted");
      refreshFileList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}

//Delete Form Fields
function resetform() {
  document.getElementById("add-file-form").reset();
}

refreshFileList();
