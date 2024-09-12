<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"]=="POST") {
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $username = $_POST['email'];
    $password = $_POST['password'];
}
?>