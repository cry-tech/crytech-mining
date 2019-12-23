$(document).ready(function () {
  $('#Form').validate({
    rules: {
      Email: {
        required: true,
        email: true
      }
    },
    messages: {
      LoginUsername: {
        required: "Please enter your email",
        email: "please enter a valid email (with use of @)"
      }
    },
    errorElement: 'div',
    errorLabelContainer: '.errorTxt',
    submitHandler: function (form) {
      $.ajax({
        type: 'POST',
        url: "/subscribe",
        contentType: "application/json",
        data: JSON.stringify({ "email": $("#Email").val() }),
        success: function (result) {
          alert(result);
        }
      })

    }
  });

  $('[data-toggle="tooltip"]').tooltip();
});