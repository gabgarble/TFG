<?php

namespace Src\Controllers;

use Src\TableGateways\PetitionGateway;
use Src\TableGateways\UserGateway;
use Src\Classes\User;

class PetitionController
{

    private $db;
    private $requestMethod;
    private $petitionId;
    private $status;
    private $URLParameters;

    private $petitionGateway;
    private $userGateway;

    public function __construct($db, $requestMethod, $petitionId, $status, $URLParameters)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->petitionId = $petitionId;
        $this->status = $status;
        $this->URLParameters = $URLParameters;

        $this->petitionGateway = new PetitionGateway($db);
        $this->userGateway = new UserGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if (isset($this->petitionId) && isset($this->status)) {
                    $response = $this->getAllPetitionsByUserIdAndStatus($this->petitionId, $this->status);
                } else {
                    $response = $this->unprocessableEntityResponse();
                }
                break;
            case 'POST':
                $response = $this->createPetitionFromRequest();
                break;
            case 'PUT':
                $response = $this->updatePetitionFromRequest($this->petitionId);
                break;
            case 'DELETE':
                $response = $this->deletePetition($this->petitionId);
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

    private function getAllPetitionsByUserIdAndStatus($userId, $status)
    {
        $result = $this->petitionGateway->findAllByUserIdAndStatus($userId, $status);
        $varToReturn = [];

        if ($status == 'accepted') {
            for ($i = 0; $i < sizeof($result); $i++) {
                $user = $this->userGateway->find($result[$i]->userReceiverId);
                array_push($varToReturn, new User($user[0]->id, $user[0]->name, $user[0]->surname, $user[0]->username, $user[0]->email));
            }
        } else if ($status == 'pending') {
            for ($i = 0; $i < sizeof($result); $i++) {
                $user = $this->userGateway->find($result[$i]->userSenderId);
                array_push($varToReturn, new User($user[0]->id, $user[0]->name, $user[0]->surname, $user[0]->username, $user[0]->email));
            }
        }

        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($varToReturn);
        return $response;
    }

    private function getPetition($id)
    {
        $result = $this->petitionGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createPetitionFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validatePetitionGateway($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->petitionGateway->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updatePetitionFromRequest($id)
    {
        $result = $this->petitionGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validatePetitionGateway($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->petitionGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deletePetition($id)
    {
        $result = $this->petitionGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $this->petitionGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validatePetitionGateway($input)
    {
        if (!isset($input['id'])) {
            return false;
        }
        if (!isset($input['userSenderId'])) {
            return false;
        }
        if (!isset($input['userReceiverId'])) {
            return false;
        }
        if (!isset($input['petitionStatusId'])) {
            return false;
        }
        return true;
    }

    private function validateGetPetition($userId, $status)
    {
        if (!isset($userId)) {
            return false;
        }
        if (!isset($status)) {
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
