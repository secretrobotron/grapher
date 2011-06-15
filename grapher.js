(function (window, document, undefined) {

  var plugins = {};

  var Grapher = window.Grapher = function (containerId, type) {

    var userContainer = document.getElementById(containerId);
    if (!userContainer) {
      throw new Error('Could not find element with id "' + containerId + '".');
    } //if

    var container = document.createElement('div');
    container.className = 'grapher-container';

    if (this !== window) {

      var dimensions = this.dimensions = [];
      var renderer = this.renderer = undefined;

      type = this.type = type || "bar";

      var Dimension = this.Dimension = function (name) {
        this.name = name;
        this.data = [];

        this.addData = function (data) {
          this.data = this.data.concat(data);
        }; //addData
      }; //Dimension

      var addDimension = this.addDimension = function (options) {
        var dimension;
        if (typeof(options) === 'string') {
          options = options || 'Dimension ' + dimensions.length;
          dimension = new Dimension(options);
        }
        else {
          dimension = options;
        } //if
        dimensions.push(dimension);
        return dimension;
      } //addDimension

      var setType = this.setType = function (type) {
        this.type = type;
        renderer = this.renderer = plugins[type];
        
        if (!renderer) {
          throw new Error('Plugin not found: "' + type + '".');
        } //if
      }; //setType

      var renderGraph = this.renderGraph = function () {
      }; //renderGraph

      var render = this.render = function () {
        if (!renderer) {
          throw new Error('No renderer!');
        } //if       
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        } //if
        var rect = userContainer.getClientRects()[0];
        container.style.width = rect.width + "px";
        container.style.height = rect.height + "px";
        userContainer.appendChild(container);

        renderer.render(container, dimensions);
      }; //render

      setType(type);
    
    } //if
    else {
      return new Grapher(containerId, type);
    } //if

  } //Grapher

  Grapher.plugin = function (plugin) {
    
    if (!plugin.name) {
      throw new Error('Plugins require a name property.');
    } //if

    plugins[plugin.name] = plugin;
  }; //plugin

  (function (Grapher) {
    var width = height = 0;
    var xElements = [];
    var container;

    var dimensionFunctions = {

      0: function (dimension) {
        for (var i=0; i<dimension.data.length; ++i) {
          var element = document.createElement('div');
          element.className = 'grapher-bar-bar-container';
          element.style.left = (width/dimension.data.length*i) + "px";
          element.style.width = (width/dimension.data.length) + "px";
          var childElement = document.createElement('div');
          childElement.className = 'grapher-bar-bar';
          element.appendChild(childElement);
          xElements.push(element);
          container.appendChild(element);
        } //for
      },

      1: function (dimension) {
        var max = -999999999;
        for (var i=0; i<dimension.data.length; ++i) {
          if (dimension.data[i] > max) {
            max = dimension.data[i];
          } //if
        } //for

        var scaleFactor = height/max;

        for (var i=0; i<dimension.data.length; ++i) {
          xElements[i].style.height = (dimension.data[i]*scaleFactor) + "px";
          xElements[i].style.top = ((max - dimension.data[i])*scaleFactor) + "px";
          xElements[i].children[0].style.backgroundColor = "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
        } //for
      },

    };

    Grapher.plugin({
      name: 'bar',
      render: function (contentContainer, dimensions) {
        
        container = contentContainer;
        var rect = container.getClientRects()[0];
        width = rect.width;
        height = rect.height;

        while (container.children.length) {
          container.removeChild(container.children[0]);
        } //while

        for (var i=0; i<dimensions.length; ++i) { 
          dimensionFunctions[i](dimensions[i]);
        } //for
      },
    });
  })(Grapher);

})(window, document, undefined);
