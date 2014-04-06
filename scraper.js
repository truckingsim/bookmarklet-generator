var stdio = require('stdio'),
    phantom = require('phantom'),
    url = '',
    form = null,
    delay = 1000,
    debug = false,
    jQuery = '',
    testMode = false;

//stdio setup
var ops = stdio.getopt({
    url: {key: 'u', args: 1, description: 'URL to hit'}
    , form: {key: 'f', args: 1, description: 'ID of form element to add as input container.'}
    , delay: {key: 'd', args: 1, description: 'How long to wait in milliseconds for the page to load before attempting to find inputs.'}
    , debug: {description: 'Outputs extra lines of information along the way'}
    , timeout: {key: 't', args: 1, description: 'Not currently implemented'}
    , localjQuery: {description: 'This is mostly for testing, but assumes you have jQuery file in this directory'}
});

url = ops.url;
form = ops.form || false;
delay = ops.delay || 1000;
debug = ops.debug;

/* If we are using the local version of jQuery we need to include via localhost
 *     This is due to how phantomjs internally handles include.js
 *          If done via a local file there is no callback, it only returns true/false
 *          If done via a url there is callback to work with
 *          So we have to use a url to load it
 *
 * This is only for testing purposes so we use phantomjs folder
 */
jQuery = ops.localjQuery ? 'http://localhost/phantomjs/jquery.js' : 'https://code.jquery.com/jquery-2.1.0.min.js';

//Test mode setup, since url is required we are going to set it to google if test mode is active
if(ops.args && ops.args.length && ops.args[0] === 'test'){
    url = 'http://google.com';
    testMode = true;
}

if(debug && !testMode){
    console.log(url, form, delay);
}

if(!testMode){
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
                page.includeJs(jQuery, function(){
                    if(debug){
                        console.log('jQuery included beginning a ' + delay + ' millisecond delay before scraping the page');
                        console.log('Next thing returned will be the results:');
                        console.log('');
                    }
                    setTimeout(function(){
                        return page.evaluate(function(form) {
                            //Due to the special nature of radio buttons where you select
                            // one or the other need to do special loading here, to put
                            var fields = {notRadios: [], radios: {}};

                            var selector;
                            if(form){
                                selector = $(form).find('input,select,textarea');
                            } else {
                                selector = $('input,select,textarea');
                            }
                            selector.each(function(){
                                var $this = $(this);
                                var type = $this.get(0).tagName.toLowerCase();
                                var properties = {
                                    name: $this.prop('name')
                                    , id: false
                                };
                                var id = '';
                                var $label = false;

                                if($this.prop('id') && $this.prop('id').length){
                                    properties.id = $this.prop('id');
                                }

                                if(type === 'input' && $this.prop('type') === 'radio'){
                                    //We are going to look for a label so we know what we are choosing
                                    //If we feel we can't find a label it will attempt to use the ID
                                    //If we still don't have an ID we will not add the field to the list
                                    //  due to not being able to identify the button in any unique way


                                    //First check to see if the radio has an ID, if it does look for a label
                                    //  that has a `for` attribute with that id
                                    id = $this.prop('id');
                                    $label = '';
                                    if(id && id.length){
                                        $label = $('label[for=' + id + ']');
                                        if($label.length){
                                            //They had a label!  Now we need to make sure it is just
                                            //  text that we are getting back
                                            properties.label = $label.text().replace(/<\/?[^>]+(>|$)/g, '');
                                        }
                                    }

                                    //Basically if the label[for=id] didn't match we now need to do a little work
                                    if(!properties.label){
                                        //Lets check to see if the input is wrapped in a label:
                                        if($this.parent().get(0).tagName.toLowerCase() === 'label'){
                                            $label = $this.parent();
                                            if($label.length){
                                                properties.label = $label.text().replace(/<\/?[^>]+(>|$)/g, '');
                                            }
                                        } else if(id && id.length){
                                            //We've given up all reasonable amount of hope of finding a label
                                            //  at this point and are just going to use the id as the label
                                            properties.label = id;
                                        }
                                    }

                                    if(properties.label){
                                        if(!fields.radios.hasOwnProperty(properties.name)){
                                            fields.radios[properties.name] = [];
                                        }
                                        fields.radios[properties.name].push(properties);
                                    }
                                } else{
                                    var includeInput = true;
                                    if(type === 'input'){
                                        var inputType = $this.prop('type');
                                        switch(inputType){
                                            case 'text':
                                            case 'email':
                                            case 'search':
                                            case 'tel':
                                                properties.type = 'text';
                                                break;
                                            case 'checkbox':
                                                properties.type = 'checkbox';
                                                //We need to do the label craziness here as well
                                                id = $this.prop('id');
                                                $label = '';
                                                if(id && id.length){
                                                    $label = $('label[for=' + id + ']');
                                                    if($label.length){
                                                        //They had a label!  Now we need to make sure it is just
                                                        //  text that we are getting back
                                                        properties.label = $label.text().replace(/<\/?[^>]+(>|$)/g, '');
                                                    }
                                                }

                                                //Basically if the label[for=id] didn't match we now need to do a little work
                                                if(!properties.label){
                                                    //Lets check to see if the input is wrapped in a label:
                                                    if($this.parent().get(0).tagName.toLowerCase() === 'label'){
                                                        $label = $this.parent();
                                                        if($label.length){
                                                            properties.label = $label.text().replace(/<\/?[^>]+(>|$)/g, '');
                                                        }
                                                    } else if(id && id.length){
                                                        //We've given up all reasonable amount of hope of finding a label
                                                        //  at this point and are just going to use the id as the label
                                                        properties.label = id;
                                                    }
                                                }

                                                if(!properties.label){
                                                    includeInput = false;
                                                }
                                                break;
                                            default:
                                                properties.type = inputType;
                                                break;
                                        }
                                    }
                                    if(type === 'textarea'){
                                        properties.type = type;
                                    }
                                    if(type === 'select'){
                                        properties.type = type;
                                        properties.options = [];

                                        var $options = $this.find('option');

                                        if($options && $options.length){
                                            $options.each(function(){
                                                properties.options.push({
                                                    value: $(this).val()
                                                    , text: $(this).text()
                                                    , selected: $(this).is(':selected')
                                                });
                                            });
                                        }
                                    }

                                    if(includeInput){
                                        fields.notRadios.push(properties);
                                    }
                                }
                            });

                            return fields;
                        }, function(inputs){
                            console.log(JSON.stringify({success: 1, inputs: inputs}));

                            ph.exit();
                        }, form);
                    }, delay);
                });
            });
        });
    });
} else {
    phantom.create(function(ph){
        ph.createPage(function(page){
            page.open(url, function(status){
                console.log(status);
                ph.exit();
            });
        });
    });
}