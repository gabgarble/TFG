<?php
namespace Src\Classes;

    class User {

        public $id;
        public $name;
        public $surname;
        public $username;
        public $email;

        /*function __construct( ) {
            
        }*/

        function __construct( $id, $name, $surname, $username, $email ) {
            $this->id = $id;
            $this->name = $name;
            $this->surname = $surname;
            $this->username = $username;
            $this->email = $email;
        }

        function getId() {
            return $this->id;
        }

        function getName() {
            return $this->name;
        }

        function getSurname() {
            return $this->surname;
        }

        function getUsername() {
            return $this->username;
        }

        function getEmail() {
            return $this->email;
        }

    }

?>
