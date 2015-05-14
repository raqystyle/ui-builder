'use strict';

/*@ngInject*/
function DomTreeViewDirective($rootScope, Canvas, RecursionHelper, ElemManager, DomTreeParser) {
  // Because there is a recursive directive usage,
  // I need to check if event listener alread has been set. Thus, I need a flag.
  var bounded = false;
  return {
    restrict: 'E',
    replace: true,
    scope: {
      tree: '='
    },
    templateUrl: 'scripts/builder/modules/domTree/directives/domTreeView.html',
    compile: function(elem) {

      elem.on('dragover', function(e){ e.preventDefault(); });
      elem.on('drop', function(e){
        var elemDescription = e.dataTransfer.getData('elementDescription');
        ElemManager.dropElement(Canvas.shadow, elemDescription);
      });

      return RecursionHelper.compile(elem, function(scope) {
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

      });
    }
  };
}

module.exports = DomTreeViewDirective;
