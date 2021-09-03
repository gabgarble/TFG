<?php
namespace Src\Controllers;

use Src\TableGateways\PetitionStatusGateway;

class PetitionStatusController {

    private $db;
    private $requestMethod;
    private $petitionStatusId;

    private $petitionStatusGateway;

    public function __construct($db, $requestMethod, $petitionStatusId)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->petitionStatusId = $petitionStatusId;

        $this->petitionStatusGateway = new PetitionStatusGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->petitionStatusId) {
                    $response = $this->getPetitionStatus($this->petitionStatusId);
                } else {
                    $response = $this->getAllPetitionsStatus();
                };
                break;
            case 'POST':
                $response = $this->createPetitionStatusFromRequest();
                break;
            case 'PUT':
                $response = $this->updatePetitionStatusFromRequest($this->petitionStatusId);
                break;
            case 'DELETE':
                $response = $this->deletePetitionStatus($this->petitionStatusId);
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

    private function getAllPetitionsStatus()
    {
        $result = $this->petitionStatusGateway->findAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getPetitionStatus($id)
    {
        $result = $this->petitionStatusGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createPetitionStatusFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validatePetitionStatus($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->petitionStatusGateway->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updatePetitionStatusFromRequest($id)
    {
        $result = $this->petitionStatusGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (! $this->validatePetitionStatus($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->petitionStatusGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deletePetitionStatus($id)
    {
        $result = $this->petitionStatusGateway->find($id);
        if (! $result) {
            return $this->notFoundResponse();
        }
        $this->petitionStatusGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validatePetitionStatus($input)
    {
        if (! isset($input['id'])) {
            return false;
        }
        if (! isset($input['name'])) {
            return false;
        }
        if (! isset($input['surname'])) {
            return false;
        }
        if (! isset($input['username'])) {
            return false;
        }
        if (! isset($input['email'])) {
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