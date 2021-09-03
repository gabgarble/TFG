<?php

namespace Src\Controllers;

use Src\TableGateways\UserGateway;

class UserController
{

    private $db;
    private $requestMethod;
    private $userId;
    private $petition;
    private $email;
    private $password;

    private $userGateway;

    public function __construct($db, $requestMethod, $userId, $petition, $email, $password)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->userId = $userId;
        $this->petition = $petition;
        $this->email = $email;
        $this->password = $password;

        $this->userGateway = new UserGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                /*if ($this->userId) {
                    $response = $this->getUser($this->userId);
                } else {
                    $response = $this->getAllUsers();
                };*/
                if ($this->petition == "sign-in-user") {
                    $response = $this->getSignInUser($this->email, $this->password);
                } else if ($this->petition == "get-user-by-email") {
                    $response = $this->getUserByEmail($this->email);
                }
                break;
            case 'POST':
                if ($this->petition == "sign-up-user") {
                    $response = $this->createUserFromRequest();
                }
                break;
            case 'PUT':
                $response = $this->updateUserFromRequest($this->userId);
                break;
            case 'DELETE':
                $response = $this->deleteUser($this->userId);
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

    private function getAllUsers()
    {
        $result = $this->userGateway->findAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getUser($id)
    {
        $result = $this->userGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getUserByEmail($email)
    {
        $result = $this->userGateway->findByEmail($email);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getSignInUser($email, $password)
    {
        $result = $this->userGateway->findByUserPassword($email, $password);
        if (!$result) {
            return $this->noContentResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createUserFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateRegisterUser($input)) {
            return $this->unprocessableEntityResponse();
        }

        $result = $this->userGateway->findByEmail($input['email']);
        if ($result) {
            return $this->userRegisteredEntityResponse();
        }

        $this->userGateway->insert($input);
        $result = $this->userGateway->findByEmail($input['email']);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function updateUserFromRequest($id)
    {
        $result = $this->userGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateUpdateUser($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->userGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deleteUser($id)
    {
        $result = $this->userGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $this->userGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validateRegisterUser($input)
    {
        if (!isset($input['username'])) {
            return false;
        }
        if (!isset($input['email'])) {
            return false;
        }
        if (!isset($input['password'])) {
            return false;
        }
        return true;
    }

    private function validateUpdateUser($input)
    {
        if (!isset($input['username'])) {
            return false;
        }
        if (!isset($input['email'])) {
            return false;
        }
        if (!isset($input['password'])) {
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

    private function userRegisteredEntityResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
        $response['body'] = json_encode([
            'error' => 'User registered'
        ]);
        return $response;
    }

    private function notFoundResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        $response['body'] = null;
        return $response;
    }

    private function noContentResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 204 No Content';
        $response['body'] = null;
        return $response;
    }
}
