<?php
require ('vendor/autoload.php');
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$yui = new \YUI\Compressor;
$request = Request::createFromGlobals();

$allFields = json_decode($request->get('fields'));

$script = '(function($){';

foreach($allFields as $index => $field){
	if($field->type !== 'radio'){
		$selector = "$('" . $field->selector . "')";

		if($field->use_eq){
			$selector .= ".eq(" . $field->eq . ")";
		}
		if($field->type !== 'radio' && $field->type !== 'checkbox'){
			$script .= $selector . ".val('" . $field->value . "');";
		} else {
			if($field->selected) {
				$script .= $selector . ".prop('checked', true);";
			}
		}
	} else {
		foreach($field->fields as $radio){
			$selector = "$('" . $radio->selector . "')";

			if($radio->use_eq){
				$selector .= ".eq(" . $radio->eq . ")";
			}

			if(property_exists($radio, 'id') && $radio->selected !== false){
				$script .= $selector . ".prop('checked', true);";
			}
		}
	}
}

$script .= '})(jQuery);';

$yui->setType(\YUI\Compressor::TYPE_JS);
$script = $yui->compress($script);

$script = 'javascript:' . $script;

$response = new Response($script, 200, ['Content-Type' => 'text/html']);
$response->send();
