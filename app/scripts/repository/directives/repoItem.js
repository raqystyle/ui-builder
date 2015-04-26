'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '='
    },
    templateUrl: 'scripts/repository/directives/repoItem.html',
    link: function(scope, elem) {

      elem.on('dragstart', function(evt) {
        if (!scope.model.markup) {
          return evt.preventDefault();
        }
        evt.dataTransfer.setData('elementDescription', JSON.stringify(scope.model));
        elem[0].classList.add('drag-from');
      });

      elem.on('dragend', function() {
        elem[0].classList.remove('drag-from');
      });

    }
  };
};
