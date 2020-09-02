// remove jQuery $ shortcut from global code
jQuery.noConflict();

jQuery(document).ready(function($) {
    // remove no-js class
    $('html').removeClass('no-js');

    // BEGIN: nav code
    var ldm_init_nav = function() {
        var top_level_nav_max_height = 0;
        $('#menu-nav-menu')
            .find('>li>a').each(function(i) {
                var current_height;
                $(this)
                    .wrapInner("<span class='inner' />") // insert inner wrapper (so we have a second container: 1 for left & bottom, one for right)
                    .append("<span class='whiteout'><!-- .whiteout --></span>"); // insert whiteout to create gray bottom line and remove when tab is active (NOTE: not used in ie7)
                current_height = $(this).find('span.inner').height();
                top_level_nav_max_height = (current_height > top_level_nav_max_height ? current_height : top_level_nav_max_height); // determine max height
            })
            .end() // each top level "a" in nav
            //.find('span.inner').height(top_level_nav_max_height).end() // assign max height to all top levels items
            .find('ul.sub-menu')
                .wrap($("<div class='div-sub-menu' />"));  // insert div-sub-menu wrapper around sub-menus (so we have a second container: 1 for left & bottom, one for right)
    }; // function ldm_init_nav

    // ie6 specific nav code, simulates li:hover
    var ldm_init_ie6_nav = function() {
        $('#menu-nav-menu').find('>li').hover(
            function() {
                $(this).addClass('hover');
            },
            function() {
                $(this).removeClass('hover');
            }
        );
    }; // function ldm_init_ie6_nav

    if ($('body').hasClass('ie6')) {
        // ie6
        ldm_init_ie6_nav();
    } else {
        // all other browsers
        ldm_init_nav();
    }
    // END: nav code

    // BEGIN: search bar - placeholder text
    var ldm_search_placeholder_text = 'Search AudGenDB Website';
    var ldm_search_box = $('#s');
    $(ldm_search_box).attr('value', ldm_search_placeholder_text);
    $(ldm_search_box).focus(function() { 
        // if placholder text, replace with blank
        if ($(this).attr('value') == ldm_search_placeholder_text) {
            $(this).attr('value', '');
        } // if searchbox == placeholder
    }); // $('#s').focus
    $(ldm_search_box).blur(function() { 
        // if value is blank, replace with placeholder text
        if ($(this).attr('value') == '') {
            $(this).attr('value', ldm_search_placeholder_text);
        } // if (value=='')
    });
    // END: search bar - placeholder text
    
    // BEGIN Twitter Tweets AJAX load
    var linklinks = function(text) {
        if( !text ) return text;
        text = text.replace(/((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{1,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))*/gi, function(url){
            return '<a target="_blank" rel="nofollow" href="'+ url +'">'+ url +'</a>';
        });
         
        return text;
    }; // function linklinks
    var twitterpreview = function(twitterbox) {
        var twitterconfig =  {
            user: 'audgendb',
            count: 5
        }
        jQuery.ajax({
            url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twitterconfig.user+'&include_rts=true&count='+twitterconfig.count+'&callback=?',
            type: 'GET',
            dataType: 'jsonp',
            timeout: 1000,
            error: function() { 
                // jsonp called do not ever trigger this error function, they fail silently
                // error occurred
                jQuery.data(twitterbox, 'loading', false);
            },
            success: function(json){
                var html = '<ul>';
                
                jQuery(json).each(function() {
                    html += '<li>'+linklinks(this.text)+'</li>';
                }); // json.each
            
                html += '</ul>';
                jQuery(twitterbox).hide().html(html);
                show_tweets(twitterbox);
                jQuery.data(twitterbox, 'loaded', true);
                jQuery.data(twitterbox, 'open', true);
                jQuery.data(twitterbox, 'loading', false);
            }
        }); // jQuery.ajax
        jQuery.data(twitterbox, 'loading', true);
        jQuery(twitterbox).html("<span class='loading'>LOADING&nbsp;tweets...</span>");
    }; // function twitterpreview

    var ldm_twittertimer;
    var start_ldm_twittertimer = function(timer) {
        timer = setTimeout(function() {
            var twitterbox = jQuery('#twitterposts');
            jQuery.data(twitterbox, 'open', false);
            jQuery(twitterbox).fadeOut();
        },
        800);
        return timer;
    }; // function start_ldm_twittertimer

    var show_tweets = function(twitterbox) {
        jQuery(twitterbox)
            .slideDown()
            .hover(
                function() {
                    // mouseover twitterbox
                    clearTimeout(ldm_twittertimer);
                },
                function() {
                    // mouseout twitterbox
                    ldm_twittertimer = start_ldm_twittertimer(ldm_twittertimer);
                }
            );
    }; // show_tweets

    var twitterbox = jQuery('<div id="twitterposts"></div>');
    var trigger = jQuery('#twittertrigger');
    jQuery('#twittertrigger').append(twitterbox);
    jQuery(trigger).find('>a').hover(
        function() {
            // mouseover
            clearTimeout(ldm_twittertimer);
            if (!jQuery.data(twitterbox, 'loaded') && !jQuery.data(twitterbox, 'loading')) {
                // tweets not yet loaded (or in progress of loading), load them
                twitterpreview(twitterbox);
            } else {
                // tweets loaded but not visible, make visible
                show_tweets(twitterbox);
            } 
        }, 
        function() {
            // mouseout
            ldm_twittertimer = start_ldm_twittertimer(ldm_twittertimer);
        }
    ); // twitter hover
    // END Twitter Tweets AJAX load
}); // document.ready
