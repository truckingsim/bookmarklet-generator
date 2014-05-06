<!doctype html>
<html lang="en-US">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title></title>

		<link href="static/css/bootstrap.min.css" rel="stylesheet">
		<link href="static/css/main.css" rel="stylesheet">
	</head>
	<body>
		<div class="container">
			<!-- ko if: errorString().length -->
				<div class="col-md-12">
					<div class="alert alert-danger" data-bind="html: errorString"></div>
				</div>
			<!-- /ko --> <!-- /if: errorString().length -->
			<!-- ko if: messageString().length -->
			<div class="col-md-12">
				<div class="alert alert-info" data-bind="html: messageString"></div>
			</div>
			<!-- /ko --> <!-- /messageString().length -->
			<div class="col-md-3">
				<div class="list-group menu">
					<a class="list-group-item active" href="#prefetch" id="prefetch-tab" data-toggle="tab">Prefetch Options</a>
					<a class="list-group-item" href="#fields" id="fields-tab" data-toggle="tab" data-bind="css: {disabled: disableFieldsTab()}">Fields Default</a>
				</div>
			</div>
			<div class="col-md-9 panel-container tab-content">
				<div class="tab-pane active" id="prefetch">
					<div class="panel panel-primary">
						<div class="panel-heading">Required Options</div>
						<div class="panel-body">
							<div class="form-group">
								<label for="url"><span data-toggle="tooltip" title="http:// or https:// required">URL</span> </label>
								<input class="form-control" id="url" type="text" tabindex="1" data-bind="value: url, valueUpdate: 'afterkeydown'" />
							</div>
						</div>
					</div>
					<div class="panel panel-primary">
						<div class="panel-heading">Optional Options</div>
						<div class="panel-body">
							<div class="form-group">
								<label for="form">Form Container (<span data-toggle="tooltip" title=".class or #id">css selector format</span>)</label>
								<input class="form-control" id="form" type="text" tabindex="2" data-bind="value: form, valueUpdate: 'afterkeydown'" />
							</div>
							<div class="form-group">
								<label for="delay"><span data-toggle="tooltip" title="max 15000, min 0">Delay</span> in milliseconds </label>
								<input class="form-control" id="delay" type="number" max="15000" min="0" tabindex="3" data-bind="value: delay, valueUpdate: 'afterkeydown'" />
							</div>
						</div>
					</div>
					<button class="btn btn-primary" id="fetch" tabindex="4" data-bind="click: fetchPage, disable: fetchLoading()">Scrape That Page! <img src="static/img/ajax-loader.gif" data-bind="visible: fetchLoading()" /> </button>
				</div>
				<div class="tab-pane" id="fields">
					<div class="panel panel-primary">
						<div class="panel-heading">Fields</div>
						<div class="panel-body">
							<!-- ko template: {name: function(item){ return item.templateName}, foreach: fields} -->
							<!-- /ko -->
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- templates -->
		<script id="formElement-text" type="text/x-handlebars-template">
			<div class="form-group">
				<label for="">{{#if label}}{{label}}{{else}}{{id}}{{/if}}</label>
				<input id="" type="text" name="" value="" >
			</div>
		</script>
		<script id="formElement-select" type="text/x-handlebars-template">
			<div class="form-group">
				<label for="">{{#if label}}{{label}}{{else}}{{id}}{{/if}}</label>
				<select id="" name="">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</div>
		</script>
		<script id="formElement-checkbox" type="text/x-handlebars-template">
			<div class="form-group">
				<label for="">{{#if label}}{{label}}{{else}}{{id}}{{/if}}</label>
				<input id="" type="checkbox" name="">
			</div>
		</script>
		<script id="formElement-textarea" type="text/x-handlebars-template">
			<div class="form-group">
				<label for="">{{#if label}}{{label}}{{else}}{{id}}{{/if}}</label>
				<textarea id="" name="" cols="30" rows="10"></textarea>
			</div>
		</script>
		<script id="formElement-radio" type="text/x-handlebars-template">
			<div class="form-group">
				<label for="">{{name}}</label>
				<input id="" type="radio" name="">
			</div>
		</script>


		<!-- /templates -->

		<script src="static/js/vendor/jquery.js"></script>
		<script src="static/js/vendor/bootstrap.min.js"></script>
		<script src="static/js/vendor/handlebars-v1.3.0.js"></script>
		<script src="static/js/vendor/knockout.min.js"></script>
		<script src="static/js/ko.handlebars.js"></script>
		<script src="static/js/index.js"></script>
	</body>
</html>
