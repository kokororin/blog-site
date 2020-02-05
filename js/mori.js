// @ts-check
(function(window, document) {
  /** @type MoriColor */
  var mori =
    // @ts-ignore
    window.MORI_INSTANCE;
  var MORI_VARS =
    // @ts-ignore
    window.MORI_VARS;
  /** @type {import('nprogress')} */
  var NProgress =
    // @ts-ignore
    window.NProgress;
  // @ts-ignore
  var Pjax = window.Pjax;
  if (!mori) {
    /**
     * @param {string | Element | Document | EventTarget} selector
     */
    var MoriDom = function(selector) {
      if (selector && typeof selector !== 'string') {
        this.element = selector;
      } else {
        // @ts-ignore
        this.element = document.querySelector(selector);
        // @ts-ignore
        this.elements = document.querySelectorAll(selector);
        this.length = this.elements.length;
      }
      if (!this.element) {
        this.element = document.createElement('mori');
        this.length = 0;
      }
    };

    /**
     * @param {string | Element | Document | EventTarget} selector
     */
    MoriDom.select = function(selector) {
      return new MoriDom(selector);
    };

    MoriDom.prototype.show = function() {
      this.element.style.display = 'block';
      return this;
    };

    MoriDom.prototype.hide = function() {
      this.element.style.display = 'none';
      return this;
    };

    /**
     * @param {string} html
     */
    MoriDom.prototype.html = function(html) {
      this.element.innerHTML = html;
      return this;
    };

    /**
     * @param {string} className
     */
    MoriDom.prototype.addClass = function(className) {
      this.element.classList.add(className);
      return this;
    };

    /**
     * @param {string} className
     */
    MoriDom.prototype.removeClass = function(className) {
      this.element.classList.remove(className);
      return this;
    };

    /**
     * @param {string} className
     */
    MoriDom.prototype.hasClass = function(className) {
      return this.element.classList.contains(className);
    };

    /**
     * @param {string} key
     * @param {string} [value]
     */
    MoriDom.prototype.css = function(key, value) {
      if (!value) {
        return this.element.style[key];
      }
      this.element.style[key] = value;
      return this;
    };

    /**
     * @param {string} key
     * @param {string} [value]
     */
    MoriDom.prototype.attr = function(key, value) {
      if (!value) {
        return this.element.getAttribute[key];
      }
      this.element.setAttribute(key, value);
      return this;
    };

    /**
     * @param {(element: Element, index: number) => void} fn
     */
    MoriDom.prototype.each = function(fn) {
      Array.prototype.forEach.call(this.elements, function(element, index) {
        return fn.call(element, element, index);
      });
      return this;
    };

    /**
     * @param {string} className
     */
    MoriDom.prototype.parent = function(className) {
      var p = this.element.parentNode;

      while (p !== document) {
        var o = p;
        if (p.className.indexOf(className) > -1) {
          return MoriDom.select(p);
        }

        if (!o.parentNode) {
          break;
        } else {
          p = o.parentNode;
        }
      }

      return MoriDom.select(null);
    };

    /**
     * @param {string} eventName
     * @param {string} selector
     * @param {EventListenerOrEventListenerObject} fn
     */
    MoriDom.prototype.on = function(eventName, selector, fn) {
      fn = fn || function() {};
      this.element.addEventListener(
        eventName,
        function(event) {
          var possibleTargets = this.element.querySelectorAll(selector);
          var target = event.target;

          for (var i = 0, l = possibleTargets.length; i < l; i++) {
            var el = target;
            var p = possibleTargets[i];

            while (el && el !== this.element) {
              if (el === p) {
                // @ts-ignore
                return fn.call(p, event, el);
              }

              el = el.parentNode;
            }
          }
        }.bind(this)
      );

      return this;
    };

    MoriDom.prototype.scrollTo = function() {
      var scrollPart = this.element;
      var top = scrollPart.getBoundingClientRect().top;
      var pageY = window.pageYOffset;
      var endPosition = top + pageY;

      var startTime = +new Date();
      var duration = 500;

      var run = function() {
        var time = +new Date() - startTime;

        window.scrollTo(0, pageY + top * (time / duration));
        // @ts-ignore
        run.timer = requestAnimationFrame(run);

        if (time >= duration) {
          window.scrollTo(0, endPosition);
          // @ts-ignore
          cancelAnimationFrame(run.timer);
        }
      };

      requestAnimationFrame(run);
      return this;
    };

    var MoriColor = function() {
      NProgress.configure({
        showSpinner: false
      });
    };

    MoriColor.prototype.getHitokoto = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.imjad.cn/hitokoto/');
      xhr.addEventListener('load', function() {
        MoriDom.select('#hitokoto').html(
          'Hitokoto&nbsp; · &nbsp;&nbsp;' + xhr.responseText
        );
      });
      xhr.send();
    };

    MoriColor.prototype.updateLinks = function() {
      MoriDom.select('a').each(function(link) {
        var href = link.getAttribute('href');
        if (!href) {
          return true;
        }
        if (href && href.indexOf(MORI_VARS.url) === 0) {
          href = href.replace(MORI_VARS.url, '');
          href = href === '' ? '/' : href;
          // @ts-ignore
          link.href = href;
          return true;
        }

        if (
          href.substring(0, 11) === 'javascript:' ||
          href.substring(0, 1) === '#' ||
          href.substring(0, 1) === '/'
        ) {
          return true;
        }
        // @ts-ignore
        link.target = '_blank';
      });
    };

    MoriColor.prototype.initDom = function() {
      if (window.location.hash !== '') {
        var i = window.location.hash.indexOf('#disqus_thread');
        if (i !== -1) {
          MoriDom.select('#disqus_thread').show();
        }
      }

      if (
        MORI_VARS.bottomTools.hitokoto &&
        MoriDom.select('#hitokoto').length > 0
      ) {
        this.getHitokoto();
      }
    };

    MoriColor.prototype.bindDom = function() {
      MoriDom.select(document).on(
        'click',
        '[data-action="comment-show"]',
        function() {
          MoriDom.select('#disqus_thread').show();
        }
      );
      MoriDom.select(document).on(
        'click',
        '[data-action="comment-go"]',
        function(event) {
          event.preventDefault();
          MoriDom.select('#disqus_thread')
            .show()
            .scrollTo();
        }
      );
      MoriDom.select(document).on('click', '[data-toggle="dropdown"]', function(
        event
      ) {
        event.preventDefault();
        event.stopPropagation();
        var dropup = MoriDom.select(event.target).parent('dropup');
        if (dropup.hasClass('open')) {
          dropup.removeClass('open');
        } else {
          dropup.addClass('open');
        }
      });
      MoriDom.select(document).on('click', 'body', function(event) {
        var target = MoriDom.select(event.target);
        if (target.parent('dropup').length === 0) {
          MoriDom.select('.dropup.open').removeClass('open');
        }
      });
    };

    MoriColor.prototype.initDisqus = function() {
      if (
        MORI_VARS.comment.use === 'disqus' &&
        MoriDom.select('#disqus_thread').length > 0 &&
        MoriDom.select('#disqus_thread').attr('data-allow-comment') !== 'false'
      ) {
        // @ts-ignore
        window.disqus_config = function() {
          // @ts-ignore
          this.page.url = MoriDom.select('#disqus_thread').attr(
            'data-permalink'
          );
          // @ts-ignore
          this.page.identifier = MoriDom.select('#disqus_thread').attr(
            'data-permalink'
          );
          // @ts-ignore
          this.page.title = MoriDom.select('#disqus_thread').attr('data-title');
        };

        // @ts-ignore
        if (window.DISQUS) {
          // @ts-ignore
          window.DISQUS.reset({
            reload: true,
            // @ts-ignore
            config: window.disqus_config
          });
        } else {
          (function() {
            var d = document;
            var s = d.createElement('script');
            s.src = '//' + MORI_VARS.comment.shortname + '.disqus.com/embed.js';
            // @ts-ignore
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
          })();
        }
      }
    };

    MoriColor.prototype.analytics = function() {
      if (MORI_VARS.analytics.use === 'google') {
        /* eslint-disable */
        (function(i, s, o, g, r, a, m) {
          // @ts-ignore
          i.GoogleAnalyticsObject = r;
          (i[r] =
            i[r] ||
            function() {
              (i[r].q = i[r].q || []).push(arguments);
            }),
            // @ts-ignore
            (i[r].l = 1 * new Date());
          (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m);
        })(
          window,
          document,
          'script',
          '//www.google-analytics.com/analytics.js',
          'ga'
        );
        /* eslint-enable */
        // @ts-ignore
        if (window.ga) {
          // @ts-ignore
          window.ga('create', MORI_VARS.analytics.id, 'auto');
          // @ts-ignore
          window.ga('send', 'pageview');
        }
      }
    };

    MoriColor.prototype.initPjax = function() {
      if (!Pjax.isSupported()) {
        return;
      }

      new Pjax({
        elements: 'a[href]:not([data-nopjax]):not([data-toggle])',
        selectors: ['title', '#pjax-container'],
        cacheBust: false
      });

      document.addEventListener('pjax:send', function() {
        mori.loadingStart();
      });

      document.addEventListener('pjax:success', function() {
        // @ts-ignore
        if (window.ga) {
          // @ts-ignore
          window.ga('send', 'pageview', {
            page: window.location.pathname + window.location.search,
            title: document.title
          });
        }
        mori.initDom();
        mori.initDisqus();
        mori.updateLinks();
      });

      document.addEventListener('pjax:complete', function() {
        mori.loadingEnd();
      });

      window.addEventListener('popstate', function() {
        mori.initDom();
      });
    };

    MoriColor.prototype.loadingStart = function() {
      NProgress.start();
    };

    MoriColor.prototype.loadingEnd = function() {
      setTimeout(NProgress.done, 500);
    };

    MoriColor.prototype.run = function() {
      this.initDom();
      this.bindDom();
      this.initDisqus();
      this.updateLinks();
      document.addEventListener('DOMContentLoaded', function() {
        mori.initPjax();
      });
      this.loadingStart();
      document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') {
          setTimeout(mori.loadingEnd, 500);
          mori.analytics();
        }
      });
    };

    mori = new MoriColor();
    mori.run();
    // @ts-ignore
    window.MORI_INSTANCE = mori;
  }
})(window, document);
