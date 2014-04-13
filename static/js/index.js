//;(function(){

function Field(data){
    $.extend(this, data);
    var self = this;

    self.value = ko.observable('');
}

function ViewModel(){
    var self = this;

    self.url = ko.observable('');
    self.form = ko.observable('');
    self.delay = ko.observable(1000);
    self.errorString = ko.observable('');

    self.fetchPage = function(){
        //Disable button
        $('#fetch').prop('disabled', true);

        self.errorString('');
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
                $('#fetch').prop('disabled', false);
            }
          , error: errorHandler
        });
    };


    var errorHandler = function(xhr){
        var json = $.parseJSON(xhr.responseText);
        if(json.hasOwnProperty('errors')){
            self.errorString(json.errors.join('<br>'));
        }
        $('#fetch').prop('disabled', false);
    };
}

var vModel = new ViewModel;
$(function(){
    $('.menu').on('click', '.disabled', function(e){
        e.preventDefault();
        return false;
    });

    $('span[data-toggle=tooltip]').tooltip();
    ko.applyBindings(vModel);
});

//})();