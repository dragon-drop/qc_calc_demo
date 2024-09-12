(function (window) {
  "use strict";
  const { h1, section } = van.tags;

  const state = {};

  const QcCalculator = () => {
    return [section(h1("QC Calculator"))];
  };

  van.add(document.body, QcCalculator());
})(window);
