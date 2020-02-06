"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}!function(o,s){var t=o.MORI_INSTANCE,r=o.MORI_VARS,n=o.NProgress,a=o.Pjax,i=function(){function a(e){_classCallCheck(this,a),e&&"string"!=typeof e?this.element=e:"string"==typeof e&&(this.element=s.querySelector(e),this.elements=s.querySelectorAll(e),this.length=this.elements.length),this.element||(this.element=s.createElement("mori"),this.length=0)}return _createClass(a,[{key:"show",value:function(){return this.element.style.display="block",this}},{key:"hide",value:function(){return this.element.style.display="none",this}},{key:"html",value:function(e){return this.element.innerHTML=e,this}},{key:"addClass",value:function(e){return this.element.classList.add(e),this}},{key:"removeClass",value:function(e){return this.element.classList.remove(e),this}},{key:"hasClass",value:function(e){return this.element.classList.contains(e)}},{key:"css",value:function(e,t){return t?(this.element.style[e]=t,this):this.element.style[e]}},{key:"attr",value:function(e,t){return t?(this.element.setAttribute(e,t),this):this.element.getAttribute(e)}},{key:"each",value:function(n){return Array.prototype.forEach.call(this.elements,function(e,t){return n.call(e,e,t)}),this}},{key:"parent",value:function(e){for(var t=this.element.parentNode;t!==s;){var n=t;if(a.select(t).hasClass(e))return a.select(t);if(!n.parentNode)break;t=n.parentNode}return a.select(null)}},{key:"on",value:function(e,r,t){var l=this,c=2<arguments.length&&void 0!==t?t:function(){};return this.element.addEventListener(e,function(e){for(var t=l.element.querySelectorAll(r),n=e.target,a=0,i=t.length;a<i;a++)for(var s=n,o=t[a];s&&s!==l.element;){if(s===o)return c.call(o,e,s);s=s.parentNode}}),this}},{key:"scrollTo",value:function(){var n=this.element.getBoundingClientRect().top,a=o.pageYOffset,i=n+a,s=+new Date;return requestAnimationFrame(function e(){var t=new Date-s;o.scrollTo(0,a+n*(t/500)),e.timer=requestAnimationFrame(e),500<=t&&(o.scrollTo(0,i),cancelAnimationFrame(e.timer))}),this}}],[{key:"select",value:function(e){return new a(e)}}]),a}(),e=function(){function e(){_classCallCheck(this,e),n.configure({showSpinner:!1})}return _createClass(e,[{key:"getHitokoto",value:function(){var e=new XMLHttpRequest;e.open("GET","https://api.imjad.cn/hitokoto/"),e.addEventListener("load",function(){i.select("#hitokoto").html("Hitokoto&nbsp; · &nbsp;&nbsp;"+e.responseText)}),e.send()}},{key:"updateLinks",value:function(){i.select("a").each(function(e){var t=e.getAttribute("href");return!t||(t&&0===t.indexOf(r.url)?(t=""===(t=t.replace(r.url,""))?"/":t,e.href=t,!0):"javascript:"===t.substring(0,11)||"#"===t.substring(0,1)||"/"===t.substring(0,1)||void(e.target="_blank"))})}},{key:"initDom",value:function(){""!==o.location.hash&&-1!==o.location.hash.indexOf("#comment")&&i.select("#disqus_thread").show();r.bottomTools.hitokoto&&0<i.select("#hitokoto").length&&this.getHitokoto()}},{key:"bindDom",value:function(){i.select(s).on("click",'[data-action="comment-show"]',function(e){e.preventDefault(),i.select("#disqus_thread").show()}),i.select(s).on("click",'[data-action="comment-go"]',function(e){e.preventDefault(),i.select("#disqus_thread").show().scrollTo()}),i.select(s).on("click",'[data-toggle="dropdown"]',function(e){e.preventDefault(),e.stopPropagation();var t=i.select(e.target).parent("dropup");t.hasClass("open")?t.removeClass("open"):t.addClass("open")}),i.select(s).on("click","body",function(e){0===i.select(e.target).parent("dropup").length&&i.select(".dropup.open").removeClass("open")})}},{key:"initDisqus",value:function(){var e,t;"disqus"===r.comment.use&&0<i.select("#disqus_thread").length&&"false"!==i.select("#disqus_thread").attr("data-allow-comment")&&(o.disqus_config=function(){this.page.url=i.select("#disqus_thread").attr("data-permalink"),this.page.identifier=i.select("#disqus_thread").attr("data-permalink"),this.page.title=i.select("#disqus_thread").attr("data-title")},o.DISQUS?o.DISQUS.reset({reload:!0,config:o.disqus_config}):((t=(e=s).createElement("script")).src="//"+r.comment.shortname+".disqus.com/embed.js",t.setAttribute("data-timestamp",+new Date),(e.head||e.body).appendChild(t)))}},{key:"analytics",value:function(){var e,t,n,a,i;"google"===r.analytics.use&&(t=s,n="ga",(e=o).GoogleAnalyticsObject=n,e.ga=e.ga||function(){(e.ga.q=e.ga.q||[]).push(arguments)},e.ga.l=+new Date,a=t.createElement("script"),i=t.getElementsByTagName("script")[0],a.async=1,a.src="//www.google-analytics.com/analytics.js",i.parentNode.insertBefore(a,i),o.ga&&(o.ga("create",r.analytics.id,"auto"),o.ga("send","pageview")))}},{key:"initPjax",value:function(){a.isSupported()&&(new a({elements:"a[href]:not([data-nopjax]):not([data-toggle])",selectors:["title","#pjax-container"],cacheBust:!1}),s.addEventListener("pjax:send",function(){t.loadingStart()}),s.addEventListener("pjax:success",function(){o.ga&&o.ga("send","pageview",{page:o.location.pathname+o.location.search,title:s.title}),t.initDom(),t.initDisqus(),t.updateLinks()}),s.addEventListener("pjax:complete",function(){t.loadingEnd()}),o.addEventListener("popstate",function(){t.initDom()}))}},{key:"loadingStart",value:function(){n.start()}},{key:"loadingEnd",value:function(){setTimeout(n.done,500)}},{key:"run",value:function(){this.initDom(),this.bindDom(),this.initDisqus(),this.updateLinks(),s.addEventListener("DOMContentLoaded",function(){t.initPjax()}),this.loadingStart(),s.addEventListener("readystatechange",function(){"complete"===s.readyState&&(setTimeout(t.loadingEnd,500),t.analytics())})}}]),e}();t||((t=new e).run(),o.MORI_INSTANCE=t)}(window,document);