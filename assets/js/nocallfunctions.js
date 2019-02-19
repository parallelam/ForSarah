// Click function that changes theme between dark display, night display and certain button types:
$(document).on('click', '.js-change-theme', function changeTheme (event){
    event.preventDefault();
    var body = $(document.body);
    var btns = $('.z');
    if (body.hasClass('t--dark')) {
        body.removeClass('t--dark');
        btns.removeClass('btn-primary')
        body.addClass('t--light');
        btns.addClass('btn-success');
        $('.js-change-theme').text('Switch to a Darker Display')
    } else {
        body.removeClass('t--light');
        body.addClass('t--dark');
        btns.addClass('btn-primary');
        btns.removeClass('btn-success');
        $('.js-change-theme').text('Switch to a Brighter Display')
}});
        
// Set Default Displays and Texts On Page Load:
$('#sort-by-sdfh').hide();
$('#sort-by-sdfeo').hide();
$('.js-change-theme').text('Switch to a Brighter Display'); 
$('#add-destination').text('Add Destination Address'); 
$('#remove-last').text('Remove Last Input'); 
$('#clear-all').text('Clear All Inputs');
$('#add-start').text('Set Starting Address')
$('#remove-start').text('Clear Starting Address')
$('#calculate').text('Plan My Trip!')
$('#email-me').text('Email Me')