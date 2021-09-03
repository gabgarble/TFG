<?php
namespace Src\Classes;

    class Resizable {

        public $beforeStart;
        public $afterEnd;

        /*function __construct( ) {
            
        }*/

        function __construct( $beforeStart, $afterEnd) {
            $this->beforeStart = $beforeStart;
            $this->afterEnd = $afterEnd;
        }

        function getBeforeStart() {
            return $this->beforeStart;
        }

        function getAfterEnd() {
            return $this->afterEnd;
        }

    }

?>
