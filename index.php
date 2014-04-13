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
			<div class="col-md-3">
				<div class="list-group menu">
					<a class="list-group-item active" href="#prefetch" data-toggle="tab">Prefetch Options</a>
					<a class="list-group-item disabled" href="#fields" data-toggle="tab">Fields Default</a>
				</div>
			</div>
			<div class="col-md-9 panel-container tab-content">
				<div class="tab-pane active" id="prefetch">
					<div class="panel panel-primary">
						<div class="panel-heading">Required Options</div>
						<div class="panel-body">
							<div class="form-group">
								<label for="url"><span data-toggle="tooltip" title="http:// or https:// required">URL</span> </label>
								<input class="form-control" id="url" type="text" data-bind="value: url, valueUpdate: 'afterkeydown'" />
							</div>
						</div>
					</div>
					<div class="panel panel-primary">
						<div class="panel-heading">Optional Options</div>
						<div class="panel-body">
							<div class="form-group">
								<label for="form">Form Container (<span data-toggle="tooltip" title=".class or #id">css selector format</span>)</label>
								<input class="form-control" id="form" type="text" data-bind="value: form, valueUpdate: 'afterkeydown'" />
							</div>
							<div class="form-group">
								<label for="delay"><span data-toggle="tooltip" title="max 15000, min 0">Delay</span> in milliseconds </label>
								<input class="form-control" id="delay" type="number" max="15000" min="0" data-bind="value: delay, valueUpdate: 'afterkeydown'" />
							</div>
						</div>
					</div>
					<button class="btn btn-primary" id="fetch" data-bind="click: fetchPage">Scrape That Page!</button>
				</div>
				<div class="tab-pane" id="fields">
					adf
				</div>
			</div>
		</div>

		<script src="static/js/vendor/jquery.js"></script>
		<script src="static/js/vendor/bootstrap.min.js"></script>
		<script src="static/js/vendor/knockout.min.js"></script>
		<script src="static/js/index.js"></script>
	</body>
</html>