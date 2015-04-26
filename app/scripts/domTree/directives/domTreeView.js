'use strict';

module.exports = ['$rootScope', 'RecursionHelper', 'ElemManager', 'DomTreeParser', 'DragDropHandler',
function($rootScope, RecursionHelper, ElemManager, DomTreeParser, DragDropHandler) {
  // Because there is a recursive directive usage,
  // I need to check if event listener alread has been set. Thus, I need a flag.
  var bounded = false;
  return {
    restrict: 'E',
    replace: true,
    scope: {
      tree: '='
    },
    templateUrl: 'scripts/domTree/directives/domTreeView.html',
    compile: function(elem) {
      return RecursionHelper.compile(elem, function(scope) {
        DragDropHandler.bindEventHandlers(elem[0]);

        // Fix for nested directives
        if (!bounded) {
          bounded = true;
          $rootScope.$on('uib:canvas:updated', function(evt, root) {
            evt.stopPropagation();
            scope.$apply(function() {
              scope.tree = DomTreeParser.buildTree(root);
            });
          });
        }

        scope.editElem = function(node) {
          ElemManager.startEditElem(node.domElem);
        };

        scope.removeElem = function(node) {
          ElemManager.removeElem(node.domElem);
        };
      });
    }
  };
}];
