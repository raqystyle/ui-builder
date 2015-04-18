'use strict';

angular.module('uiBuilderApp.common')
  .service('DragDropHandler', function($rootScope, ElemManager) {

    this.bindEventHandlers = function(element) {
      element.addEventListener('dragover', function _dravOverHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $rootScope.$emit('uib:dragover', element);
      });

      element.addEventListener('dragend', function _dravEndHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $rootScope.$emit('uib:dragend', element);
      });

      element.addEventListener('dragleave', function _dravLeaveHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $rootScope.$emit('uib:dragleave', element);
      });

      element.addEventListener('drop', function _dropHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var target = evt.target;
        var elemDescription = evt.dataTransfer.getData('elementDescription');
        if (target.classList.contains('uib-tree-item')) {
          target = angular.element(target).scope().node.domElem;
        }
        ElemManager.dropElement(target, elemDescription);
      });
    };

  });