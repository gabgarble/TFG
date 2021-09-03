<?php
namespace Src\Controllers;

use Src\TableGateways\EventColorGateway;

class EventColorController {

    private $db;
    private $requestMethod;
    private $eventColorId;

    private $eventColorGateway;

    public function __construct($db, $requestMethod, $eventColorId)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->eventColorId = $eventColorId;

        $this->eventColorGateway = new EventColorGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->eventColorId) {
                    $response = $this->getEventColor($this->eventColorId);
                } else {
                    $response = $this->getAllEventsColors();
                };
                break;
            case 'POST':
                $response = $this->createEventColorFromRequest();
                break;
            case 'PUT':
                $response = $this->updateEventColorFromRequest($this->eventColorId);
                break;
            case 'DELETE':
                $response = $this->deleteEventColor($this->eventColorId);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }

    private function getAllEventsColors()
    {
        $result = $this->eventColorGateway->findAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getEventColor($id)
    {
        $result = $this->eventColorGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createEventColorFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validateEventColor($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->eventColorGateway->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updateEventColorFromRequest($id)
    {
        $result = $this->eventColorGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validateEventColor($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->eventColorGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deleteEventColor($id)
    {
        $result = $this->eventColorGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $this->eventColorGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validateEventColor($input)
    {
        if (! isset($input['id'])) {
            return false;
        }
        if (! isset($input['description'])) {
            return false;
        }
        if (! isset($input['primaryColor'])) {
            return false;
        }
        if (! isset($input['secondaryColor'])) {
            return false;
        }
        return true;
    }

    private function unprocessableEntityResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
        $response['body'] = json_encode([
            'error' => 'Invalid input'
        ]);
        return $response;
    }

    private function notFoundResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        $response['body'] = null;
        return $response;
    }
}