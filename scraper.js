var stdio = require('stdio'),
    phantom = require('phantom'),
    url = '',
    form = null,
    delay = 1000,
    debug = false;

//stdio setup
var ops = stdio.getopt({
    'url': {key: 'u', args: 1, description: 'URL to hit', mandatory: true}
  , 'form': {key: 'f', args: 1, description: 'ID of form element to add as input container.'}
  , 'delay': {key: 'd', args: 1, description: 'How long to wait in milliseconds for the page to load before attempting to find inputs.'}
  , 'debug': {description: 'Outputs extra lines of information along the way'}
});

url = ops.url;
form = ops.form || false;
delay = ops.delay || 1000;
debug = ops.debug;

if(debug){
    console.log(url, form, delay);
}

phantom.create('--ignore-ssl-errors=yes', function(ph){
    if(debug){
        console.log('PhantomJS instance started');
    }
    ph.createPage(function(page){
        if(debug){
            console.log('Opening page, this may take a second');
        }
        page.open(url, function(status) {
            if(debug){
                console.log('Page opened');
            }
            page.includeJs('https://code.jquery.com/jquery-2.1.0.min.js', function(){
                if(debug){
                    console.log('jQuery included beginning a ' + delay + ' millisecond delay before scraping the page');
                    console.log('Next thing returned will be the results:');
                    console.log('');
                }
                setTimeout(function(){
                    return page.evaluate(function(form) {
                        var fields = [];

                        var selector;
                        if(form){
                            selector = $('#' + form).find('input,select,textarea');
                        } else {
                            selector = $('input,select,textarea');
                        }
                        selector.each(function(){
                            fields.push({'name': $(this).prop('name'), 'type': $(this).get(0).tagName.toLowerCase()});
                        });

                        return fields;
                    }, function(inputs){
                        console.log(JSON.stringify(inputs));

                        ph.exit();
                    }, form);
                }, delay);
            });
        });
    });
});