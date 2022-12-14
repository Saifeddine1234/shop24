Stripe.setPublishableKey('pk_test_51HmGfCJLq1f5igD71dsl1H7DOTy7D1cPqjSIvHGT9iCyPSQVcLGPk1e3AZYOdOLfA6gdhegzv89zDYweMgwB4gmB00Ez5f7G31');
var $form = $('#form');
$form.submit(function(event){
    $form.find('button').prop('disabled' , true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val()
      }, stripeResponseHandler);
      return false ;
});


function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!
  
      // Show the errors on the form
      $('#payment-errors').text(response.error.message);
      $('#payment-errors').removeClass('d-none')
      $form.find('button').prop('disabled', false); // Re-enable submission
  
    } else { // Token was created!
  
      // Get the token ID:
      var token = response.id;
  
      // Insert the token into the form so it gets submitted to the server:
      $form.append($('<input type="hidden" name="stripeToken" />').val(token));
  
      // Submit the form:
      $form.get(0).submit();
  
    }
}