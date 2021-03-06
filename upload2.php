<?php


$output = array();

$IMG_Name = $_FILES['ImageToUpload']['name'];
$target_dir = $_SERVER['DOCUMENT_ROOT'].'/cuentoInteractivo/IMG_NEW/historia/';
$target_file = $target_dir . basename($_FILES["ImageToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["ImageToUpload"]["tmp_name"]);
    if($check !== false) {
      array_push(output, "File is an image - " . $check["mime"] . ".");
      $uploadOk = 1;
    } else {
      array_push(output, "File is not an image.");
      $uploadOk = 0;
    }
  }

// Check if file already exists
if (file_exists($target_file)) {
    array_push(output, "Sorry, file already exists.");
    $uploadOk = 0;
  }

  // Check file size
  if ($_FILES["ImageToUpload"]["size"] > 2000000) {
    array_push(output, "Sorry, your file is too large.");
    $uploadOk = 0;
  }

  // Allow certain file formats
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
  && $imageFileType != "gif" ) {
    array_push(output, "Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
    $uploadOk = 0;
  }


// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    array_push(output, "Sorry, your file was not uploaded.");
  // if everything is ok, try to upload file
  } else {
    if (move_uploaded_file($_FILES["ImageToUpload"]["tmp_name"], $target_file)) {
      array_push(output, "The file ". basename( $_FILES["ImageToUpload"]["name"]). " has been uploaded.");
    } else {
      array_push(output, "Sorry, there was an error uploading your file.");
    }
  }

$response = array();
$response["message"] = $output;

echo json_encode($response, JSON_UNESCAPED_SLASHES);


?>

