<?php
namespace Src\Classes;

    class EventColor {

        public $id;
        public $description;
        public $primaryColor;
        public $secondaryColor;

        /*function __construct( ) {

        }*/

        function __construct( $id, $description, $primaryColor, $secondaryColor ) {
            $this->id = $id;
            $this->description = $description;
            $this->primaryColor = $primaryColor;
            $this->secondaryColor = $secondaryColor;
        }

        function getName() {
            return $this->name;
        }

        function getDescription() {
            return $this->description;
        }

        function getPrimaryColor() {
            return $this->primaryColor;
        }

        function getSecondaryColor() {
            return $this->secondaryColor;
        }

    }

?>