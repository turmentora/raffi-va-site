<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Invalid form submission.";
        exit;
    }

    $smtpHost = getenv('SMTP_HOST') ?: 'mail.privateemail.com';
    $smtpUser = getenv('SMTP_USERNAME');
    $smtpPass = getenv('SMTP_PASSWORD');
    $smtpPort = (int)(getenv('SMTP_PORT') ?: 465);
    $smtpSecure = getenv('SMTP_SECURE') ?: 'ssl';

    $toAddress = getenv('CONTACT_TO') ?: 'raffi.ivanov-jones@virtualassitant.co.uk';
    $fromAddress = getenv('CONTACT_FROM') ?: $toAddress;

    if (!$smtpUser || !$smtpPass) {
        http_response_code(500);
        echo "Email service not configured.";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;
        $mail->SMTPSecure = $smtpSecure;
        $mail->Port = $smtpPort;

        $mail->setFrom($fromAddress, 'Website Contact Form');
        $mail->addAddress($toAddress);
        $mail->addReplyTo($email, $name);

        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission';
        $mail->Body    = "<strong>Name:</strong> {$safeName}<br>
                          <strong>Email:</strong> {$safeEmail}<br><br>
                          <strong>Message:</strong><br>{$safeMessage}";
        $mail->SMTPDebug = 0;

        $mail->send();
        header('Location: thank-you.html', true, 303);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo "Message could not be sent. Error: {$mail->ErrorInfo}";
        exit;
    }
}
?>