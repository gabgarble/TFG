<?php
require "../bootstrap.php";

use Src\Controllers\UserController;
use Src\Controllers\EventController;
use Src\Controllers\CalendarController;
use Src\Controllers\UserEventRelationController;
use Src\Controllers\PetitionController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// all of our endpoints start with /person
// everything else results in a 404 Not Found
if ($uri[1] !== 'user' && $uri[1] !== 'event' && $uri[1] !== 'calendar' && $uri[1] !== 'petition' && $uri[1] !== 'user-event-relation') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

switch ($uri[1]) {
    case 'user':
        $userId = null;
        $petition = null;
        $email = "";
        $password = "";

        if (isset($uri[2])) {
            $petition = $uri[2];
            if (isset($_GET['email'])) {
                $email = $_GET['email'];
            } else if (isset($_GET['password'])) {
                $password = $_GET['password'];
            }
        }
        if (isset($uri[3])) {
            $userId = (int) $uri[3];
        }

        $requestMethod = $_SERVER["REQUEST_METHOD"];

        $controller = new UserController($dbConnection, $requestMethod, $userId, $petition, $email, $password);
        $controller->processRequest();
        break;
    case 'event':
        $id = null;

        if (isset($uri[2])) {
            $id = (int) $uri[2];
        }

        $requestMethod = $_SERVER["REQUEST_METHOD"];

        $controller = new EventController($dbConnection, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'user-event-relation':
        $userEventRelationId = null;
        if (isset($uri[2])) {
            $userEventRelationId = (int) $uri[2];
        }

        $requestMethod = $_SERVER["REQUEST_METHOD"];

        $controller = new UserEventRelationController($dbConnection, $requestMethod, $userEventRelationId);
        $controller->processRequest();
        break;
    case 'calendar':
        $id = null;
        if (isset($uri[2])) {
            $id = (int) $uri[2];
        }

        $requestMethod = $_SERVER["REQUEST_METHOD"];

        $controller = new CalendarController($dbConnection, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'petition':
        $petitionId = null;
        $status = null;
        if (isset($uri[2])) {
            $petitionId = (int) $uri[2];
        }
        if (isset($uri[3])) {
            $status = (int) $uri[3];
        }

        $requestMethod = $_SERVER["REQUEST_METHOD"];

        $controller = new PetitionController($dbConnection, $requestMethod, $petitionId, $status, $_GET);
        $controller->processRequest();
        break;
    default:
        $response = $this->notFoundResponse();
        break;
}
