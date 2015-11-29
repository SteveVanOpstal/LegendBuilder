$(function() {

    /* touch device? */
    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        $('body').addClass('touch-enabled');
        
        $(window).on('scroll', function() {
            if($(this).scrollTop() > $('.shop').offset().top)
            {
                $('.shop-left').css('position', 'fixed');
                $('.shop-right').css('padding-left', $('.shop-left').outerWidth());
                $('.search').css('width', $('.shop-right').outerWidth() - $('.shop-left').outerWidth());
            }
            else
            {
                $('.shop-left, .search').css('position', '');
                $('.shop-right').css('padding-left', '');
            }
        });
    }

    $('input[type="number"]').on('focusout', function() {
        var val = parseInt($(this).prop('value'));
        var min = parseInt($(this).prop('min'));
        var max = parseInt($(this).prop('max'));

        min = isNaN(min) ? 0 : min;
        max = isNaN(max) ? 100 : max;

        if(val < min)
        {
            $(this).prop('value', min);
        }
        else if(val > max)
        {
            $(this).prop('value', max);
        }
    });
});