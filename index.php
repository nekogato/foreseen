<?php
$user_agent = $_SERVER['HTTP_USER_AGENT'];

if (strpos($user_agent, 'facebookexternalhit') === false && strpos($user_agent, 'WhatsApp') === false) {
    header("Location: tc/");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Foreseen Property 2099 寓延地產 2099</title>
    <meta charset="utf-8">
    
    <!-- Open Graph Tags for Facebook/WhatsApp -->
    <meta property="og:title" content="Foreseen Property 2099 寓延地產 2099">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Foreseen Property 2099 寓延地產 2099">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="675">
    <meta property="og:image" content="https://fore-seen-2099.com/c_images/fb.png">
    
    <!-- Meta Refresh (optional) -->
    <meta http-equiv="refresh" content="0; url=https://fore-seen-2099.com/tc/">
</head>
<body>
</body>
</html>