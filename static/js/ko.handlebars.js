ko.handlebarsTemplateEngine = function () { }
ko.handlebarsTemplateEngine.prototype = ko.utils.extend(new ko.templateEngine(), {
    templates: {},
    renderTemplateSource: function (templateSource, bindingContext, options) {
        var data = bindingContext.$data,
            templateId = options,
            templateText = templateSource.text(),
            compiledTemplate = this.templates[templateId];

        // only compile the template once on the client
        if (compiledTemplate == null) {
            compiledTemplate = Handlebars.compile(templateText);
            this.templates[templateId] = compiledTemplate;
        }

        console.log('what');

        return ko.utils.parseHtmlFragment(compiledTemplate(data));
    },
    allowTemplateRewriting: false
});
ko.setTemplateEngine(new ko.handlebarsTemplateEngine());