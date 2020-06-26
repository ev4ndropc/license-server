$(document).ready(() => {

  $('input').not('.container-edit-customer input').keyup(function(event) {
    var element = $(event.target).parent();

    if( $(event.target).val() != '' ) {
      $(element).find('label').attr('style','transform: translate(-12px, -32px);')
    }else{
      $(element).find('label').removeAttr('style','transform: translate(-12px, -32px);')
    }
  });

});
