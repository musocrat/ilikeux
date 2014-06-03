// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function(document) {
    var Miss, backdrop, colorConvert, coords, extend, gravity, message, miss, prepHex, resize, showHideEl, sortMissies, testEl;
    miss = function(misset) {
      var defaults, el, i, k, msg, opts, title, v, _i, _len, _ref, _ref1;
      miss.missies = miss.missies || [];
      if (!miss.global) {
        miss.settings(misset.settings || null);
      }
      defaults = {
        order: 'series',
        background_color: '#f5f5f5',
        titlebar_color: '#939393',
        font_color: '#000'
      };
      if (misset.elements) {
        miss.off();
        i = 0;
        _ref = misset.elements;
        for (k in _ref) {
          v = _ref[k];
          opts = extend(extend(defaults, v), miss.global);
          _ref1 = document.querySelectorAll.call(document, k);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            el = _ref1[_i];
            title = opts.title || el.dataset.missTitle || null;
            msg = message(opts.msg) || message(el.dataset.missMsg) || null;
            if (!!(title || msg)) {
              miss.missies.push(new Miss(el, i = i + 1, opts, title, msg));
            }
          }
        }
        sortMissies();
        miss.on();
        return miss.missies[0].on();
      }
    };
    Miss = (function() {
      function Miss(el, i, opts, title, msg) {
        this.off = __bind(this.off, this);
        this.on = __bind(this.on, this);
        this.resize = __bind(this.resize, this);
        this.highlight = __bind(this.highlight, this);
        this.boxSizing = __bind(this.boxSizing, this);
        this.buildBox = __bind(this.buildBox, this);
        this.el = el;
        this.order = parseInt(this.el.dataset.missOrder) || 100 + i;
        this.opts = opts;
        this.title = title;
        this.msg = msg;
        this.index = i;
        this.buildBox();
      }

      Miss.prototype.buildBox = function() {
        var box, msg_box, nav_box, nav_buttons, title_box;
        box = document.createElement('div');
        box.id = "miss_" + this.order;
        box.className = 'miss-box';
        box.style.position = 'fixed';
        title_box = document.createElement('div');
        title_box.className = 'miss-titlebar';
        title_box.innerHTML = this.title;
        msg_box = document.createElement('div');
        msg_box.className = 'miss-msg';
        msg_box.innerHTML = this.msg;
        nav_box = document.createElement('div');
        nav_box.className = 'miss-nav';
        nav_buttons = '<button onclick="miss.previous();">previous</button><button onclick="miss.next();">next</button>';
        nav_box.innerHTML = nav_buttons;
        if (!miss.global.theme) {
          box.style.backgroundColor = this.opts.background_color;
          box.style.borderRadius = "3px";
          title_box.style.backgroundColor = this.opts.titlebar_color;
          title_box.style.borderTopLeftRadius = "3px";
          title_box.style.borderTopRightRadius = "3px";
          title_box.style.padding = '8px';
          msg_box.style.padding = '8px';
        }
        box.appendChild(title_box);
        box.appendChild(msg_box);
        box.appendChild(nav_box);
        showHideEl(box, false);
        miss.bd.appendChild(box);
        this.box = box;
        return this.boxSizing();
      };

      Miss.prototype.boxSizing = function() {
        var bd_miss_visible, box_miss_visible, coord, gravitate;
        coord = coords(this.el);
        bd_miss_visible = miss.bd.miss_visible || null;
        box_miss_visible = this.box.miss_visible || null;
        if (!bd_miss_visible) {
          miss.bd.style.visibility = 'hidden';
          miss.on();
        }
        if (!box_miss_visible) {
          this.box.style.visibility = 'hidden';
          showHideEl(this.box, true);
        }
        this.box.style.maxWidth = "30%";
        this.box.style.maxHeight = "60%";
        gravitate = gravity(coord, this.box.offsetHeight, this.box.offsetWidth);
        this.box.style.top = "" + gravitate.x + "px";
        this.box.style.left = "" + gravitate.y + "px";
        if (!bd_miss_visible) {
          miss.bd.style.visibility = '';
          miss.off();
        }
        if (!box_miss_visible) {
          this.box.style.visibility = '';
          return showHideEl(this.box, false);
        }
      };

      Miss.prototype.highlight = function() {
        var coord, hl;
        coord = coords(this.el);
        hl = document.getElementById("miss_hl_" + this.index) || document.createElement('div');
        hl.id = "miss_hl_" + this.index;
        hl.style.position = "fixed";
        hl.style.top = "" + (coord.top - this.opts.highlight_width) + "px";
        hl.style.left = "" + (coord.left - this.opts.highlight_width) + "px";
        hl.style.width = "" + (coord.width + this.opts.highlight_width) + "px";
        hl.style.height = "" + (coord.height + this.opts.highlight_width) + "px";
        hl.style.border = "" + this.opts.highlight_width + "px solid " + this.opts.highlight_color;
        return miss.bd.appendChild(hl);
      };

      Miss.prototype.resize = function() {
        this.boxSizing();
        return this.highlight();
      };

      Miss.prototype.on = function() {
        this.highlight();
        return showHideEl(this.box, true);
      };

      Miss.prototype.off = function() {
        var hl;
        hl = document.getElementById("miss_hl_" + this.index);
        if (hl) {
          hl.parentNode.removeChild(hl);
        }
        return showHideEl(this.box, false);
      };

      return Miss;

    })();
    showHideEl = function(el, toggle) {
      if (miss.global.compat.hidden) {
        if (toggle) {
          el.removeAttribute('hidden') && (el.style.display = '');
        } else {
          el.setAttribute('hidden', true);
        }
      } else if (toggle) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
      return el.miss_visible = toggle;
    };
    extend = function(objA, objB) {
      var attr;
      for (attr in objB) {
        objA[attr] = objB[attr];
      }
      return objA;
    };
    colorConvert = function(hex) {
      return {
        red: parseInt((prepHex(hex)).substring(0, 2), 16),
        green: parseInt((prepHex(hex)).substring(2, 4), 16),
        blue: parseInt((prepHex(hex)).substring(4, 6), 16)
      };
    };
    prepHex = function(hex) {
      hex = (hex.charAt(0) === "#" ? hex.split("#")[1] : hex);
      if (hex.length === 3) {
        return hex + hex;
      } else {
        return hex;
      }
    };
    sortMissies = function() {
      return miss.missies.sort(function(a, b) {
        return a['order'] - b['order'];
      });
    };
    coords = function(el) {
      var hl_border, rect;
      rect = el.getBoundingClientRect();
      hl_border = miss.global.highlight ? miss.global.highlight_width : 0;
      return {
        top: rect.top - hl_border,
        right: rect.right + hl_border,
        bottom: rect.bottom + hl_border,
        left: rect.left - hl_border,
        width: rect.width || rect.right - rect.left,
        height: rect.height || rect.bottom - rect.top
      };
    };
    testEl = function() {
      var test;
      if (!(test = document.getElementById('miss-size-test'))) {
        test = document.createElement("div");
        test.id = 'miss-size-test';
        test.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0; visibility: hidden;";
        document.body.appendChild(test);
      }
      return {
        height: test.offsetHeight,
        width: test.offsetWidth
      };
    };
    gravity = function(coords, height, width) {
      var ary_x, ary_y, box_center, center, el_center, k, map_x, map_y, optimal_x, optimal_y, v, x, xk, xv, y, yk, yv, _ref, _ref1, _ref2, _ref3;
      ary_x = [];
      ary_y = [];
      center = {
        x: testEl().height / 2,
        y: testEl().width / 2
      };
      el_center = {
        x: coords.height / 2,
        y: coords.width / 2
      };
      box_center = {
        x: height / 2,
        y: width / 2
      };
      map_x = [
        {
          diff: {
            top: Math.abs(coords.top - box_center.x - center.x),
            middle: Math.abs(coords.top - center.x),
            bottom: Math.abs(coords.top + box_center.x - center.x)
          },
          val: {
            top: coords.top - height,
            middle: coords.top - box_center.x,
            bottom: coords.top
          },
          position: 'top'
        }, {
          diff: {
            top: Math.abs(coords.top + el_center.x - box_center.x - center.x),
            middle: Math.abs(coords.top + el_center.x - center.x),
            bottom: Math.abs(coords.top + el_center.x + box_center.x - center.x)
          },
          val: {
            top: coords.top + el_center.x - height,
            middle: coords.top + el_center.x - box_center.x,
            bottom: coords.top + el_center.x
          },
          position: 'middle'
        }, {
          diff: {
            top: Math.abs(coords.bottom - box_center.x - center.x),
            middle: Math.abs(coords.bottom - center.x),
            bottom: Math.abs(coords.bottom + box_center.x - center.x)
          },
          val: {
            top: coords.bottom - height,
            middle: coords.bottom - box_center.x,
            bottom: coords.bottom
          },
          position: 'bottom'
        }
      ];
      map_y = [
        {
          diff: {
            left: Math.abs(coords.left - box_center.y - center.y),
            middle: Math.abs(coords.left - center.y),
            right: Math.abs(coords.left + box_center.y - center.y)
          },
          val: {
            left: coords.left - width,
            middle: coords.left - box_center.y,
            right: coords.left
          },
          position: 'left'
        }, {
          diff: {
            left: Math.abs(coords.left + el_center.y - box_center.y - center.y),
            middle: Math.abs(coords.left + el_center.y - center.y),
            right: Math.abs(coords.left + el_center.y + box_center.y - center.y)
          },
          val: {
            left: coords.left + el_center.y - width,
            middle: coords.left + el_center.y - box_center.y,
            right: coords.left + el_center.y
          },
          position: 'middle'
        }, {
          diff: {
            left: Math.abs(coords.right - box_center.y - center.y),
            middle: Math.abs(coords.right - center.y),
            right: Math.abs(coords.right + box_center.y - center.y)
          },
          val: {
            left: coords.right - width,
            middle: coords.right - box_center.y,
            right: coords.right
          },
          position: 'right'
        }
      ];
      for (k in map_x) {
        v = map_x[k];
        _ref = v['diff'];
        for (xk in _ref) {
          xv = _ref[xk];
          ary_x.push(xv);
        }
      }
      for (k in map_y) {
        v = map_y[k];
        _ref1 = v['diff'];
        for (yk in _ref1) {
          yv = _ref1[yk];
          ary_y.push(yv);
        }
      }
      optimal_x = ary_x.sort(function(a, b) {
        return a - b;
      })[0];
      optimal_y = ary_y.sort(function(a, b) {
        return a - b;
      })[0];
      for (k in map_x) {
        v = map_x[k];
        _ref2 = v['diff'];
        for (xk in _ref2) {
          xv = _ref2[xk];
          if (xv === optimal_x) {
            x = {
              val: v.val[xk],
              position: "" + v['position'] + "_" + xk
            };
          }
        }
      }
      for (k in map_y) {
        v = map_y[k];
        _ref3 = v['diff'];
        for (yk in _ref3) {
          yv = _ref3[yk];
          if (yv === optimal_y) {
            y = {
              val: v.val[yk],
              position: "" + v['position'] + "_" + yk
            };
          }
        }
      }
      return {
        x: x.val,
        y: y.val
      };
    };
    backdrop = function(toggle) {
      var bd, opts, rgb;
      if (!(bd = document.getElementById('miss_bd'))) {
        opts = miss.global;
        rgb = colorConvert(opts.backdrop_color);
        bd = document.createElement('div');
        bd.id = 'miss_bd';
        bd.style.backgroundColor = "rgba(" + rgb.red + ", " + rgb.green + ", " + rgb.blue + ", " + opts.backdrop_opacity + ")";
        bd.style.position = 'fixed';
        bd.style.zIndex = opts.z_index;
        bd.style.top = 0;
        bd.style.right = 0;
        bd.style.bottom = 0;
        bd.style.left = 0;
        showHideEl(bd, false);
        document.body.appendChild(bd);
      }
      miss.bd = bd;
      return showHideEl(bd, toggle);
    };
    message = function(msg) {
      var msg_el;
      if (/#{(.*?)}/.test(msg)) {
        msg_el = document.querySelector(msg.match(/#{(.*?)}/)[1]);
        showHideEl(msg_el, false);
        return msg_el.innerHTML;
      } else {
        return msg;
      }
    };
    miss.settings = function(set) {
      return miss.global = extend({
        theme: null,
        trigger: null,
        key_on: null,
        key_off: null,
        key_hover: null,
        backdrop_color: '#000',
        backdrop_opacity: 0.4,
        z_index: 2100,
        welcome_title: null,
        welcome_msg: null,
        highlight: true,
        highlight_width: 3,
        highlight_color: '#fff',
        compat: {
          hidden: !!('hidden' in document.createElement('div'))
        }
      }, set);
    };
    resize = function() {
      var i, m, _ref, _results;
      _ref = miss.missies;
      _results = [];
      for (i in _ref) {
        m = _ref[i];
        _results.push(m.resize());
      }
      return _results;
    };
    window.onresize = resize();
    window.onscroll = resize();
    window.onorientationchange = resize();
    miss.next = function() {
      var i, m, _i, _len, _ref;
      _ref = miss.missies;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        m = _ref[i];
        if (m.box.miss_visible) {
          m.off();
          if (miss.missies[i + 1]) {
            return miss.missies[i + 1].on();
          } else {
            return miss.off();
          }
        }
      }
    };
    miss.previous = function() {
      var i, m, _i, _len, _ref;
      _ref = miss.missies;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        m = _ref[i];
        if (m.box.miss_visible) {
          m.off();
          if (miss.missies[i - 1]) {
            return miss.missies[i - 1].on();
          } else {
            return miss.off();
          }
        }
      }
    };
    miss.first = function() {
      var m, _i, _len, _ref;
      _ref = miss.missies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        if (m.box.miss_visible) {
          m.off();
        }
      }
      return miss.missies[0].on();
    };
    miss.last = function() {
      var m, _i, _len, _ref;
      _ref = miss.missies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        if (m.box.miss_visible) {
          m.off();
        }
      }
      return miss.missies[miss.missies.length - 1].on();
    };
    miss.on = function() {
      return backdrop(true);
    };
    miss.off = function() {
      return backdrop(false);
    };
    miss.destroy = (function(_this) {
      return function() {
        var bd, test;
        test = document.getElementById('miss-size-test');
        test.parentNode.removeChild(test);
        bd = document.getElementById('miss_bd');
        bd.parentNode.removeChild(bd);
        return delete _this.miss;
      };
    })(this);
    return this.miss = miss;
  })(document);

}).call(this);
