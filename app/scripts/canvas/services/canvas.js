'use strict';

angular.module('uiBuilderApp.Canvas')
  .service('Canvas', function(Repository, ElemManager, Common, DragDropHandler, $rootScope) {

    this.iframe = null;
    this.shadow = null;

    this.register = function(container) {
      this.iframe = container.find('iframe')[0];
      this.shadow = container.find('div')[0];
      Repository.getItems().then(function(repoData) {
        this.setUpCanvas('', repoData, true);
      }.bind(this));
    };

    this.setUpCanvas = function(newHTML, repoData, initial) {
      this.getIframeBody().innerHTML = newHTML;
      this.addJS(repoData.initial.js);
      this.addStyles('/styles/uib-canvas.css');
      DragDropHandler.bindEventHandlers(this.getIframeBody());
      if (!initial) {
        $rootScope.$emit('uib:canvas:updated', this.shadow);
      }
    };

    this.reloadIFrame = function() {
      var oldCode = this.shadow.innerHTML;
      var repoData = Repository.getItems();
      this.iframe.src = repoData.initial.html;
      this.iframe.onload = function() {
        this.setUpCanvas(oldCode, repoData);
      }.bind(this);
    };

    this.updateShadow = function(parent, dropppedElement) {
      parent = (parent.tagName === 'BODY') ?
                this.shadow :
                this.shadow.querySelector(Common.domPath(dropppedElement));
      var clone = ElemManager.cloneElement(dropppedElement);
      parent.appendChild(clone);
    };

    this.elementDropped = function(dropppedElement, target) {
      if (!Common.hasParent(target, 'uib-canvas-shadow')) {
        this.updateShadow(target, dropppedElement);
      }
      this.reloadIFrame();
    };

    this.removeElement = function(element) {
      element.remove();
      this.reloadIFrame();
    };

    this.getIframeHead = function() {
      if (!this.iframe) {
        throw 'IFrame is not registered';
      }
      var iDoc = this.iframe.contentWindow || this.iframe.contentDocument;
      return iDoc.document ? iDoc.document.head : null;
    };

    this.getIframeBody = function() {
      if (!this.iframe) {
        throw 'IFrame is not registered';
      }
      var iDoc = this.iframe.contentWindow || this.iframe.contentDocument;
      return iDoc.document ? iDoc.document.body : null;
    };

    this.getSourceCode = function() {
      return this.getIframeBody().innerHTML;
    };

    this.addStyles = function(url) {
      if (!this.iframe) {
        throw 'IFrame is not registered';
      }
      var timestamp = +(new Date());
      var style = document.createElement('link');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('type', 'text/css');
      style.setAttribute('href', url + '?' + timestamp);

      this.getIframeHead().appendChild(style);
    };

    this.addJS = function(url) {
      var timestamp = +(new Date());
      var script = document.createElement('script');

      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.setAttribute('src', url + '?' + timestamp);

      this.getIframeHead().appendChild(script);
    };

  });