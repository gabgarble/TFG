<?php
namespace Src\Controllers;

use Src\TableGateways\UserEventRelationGateway;

class UserEventRelationController {

    private $db;
    private $requestMethod;
    private $userEventRelationId;

    private $userEventRelationGateway;

    public function __construct($db, $requestMethod, $userEventRelationId)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->userEventRelationId = $userEventRelationId;

        $this->userEventRelationGateway = new UserEventRelationGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->userEventRelationId) {
                    $response = $this->getUserEventRelation($this->userEventRelationId);
                } else {
                    $response = $this->getAllUserEventRelations();
                };
                break;
            case 'POST':
                $response = $this->createUserEventRelationFromRequest();
                break;
            case 'PUT':
                $response = $this->updateUserEventRelationFromRequest($this->userEventRelationId);
                break;
            case 'DELETE':
                $response = $this->deleteUserEventRelation($this->userEventRelationId);
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

    private function getAllUserEventRelations()
    {
        $result = $this->userEventRelationGateway->findAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getUserEventRelation($id)
    {
        $result = $this->userEventRelationGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createUserEventRelationFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validateUserEventRelation($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->userEventRelationGateway->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updateUserEventRelationFromRequest($id)
    {
        $result = $this->userEventRelationIdGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validateUserEventRelation($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->userEventRelationGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deleteUserEventRelation($id)
    {
        $result = $this->userEventRelationGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $this->userEventRelationIdGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validateUserEventRelation($input)
    {
        if (! isset($input['eventId'])) {
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