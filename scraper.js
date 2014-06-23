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
jQuery = ops.localjQuery ? 'http://localhost/phantomjs/static/js/vendor/jquery.js' : 'https://code.jquery.com/jquery-2.1.0.min.js';

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
                                selector = $(form).find('input,select,textarea').not('[type=hidden],[type=submit],[type=button]');
                            } else {
                                selector = $('input,select,textarea').not('[type=hidden],[type=submit],[type=button]');
                            }

                            var fieldCounter = 0;
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
                                    // We have to use this selector due to sizzle always returning 
                                    // 	1 element when using the # symbol.  This ensures we will
                                    // 	always get the actual number of elements using the id on the page
                                    if($('[id="' + properties.id + '"]').length > 1){
                                    	// If there is more than one element with the same id
                                    	// 	this field is useless to us.
                                    	properties.id = false;
									}
                                }

                                //Generate selector
                                properties.selector = properties.id ? '#' + properties.id : false;
								properties.use_eq = false;

                                if(!properties.selector){
									//Attempt to build a unique selector
									var tempSelector = type;

									if($this.prop('type')){
										tempSelector += '[type="' + $this.prop('type') + '"]';
									} else {
										tempSelector += ':text';
									}

									if(properties.name){
										tempSelector += '[name="' + properties.name + '"]';
									}

									var $temp = $(tempSelector);
									// First try to find the element with the selector built above.
									if($temp.length === 0){
										// If that got no results set $tem based on type (ex. input)
										tempSelector = type;
										$temp = $(tempSelector);
									}

									
									// No matter the result from above see if it matches the exact element.
									//   This works even if all the attributes are identical on two elements
									if($temp.length > 1){
										// We are going to have to use eq to get the element
										properties.use_eq = true;
										var index = 0;

										$temp.each(function(){
											if(this === $this.get(0)){
												// This is how to break out of a jQuery .each loop
												return false;
											}
											index++;
										});
										
										// Set the index so that we can then build a viable selector when generating the JS
										properties.eq = index;
									}

									properties.selector = tempSelector;
								}

                                if(type === 'input' && $this.prop('type') === 'radio'){
                                    //Make sure we get the value of the radio so we can choose correctly
                                    properties.value = $this.val();
                                    properties.selected = $this.is(':checked');
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
                                            fields.radios[properties.name] = {fields: [], type: 'radio', name: properties.name};
                                        }


                                        fields.radios[properties.name].fields.push(properties);
                                        fieldCounter++;
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
                                            case 'password':
                                                properties.type = 'password';
                                                break;
                                            default:
                                                //We have to add field types manually so default to text type
                                                properties.type = 'text';
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
                                        fieldCounter++;
                                    }
                                }
                            });

                            return {inputs: fields, count: fieldCounter};
                        }, function(obj){
                            console.log(JSON.stringify({success: 1, inputs: obj.inputs, count: obj.count}));

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
