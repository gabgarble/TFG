<?php
namespace Src\Controllers;

use Src\TableGateways\CalendarGateway;

class CalendarController {

    private $db;
    private $requestMethod;
    private $id;

    private $calendarGateway;

    public function __construct($db, $requestMethod, $id)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->id = $id;

        $this->calendarGateway = new CalendarGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->id) {
                    $response = $this->getAllCalendarsByUserId($this->id);
                }
                break;
            case 'POST':
                $response = $this->createCalendarFromRequest();
                break;
            case 'PUT':
                $response = $this->updateCalendarFromRequest($this->id);
                break;
            case 'DELETE':
                $response = $this->deleteCalendar($this->id);
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

    private function getAllCalendarsByUserId($userId)
    {
        $result = $this->calendarGateway->findAllByUserId($userId);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getAllCalendars()
    {
        $result = $this->calendarGateway->findAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getCalendar($id)
    {
        $result = $this->calendarGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createCalendarFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validateCreateCalendar($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->calendarGateway->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updateCalendarFromRequest($id)
    {
        $result = $this->calendarGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validateUpdateCalendar($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->calendarGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deleteCalendar($id)
    {
        $result = $this->calendarGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $this->calendarGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validateUpdateCalendar($input)
    {
        if (! isset($input['id'])) {
            return false;
        }
        if (! isset($input['name'])) {
            return false;
        }
        if (! isset($input['visible'])) {
            return false;
        }
        return true;
    }

    private function validateCreateCalendar($input)
    {
        if (! isset($input['name'])) {
            return false;
        }
        if (! isset($input['visible'])) {
            return false;
        }
        if (! isset($input['userId'])) {
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