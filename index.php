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
							<!-- ko template: {name: 'formTemplates', foreach: fields} -->
							<!-- /ko -->
							<button data-bind="click: generateJavascriptString">Generate JavaScripts!!</button>
							<a data-bind="attr: {href: javascriptString}, visible: javascriptString().length"></a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<script id="formTemplates" type="text/html">
			<!-- ko if: type === 'text' -->
				<!-- ko template: {name: templateName, data: $data} -->
				<!-- /ko -->
			<!-- /ko -->
			<!-- ko if: type === 'select' -->
				<!-- ko template: {name: templateName, data: $data} -->
				<!-- /ko -->
			<!-- /ko -->
			<!-- ko if: type === 'checkbox' -->
				<!-- ko template: {name: templateName, data: $data} -->
				<!-- /ko -->
			<!-- /ko -->
			<!-- ko if: type === 'radio' -->
				<!-- ko template: {name: templateName, data: $data} -->
				<!-- /ko -->
			<!-- /ko -->
			<!-- ko if: type === 'textarea' -->
				<!-- ko template: {name: templateName, data: $data} -->
				<!-- /ko -->
			<!-- /ko -->
		</script>

		<script id="formElement-text" type="text/html">
			<div class="form-group">
				<div class="row">
					<div class="col-md-4">
						<label for="" data-bind="text: name || id"></label>
					</div>
					<div class="col-md-8">
						<input id="" type="text" name="" value="" data-bind="value: value, valueUpdate: 'afterkeydown'">
					</div>
				</div>
			</div>
		</script>
		<script id="formElement-select" type="text/html">
			<div class="form-group">
				<div class="row">
					<div class="col-md-4">
						<label for="" data-bind="text: name || id"></label>
					</div>
					<div class="col-md-8">
						<select id="" name="" data-bind="value: value">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>
					</div>
				</div>
			</div>
		</script>
		<script id="formElement-checkbox" type="text/html">
			<div class="form-group">
				<div class="row">
					<div class="col-md-4">
						<label for="" data-bind="text: name || id"></label>
					</div>
					<div class="col-md-8">
						<input id="" type="checkbox" name="" data-bind="checked: selected, value: value">
					</div>
				</div>
			</div>
		</script>
		<script id="formElement-textarea" type="text/html">
			<div class="form-group">
				<div class="row">
					<div class="col-md-4">
						<label for="" data-bind="text: name || id"></label>
					</div>
					<div class="col-md-8">
						<textarea id="" name="" cols="30" rows="10" data-bind="value: value, valueUpdate: 'afterkeydown'"></textarea>
					</div>
				</div>
			</div>
		</script>
		<script id="formElement-radio" type="text/html">
			<div class="form-group">
				<div class="row">
					<div class="col-md-4">
						<label for="" data-bind="text: name || id"></label>
					</div>
					<div class="col-md-8">
						<!-- ko foreach: fields -->
							<label data-bind="attr: {for: id}, text: label || id"></label>
							<input type="radio" data-bind="attr: {name: name, id: id}, value: value, checked: selected" />
						<!-- /ko -->
					</div>
				</div>
			</div>
		</script>
		<!-- /templates -->

		<script src="static/js/vendor/jquery.js"></script>
		<script src="static/js/vendor/bootstrap.min.js"></script>
		<script src="static/js/vendor/knockout.min.js"></script>
		<script src="static/js/index.js"></script>
	</body>
</html>
