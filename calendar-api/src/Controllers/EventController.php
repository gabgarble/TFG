<?php

namespace Src\Controllers;

use ArrayObject;
use Src\TableGateways\EventGateway;
use Src\TableGateways\EventColorGateway;
use Src\TableGateways\CalendarGateway;
use Src\TableGateways\UserEventRelationGateway;

use Src\Classes\Event;
use Src\Classes\EventColor;
use Src\Classes\Calendar;
use Src\Classes\Resizable;
use Src\Classes\JSONObject;

class EventController
{

    private $db;
    private $requestMethod;
    private $id;

    private $eventGateway;
    private $eventColorGateway;
    private $calendarGateway;
    private $userEventRelationGateway;

    public function __construct($db, $requestMethod, $id)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->id = $id;

        $this->eventGateway = new EventGateway($db);
        $this->eventColorGateway = new EventColorGateway($db);
        $this->calendarGateway = new CalendarGateway($db);
        $this->userEventRelationGateway = new UserEventRelationGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if (isset($this->id)) {
                    $response = $this->getAllEventsByUser($this->id);
                } else {
                    $response = $this->unprocessableEntityResponse();
                }
                break;
            case 'POST':
                $response = $this->createEventFromRequest();
                break;
            case 'PUT':
                $response = $this->updateEventFromRequest($this->id);
                break;
            case 'DELETE':
                $response = $this->deleteEvent($this->id);
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

    private function getAllEventsByUser($id)
    {
        $result = $this->eventGateway->findAll($id);
        $varToReturn = [];
        for ($i = 0; $i < sizeof($result); $i++) {
            $eventColor = $this->eventColorGateway->find($result[$i]->eventColorId);
            $calendar = $this->calendarGateway->find($result[$i]->calendarId);
            $calendar[0]->visible = $calendar[0]->visible == "1" ? true : false;
            $resizable = new Resizable($result[$i]->resizableBeforeStart == "1" ? true : false, $result[$i]->resizableBeforeEnd == "1" ? true : false);
            array_push($varToReturn, new Event($result[$i]->id, $result[$i]->start, $result[$i]->end, $result[$i]->title, $result[$i]->allDay == "1" ? true : false, $resizable, $result[$i]->draggable == "1" ? true : false, $result[$i]->userCreatorId, $eventColor, $calendar));
        }
        $otherEvents = $this->userEventRelationGateway->findAllByUser($id);
        for ($j = 0; $j < sizeof($otherEvents); $j++) {
            $result = $this->eventGateway->find($otherEvents[$j]->eventId);
            $eventColor = $this->eventColorGateway->find($result[0]->eventColorId);
            $calendar = $this->calendarGateway->find($result[0]->calendarId);
            $resizable = new Resizable($result[0]->resizableBeforeStart == "1" ? true : false, $result[0]->resizableBeforeEnd == "1" ? true : false);
            array_push($varToReturn, new Event($result[0]->id, $result[0]->start, $result[0]->end, $result[0]->title, $result[0]->allDay == "1" ? true : false, $resizable, $result[0]->draggable == "1" ? true : false, $result[0]->userCreatorId, $eventColor, $calendar));
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($varToReturn);
        return $response;
    }

    private function getEvent($id)
    {
        $result = $this->eventGateway->find($id);
        $eventColor = $this->eventColorGateway->find($result[0]->eventColorId);
        $calendar = $this->calendarGateway->find($result[0]->calendarId);
        $resizable = new Resizable($result[0]->resizableBeforeStart, $result[0]->resizableBeforeEnd);
        $varToReturn = new Event($result[0]->id, $result[0]->startDate, $result[0]->endDate, $result[0]->title, $result[0]->allDay, $resizable, $result[0]->draggable, $result[0]->userCreatorId, $eventColor, $calendar);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($varToReturn);
        return $response;
    }

    private function createEventFromRequest()
    {
        $result = array_values(json_decode(file_get_contents('php://input'), true));
        print_r($result[1]);

        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateEvent($input)) {
            return $this->unprocessableEntityResponse();
        }

        $this->eventGateway->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updateEventFromRequest($id)
    {
        $result = $this->eventGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }

        $input = (array) json_decode(file_get_contents('php://input'), TRUE);

        if (!$this->validateEvent($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->eventGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deleteEvent($id)
    {
        $result = $this->eventGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $this->eventGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validateEvent($input)
    {
        if (!isset($input['startDate'])) {
            return false;
        }
        if (!isset($input['endDate'])) {
            return false;
        }
        if (!isset($input['title'])) {
            return false;
        }
        if (!isset($input['allDay'])) {
            return false;
        }
        if (!isset($input['userCreatorId'])) {
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
