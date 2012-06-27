<?php

//
// basic basic proxy that run cUrl in shell - good to quick testing of REST APIs
//
// Ido Green
// Date: may 2012
//
function postToString() {
  $query_string = "";
  if ($_POST) {
    $kv = array();
    foreach ($_POST as $key => $value) {
      $kv[] = "$key=$value";
    }
    $query_string = join("&", $kv);
  }
  else {
    $query_string = $_SERVER['QUERY_STRING'];
  }
  return $query_string;
}


$url =    $_GET['url'];
$limits = $_GET['limit'];
$cursor = $_GET['cursor'];

$postData = str_replace( '\\', "", $_GET['postData']);

error_log("WORKING on: $url and _POST: " . postToString()  . 
  " postData: ". $postData . "\n==========\n");

//
function getUrl($url) {
	error_log("--> Fetch:" . $url);
  try {
  	$handle = fopen($url, "rb");
    if ($handle == false) {
      header("Content-Type: application/json");
      echo "[{data {error: 'could not fetch url: {$url}'}}]";
      return;
    }
  	$ret = stream_get_contents($handle);
  	fclose($handle);
    error_log("Simple GET ret:\n $ret \n");
    header("Content-Type: application/json");
    echo $ret;
  } 
  catch (Exception $e) {
    header("Content-Type: application/json");
    echo "[{data {error: '$e'}}]";
  }
	
}

//
function runCurl ($params){
  $postParams = "";
  if (isset($params) && strlen($params) > 1) {
    $postParams = "-d '" . $params . "'";
  }
  $runCmd = "curl -H 'content-type:application/json' {$postParams} " . $_GET['url'];
  error_log("run cmd: " . $runCmd . "\n\n");
  $output = shell_exec($runCmd);
  error_log("exec ret: $output");
  header("Content-Type: application/json");
  echo "$output";
}

//
if (isset($_GET['url']) &&  isset($_GET['limit']) ) {
  $tmpParams = isset($cursor) ? "?cursor=".$cursor . "&limit=" . $_GET['limit'] : "?limit=" . $_GET['limit'];
  $tmpUrl = urldecode($_GET['url'] . $tmpParams  );
  
  error_log("===> Fetching GET: $tmpUrl  with limit: " .  $_GET['limit']);
  getUrl($tmpUrl);
}
elseif (isset($_GET['url']) && !isset($postData) ) {
	getUrl($_GET['url']);
} 
else {
  error_log("=== postData: $postData");
    runCurl($postData); // TODO: should be $_POST
}
