var radioValues = {};

var getRadioValue = function(name, value, selected){
    if(!radioValues[name]){
        radioValues[name] = ko.observable('');
    }

    if(selected){
        radioValues[name] = value;
    }

    return radioValues[name];
};

var Field = function(data){
    var self = this;

    //Each field type gets its own function in case we need to do anything special to it.  If not its a placeholder
    self._select = function(){
        self.value = ko.observable(self.value || '');
    };

    self._text = function(){
        self.value = ko.observable(self.value || '');
    };

    self._password = function(){
        //For now passwords will act like text boxes
        self.templateName = 'formElement-text';
        self._text();
    };

    self._checkbox = function(){
        self.selected = ko.observable(false);
        self.value = ko.observable(self.value || false);
    };

    self._textarea = function(){
        self.value = ko.observable(self.value || '');
    };

    self._radio = function(){
        self.templateName = 'formElement-' + self.type;
        self.selected = getRadioValue(self.name, self.value, self.selected);
        self.value = ko.observable(self.value);
    };

    $.extend(self, data);
    self.templateName = 'formElement-' + self.type;


    //Initialize based on field type:
    self['_' + self.type]();
};




function ViewModel(){
    var self = this;

    //Fetch settings
    self.url = ko.observable('');
    self.form = ko.observable('');
    self.delay = ko.observable(1000);

    //Fetch other fields
    self.errorString = ko.observable('');
    self.messageString = ko.observable('');
    var messageStringId = 0;
    self.fetchLoading = ko.observable(false);

    //Fields settings
    self.disableFieldsTab = ko.observable(true);

    //Fields
    self.fields = ko.observableArray([]);

    self.fetchPage = function(){
        self.fetchLoading(true);

        self.errorString('');
        self.messageString('');
        var params = {
            url: self.url()
          , form: self.form()
          , delay: self.delay()
        };

        $.ajax('retrieve.php', {
            dataType: 'json'
          , type: 'POST'
          , data: params
          , success: function(data){
                console.log(data);
                self.fetchLoading(false);

                if(data.count > 0){
                    //Remove disabled attribute from fields menu link
                    self.disableFieldsTab(false);
                    //Set fields menu link as active and switch to the tab
                    showTab(1);

                    var localFields = []
                      , nonRadioLen = data.inputs.notRadios.length;

                    if(nonRadioLen){
                        for(var i = 0; i < nonRadioLen; i++){
                            localFields.push(new Field(data.inputs.notRadios[i]));
                        }
                    }

                    if(Object.keys(data.inputs.radios).length){
                        for(var name in data.inputs.radios){
                            if(data.inputs.radios.hasOwnProperty(name)){
                                localFields.push(new Field(data.inputs.radios[name], name));
                            }
                        }
                    }

                    self.fields(localFields);

                } else {
                    //Make sure we are on the first tab
                    showTab(0);

                    //Set message string
                    self.messageString('Request was valid but could not find any inputs');

                    //Reset timeout in case we have submitted again in less than 3 seconds
                    clearTimeout(messageStringId);

                    //Clear message in 3 seconds
                    messageStringId = setTimeout(function(){
                        self.messageString('');
                    }, 3000);
                }
            }
          , error: errorHandler
        });
    };

	self.generateJavascriptString = function(){
		console.log($.parseJSON(ko.toJSON(self.fields)));
	};

	self.javascriptString = ko.observable('');

    var showTab = function(index){
        $('.menu').find('a').removeClass('active').eq(index).addClass('active').tab('show');
    };

    var errorHandler = function(xhr){
        var json = $.parseJSON(xhr.responseText);
        if(json.hasOwnProperty('errors')){
            self.errorString(json.errors.join('<br>'));
        }
        self.fetchLoading(false);
    };
}

var vModel = new ViewModel;
$(function(){
    var $menu = $('.menu');
    $menu.on('click', 'a', function(e){
        if($(this).hasClass('disabled')){
            e.preventDefault();
            return false;
        }
        $menu.find('a').removeClass('active');
        $(this).addClass('active');

        return true;
    });

    $('span[data-toggle=tooltip]').tooltip();
    ko.applyBindings(vModel);
});