<?php
$url = false;
$form = false;
$delay = false;


//We are going to allow script to be run from either ajax or command line for now
if(count($argv)){
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
	//Get parameters... a little easier to parse.
}


//echo exec('bin/phantomjs scrape.js', $lines, $return)
$lines = shell_exec('nodejs /var/www/phantomjs/scraper.js -u "https://google.com" -f createUser -d 500');

echo $lines;