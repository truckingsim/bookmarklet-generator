<?php
require ('vendor/autoload.php');

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$url = null;
$form = false;
$delay = false;

$request = Request::createFromGlobals();
$errors = [];

/**
 * Parsing request to set all variables no matter how request is sent.
 */

//We are going to allow script to be run from either ajax or command line for now
if(isset($argv) && count($argv)){
	$unnamedParameters = 0;
	$nextNamedParameter = '';
	$useAsValue = false;


	$paramReplace = ['--form' => '-f', '--delay' => '-d', '--url' => '-u'];
	$validParameters = ['--form', '-f', '-d', '--delay', '--url', '-u'];

	for($i = 0; $i < count($argv); $i++){

		$arg = $argv[$i];
		if($arg[0] === '-' && in_array($arg, $validParameters) && !$useAsValue){
			$nextNamedParameter = in_array($arg, array_values($paramReplace)) ? $arg : $paramReplace[$arg];
			$useAsValue = true;
		} else {
			if($useAsValue){
				switch($nextNamedParameter){
					case '-u':
						$url = $arg;
						break;
					case '-d':
						$delay = $arg;
						break;
					case '-f':
						$form = $arg;
						break;
				}
			}
		}
	}
} else {
	$url = $request->request->get('url');
	$form = $request->request->get('form', false);
	$delay = $request->request->has('delay') ? (int)$request->request->get('delay') : false;
}


/**
 * Basic validation
 */
if(is_null($url) || !strlen($url)){
	$errors[] = 'Must provide URL';
}

if(!filter_var($url, FILTER_VALIDATE_URL) || !preg_match('/^http/', $url)){
	$errors[] = 'Invalid URL, must start with http';
}

if($delay && (!is_int($delay) || $delay < 0 || $delay > 15000)){
	$errors[] = 'Delay must be an integer above 0 and below 15000';
}

if(count($errors)){
	$response = new Response(json_encode(['errors' => $errors]), 500, ['Content-Type' => 'application/json']);
	$response->send();
} else {

	//Build request
	$scraper_request = 'nodejs scraper.js -u ' . escapeshellarg($url);
	if($form){
		$scraper_request .= ' -f ' . escapeshellarg($form);
	}
	if($delay){
		$scraper_request .= ' -d ' . escapeshellarg($delay);
	}

	$scraper_request .= ' --localjQuery';
	$lines = shell_exec($scraper_request);

	$response = new Response($lines, 200, ['Content-Type' => 'application/json']);
	$response->send();
}
