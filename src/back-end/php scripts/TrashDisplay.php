<?php

header('Access-Control-Allow-Origin: http://localhost:3000');

$host='localhost';
$user='root';
$password='';
$db='fantamail';

$connection = mysqli_connect($host, $user, $password, $db) or die ('Failed to Connect to FantaMail Server');

$sql = 'SELECT * from trashed';
$result = mysqli_query($connection, $sql);
$json_array = array();
while($row = mysqli_fetch_assoc($result)){
	$json_array[] = $row;
}

echo json_encode($json_array);

?>
