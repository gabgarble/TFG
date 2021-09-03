<?php

namespace Src\TableGateways;

class CalendarGateway
{

    private $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function findAll()
    {
        $statement = "
            SELECT 
                id, name, visible, userId
            FROM
                ImportedCalendar;
        ";

        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function findAllByUserId($userId)
    {
        $statement = "
            SELECT 
                id, name, visible, userId
            FROM
                ImportedCalendar
            WHERE userId = $userId;
        ";

        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_CLASS);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function find($id)
    {
        $statement = "
            SELECT 
                id, name, visible, userId
            FROM
                ImportedCalendar
            WHERE id = ?;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array($id));
            $result = $statement->fetchAll(\PDO::FETCH_CLASS);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function insert(array $input)
    {
        $statement = "
            INSERT INTO ImportedCalendar 
                (name, visible, userId)
            VALUES
                (:name, :visible, :userId);
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'name'  => $input['name'],
                'visible' => $input['visible'],
                'userId'  => $input['userId'],
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function update($id, array $input)
    {

        $statement = "
            UPDATE ImportedCalendar
            SET 
                name = :name,
                visible  = :visible
            WHERE id = :id;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'id' => (int) $id,
                'name' => $input['name'],
                'visible'  => $input['visible'] == "1" ? true : false,
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function delete($id)
    {
        $statement = "
            DELETE FROM ImportedCalendar
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
