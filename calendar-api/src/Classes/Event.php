<?php
namespace Src\Classes;

use Src\Classes\Calendar as Calendar;
use Src\Classes\EventColor as EventColor;

    class Event {

        public $id;
        public $start;
        public $end;
        public $title;
        public $allDay;
        public $resizable;
        public $draggable;
        public $userCreatorId;
        public $eventColor;
        public $calendar;

        /*public function __construct( ) {
            
        }*/

        public function __construct( $id, $start, $end, $title, $allDay, $resizable, $draggable, $userCreatorId, $eventColor, $calendar ) {
            $this->id = $id;
            $this->start = $start;
            $this->end = $end;
            $this->title = $title;
            $this->allDay = $allDay;
            $this->resizable = $resizable;
            $this->draggable = $draggable;
            $this->userCreatorId = $userCreatorId;
            $this->eventColor = $eventColor;
            $this->calendar = $calendar;
        }

        function getId() {
            return $this->name;
        }

        function getStartDate() {
            return $this->start;
        }

        function getEndDate() {
            return $this->end;
        }

        function getTitle() {
            return $this->title;
        }

        function getAllDay() {
            return $this->allDay;
        }

        function getResizableBeforeStart() {
            return $this->resizableBeforeStart;
        }

        function getResizableBeforeEnd() {
            return $this->resizableBeforeEnd;
        }

        function getDraggable() {
            return $this->draggable;
        }

        function getUserCreator() {
            return $this->userCreator;
        }

        function getEventColor() {
            return $this->eventColor;
        }

        function getCalendar() {
            return $this->calendarId;
        }

    }
?> 
