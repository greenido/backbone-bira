<?php

// Get the REST call path from the AJAX application
// Is it a POST or a GET?
error_log("GET['url']: ". $_GET['url']);
$url = $_GET['url'];
if (isset ($_POST['url']) ) {
  $url = $_POST['url']; 
}
//$url = $_GET['url'];
error_log("WORKING on: $url");

// Open the Curl session
$session = curl_init($url);

// If it's a POST, put the POST data in the body
if ( isset($_POST['url']) ) {
	$postvars = '';
	while ($element = current($_POST)) {
		$postvars .= urlencode(key($_POST)).'='.urlencode($element).'&';
		next($_POST);
	}
	curl_setopt ($session, CURLOPT_POST, true);
	curl_setopt ($session, CURLOPT_POSTFIELDS, $postvars);
}

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$json = curl_exec($session);
if ($json === FALSE) {
   die(curl_error($curl_handle));
}


header("Content-Type: application/json");
error_log("Our json: $json");
echo $json;
curl_close($session);

?>