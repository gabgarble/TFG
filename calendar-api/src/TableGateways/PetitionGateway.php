<?php

namespace Src\TableGateways;

class PetitionGateway
{

    private $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function findAllByUserIdAndStatus($userId, $status)
    {
        $statement = "";

        if ($status == 'accepted') {
            $statement = "
            SELECT 
                id, userSenderId, userReceiverId, petitionEstatusId
            FROM
                UserPetition
            WHERE userSenderId = $userId and petitionEstatusId = 1;
        ";
        } else if ($status == 'pending') {
            $statement = "
            SELECT 
                id, userSenderId, userReceiverId, petitionEstatusId
            FROM
                UserPetition
            WHERE userReceiverId = $userId and petitionEstatusId = 3;
        ";
        }

        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_CLASS);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function findAll()
    {
        $statement = "
            SELECT 
                id, userSenderId, userReceiverId, petitionEstatusId
            FROM
                UserPetition;
        ";

        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function find($id)
    {
        $statement = "
            SELECT 
                id, userSenderId, userReceiverId, petitionEstatusId
            FROM
                UserPetition
            WHERE id = ?;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array($id));
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function insert(array $input)
    {
        $statement = "
            INSERT INTO UserPetition
                (userSenderId, userReceiverId, petitionEstatusId)
            VALUES
                (userSenderId:, userReceiverId:, petitionEstatusId:);
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'userSenderId' => $input['userSenderId'],
                'userReceiverId'  => $input['userReceiverId'],
                'petitionEstatusId' => $input['petitionEstatusId'],
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function update($id, array $input)
    {
        $statement = "
            UPDATE UserPetition
            SET 
                petitionEstatusId = :petitionEstatusId,
            WHERE id = :id;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'id' => (int) $id,
                'petitionEstatusId' => $input['petitionEstatusId'],
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function delete($id)
    {
        $statement = "
            DELETE FROM UserPetition
            WHERE id = :id;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array('id' => $id));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
}
