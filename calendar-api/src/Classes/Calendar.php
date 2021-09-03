<?php
namespace Src\Classes;

    class Calendar {

        public $id;
        public $name;
        public $visible;
        public $userId;

        /*function __construct( ) {
            
        }*/

        function __construct( $id, $name, $visible, $userId ) {
            $this->id = $id;
            $this->name = $name;
            $this->visible = $visible;
            $this->userId = $userId;
        }

        function getId() {
            return $this->id;
        }

        function getName() {
            return $this->name;
        }

        function getVisible() {
            return $this->visible;
        }

        function getUserId() {
            return $this->userId;
        }

    }

?>
