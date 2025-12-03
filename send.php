<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer(true);

    try {
        // SMTP settings for PrivateEmail
        $mail->isSMTP();
        $mail->Host = 'mail.privateemail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'raffi.ivanov-jones@virtualassitant.com'; // your PrivateEmail username
        $mail->Password = 'Missy23569';                             // your PrivateEmail password
        $mail->SMTPSecure = 'tls';                                  // use 'ssl' if tls fails
        $mail->Port = 587;                                          // 465 if using ssl

        // Sender and recipient
        $mail->setFrom('raffi.ivanov-jones@virtualassitant.com', 'Website Contact Form');
        $mail->addAddress('raffi.ivanov-jones@virtualassitant.com'); // receive at same address
        $mail->addReplyTo($email, $name);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission';
        $mail->Body    = "<strong>Name:</strong> $name <br>
                          <strong>Email:</strong> $email <br><br>
                          <strong>Message:</strong><br>$message";

        // Debugging (optional, shows errors if failing)
        $mail->SMTPDebug = 2;

        $mail->send();
        echo "Message sent successfully!";
    } catch (Exception $e) {
        echo "Message could not be sent. Error: {$mail->ErrorInfo}";
    }
}
?>
