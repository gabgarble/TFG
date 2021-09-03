<?php

namespace Src\TableGateways;

class EventGateway {

    private $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function findAll($userCreatorId)
    {
        $statement = "
            SELECT 
                id, start, end, title, allDay, resizableBeforeStart, resizableBeforeEnd, draggable, userCreatorId, eventColorId, calendarId
            FROM
                Event
            WHERE userCreatorId = ?;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array($userCreatorId));
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
                id, start, end, title, allDay, resizableBeforeStart, resizableBeforeEnd, draggable, userCreatorId, eventColorId, calendarId
            FROM
                Event
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

    public function insert(Array $input)
    {
        $statement = "
            INSERT INTO Event 
                (start, end, title, allDay, resizableBeforeStart, resizableBeforeEnd, draggable, userCreatorId, eventColorId)
            VALUES
                (:start, :end, :title, :allDay, :resizableBeforeStart, :resizableBeforeEnd, :draggable, :userCreatorId, :eventColorId);
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'start' => $input['start'],
                'end'  => $input['end'],
                'title' => $input['title'],
                'allDay'  => $input['allDay'],
                'resizableBeforeStart' => $input['resizableBeforeStart'],
                'resizableBeforeEnd'  => $input['resizableBeforeEnd'],
                'draggable' => $input['draggable'],
                'userCreatorId'  => $input['userCreatorId'],
                'eventColorId' => $input['eventColorId'],
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }    
    }

    public function update($id, Array $input)
    {
        $statement = "
            UPDATE Event
            SET 
                start = :start,
                end  = :end,
                title  = :title,
                allDay = :allDay,
                resizableBeforeStart  = :resizableBeforeStart,
                resizableBeforeEnd  = :resizableBeforeEnd,
                draggable = :draggable,
                userCreatorId  = :userCreatorId,
                eventColorId  = :eventColorId
            WHERE id = :id;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'id' => (int) $id,
                'start' => $input['start'],
                'end'  => $input['end'],
                'title' => $input['title'],
                'allDay'  => $input['allDay'] == "1" ? true : false,
                'resizableBeforeStart' => $input['resizableBeforeStart'] == "1" ? true : false,
                'resizableBeforeEnd'  => $input['resizableBeforeEnd'] == "1" ? true : false,
                'draggable' => $input['draggable'] == "1" ? true : false,
                'userCreatorId'  => $input['userCreatorId'],
                'eventColorId' => $input['eventColorId'],
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }    
    }

    public function delete($id)
    {
        $statement = "
            DELETE FROM Event
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