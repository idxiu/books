!function(e){function t(t){for(var n,i,a=t[0],l=t[1],c=t[2],u=0,f=[];u<a.length;u++)i=a[u],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&f.push(r[i][0]),r[i]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(d&&d(t);f.length;)f.shift()();return s.push.apply(s,c||[]),o()}function o(){for(var e,t=0;t<s.length;t++){for(var o=s[t],n=!0,a=1;a<o.length;a++){var l=o[a];0!==r[l]&&(n=!1)}n&&(s.splice(t--,1),e=i(i.s=o[0]))}return e}var n={},r={0:0},s=[];function i(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=e,i.c=n,i.d=function(e,t,o){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(o,n,function(t){return e[t]}.bind(null,n));return o},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/js/";var a=window.webpackJsonp=window.webpackJsonp||[],l=a.push.bind(a);a.push=t,a=a.slice();for(var c=0;c<a.length;c++)t(a[c]);var d=l;s.push([47,1]),o()}({47:function(e,t,o){o(48),o(49),o(79),e.exports=o(88)},48:function(e,o){var n,r,s,i,a,l;OCA.Books||(OCA.Books={}),OCA.Books.Core=(n=[],r={},s=void 0,i=void 0,a=void 0,l=function(e,t){t=t.substring(0,t.lastIndexOf("/")+1),e.forEach((function(e){e.href=t+e.href,l(e.subitems,t)}))},{init:function(){window.addEventListener("bookstylechange",(function(){s&&s.themes.default(OCA.Books.UI.Style.get())})),OCA.Books.Backend.getConfig((function(e){document.querySelector("#path-settings").value=e.library})),OCA.Books.Backend.getBooks((function(e){e.success&&(n=e.data,OCA.Books.UI.buildShelf(n),OCA.Books.UI.buildNavigation(n))})),OCA.Books.UI.init()},open:function(e,t){this.close(),OCA.Books.Backend.getLocation(e,(function(o){if(o.success){OCA.Books.UI.openReader(),OCA.Books.UI.showLoadingScreen();let c=ePub(o.data,{replacements:"blobUrl",openAs:"epub"});c.loaded.navigation.then((function(e){let t=c.packaging.navPath||c.packaging.ncxPath;t?l(e.toc,t):e=c.spine.items.map(e=>({label:e.idref,href:e.href,subitems:[]})),OCA.Books.UI.buildTOC(e)})),c.ready.then((function(){c.locations.generate(1e3).then((function(){OCA.Books.UI.hideLoadingScreen();let o=[];c.spine.each((function(e){let t=e.cfiFromElement(e.document);o.push(c.locations.percentageFromCfi(t))})),OCA.Books.UI.buildMarkers(o),(s=c.renderTo(t,{width:"100%",height:"100%"})).id=e,s.themes.default(OCA.Books.UI.Style.get()),s.display(function(e){let t=n.find(t=>t.id==e);if(t&&t.progress)return t.progress}(e)),s.on("relocated",(function(){clearTimeout(i),i=setTimeout((function(){let e=s.location.start.cfi,t=s.book.locations.percentageFromCfi(e),o=[];s.book.navigation.toc.map(e=>[e].concat(e.subitems)).flat().filter(e=>e.href.startsWith(r.href)).forEach(e=>{let t=e.href.split("#")[1],n=t?r.document.getElementById(t):r.document.body,i=s.book.locations.percentageFromCfi(r.cfiFromElement(n));o.push({href:e.href,percent:i})});let n=o.filter(e=>e.percent<=t).pop()||o[0]||{href:r.href};OCA.Books.UI.refreshProgress(t,n.href)}),250),clearTimeout(a),a=setTimeout((function(){let e=s.location.start.cfi;if(s.book.locations.percentageFromCfi(e)>0){let t=n.find(e=>e.id==s.id);OCA.Books.Backend.saveProgress(s.id,e,(function(o){if(o.success){let o=t.status;t.progress=e,t.status=t.status||1,OCA.Books.UI.refreshStatus(s.id,t.status,o)}}))}}),1e3)})),s.on("rendered",(function(e){r=e}))}))}))}}))},close:function(){s&&(s.destroy(),s=void 0,r={}),clearTimeout(a),clearTimeout(i),OCA.Books.UI.closeReader(),OCA.Books.UI.refreshProgress(0)},nextPage:function(){s&&s.next()},prevPage:function(){s&&s.prev()},nextSection:function(){s&&r&&s.display((r.next()||{}).href)},prevSection:function(){s&&r&&s.display((r.prev()||{}).href)},toSection:function(e){s&&s.display(e)},toPercent:function(e){if(s){let t=s.book.locations.cfiFromPercentage(e);s.display(t)}},getBook:function(e){return n.filter(t=>t.id==e)[0]},getIds:function(e,t){let o=[];return"author"==e?o=n.filter(e=>void 0!==e.authors&&e.authors.some(e=>e.fileAs==t)):"series"==e?o=n.filter(e=>void 0!==e.series&&e.series.some(e=>e.fileAs==t)):"genre"==e?o=n.filter(e=>void 0!==e.genres&&e.genres.includes(t)):"status"==e?o=n.filter(e=>e.status==t):"shelf"==e&&(o=n.filter(e=>void 0!==e.shelves&&e.shelves.includes(t))),o.map(e=>e.id)},getMeta:function(e){let o=[];return"author"==e?o=n.filter(e=>void 0!==e.authors).map(e=>e.authors.map(e=>[e.fileAs,e.name])).flat():"series"==e?o=n.filter(e=>void 0!==e.series).map(e=>e.series.map(e=>[e.fileAs,e.name])).flat():"genre"==e?o=n.filter(e=>void 0!==e.genres).map(e=>e.genres.map(e=>[e,t("books",e)])).flat():"status"==e?o=n.map(e=>[[e.status],t("books","status-"+e.status)]):"shelf"==e&&(o=n.filter(e=>void 0!==e.shelves).map(e=>e.shelves.map(e=>[e,e])).flat()),o},getOPF:function(e,t){OCA.Books.Backend.getLocation(e,(function(e){if(e.success){let o=ePub(e.data,{replacements:"blobUrl",openAs:"epub"});o.ready.then((function(){let e=Object.keys(o.archive.zip.files).filter(e=>e.endsWith(".opf"))[0];o.archive.getText("/"+e).then(t)}))}}))}}),document.addEventListener("DOMContentLoaded",(function(){OCA.Books.Core.init()}))},49:function(e,t,o){"use strict";o.r(t);var n,r,s=o(2);OCA.Books.Backend=(n=function(e,t){let o=new XMLHttpRequest;o.addEventListener("load",t),o.open("GET",e),o.setRequestHeader("requesttoken",oc_requesttoken),o.send()},r=function(e,t,o){let n=new XMLHttpRequest;n.addEventListener("load",o),n.open("POST",e),n.setRequestHeader("requesttoken",oc_requesttoken),n.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),n.send(t)},{getConfig:function(e){n(Object(s.generateUrl)("apps/books/api/0.1/config"),(function(){e(JSON.parse(this.response))}))},getBooks:function(e){n(Object(s.generateUrl)("apps/books/api/0.1/books"),(function(){e(JSON.parse(this.response))}))},getLocation:function(e,t){n(Object(s.generateUrl)("apps/books/api/0.1/loc/"+e),(function(){t(JSON.parse(this.response))}))},saveProgress:function(e,t,o){let n=`id=${e}&progress=${t}`;r(Object(s.generateUrl)("apps/books/api/0.1/progress"),n,(function(){o(JSON.parse(this.response))}))},scan:function(e,t){let o=new OC.EventSource(Object(s.generateUrl)("apps/books/api/0.1/scan?dir="+e));o.listen("progress",t.updateFunc),o.listen("done",t.doneFunc),o.listen("error",t.errorFunc)},reset:function(e){r(Object(s.generateUrl)("apps/books/api/0.1/reset"),"",(function(){e(JSON.parse(this.response))}))},coverPath:function(e){return`${Object(s.generateUrl)("apps/books/api/0.1/cover")}/${e}`},coverUrl:function(e){return`url("${Object(s.generateUrl)("apps/books/api/0.1/cover")}/${e}")`}})},79:function(e,t,o){"use strict";o.r(t);var n,r,s;o(80),o(82),o(84),o(85),o(22),o(86),o(87);OCA.Books.Editor=(n=o(5),r=void 0,s={mode:"xml",lineNumbers:!0,styleActiveLine:!0,matchTags:!0,autoCloseTags:!0,theme:"default"},window.addEventListener("themechange",(function(e){s.theme=e.detail,r&&r.setOption("theme",e.detail)})),{init:function(e){void 0===r&&(r=n.fromTextArea(document.querySelector(e),s)).refresh()},close:function(){r&&(r.toTextArea(),r=void 0)},setValue:function(e){r&&r.setValue(e)}})},88:function(e,o,n){"use strict";n.r(o);var r,s,i,a,l,c,d,u,f,p,m,h,g,y,v,C,k,S,b,A,O,q,L,E,B=n(13);n(90);OCA.Books.UI=(a="author",l="title",c=!0,d=void 0,u=function(e,t){let o=t.querySelector(".more");e.length>1?(o.style.display="inline-block",o.textContent="+"+(e.length-1)):o.style.display="none"},f=function(e){let t=OCA.Books.Core.getMeta(e),o=document.createDocumentFragment(),n=document.createElement("li");n.innerHTML=document.querySelector("#template-list-item").innerHTML,t.forEach(e=>v(n,o,e[0],e[1])),h(o);let r=document.querySelector(`#category div[data-group="${e}"] > ul`);o.prepend(r.firstElementChild),r.innerHTML="",r.appendChild(o)},p=function(e,t){l=e,t&&document.querySelector(`#app-content th.${l} > span:not(.hidden)`)&&(c=!c);let o=document.querySelectorAll("#app-content th.sort");for(let e,t=0;e=o[t];t++)e.classList.contains(l)?e.firstElementChild.classList.remove("hidden"):e.firstElementChild.classList.add("hidden"),c?(e.firstElementChild.classList.remove("icon-triangle-s"),e.firstElementChild.classList.add("icon-triangle-n")):(e.firstElementChild.classList.remove("icon-triangle-n"),e.firstElementChild.classList.add("icon-triangle-s"));let n=document.documentElement.dataset.locale||"en",r=document.querySelector("#app-content tbody"),s=Array.from(r.querySelectorAll("tr"));s.sort((function(e,t){return m(e,t,n)})),s.forEach(e=>{r.appendChild(e)})},m=function(e,t,o){let n=e.querySelector("."+l).dataset.fileAs,r=t.querySelector("."+l).dataset.fileAs,s=n.localeCompare(r,o,{numeric:!0});return c||(s*=-1),s},h=function(e){let t=document.documentElement.dataset.locale||"en",o=Array.from(e.children);o.sort((e,o)=>e.dataset.id.localeCompare(o.dataset.id,t,{numeric:!0})),o.forEach(t=>e.appendChild(t))},g=function(e){document.querySelector(`#list-category > li[data-group="${a}"]`).classList.remove("active"),document.querySelector(`#category > div[data-group="${a}"]`).style.display="none",document.querySelector(`#list-category > li[data-group="${e}"]`).classList.add("active"),document.querySelector(`#category > div[data-group="${e}"]`).style.display="block",a=e,y("all")},y=function(e){let t=document.querySelectorAll("#app-content tbody tr");if("all"==e)t.forEach(e=>e.style.display="table-row");else{let o=OCA.Books.Core.getIds(a,e);for(let e,n=0;e=t[n];n++)e.style.display=o.includes(parseInt(e.dataset.id))?"table-row":"none"}let o=document.querySelectorAll(`#category > div[data-group="${a}"] li`);for(let t,n=0;t=o[n];n++)t.dataset.id==e?t.classList.add("active"):t.classList.remove("active")},v=function(e,t,o,n){let r=t.querySelector(`li[data-id="${o}"]`);if(r){let e=parseInt(r.lastElementChild.textContent);r.lastElementChild.textContent=e+1}else r=e.cloneNode(!0),r.dataset.id=o,r.firstElementChild.textContent=n,r.firstElementChild.addEventListener("click",(function(e){e.preventDefault(),y(e.target.parentNode.dataset.id)})),t.appendChild(r)},C=function(e){let t=document.createDocumentFragment(),o=document.createElement("li");o.innerHTML=document.querySelector("#template-toc-item").innerHTML,e.forEach((function(e){let n=o.cloneNode(!0);n.lastElementChild.textContent=e.label,n.lastElementChild.href=e.href,n.addEventListener("click",O),e.subitems.length>0&&n.appendChild(C(e.subitems)),t.appendChild(n)}));let n=document.createElement("ul");return n.appendChild(t),n},k=function(){let e=document.querySelector("#app-sidebar");e.classList.add("hidden"),e.classList.remove("wide"),e.querySelector("#app-sidebar-raw").dataset.id=void 0,OCA.Books.Editor.close()},S=function(e){let t=document.querySelectorAll("#app-sidebar header nav > a");for(let o,n=0;o=t[n];n++)n==e?o.classList.add("active"):o.classList.remove("active");let o=document.querySelectorAll("#app-sidebar .tabcontent > div");for(let t,n=0;t=o[n];n++)n==e?t.classList.remove("hidden"):t.classList.add("hidden");let n=document.querySelector("#app-sidebar"),r=n.querySelector("#app-sidebar-raw");2==e&&r.dataset.id!=n.dataset.id&&OCA.Books.Core.getOPF(n.dataset.id,(function(e){r.dataset.id=n.dataset.id,OCA.Books.Editor.setValue(e)}))},b=function(e){let t=e.target.closest("tr").dataset.id;OCA.Books.Core.open(t,"reader"),k()},A=function(e){e.preventDefault(),e.stopPropagation(),function(e){let t=document.querySelector("#app-sidebar");if(t.dataset.id=e,t.classList.contains("hidden"))S(0);else{let e=t.querySelector(".tabbar"),o=t.querySelector(".tabbar > .active");S(Array.from(e.children).indexOf(o))}let o=OCA.Books.Core.getBook(e),n=t.querySelector("#app-sidebar-details");n.querySelector(".description").innerHTML=o.description,n.querySelector(".title").textContent=o.titles?o.titles[0].name:"",n.querySelector(".author").textContent=o.authors?o.authors[0].name:"";let r=n.querySelector("figure > img");r.src=OCA.Books.Backend.coverPath(e),r.style.display=o.hasCover?"block":"none",OCA.Books.Editor.init("#app-sidebar-raw textarea"),t.classList.remove("hidden")}(e.target.closest("tr").dataset.id)},O=function(e){e.preventDefault(),OCA.Books.Core.toSection(e.target.getAttribute("href"))},q=function(e){clearTimeout(d);let t=document.querySelector("#reader-progress-bar").getBoundingClientRect().width,o=Math.min(Math.max(e.pageX-44,0),t);document.querySelector("#reader-progress-handle").style.left=o-7+"px",document.querySelector("#reader-progress-overlay").style.width=o+"px",d=setTimeout((function(){OCA.Books.Core.toPercent(o/t)}),250)},L=function(){let e=document.querySelector("#reader-progress-handle");e.removeEventListener("mousemove",q),e.removeEventListener("mouseup",L),e.removeEventListener("mouseleave",L),document.querySelector("#reader-progress-bar").classList.remove("active")},E=function(e){"ArrowLeft"==e.code||37==e.keyCode?OCA.Books.Core.prevPage():"ArrowRight"==e.code||39==e.keyCode?OCA.Books.Core.nextPage():"ArrowUp"==e.code||38==e.keyCode?OCA.Books.Core.prevSection():"ArrowDown"==e.code||40==e.keyCode?OCA.Books.Core.nextSection():"Escape"!=e.code&&27!=e.keyCode||OCA.Books.Core.close()},{init:function(){this.Style.init(),document.querySelector("#settings-item-scan").addEventListener("click",(function(){var e;OCA.Books.UI.showLoadingScreen(),OCA.Books.Backend.scan(document.querySelector("#path-settings").value,(e=document.querySelector("#spinner > svg circle"),{updateFunc:function(t){let o=t.done/t.total*700;e.style.strokeDasharray=o+" 710"},doneFunc:function(t){OCA.Books.UI.toast(t.message,!0),e.style.strokeDasharray="705 710",setTimeout(OCA.Books.UI.hideLoadingScreen,1e3)},errorFunc:function(e){OCA.Books.UI.toast(e.message,!1),setTimeout(OCA.Books.UI.hideLoadingScreen,1e3)}}))})),document.querySelector("#settings-item-reset").addEventListener("click",(function(){OCA.Books.Backend.reset((function(e){OCA.Books.UI.toast(e.message,e.success)}))})),document.querySelector("#reader-prev").addEventListener("click",(function(){OCA.Books.Core.prevPage()})),document.querySelector("#reader-next").addEventListener("click",(function(){OCA.Books.Core.nextPage()})),document.querySelector("#reader-close").addEventListener("click",(function(){OCA.Books.Core.close()})),document.querySelector("#reader-progress-handle").addEventListener("mousedown",(function(){OCA.Books.UI.activateSlider()})),document.querySelector("#font-settings").addEventListener("change",(function(e){OCA.Books.UI.Style.setFontSize(e.target.value)})),document.querySelector("#color-settings").addEventListener("change",(function(e){OCA.Books.UI.Style.setTheme(e.target.value)})),document.querySelector("#app-sidebar > header > a").addEventListener("click",(function(e){e.preventDefault(),k()})),document.querySelector("#app-sidebar-raw .icon-fullscreen").addEventListener("click",(function(e){e.preventDefault(),document.querySelector("#app-sidebar").classList.toggle("wide")}));let e=document.querySelectorAll("#list-category > li > a");for(let t,o=0;t=e[o];o++)t.addEventListener("click",(function(e){g(e.target.parentNode.dataset.group),e.preventDefault()}));let t=document.querySelectorAll("#app-sidebar header nav > a");for(let e,o=0;e=t[o];o++)e.addEventListener("click",(function(t){t.preventDefault(),S(Array.from(e.parentNode.children).indexOf(t.target))}));let o=document.querySelectorAll("th.sort");for(let e,t=0;e=o[t];t++)e.addEventListener("click",(function(e){OCA.Books.UI.sortShelf(e.target.dataset.sort)}))},buildNavigation:function(e){let t=document.querySelectorAll("#category li:first-child");for(let o,n=0;o=t[n];n++)o.lastElementChild.textContent=e.length,o.firstElementChild.onclick=function(e){y(e.target.parentNode.dataset.id)};f("author"),f("series"),f("genre"),f("status"),f("shelf"),g(a)},buildShelf:function(e){let o=document.createDocumentFragment(),n=document.createElement("tr");n.innerHTML=document.querySelector("#template-shelf-item").innerHTML;for(let r,s=0;r=e[s];s++){let e=n.cloneNode(!0),s=e.querySelectorAll(".field");if(e.dataset.id=r.id,e.className="app-shelf-item",0!=r.status&&(s[0].querySelector(".status-"+r.status).style.display="block"),r.hasCover?s[0].firstElementChild.style.backgroundImage=OCA.Books.Backend.coverUrl(r.id):s[0].querySelector(".placeholder").textContent=r.titles[0].fileAs.substring(0,2),s[1].querySelector(".title-1").textContent=r.titles[0].name,s[1].dataset.fileAs=r.titles[0].fileAs,s[1].addEventListener("click",b),s[1].querySelector("a.action").addEventListener("click",A),r.series){let e=r.series[0];s[1].dataset.fileAs=`${e.fileAs}${e.pos}`,s[1].querySelector(".title-2").textContent=`${e.name} ${e.pos}`}r.authors&&(s[0].firstElementChild.style.backgroundColor=r.authors[0].color,s[2].dataset.fileAs=r.authors[0].fileAs,s[2].querySelector(".author-1").textContent=r.authors[0].name,u(r.authors,s[2])),r.genres&&(s[3].dataset.fileAs=r.genres[0],s[3].querySelector(".genre-1").textContent=t("books",r.genres[0]),u(r.genres,s[3]));let i=t("books",r.languages[0]);s[4].dataset.fileAs=i,s[4].querySelector(".lang-1").textContent=i,u(r.languages,s[4]),o.appendChild(e)}let r=document.querySelector("#app-shelf-body");r.textContent="",r.appendChild(o),p(l)},sortShelf:function(e){p(e,!0)},buildTOC:function(e){let t=document.querySelector("#app-navigation-toc");t.textContent="",t.appendChild(C(e))},buildMarkers:function(e){let t=document.createDocumentFragment();e.forEach((function(e){let o=document.createElement("div");o.className="marker",o.style.left=100*e+"%",t.appendChild(o)}));let o=document.querySelector("#reader-progress-markers");o.textContent="",o.appendChild(t)},openReader:function(){document.querySelector("#app").classList.add("reader"),window.addEventListener("keyup",E)},closeReader:function(){document.querySelector("#app").classList.remove("reader"),window.removeEventListener("keyup",E),this.hideLoadingScreen()},showLoadingScreen:function(){document.querySelector("#spinner").style.display="block"},hideLoadingScreen:function(){document.querySelector("#spinner").style.display="none",document.querySelector("#spinner svg circle").style.strokeDasharray="0 710"},activateSlider:function(){let e=document.querySelector("#reader-progress-handle");e.addEventListener("mousemove",q),e.addEventListener("mouseup",L),e.addEventListener("mouseleave",L),document.querySelector("#reader-progress-bar").classList.add("active")},refreshProgress:function(e,t){if(!document.querySelector("#reader-progress-bar").classList.contains("active")){e*=100;let t=document.querySelector("#reader-progress-handle"),o=document.querySelector("#reader-progress-overlay");t.style.left=`calc(${e}% - 6px)`,o.style.width=e+"%"}let o=document.querySelectorAll("#app-navigation-toc li");for(let e,n=0;e=o[n];n++)e.firstElementChild.getAttribute("href")==t?e.classList.add("active"):e.classList.remove("active")},refreshStatus:function(e,t,o){let n=document.querySelectorAll(`#app-content tr[data-id="${e}"] .cover .icon`);for(let e,o=0;e=n[o];o++)e.style.display=e.classList.contains("status-"+t)?"block":"none";void 0!==o&&t!=o&&f("status")},toast:function(e,t){void 0===t?Object(B.b)(e):t?Object(B.c)(e):Object(B.a)(e)},Style:(r={html:{"font-size":"initial"},body:{"font-size":"inherit","text-align":"justify"},p:{"max-width":"32em"}},s=function(e){r.html["font-size"]=e,window.dispatchEvent(new Event("bookstylechange"))},i=function(e){window.dispatchEvent(new CustomEvent("themechange",{detail:e}))},{setFontSize:function(e){window.localStorage.setItem("font-size",e),s(e)},setTheme:function(e){window.localStorage.setItem("theme",e),i(e)},get:function(){return r},init:function(){let e=window.localStorage.getItem("font-size")||"initial",t=window.localStorage.getItem("theme")||"default";document.querySelector("#font-settings").value=e,document.querySelector("#color-settings").value=t,s(e),i(t)}})})}});