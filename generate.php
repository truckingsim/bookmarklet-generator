<?php
require ('vendor/autoload.php');
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$yui = new \YUI\Compressor;
$request = Request::createFromGlobals();

$allFields = json_decode($request->get('fields'));

$script = '(function($){';

foreach($allFields as $index => $field){
	//For now just fields with ID's
	if($field->type !== 'radio'){
		//Build selector
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
			if(property_exists($radio, 'id') && $radio->selected !== false){
				$script .= "$('#" . $radio->id . "').prop('checked', true);";
			}
		}
	}
}

$script .= '})(jQuery);';

$yui->setType(\YUI\Compressor::TYPE_JS);
$script = $yui->compress($script);

$script = 'javascript:' . $script;

//var_dump($script);

$response = new Response($script, 200, ['Content-Type' => 'text/html']);
$response->send();
