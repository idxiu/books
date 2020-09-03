import { generateUrl } from "@nextcloud/router";

if (!OCA.Books) {
	OCA.Books = {};
}

OCA.Books.Core = (function() {
	var _books = [];
	var _section = {};
	var _rendition = undefined;
	var _updateHandle = undefined;
	var _saveHandle = undefined;

	var _progress = function(id) {
		let book = _books.find(elem => elem.id == id);
		if (book && book.progress) {
			return book.progress;
		}
		return undefined;
	};

	var _updateProgressUI = function() {
		clearTimeout(_updateHandle);

		_updateHandle = setTimeout(function() {
			let cfi = _rendition.location.start.cfi;
			let progress = _rendition.book.locations.percentageFromCfi(cfi);
			OCA.Books.UI.refreshProgress(progress, _section.href);
		}, 250);
	};

	var _saveProgress = function() {
		clearTimeout(_saveHandle);

		_saveHandle = setTimeout(function() {
			let cfi = _rendition.location.start.cfi;
			if (_rendition.book.locations.percentageFromCfi(cfi) > 0) {
				let book = _books.find(elem => elem.id == _rendition.id);
				OCA.Books.Backend.saveProgress(_rendition.id, cfi, function(obj){
					if (obj.success) {
						book.progress = cfi;
						book.status = book.status || 1;
						OCA.Books.UI.refreshStatus(_rendition.id, book.status);
					}
				});
			}
		}, 1000);
	};

	return {
		init: function() {
			window.addEventListener("bookstylechange", function(){
				if (_rendition) {
					_rendition.themes.default(OCA.Books.UI.Style.get());
				}
			});

			OCA.Books.Backend.getConfig(function(obj) {
				document.querySelector("#path-settings").value = obj.library;
			});
			OCA.Books.Backend.getBooks(function(obj) {
				if (obj.success) {
					_books = obj.data;
					OCA.Books.UI.buildShelf(_books);
					OCA.Books.UI.buildNavigation(_books);
				}
			});
			OCA.Books.UI.init();
		},

		open: function(id, elem) {
			this.close();
			OCA.Books.Backend.getLocation(id, function(obj) {
				if (obj.success) {
					OCA.Books.UI.openReader();
					OCA.Books.UI.showLoadingScreen();
					let book = ePub(obj.data, { replacements: "blobUrl", openAs: "epub" });
					book.loaded.navigation.then(OCA.Books.UI.buildTOC);
					book.ready.then(function(){
						book.locations.generate(1000).then(function(){
							OCA.Books.UI.hideLoadingScreen();

							let markers = [];
							book.spine.each(function(elem){
								let cfi = elem.cfiFromElement(elem.document);
								markers.push(book.locations.percentageFromCfi(cfi));
							});
							OCA.Books.UI.buildMarkers(markers);

							_rendition = book.renderTo(elem, { width: "100%", height: "100%" });
							_rendition.id = id;
							_rendition.themes.default(OCA.Books.UI.Style.get());
							_rendition.display(_progress(id));
							_rendition.on("relocated", function(){
								_updateProgressUI();
								_saveProgress();
							});
							_rendition.on("rendered", function(section){
								_section = section;
							});
						});
					});
				}
			});
		},

		close: function() {
			if (_rendition) {
				_rendition.destroy();
				_rendition = undefined;
				_section = {};
			}
			clearTimeout(_saveHandle);
			clearTimeout(_updateHandle);
			OCA.Books.UI.closeReader();
			OCA.Books.UI.refreshProgress(0);
		},

		nextPage: function() {
			if (_rendition) {
				_rendition.next();
			}
		},

		prevPage: function() {
			if (_rendition) {
				_rendition.prev();
			}
		},

		nextSection: function() {
			if (_rendition && _section) {
				_rendition.display((_section.next() || {}).href);
			}
		},

		prevSection: function() {
			if (_rendition && _section) {
				_rendition.display((_section.prev() || {}).href);
			}
		},

		toSection: function(href) {
			if (_rendition) {
				_rendition.display(href);
			}
		},

		toPercent: function(val) {
			if (_rendition) {
				let cfi = _rendition.book.locations.cfiFromPercentage(val);
				_rendition.display(cfi);
			}
		},

		getIds: function(key, value) {
			let match = [];

			if (key == "author") {
				match = _books.filter(b => b.authors !== undefined && b.authors.some(a => a.fileAs == value));
			} else if (key == "series") {
				match = _books.filter(b => b.series !== undefined && b.series.some(s => s.fileAs == value));
			} else if (key == "genre") {
				match = _books.filter(b => b.genres !== undefined && b.genres.includes(value));
			} else if (key == "status") {
				match = _books.filter(b => b.status == value);
			} else if (key == "shelf") {
				match = _books.filter(b => b.shelves !== undefined && b.shelves.includes(value));
			}

			return match.map(m => m.id);
		}
	};
})();

OCA.Books.UI = (function() {
	var _groupBy = "author";
	var _sortBy = "title";
	var _sortAsc = true;
	var _sliderTimeout = undefined;

	var _refreshMore = function(objs, field) {
		let more = field.querySelector(".more");
		if (objs.length > 1) {
			more.style.display = "inline-block";
			more.textContent = `+${objs.length-1}`;
		} else {
			more.style.display = "none";
		}
	};

	var _sortShelf = function(cat, toggle) {
		_sortBy = cat;

		if (toggle) {
			if (document.querySelector(`#app-content th.${_sortBy} > span:not(.hidden)`)) {
				_sortAsc = !_sortAsc;
			}
		}

		let heads = document.querySelectorAll("#app-content th.sort");
		for (let i = 0, head; head = heads[i]; i++) {
			if (head.classList.contains(_sortBy)) {
				head.firstElementChild.classList.remove("hidden");
			} else {
				head.firstElementChild.classList.add("hidden");
			}

			if (_sortAsc) {
				head.firstElementChild.classList.remove("icon-triangle-s");
				head.firstElementChild.classList.add("icon-triangle-n");
			} else {
				head.firstElementChild.classList.remove("icon-triangle-n");
				head.firstElementChild.classList.add("icon-triangle-s");
			}
		}

		let locale = document.documentElement.dataset.locale || "en";
		let body = document.querySelector("#app-content tbody");
		let tr = Array.from(body.querySelectorAll('tr'));
		tr.sort(function(a, b){ return _sort(a, b, locale); });
		tr.forEach(t => {body.appendChild(t)});
	};

	var _sort = function(tr1, tr2, loc) {
		let text1 = tr1.querySelector(`.${_sortBy}`).dataset.fileAs;
		let text2 = tr2.querySelector(`.${_sortBy}`).dataset.fileAs;
		let out = text1.localeCompare(text2, loc, {numeric: true});
		if (!_sortAsc) out *= -1;
		return out;
	};

	var _sortCategoryFragment = function(frag) {
		let loc = document.documentElement.dataset.locale || "en";
		let all = Array.from(frag.children);
		all.sort((a, b) => a.dataset.id.localeCompare(b.dataset.id, loc, {numeric: true}));
		all.forEach(c => frag.appendChild(c));
	};

	var _showCategory = function(cat) {
		document.querySelector(`#list-category > li[data-group='${_groupBy}']`).classList.remove("active");
		document.querySelector(`#category > div[data-group='${_groupBy}']`).style.display = "none";
		document.querySelector(`#list-category > li[data-group='${cat}']`).classList.add("active");
		document.querySelector(`#category > div[data-group='${cat}']`).style.display = "block";
		_groupBy = cat;
		_showGroup("all");
	};

	var _showGroup = function(id) {
		let rows = document.querySelectorAll("#app-content tbody tr");
		if (id == "all") {
			rows.forEach(r => r.style.display = "table-row");
		} else {
			let ids = OCA.Books.Core.getIds(_groupBy, id);
			for (let i = 0, row; row = rows[i]; i++) {
				row.style.display = ids.includes(parseInt(row.dataset.id)) ? "table-row" : "none";
			}
		}

		let items = document.querySelectorAll(`#category > div[data-group='${_groupBy}'] li`);
		for (let i = 0, item; item = items[i]; i++) {
			if (item.dataset.id == id) {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		}
	};

	var _buildNavigationItem = function(tpl, frag, id, name) {
		let item = frag.querySelector(`li[data-id='${id}']`);
		if (item) {
			let num = parseInt(item.lastElementChild.textContent);
			item.lastElementChild.textContent = num + 1;
		} else {
			item = tpl.cloneNode(true);
			item.dataset.id = id;
			item.firstElementChild.textContent = name;
			item.firstElementChild.addEventListener("click", function(evt){
				_showGroup(evt.target.parentNode.dataset.id);
			});
			frag.appendChild(item);
		}
	};

	var _buildTOC = function(toc) {
		let frag = document.createDocumentFragment();
		let tpl = document.createElement("li");
		tpl.innerHTML = document.querySelector("#template-toc-item").innerHTML;

		toc.forEach(function(chapter) {
			let item = tpl.cloneNode(true);
			item.lastElementChild.textContent = chapter.label;
			item.lastElementChild.href = chapter.href;
			item.addEventListener("click", _onTOCItemClicked);

			if (chapter.subitems.length > 0) {
				item.appendChild(_buildTOC(chapter.subitems));
			}

			frag.appendChild(item);
		});

		let list = document.createElement("ul");
		list.appendChild(frag);

		return list;
	};

	var _onItemClicked = function(evt) {
		let id = evt.target.closest("tr").dataset.id;
		OCA.Books.Core.open(id, "reader");
	};

	var _onTOCItemClicked = function(evt) {
		evt.preventDefault();
		OCA.Books.Core.toSection(evt.target.getAttribute("href"));
	};

	var _onProgressHandleMoved = function(evt) {
		clearTimeout(_sliderTimeout);

		let width = document.querySelector("#reader-progress-bar").getBoundingClientRect().width;
		let pos = Math.min(Math.max(evt.pageX - 44, 0), width);
		document.querySelector("#reader-progress-handle").style.left = (pos - 7) + "px";
		document.querySelector("#reader-progress-overlay").style.width = pos + "px" ;

		_sliderTimeout = setTimeout(function(){
			OCA.Books.Core.toPercent(pos / width);
		}, 250);
	};

	var _onProgressHandleReleased = function() {
		let handle = document.querySelector("#reader-progress-handle");
		handle.removeEventListener("mousemove", _onProgressHandleMoved);
		handle.removeEventListener("mouseup", _onProgressHandleReleased);
		handle.removeEventListener("mouseleave", _onProgressHandleReleased);
		document.querySelector("#reader-progress-bar").classList.remove("active");
	}

	var _onKeyUp = function(evt) {
		if (evt.code == "ArrowLeft" || evt.keyCode == 37) {
			OCA.Books.Core.prevPage();
		} else if (evt.code == "ArrowRight" || evt.keyCode == 39) {
			OCA.Books.Core.nextPage();
		} else if (evt.code == "ArrowUp" || evt.keyCode == 38) {
			OCA.Books.Core.prevSection();
		} else if (evt.code == "ArrowDown" || evt.keyCode == 40) {
			OCA.Books.Core.nextSection();
		} else if (evt.code == "Escape" || evt.keyCode == 27) {
			OCA.Books.Core.close();
		}
	};

	return {
		stylesheet: "/apps/books/css/book.css",

		init: function() {
			this.Style.init();
			document.querySelector("#settings-item-scan").addEventListener("click", function() {
				OCA.Books.Backend.scan(document.querySelector("#path-settings").value, function(obj) {
					console.log(obj);
				});
			});
			document.querySelector("#settings-item-reset").addEventListener("click", function() {
				OCA.Books.Backend.reset(function(obj) {
					console.log(obj);
				});
			});
			document.querySelector("#reader-prev").addEventListener("click", function(){
				OCA.Books.Core.prevPage();
			});
			document.querySelector("#reader-next").addEventListener("click", function(){
				OCA.Books.Core.nextPage();
			});
			document.querySelector("#reader-close").addEventListener("click", function(){
				OCA.Books.Core.close();
			});
			document.querySelector("#reader-progress-handle").addEventListener("mousedown", function(){
				OCA.Books.UI.activateSlider();
			});
			document.querySelector("#font-settings").addEventListener("change", function(evt){
				OCA.Books.UI.Style.setFontSize(evt.target.value);
			});

			let cats = document.querySelectorAll("#list-category > li > a");
			for (let i = 0, cat; cat = cats[i]; i++) {
				cat.addEventListener("click", function(evt){
					_showCategory(evt.target.parentNode.dataset.group);
					evt.preventDefault();
				});
			}

			let cols = document.querySelectorAll("th.sort");
			for (let i = 0, col; col = cols[i]; i++) {
				col.addEventListener("click", function(evt) {
					OCA.Books.UI.sortShelf(evt.target.dataset.sort);
				});
			}
		},

		buildNavigation: function(books) {
			let all = document.querySelectorAll("#category li:first-child");
			for (let i = 0, a; a = all[i]; i++) {
				a.lastElementChild.textContent = books.length;
				a.firstElementChild.addEventListener("click", function(evt){
					_showGroup(evt.target.parentNode.dataset.id);
				});
			}

			let fragAuthor = document.createDocumentFragment();
			let fragSeries = document.createDocumentFragment();
			let fragGenre = document.createDocumentFragment();
			let fragStatus = document.createDocumentFragment();
			let fragShelf = document.createDocumentFragment();

			let tpl = document.createElement("li");
			tpl.innerHTML = document.querySelector("#template-list-item").innerHTML;
			for (let i = 0, book; book = books[i]; i++) {
				_buildNavigationItem(tpl, fragStatus, book.status, t("books", `status-${book.status}`));

				if (book.authors) {
					book.authors.forEach(a => _buildNavigationItem(tpl, fragAuthor, a.fileAs, a.name));
				}
				if (book.series) {
					book.series.forEach(s => _buildNavigationItem(tpl, fragSeries, s.fileAs, s.name));
				}
				if (book.genres) {
					book.genres.forEach(g => _buildNavigationItem(tpl, fragGenre, g, g));
				}
				if (book.shelves) {
					book.shelves.forEach(s => _buildNavigationItem(tpl, fragShelf, s, s));
				}
			}

			_sortCategoryFragment(fragAuthor);
			_sortCategoryFragment(fragSeries);
			_sortCategoryFragment(fragGenre);
			_sortCategoryFragment(fragStatus);
			_sortCategoryFragment(fragShelf);

			document.querySelector("#category > div[data-group='author'] > ul").appendChild(fragAuthor);
			document.querySelector("#category > div[data-group='series'] > ul").appendChild(fragSeries);
			document.querySelector("#category > div[data-group='genre'] > ul").appendChild(fragGenre);
			document.querySelector("#category > div[data-group='status'] > ul").appendChild(fragStatus);
			document.querySelector("#category > div[data-group='shelf'] > ul").appendChild(fragShelf);

			_showCategory(_groupBy);
		},

		buildShelf: function(books) {
			let frag = document.createDocumentFragment();
			let tpl = document.createElement("tr");
			tpl.innerHTML = document.querySelector("#template-shelf-item").innerHTML;

			for (let i = 0, book; book = books[i]; i++) {
				let item = tpl.cloneNode(true);
				let fields = item.querySelectorAll(".field");
				item.dataset.id = book.id;
				item.className = "app-shelf-item";

				if (book.status != 0) {
					fields[0].querySelector(`svg.status-${book.status}`).style.display = "block";
				}
				if (book.hasCover) {
					let url = `url("${generateUrl("apps/books/api/0.1/cover")}/${book.id}")`;
					fields[0].firstElementChild.style.backgroundImage = url;
				} else {
					fields[0].querySelector(".placeholder").textContent = book.titles[0].fileAs.substring(0,2);
				}

				fields[1].querySelector(".title-1").textContent = book.titles[0].name;
				fields[1].dataset.fileAs = book.titles[0].fileAs;
				fields[1].addEventListener("click", _onItemClicked);
				if (book.series) {
					let series = book.series[0];
					fields[1].dataset.fileAs = `${series.fileAs}${series.pos}`;
					fields[1].querySelector(".title-2").textContent = `${series.name} ${series.pos}`;
				}

				if (book.authors) {
					fields[0].firstElementChild.style.backgroundColor = book.authors[0].color;
					fields[2].dataset.fileAs = book.authors[0].fileAs;
					fields[2].querySelector(".author-1").textContent = book.authors[0].name;
					_refreshMore(book.authors,fields[2]);
				}

				if (book.genres) {
					fields[3].dataset.fileAs = book.genres[0];
					fields[3].querySelector(".genre-1").textContent = book.genres[0];
					_refreshMore(book.genres,fields[3]);
				}

				let lang = t("books", book.languages[0]);
				fields[4].dataset.fileAs = lang;
				fields[4].querySelector(".lang-1").textContent = lang;
				_refreshMore(book.languages, fields[4]);

				frag.appendChild(item);
			}

			let shelf = document.querySelector("#app-shelf-body");
			shelf.textContent = "";
			shelf.appendChild(frag);
			_sortShelf(_sortBy);
		},

		sortShelf: function(category) {
			_sortShelf(category, true);
		},

		buildTOC: function(toc) {
			let elem = document.querySelector("#app-navigation-toc");
			elem.textContent = "";
			elem.appendChild(_buildTOC(toc));
		},

		buildMarkers: function(positions) {
			let frag = document.createDocumentFragment();

			positions.forEach(function(pos){
				let marker = document.createElement("div");
				marker.className = "marker";
				marker.style.left = `${pos * 100}%`;
				frag.appendChild(marker);
			});

			let panel = document.querySelector("#reader-progress-markers");
			panel.textContent = "";
			panel.appendChild(frag);
		},

		openReader: function() {
			document.querySelector("#app").classList.add("reader");
			window.addEventListener("keyup", _onKeyUp);
		},

		closeReader: function() {
			document.querySelector("#app").classList.remove("reader");
			window.removeEventListener("keyup", _onKeyUp);
			this.hideLoadingScreen();
		},

		showLoadingScreen: function() {
			document.querySelector("#spinner").style.display = "block";
		},

		hideLoadingScreen: function() {
			document.querySelector("#spinner").style.display = "none";
		},

		activateSlider: function() {
			let handle = document.querySelector("#reader-progress-handle");
			handle.addEventListener("mousemove", _onProgressHandleMoved);
			handle.addEventListener("mouseup", _onProgressHandleReleased);
			handle.addEventListener("mouseleave", _onProgressHandleReleased);
			document.querySelector("#reader-progress-bar").classList.add("active");
		},

		refreshProgress: function(percent, section) {
			if (!document.querySelector("#reader-progress-bar").classList.contains("active")) {
				percent *= 100;
				let handle = document.querySelector("#reader-progress-handle");
				let overlay = document.querySelector("#reader-progress-overlay");
				handle.style.left = `calc(${percent}% - 6px)`;
				overlay.style.width = `${percent}%`;
			}

			let toc = document.querySelectorAll("#app-navigation-toc li");
			for (let i = 0, item; item = toc[i]; i++) {
				if (item.firstElementChild.getAttribute("href") == section) {
					item.classList.add("active");
				} else {
					item.classList.remove("active");
				}
			}
		},

		refreshStatus: function(id, status) {
			let icons = document.querySelectorAll(`#app-content tr[data-id='${id}'] .cover svg`);
			for (let i = 0, icon; icon = icons[i]; i++) {
				icon.style.display = (icon.classList.contains(`status-${status}`)) ? "block" : "none";
			}
		},

		Style: (function(){
			var _style = {
				html: {
					"font-size": "initial"
				},
				body: {
					"font-size": "inherit",
					"text-align": "justify"
				},
				p: {
					"max-width": "32em"
				}
			};

			return {
				setFontSize: function(val) {
					_style.html["font-size"] = val;
					window.localStorage.setItem("font-size", val);
					window.dispatchEvent(new Event("bookstylechange"));
				},

				get: function() {
					return _style;
				},

				init: function() {
					_style.html["font-size"] = window.localStorage.getItem("font-size");
					document.querySelector("#font-settings").value = _style.html["font-size"];
				}
			};
		})()
	};
})();

/**
 * Books.Backend communicates with the server. All public functions
 * accept a callback function and pass the JSON-parsed response as
 * the first parameter to that function.
 */
OCA.Books.Backend = (function() {
	return {
		get: function(uri, callback) {
			let xhr = new XMLHttpRequest();
			xhr.addEventListener("load", callback);
			xhr.open("GET", uri);
			xhr.setRequestHeader("requesttoken", oc_requesttoken);
			xhr.send();
		},

		post: function(uri, data, callback) {
			let xhr = new XMLHttpRequest();
			xhr.addEventListener("load", callback);
			xhr.open("POST", uri);
			xhr.setRequestHeader("requesttoken", oc_requesttoken);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);
		},

		getConfig: function(callback) {
			this.get(generateUrl("apps/books/api/0.1/config"), function() {
				callback(JSON.parse(this.response));
			});
		},

		getBooks: function(callback) {
			this.get(generateUrl("apps/books/api/0.1/books"), function() {
				callback(JSON.parse(this.response));
			});
		},

		getLocation: function(id, callback) {
			this.get(generateUrl("apps/books/api/0.1/loc/"+id), function() {
				callback(JSON.parse(this.response));
			});
		},

		saveProgress: function(id, value, callback) {
			let data = `id=${id}&progress=${value}`;
			this.post(generateUrl("apps/books/api/0.1/progress"), data, function() {
				callback(JSON.parse(this.response));
			});
		},

		scan: function(dir, callback) {
			let data = `dir=${dir}`;
			this.post(generateUrl("apps/books/api/0.1/scan"), data, function() {
				callback(JSON.parse(this.response));
			});
		},

		reset: function(callback) {
			this.post(generateUrl("apps/books/api/0.1/reset"), "", function() {
				callback(JSON.parse(this.response));
			});
		}
	};
})();

document.addEventListener("DOMContentLoaded", function () {
	OCA.Books.Core.init();
});