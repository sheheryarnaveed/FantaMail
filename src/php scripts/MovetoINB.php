<?php

header('Access-Control-Allow-Origin: http://localhost:3000');

$host='localhost';
$user='root';
$password='';
$db='fantamail';
$connection = mysqli_connect($host, $user, $password, $db) or die ('Failed to Connect to FantaMail Server');

if(isset($_GET['Important'])){
	$id = $_GET['Important'];
	$sql = "SELECT * FROM important WHERE id='$id'";
	$response = mysqli_query($connection,$sql) or die ('Failed to Find the requested item'.mysqli_error($connection));
	$row = mysqli_fetch_assoc($response);

	$sql = "alter table inbox AUTO_INCREMENT = 0";
	$response = mysqli_query($connection, $sql) or die ('Failed to auto increment Insert'.mysqli_error($connection));
	//use of prepared statements to avoid sql injections
	$stmt = $connection->prepare("INSERT INTO inbox (emailAddress, message, date, category) VALUES (?, ?, ?, ?)");
	$stmt->bind_param('ssss', $email, $message, $date, $category);
	$email = $row['emailAddress'];
	$message = $row['message'];
	$date = $row['date'];
	$category = "Inbox";
	$stmt->execute();
	$stmt->close();
	
	$sql = "DELETE FROM important WHERE id='$id'";
	$response = mysqli_query($connection, $sql) or die ('Failed to Delete the requested item\n'.mysqli_error($connection));
	$sql = "set @autoid := 0";
	$response = mysqli_query($connection, $sql) or die ('Failed to reset auto increment\n'.mysqli_error($connection));
	$sql = "update important set id = @autoid := (@autoid+1)";
	$response = mysqli_query($connection, $sql) or die ('Failed to reset auto increment\n'.mysqli_error($connection));
	$sql = " alter table important AUTO_INCREMENT=1";
	$response = mysqli_query($connection, $sql) or die ('Failed to reset auto increment\n'.mysqli_error($connection));

	//retrieving updated data
	$sql = 'SELECT * from important';
	$result = mysqli_query($connection, $sql);
	$json_array = array();
	while($row = mysqli_fetch_assoc($result)){
		$json_array[] = $row;
	}
}

if(isset($_GET['Trash'])){
	$id = $_GET['Trash'];
	$sql = "SELECT * FROM trashed WHERE id='$id'";
	$response = mysqli_query($connection,$sql) or die ('Failed to Find the requested item: '.mysqli_error($connection));
	$row = mysqli_fetch_assoc($response);

	$sql = "alter table inbox AUTO_INCREMENT = 0";
	$response = mysqli_query($connection, $sql) or die ('Failed to auto increment Insert'.mysqli_error($connection));
	//use of prepared statements to avoid sql injections
	$stmt = $connection->prepare("INSERT INTO inbox (emailAddress, message, date, category) VALUES (?, ?, ?, ?)");
	$stmt->bind_param('ssss', $email, $message, $date, $category);
	$email = $row['emailAddress'];
	$message = $row['message'];
	$date = $row['date'];
	$category = "Inbox";
	$stmt->execute();
	$stmt->close();
	
	$sql = "DELETE FROM trashed WHERE id='$id'";
	$response = mysqli_query($connection, $sql) or die ('Failed to Delete the requested item: '.mysqli_error($connection));
	$sql = "set @autoid := 0";
	$response = mysqli_query($connection, $sql) or die ('Failed to reset auto increment: '.mysqli_error($connection));
	$sql = "update trashed set id = @autoid := (@autoid+1)";
	$response = mysqli_query($connection, $sql) or die ('Failed to reset auto increment: '.mysqli_error($connection));
	$sql = " alter table trashed AUTO_INCREMENT=1";
	$response = mysqli_query($connection, $sql) or die ('Failed to reset auto increment: '.mysqli_error($connection));

	//retrieving updated data
	$sql = 'SELECT * from trashed';
	$result = mysqli_query($connection, $sql);
	$json_array = array();
	while($row = mysqli_fetch_assoc($result)){
		$json_array[] = $row;
	}
}

echo json_encode($json_array);
?>
