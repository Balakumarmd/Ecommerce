(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let formData = new FormData(form);
      let action = form.getAttribute('action');

      if (!action) {
        displayError(form, 'The form action property is not set!');
        return;
      }

      fetch(action, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`${response.status} ${response.statusText}`);
        }
      })
      .then(data => {
        form.querySelector('.loading').classList.remove('d-block');
        form.querySelector('.error-message').classList.remove('d-block');
        form.querySelector('.sent-message').classList.add('d-block');
        form.reset();
      })
      .catch(error => {
        displayError(form, error.message || 'Form submission failed');
      });
    });
  });

  function displayError(form, error) {
    form.querySelector('.loading').classList.remove('d-block');
    form.querySelector('.error-message').innerHTML = error;
    form.querySelector('.error-message').classList.add('d-block');
  }

})();
