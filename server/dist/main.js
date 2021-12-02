/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "d6107a4f1c33da092eb1";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(2);

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(3)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?100"))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(2);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(6);
const passport_1 = __importDefault(__webpack_require__(7));
const cookie_parser_1 = __importDefault(__webpack_require__(8));
const express_session_1 = __importDefault(__webpack_require__(9));
const path_1 = __importDefault(__webpack_require__(10));
const common_1 = __webpack_require__(11);
const app_module_1 = __webpack_require__(12);
const http_exception_filter_1 = __webpack_require__(65);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useStaticAssets(process.env.NODE_ENV === 'production'
        ? path_1.default.join(__dirname, '..', '..', 'uploads')
        : path_1.default.join(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });
    app.useStaticAssets(process.env.NODE_ENV === 'production'
        ? path_1.default.join(__dirname, '..', '..', 'public')
        : path_1.default.join(__dirname, '..', 'public'), {
        prefix: '/dist',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Sleact API')
        .setDescription('Sleact 개발을 위한 API 문서입니다.')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(cookie_parser_1.default());
    app.use(express_session_1.default({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
        },
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    const PORT = process.env.PORT || 3095;
    await app.listen(PORT);
    console.log(`server listening on port ${PORT}`);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/core");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/common");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const config_1 = __webpack_require__(14);
const app_controller_1 = __webpack_require__(15);
const app_service_1 = __webpack_require__(16);
const auth_module_1 = __webpack_require__(17);
const logger_middleware_1 = __webpack_require__(33);
const ormconfig = __importStar(__webpack_require__(34));
const users_module_1 = __webpack_require__(36);
const workspaces_module_1 = __webpack_require__(45);
const channels_module_1 = __webpack_require__(49);
const events_module_1 = __webpack_require__(60);
const dms_module_1 = __webpack_require__(61);
const frontend_middleware_1 = __webpack_require__(64);
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
        consumer.apply(frontend_middleware_1.FrontendMiddleware).forRoutes({
            path: '/**',
            method: common_1.RequestMethod.ALL,
        });
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot(ormconfig),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            workspaces_module_1.WorkspacesModule,
            channels_module_1.ChannelsModule,
            events_module_1.EventsModule,
            dms_module_1.DMsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/config");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = __webpack_require__(11);
const app_service_1 = __webpack_require__(16);
const path_1 = __importDefault(__webpack_require__(10));
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello(res) {
        res.sendFile(path_1.default.join(__dirname, '..', '..', 'public', 'index.html'));
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = __webpack_require__(11);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = __webpack_require__(11);
const passport_1 = __webpack_require__(18);
const typeorm_1 = __webpack_require__(13);
const Users_1 = __webpack_require__(19);
const auth_service_1 = __webpack_require__(28);
const local_serializer_1 = __webpack_require__(30);
const local_strategy_1 = __webpack_require__(31);
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            passport_1.PassportModule.register({ session: true }),
            typeorm_1.TypeOrmModule.forFeature([Users_1.Users]),
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, local_serializer_1.LocalSerializer],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/passport");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const typeorm_1 = __webpack_require__(20);
const ChannelChats_1 = __webpack_require__(21);
const ChannelMembers_1 = __webpack_require__(23);
const Channels_1 = __webpack_require__(22);
const DMs_1 = __webpack_require__(25);
const Mentions_1 = __webpack_require__(26);
const WorkspaceMembers_1 = __webpack_require__(27);
const Workspaces_1 = __webpack_require__(24);
let Users = class Users {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'email', unique: true, length: 30 }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'nickname', length: 30 }),
    __metadata("design:type", String)
], Users.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'password', length: 100, select: false }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Users.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Users.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Users.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelChats_1.ChannelChats, (channelchats) => channelchats.User),
    __metadata("design:type", Array)
], Users.prototype, "ChannelChats", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelMembers_1.ChannelMembers, (channelmembers) => channelmembers.User),
    __metadata("design:type", Array)
], Users.prototype, "ChannelMembers", void 0);
__decorate([
    typeorm_1.OneToMany(() => DMs_1.DMs, (dms) => dms.Sender),
    __metadata("design:type", Array)
], Users.prototype, "DMs", void 0);
__decorate([
    typeorm_1.OneToMany(() => DMs_1.DMs, (dms) => dms.Receiver),
    __metadata("design:type", Array)
], Users.prototype, "DMs2", void 0);
__decorate([
    typeorm_1.OneToMany(() => Mentions_1.Mentions, (mentions) => mentions.Sender),
    __metadata("design:type", Array)
], Users.prototype, "Mentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => Mentions_1.Mentions, (mentions) => mentions.Receiver),
    __metadata("design:type", Array)
], Users.prototype, "Mentions2", void 0);
__decorate([
    typeorm_1.OneToMany(() => WorkspaceMembers_1.WorkspaceMembers, (workspacemembers) => workspacemembers.User),
    __metadata("design:type", Array)
], Users.prototype, "WorkspaceMembers", void 0);
__decorate([
    typeorm_1.OneToMany(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Owner),
    __metadata("design:type", Array)
], Users.prototype, "OwnedWorkspaces", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Members),
    typeorm_1.JoinTable({
        name: 'workspacemembers',
        joinColumn: {
            name: 'UserId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'WorkspaceId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "Workspaces", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Channels_1.Channels, (channels) => channels.Members),
    typeorm_1.JoinTable({
        name: 'channelmembers',
        joinColumn: {
            name: 'UserId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'ChannelId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "Channels", void 0);
Users = __decorate([
    typeorm_1.Index('email', ['email'], { unique: true }),
    typeorm_1.Entity({ schema: 'sleact', name: 'users' })
], Users);
exports.Users = Users;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("typeorm");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelChats = void 0;
const typeorm_1 = __webpack_require__(20);
const Users_1 = __webpack_require__(19);
const Channels_1 = __webpack_require__(22);
let ChannelChats = class ChannelChats {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text', { name: 'content' }),
    __metadata("design:type", String)
], ChannelChats.prototype, "content", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ChannelChats.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ChannelChats.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'UserId', nullable: true }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "UserId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'ChannelId', nullable: true }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "ChannelId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _c : Object)
], ChannelChats.prototype, "User", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Channels_1.Channels, (channels) => channels.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Channels_1.Channels !== "undefined" && Channels_1.Channels) === "function" ? _d : Object)
], ChannelChats.prototype, "Channel", void 0);
ChannelChats = __decorate([
    typeorm_1.Index('UserId', ['UserId'], {}),
    typeorm_1.Index('ChannelId', ['ChannelId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'channelchats' })
], ChannelChats);
exports.ChannelChats = ChannelChats;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channels = void 0;
const typeorm_1 = __webpack_require__(20);
const ChannelChats_1 = __webpack_require__(21);
const ChannelMembers_1 = __webpack_require__(23);
const Users_1 = __webpack_require__(19);
const Workspaces_1 = __webpack_require__(24);
let Channels = class Channels {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Channels.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'name', length: 30 }),
    __metadata("design:type", String)
], Channels.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('tinyint', {
        name: 'private',
        nullable: true,
        width: 1,
        default: () => "'0'",
    }),
    __metadata("design:type", Boolean)
], Channels.prototype, "private", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Channels.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Channels.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], Channels.prototype, "WorkspaceId", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelChats_1.ChannelChats, (channelchats) => channelchats.Channel),
    __metadata("design:type", Array)
], Channels.prototype, "ChannelChats", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChannelMembers_1.ChannelMembers, (channelMembers) => channelMembers.Channel, {
        cascade: ['insert'],
    }),
    __metadata("design:type", Array)
], Channels.prototype, "ChannelMembers", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, (users) => users.Channels),
    __metadata("design:type", Array)
], Channels.prototype, "Members", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Channels, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _c : Object)
], Channels.prototype, "Workspace", void 0);
Channels = __decorate([
    typeorm_1.Index('WorkspaceId', ['WorkspaceId'], {}),
    typeorm_1.Entity({ schema: 'sleact' })
], Channels);
exports.Channels = Channels;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelMembers = void 0;
const typeorm_1 = __webpack_require__(20);
const Channels_1 = __webpack_require__(22);
const Users_1 = __webpack_require__(19);
let ChannelMembers = class ChannelMembers {
};
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ChannelMembers.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ChannelMembers.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'ChannelId' }),
    __metadata("design:type", Number)
], ChannelMembers.prototype, "ChannelId", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'UserId' }),
    __metadata("design:type", Number)
], ChannelMembers.prototype, "UserId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Channels_1.Channels, (channels) => channels.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Channels_1.Channels !== "undefined" && Channels_1.Channels) === "function" ? _c : Object)
], ChannelMembers.prototype, "Channel", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], ChannelMembers.prototype, "User", void 0);
ChannelMembers = __decorate([
    typeorm_1.Index('UserId', ['UserId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'channelmembers' })
], ChannelMembers);
exports.ChannelMembers = ChannelMembers;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspaces = void 0;
const typeorm_1 = __webpack_require__(20);
const Channels_1 = __webpack_require__(22);
const DMs_1 = __webpack_require__(25);
const Mentions_1 = __webpack_require__(26);
const WorkspaceMembers_1 = __webpack_require__(27);
const Users_1 = __webpack_require__(19);
let Workspaces = class Workspaces {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Workspaces.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'name', unique: true, length: 30 }),
    __metadata("design:type", String)
], Workspaces.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'url', unique: true, length: 30 }),
    __metadata("design:type", String)
], Workspaces.prototype, "url", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Workspaces.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Workspaces.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Workspaces.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'OwnerId', nullable: true }),
    __metadata("design:type", Number)
], Workspaces.prototype, "OwnerId", void 0);
__decorate([
    typeorm_1.OneToMany(() => Channels_1.Channels, (channels) => channels.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "Channels", void 0);
__decorate([
    typeorm_1.OneToMany(() => DMs_1.DMs, (dms) => dms.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "DMs", void 0);
__decorate([
    typeorm_1.OneToMany(() => Mentions_1.Mentions, (mentions) => mentions.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "Mentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => WorkspaceMembers_1.WorkspaceMembers, (workspacemembers) => workspacemembers.Workspace, { cascade: ['insert'] }),
    __metadata("design:type", Array)
], Workspaces.prototype, "WorkspaceMembers", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.Workspaces, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], Workspaces.prototype, "Owner", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Users_1.Users, (users) => users.Workspaces),
    __metadata("design:type", Array)
], Workspaces.prototype, "Members", void 0);
Workspaces = __decorate([
    typeorm_1.Index('name', ['name'], { unique: true }),
    typeorm_1.Index('url', ['url'], { unique: true }),
    typeorm_1.Index('OwnerId', ['OwnerId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'workspaces' })
], Workspaces);
exports.Workspaces = Workspaces;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMs = void 0;
const typeorm_1 = __webpack_require__(20);
const Workspaces_1 = __webpack_require__(24);
const Users_1 = __webpack_require__(19);
let DMs = class DMs {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], DMs.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text', { name: 'content' }),
    __metadata("design:type", String)
], DMs.prototype, "content", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], DMs.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], DMs.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], DMs.prototype, "WorkspaceId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'SenderId', nullable: true }),
    __metadata("design:type", Number)
], DMs.prototype, "SenderId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'ReceiverId', nullable: true }),
    __metadata("design:type", Number)
], DMs.prototype, "ReceiverId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Workspaces_1.Workspaces, (workspaces) => workspaces.DMs, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _c : Object)
], DMs.prototype, "Workspace", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.DMs, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], DMs.prototype, "Sender", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.DMs2, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object)
], DMs.prototype, "Receiver", void 0);
DMs = __decorate([
    typeorm_1.Index('WorkspaceId', ['WorkspaceId'], {}),
    typeorm_1.Index('dms_ibfk_2', ['SenderId'], {}),
    typeorm_1.Index('dms_ibfk_3', ['ReceiverId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'dms' })
], DMs);
exports.DMs = DMs;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mentions = void 0;
const typeorm_1 = __webpack_require__(20);
const Workspaces_1 = __webpack_require__(24);
const Users_1 = __webpack_require__(19);
let Mentions = class Mentions {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Mentions.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('enum', { name: 'category', enum: ['chat', 'dm', 'system'] }),
    __metadata("design:type", String)
], Mentions.prototype, "type", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'ChatId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "ChatId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Mentions.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Mentions.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "WorkspaceId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'SenderId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "SenderId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'ReceiverId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "ReceiverId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Mentions, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _c : Object)
], Mentions.prototype, "Workspace", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.Mentions, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], Mentions.prototype, "Sender", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.Mentions2, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object)
], Mentions.prototype, "Receiver", void 0);
Mentions = __decorate([
    typeorm_1.Index('WorkspaceId', ['WorkspaceId'], {}),
    typeorm_1.Index('SenderId', ['SenderId'], {}),
    typeorm_1.Index('ReceiverId', ['ReceiverId'], {}),
    typeorm_1.Entity({ schema: 'sleact', name: 'mentions' })
], Mentions);
exports.Mentions = Mentions;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceMembers = void 0;
const typeorm_1 = __webpack_require__(20);
const Workspaces_1 = __webpack_require__(24);
const Users_1 = __webpack_require__(19);
let WorkspaceMembers = class WorkspaceMembers {
};
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], WorkspaceMembers.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], WorkspaceMembers.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'WorkspaceId' }),
    __metadata("design:type", Number)
], WorkspaceMembers.prototype, "WorkspaceId", void 0);
__decorate([
    typeorm_1.Column('int', { primary: true, name: 'UserId' }),
    __metadata("design:type", Number)
], WorkspaceMembers.prototype, "UserId", void 0);
__decorate([
    typeorm_1.Column('datetime', { name: 'loggedInAt', nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], WorkspaceMembers.prototype, "loggedInAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Workspaces_1.Workspaces, (workspaces) => workspaces.WorkspaceMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _d : Object)
], WorkspaceMembers.prototype, "Workspace", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (users) => users.WorkspaceMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object)
], WorkspaceMembers.prototype, "User", void 0);
WorkspaceMembers = __decorate([
    typeorm_1.Index('UserId', ['UserId'], {}),
    typeorm_1.Entity('workspacemembers', { schema: 'sleact' })
], WorkspaceMembers);
exports.WorkspaceMembers = WorkspaceMembers;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const bcrypt_1 = __importDefault(__webpack_require__(29));
const typeorm_2 = __webpack_require__(20);
const Users_1 = __webpack_require__(19);
let AuthService = class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password'],
        });
        console.log(email, password, user);
        if (!user) {
            return null;
        }
        const result = await bcrypt_1.default.compare(password, user.password);
        if (result) {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        }
        return null;
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalSerializer = void 0;
const common_1 = __webpack_require__(11);
const passport_1 = __webpack_require__(18);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(20);
const Users_1 = __webpack_require__(19);
const auth_service_1 = __webpack_require__(28);
let LocalSerializer = class LocalSerializer extends passport_1.PassportSerializer {
    constructor(authService, usersRepository) {
        super();
        this.authService = authService;
        this.usersRepository = usersRepository;
    }
    serializeUser(user, done) {
        console.log(user);
        done(null, user.id);
    }
    async deserializeUser(userId, done) {
        return await this.usersRepository
            .findOneOrFail({
            id: +userId,
        }, {
            select: ['id', 'email', 'nickname'],
            relations: ['Workspaces'],
        })
            .then((user) => {
            console.log('user', user);
            done(null, user);
        })
            .catch((error) => done(error));
    }
};
LocalSerializer = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], LocalSerializer);
exports.LocalSerializer = LocalSerializer;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
const passport_local_1 = __webpack_require__(32);
const passport_1 = __webpack_require__(18);
const common_1 = __webpack_require__(11);
const auth_service_1 = __webpack_require__(28);
let LocalStrategy = class LocalStrategy extends passport_1.PassportStrategy(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'email', passwordField: 'password' });
        this.authService = authService;
    }
    async validate(email, password, done) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return done(null, user);
    }
};
LocalStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = __webpack_require__(11);
let LoggerMiddleware = class LoggerMiddleware {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    use(request, response, next) {
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';
        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        });
        next();
    }
};
LoggerMiddleware = __decorate([
    common_1.Injectable()
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dotenv_1 = __importDefault(__webpack_require__(35));
const ChannelChats_1 = __webpack_require__(21);
const ChannelMembers_1 = __webpack_require__(23);
const Channels_1 = __webpack_require__(22);
const DMs_1 = __webpack_require__(25);
const Mentions_1 = __webpack_require__(26);
const Users_1 = __webpack_require__(19);
const WorkspaceMembers_1 = __webpack_require__(27);
const Workspaces_1 = __webpack_require__(24);
dotenv_1.default.config();
const config = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        ChannelChats_1.ChannelChats,
        ChannelMembers_1.ChannelMembers,
        Channels_1.Channels,
        DMs_1.DMs,
        Mentions_1.Mentions,
        Users_1.Users,
        WorkspaceMembers_1.WorkspaceMembers,
        Workspaces_1.Workspaces,
    ],
    migrations: [__dirname + '/src/migrations/*.ts'],
    cli: { migrationsDir: 'src/migrations' },
    autoLoadEntities: true,
    charset: 'utf8mb4',
    synchronize: false,
    logging: true,
    keepConnectionAlive: true,
};
module.exports = config;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const ChannelMembers_1 = __webpack_require__(23);
const Users_1 = __webpack_require__(19);
const WorkspaceMembers_1 = __webpack_require__(27);
const users_service_1 = __webpack_require__(37);
const users_controller_1 = __webpack_require__(38);
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Users_1.Users, ChannelMembers_1.ChannelMembers, WorkspaceMembers_1.WorkspaceMembers]),
        ],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
        controllers: [users_controller_1.UsersController],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(20);
const bcrypt_1 = __importDefault(__webpack_require__(29));
const ChannelMembers_1 = __webpack_require__(23);
const Users_1 = __webpack_require__(19);
const WorkspaceMembers_1 = __webpack_require__(27);
let UsersService = class UsersService {
    constructor(usersRepository, workspaceMembersRepository, channelMembersRepository) {
        this.usersRepository = usersRepository;
        this.workspaceMembersRepository = workspaceMembersRepository;
        this.channelMembersRepository = channelMembersRepository;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password'],
        });
    }
    async join(email, nickname, password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user) {
            return false;
        }
        const returned = await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.UserId = returned.id;
        workspaceMember.WorkspaceId = 1;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = returned.id;
        channelMember.ChannelId = 1;
        await this.channelMembersRepository.save(channelMember);
        return true;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Users_1.Users)),
    __param(1, typeorm_1.InjectRepository(WorkspaceMembers_1.WorkspaceMembers)),
    __param(2, typeorm_1.InjectRepository(ChannelMembers_1.ChannelMembers)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(6);
const local_auth_guard_1 = __webpack_require__(39);
const not_logged_in_guard_1 = __webpack_require__(40);
const logged_in_guard_1 = __webpack_require__(41);
const user_decorator_1 = __webpack_require__(42);
const Users_1 = __webpack_require__(19);
const join_request_dto_1 = __webpack_require__(43);
const users_service_1 = __webpack_require__(37);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(user) {
        return user || false;
    }
    async login(user) {
        return user;
    }
    async join(data) {
        const user = this.usersService.findByEmail(data.email);
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const result = await this.usersService.join(data.email, data.nickname, data.password);
        if (result) {
            return 'ok';
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async logout(res) {
        res.clearCookie('connect.sid', { httpOnly: true });
        return res.send('ok');
    }
};
__decorate([
    swagger_1.ApiCookieAuth('connect.sid'),
    swagger_1.ApiOperation({ summary: '내 정보 가져오기' }),
    common_1.Get(),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    swagger_1.ApiOperation({ summary: '로그인' }),
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post('login'),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    swagger_1.ApiOperation({ summary: '회원가입' }),
    common_1.UseGuards(not_logged_in_guard_1.NotLoggedInGuard),
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof join_request_dto_1.JoinRequestDto !== "undefined" && join_request_dto_1.JoinRequestDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "join", null);
__decorate([
    swagger_1.ApiCookieAuth('connect.sid'),
    swagger_1.ApiOperation({ summary: '로그아웃' }),
    common_1.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_1.Post('logout'),
    __param(0, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
UsersController = __decorate([
    swagger_1.ApiTags('USERS'),
    common_1.Controller('api/users'),
    __metadata("design:paramtypes", [typeof (_d = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _d : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAuthGuard = void 0;
const common_1 = __webpack_require__(11);
const passport_1 = __webpack_require__(18);
let LocalAuthGuard = class LocalAuthGuard extends passport_1.AuthGuard('local') {
    async canActivate(context) {
        const can = await super.canActivate(context);
        if (can) {
            const request = context.switchToHttp().getRequest();
            console.log('login for cookie');
            await super.logIn(request);
        }
        return true;
    }
};
LocalAuthGuard = __decorate([
    common_1.Injectable()
], LocalAuthGuard);
exports.LocalAuthGuard = LocalAuthGuard;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotLoggedInGuard = void 0;
const common_1 = __webpack_require__(11);
let NotLoggedInGuard = class NotLoggedInGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return !request.isAuthenticated();
    }
};
NotLoggedInGuard = __decorate([
    common_1.Injectable()
], NotLoggedInGuard);
exports.NotLoggedInGuard = NotLoggedInGuard;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedInGuard = void 0;
const common_1 = __webpack_require__(11);
let LoggedInGuard = class LoggedInGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated();
    }
};
LoggedInGuard = __decorate([
    common_1.Injectable()
], LoggedInGuard);
exports.LoggedInGuard = LoggedInGuard;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = __webpack_require__(11);
exports.User = common_1.createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequestDto = void 0;
const swagger_1 = __webpack_require__(6);
const class_validator_1 = __webpack_require__(44);
class JoinRequestDto {
}
__decorate([
    class_validator_1.IsEmail(),
    swagger_1.ApiProperty({
        example: 'jinpark@email.com',
        description: '이메일',
    }),
    __metadata("design:type", String)
], JoinRequestDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty({
        example: 'jinpark',
        description: 'nickname',
    }),
    __metadata("design:type", String)
], JoinRequestDto.prototype, "nickname", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty({
        example: 'password',
        description: '비밀번호 password',
    }),
    __metadata("design:type", String)
], JoinRequestDto.prototype, "password", void 0);
exports.JoinRequestDto = JoinRequestDto;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("class-validator");

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesModule = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const ChannelMembers_1 = __webpack_require__(23);
const Channels_1 = __webpack_require__(22);
const Users_1 = __webpack_require__(19);
const WorkspaceMembers_1 = __webpack_require__(27);
const Workspaces_1 = __webpack_require__(24);
const workspaces_service_1 = __webpack_require__(46);
const workspaces_controller_1 = __webpack_require__(47);
let WorkspacesModule = class WorkspacesModule {
};
WorkspacesModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Users_1.Users,
                Workspaces_1.Workspaces,
                Channels_1.Channels,
                WorkspaceMembers_1.WorkspaceMembers,
                ChannelMembers_1.ChannelMembers,
            ]),
        ],
        providers: [workspaces_service_1.WorkspacesService],
        controllers: [workspaces_controller_1.WorkspacesController],
    })
], WorkspacesModule);
exports.WorkspacesModule = WorkspacesModule;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesService = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(20);
const ChannelMembers_1 = __webpack_require__(23);
const Channels_1 = __webpack_require__(22);
const Users_1 = __webpack_require__(19);
const WorkspaceMembers_1 = __webpack_require__(27);
const Workspaces_1 = __webpack_require__(24);
let WorkspacesService = class WorkspacesService {
    async findById(id) {
        return this.workspacesRepository.findOne({ where: { id } });
    }
    async findMyWorkspaces(myId) {
        return this.workspacesRepository.find({
            where: {
                WorkspaceMembers: [{ userId: myId }],
            },
        });
    }
    async createWorkspace(name, url, myId) {
        const workspace = new Workspaces_1.Workspaces();
        workspace.name = name;
        workspace.url = url;
        workspace.OwnerId = myId;
        const returned = await this.workspacesRepository.save(workspace);
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.UserId = myId;
        workspaceMember.WorkspaceId = returned.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channel = new Channels_1.Channels();
        channel.name = 'general';
        channel.WorkspaceId = returned.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceMembers(url) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.WorkspaceMembers', 'members')
            .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getMany();
    }
    async createWorkspaceMembers(url, email) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
            join: {
                alias: 'workspace',
                innerJoinAndSelect: {
                    channels: 'workspace.Channels',
                },
            },
        });
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.WorkspaceId = workspace.id;
        workspaceMember.UserId = user.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.ChannelId = workspace.Channels.find((v) => v.name === 'general').id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceMember(url, id) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
            url,
        })
            .getOne();
    }
};
__decorate([
    typeorm_1.InjectRepository(Workspaces_1.Workspaces),
    __metadata("design:type", typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object)
], WorkspacesService.prototype, "workspacesRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(Channels_1.Channels),
    __metadata("design:type", typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object)
], WorkspacesService.prototype, "channelsRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(WorkspaceMembers_1.WorkspaceMembers),
    __metadata("design:type", typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object)
], WorkspacesService.prototype, "workspaceMembersRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(ChannelMembers_1.ChannelMembers),
    __metadata("design:type", typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object)
], WorkspacesService.prototype, "channelMembersRepository", void 0);
__decorate([
    typeorm_1.InjectRepository(Users_1.Users),
    __metadata("design:type", typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object)
], WorkspacesService.prototype, "usersRepository", void 0);
WorkspacesService = __decorate([
    common_1.Injectable()
], WorkspacesService);
exports.WorkspacesService = WorkspacesService;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesController = void 0;
const common_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(6);
const logged_in_guard_1 = __webpack_require__(41);
const user_decorator_1 = __webpack_require__(42);
const Users_1 = __webpack_require__(19);
const create_workspace_dto_1 = __webpack_require__(48);
const workspaces_service_1 = __webpack_require__(46);
let WorkspacesController = class WorkspacesController {
    constructor(workspacesService) {
        this.workspacesService = workspacesService;
    }
    async getMyWorkspaces(user) {
        return this.workspacesService.findMyWorkspaces(user.id);
    }
    async createWorkspace(user, body) {
        return this.workspacesService.createWorkspace(body.workspace, body.url, user.id);
    }
    async getWorkspaceMembers(url) {
        return this.workspacesService.getWorkspaceMembers(url);
    }
    async createWorkspaceMembers(url, email) {
        return this.workspacesService.createWorkspaceMembers(url, email);
    }
    async getWorkspaceMember(url, id) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }
    async getWorkspaceUser(url, id) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: '내 워크스페이스 가져오기' }),
    common_1.Get(),
    __param(0, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getMyWorkspaces", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 만들기' }),
    common_1.Post(),
    __param(0, user_decorator_1.User()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _b : Object, typeof (_c = typeof create_workspace_dto_1.CreateWorkspaceDto !== "undefined" && create_workspace_dto_1.CreateWorkspaceDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "createWorkspace", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 멤버 가져오기' }),
    common_1.Get(':url/members'),
    __param(0, common_1.Param('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 멤버 초대하기' }),
    common_1.Post(':url/members'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "createWorkspaceMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' }),
    common_1.Get(':url/members/:id'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceMember", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' }),
    common_1.Get(':url/users/:id'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceUser", null);
WorkspacesController = __decorate([
    swagger_1.ApiTags('WORKSPACES'),
    swagger_1.ApiCookieAuth('connect.sid'),
    common_1.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_1.Controller('api/workspaces'),
    __metadata("design:paramtypes", [typeof (_d = typeof workspaces_service_1.WorkspacesService !== "undefined" && workspaces_service_1.WorkspacesService) === "function" ? _d : Object])
], WorkspacesController);
exports.WorkspacesController = WorkspacesController;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkspaceDto = void 0;
const swagger_1 = __webpack_require__(6);
class CreateWorkspaceDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: 'Sleact',
        description: 'name for workspace',
    }),
    __metadata("design:type", String)
], CreateWorkspaceDto.prototype, "workspace", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 'sleact',
        description: 'url address',
    }),
    __metadata("design:type", String)
], CreateWorkspaceDto.prototype, "url", void 0);
exports.CreateWorkspaceDto = CreateWorkspaceDto;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsModule = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const ChannelChats_1 = __webpack_require__(21);
const ChannelMembers_1 = __webpack_require__(23);
const Channels_1 = __webpack_require__(22);
const Users_1 = __webpack_require__(19);
const Workspaces_1 = __webpack_require__(24);
const events_gateway_1 = __webpack_require__(50);
const channels_service_1 = __webpack_require__(54);
const channels_controller_1 = __webpack_require__(55);
let ChannelsModule = class ChannelsModule {
};
ChannelsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Channels_1.Channels,
                ChannelChats_1.ChannelChats,
                Users_1.Users,
                Workspaces_1.Workspaces,
                ChannelMembers_1.ChannelMembers,
            ]),
        ],
        providers: [channels_service_1.ChannelsService, events_gateway_1.EventsGateway],
        controllers: [channels_controller_1.ChannelsController],
    })
], ChannelsModule);
exports.ChannelsModule = ChannelsModule;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = __webpack_require__(51);
const socket_io_1 = __webpack_require__(52);
const onlineMap_1 = __webpack_require__(53);
let EventsGateway = class EventsGateway {
    handleTest(data) {
        console.log('test', data);
    }
    handleLogin(data, socket) {
        const newNamespace = socket.nsp;
        console.log('login', newNamespace);
        onlineMap_1.onlineMap[socket.nsp.name][socket.id] = data.id;
        newNamespace.emit('onlineList', Object.values(onlineMap_1.onlineMap[socket.nsp.name]));
        data.channels.forEach((channel) => {
            console.log('join', socket.nsp.name, channel);
            socket.join(`${socket.nsp.name}-${channel}`);
        });
    }
    afterInit(server) {
        console.log('init');
    }
    handleConnection(socket) {
        console.log('connected', socket.nsp.name);
        if (!onlineMap_1.onlineMap[socket.nsp.name]) {
            onlineMap_1.onlineMap[socket.nsp.name] = {};
        }
        socket.emit('hello', socket.nsp.name);
    }
    handleDisconnect(socket) {
        console.log('disconnected', socket.nsp.name);
        const newNamespace = socket.nsp;
        delete onlineMap_1.onlineMap[socket.nsp.name][socket.id];
        newNamespace.emit('onlineList', Object.values(onlineMap_1.onlineMap[socket.nsp.name]));
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], EventsGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('test'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleTest", null);
__decorate([
    websockets_1.SubscribeMessage('login'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLogin", null);
__decorate([
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleDisconnect", null);
EventsGateway = __decorate([
    websockets_1.WebSocketGateway({ namespace: /\/ws-.+/ })
], EventsGateway);
exports.EventsGateway = EventsGateway;


/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineMap = void 0;
exports.onlineMap = {};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsService = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(20);
const ChannelChats_1 = __webpack_require__(21);
const ChannelMembers_1 = __webpack_require__(23);
const Channels_1 = __webpack_require__(22);
const Users_1 = __webpack_require__(19);
const Workspaces_1 = __webpack_require__(24);
const events_gateway_1 = __webpack_require__(50);
let ChannelsService = class ChannelsService {
    constructor(channelsRepository, channelMembersRepository, workspacesRepository, channelChatsRepository, usersRepository, eventsGateway) {
        this.channelsRepository = channelsRepository;
        this.channelMembersRepository = channelMembersRepository;
        this.workspacesRepository = workspacesRepository;
        this.channelChatsRepository = channelChatsRepository;
        this.usersRepository = usersRepository;
        this.eventsGateway = eventsGateway;
    }
    async findById(id) {
        return this.channelsRepository.findOne({ where: { id } });
    }
    async getWorkspaceChannels(url, myId) {
        return this.channelsRepository
            .createQueryBuilder('channels')
            .innerJoinAndSelect('channels.ChannelMembers', 'channelMembers', 'channelMembers.userId = :myId', { myId })
            .innerJoinAndSelect('channels.Workspace', 'workspace', 'workspace.url = :url', { url })
            .getMany();
    }
    async getWorkspaceChannel(url, name) {
        return this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
    }
    async createWorkspaceChannels(url, name, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const channel = new Channels_1.Channels();
        channel.name = name;
        channel.WorkspaceId = workspace.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceChannelMembers(url, name) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
            name,
        })
            .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getMany();
    }
    async createWorkspaceChannelMembers(url, name, email) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        if (!channel) {
            return null;
        }
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getOne();
        if (!user) {
            return null;
        }
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.ChannelId = channel.id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceChannelChats(url, name, perPage, page) {
        return this.channelChatsRepository
            .createQueryBuilder('channelChats')
            .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
            name,
        })
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .innerJoinAndSelect('channelChats.User', 'user')
            .orderBy('channelChats.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    async createWorkspaceChannelChats(url, name, content, myId) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        const chats = new ChannelChats_1.ChannelChats();
        chats.content = content;
        chats.UserId = myId;
        chats.ChannelId = channel.id;
        const savedChat = await this.channelChatsRepository.save(chats);
        const chatWithUser = await this.channelChatsRepository.findOne({
            where: { id: savedChat.id },
            relations: ['User', 'Channel'],
        });
        this.eventsGateway.server
            .to(`/ws-${url}-${chatWithUser.ChannelId}`)
            .emit('message', chatWithUser);
    }
    async createWorkspaceChannelImages(url, name, files, myId) {
        console.log(files);
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        for (let i = 0; i < files.length; i++) {
            const chats = new ChannelChats_1.ChannelChats();
            chats.content = files[i].path;
            chats.UserId = myId;
            chats.ChannelId = channel.id;
            const savedChat = await this.channelChatsRepository.save(chats);
            const chatWithUser = await this.channelChatsRepository.findOne({
                where: { id: savedChat.id },
                relations: ['User', 'Channel'],
            });
            this.eventsGateway.server
                .to(`/ws-${url}-${chatWithUser.ChannelId}`)
                .emit('message', chatWithUser);
        }
    }
    async getChannelUnreadsCount(url, name, after) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        return this.channelChatsRepository.count({
            where: {
                ChannelId: channel.id,
                createdAt: typeorm_2.MoreThan(new Date(after)),
            },
        });
    }
};
ChannelsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Channels_1.Channels)),
    __param(1, typeorm_1.InjectRepository(ChannelMembers_1.ChannelMembers)),
    __param(2, typeorm_1.InjectRepository(Workspaces_1.Workspaces)),
    __param(3, typeorm_1.InjectRepository(ChannelChats_1.ChannelChats)),
    __param(4, typeorm_1.InjectRepository(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof events_gateway_1.EventsGateway !== "undefined" && events_gateway_1.EventsGateway) === "function" ? _f : Object])
], ChannelsService);
exports.ChannelsService = ChannelsService;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsController = void 0;
const common_1 = __webpack_require__(11);
const platform_express_1 = __webpack_require__(56);
const swagger_1 = __webpack_require__(6);
const fs_1 = __importDefault(__webpack_require__(57));
const multer_1 = __importDefault(__webpack_require__(58));
const path_1 = __importDefault(__webpack_require__(10));
const logged_in_guard_1 = __webpack_require__(41);
const user_decorator_1 = __webpack_require__(42);
const Users_1 = __webpack_require__(19);
const create_channel_dto_1 = __webpack_require__(59);
const channels_service_1 = __webpack_require__(54);
try {
    fs_1.default.readdirSync('uploads');
}
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs_1.default.mkdirSync('uploads');
}
let ChannelsController = class ChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    async getWorkspaceChannels(url, user) {
        return this.channelsService.getWorkspaceChannels(url, user.id);
    }
    async getWorkspaceChannel(url, name) {
        return this.channelsService.getWorkspaceChannel(url, name);
    }
    async createWorkspaceChannels(url, body, user) {
        return this.channelsService.createWorkspaceChannels(url, body.name, user.id);
    }
    async getWorkspaceChannelMembers(url, name) {
        return this.channelsService.getWorkspaceChannelMembers(url, name);
    }
    async createWorkspaceMembers(url, name, email) {
        return this.channelsService.createWorkspaceChannelMembers(url, name, email);
    }
    async getWorkspaceChannelChats(url, name, perPage, page) {
        return this.channelsService.getWorkspaceChannelChats(url, name, perPage, page);
    }
    async createWorkspaceChannelChats(url, name, content, user) {
        return this.channelsService.createWorkspaceChannelChats(url, name, content, user.id);
    }
    async createWorkspaceChannelImages(url, name, files, user) {
        return this.channelsService.createWorkspaceChannelImages(url, name, files, user.id);
    }
    async getUnreads(url, name, after) {
        return this.channelsService.getChannelUnreadsCount(url, name, after);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 모두 가져오기' }),
    common_1.Get(':url/channels'),
    __param(0, common_1.Param('url')), __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannels", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 가져오기' }),
    common_1.Get(':url/channels/:name'),
    __param(0, common_1.Param('url')), __param(1, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannel", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 만들기' }),
    common_1.Post(':url/channels'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Body()),
    __param(2, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_channel_dto_1.CreateChannelDto !== "undefined" && create_channel_dto_1.CreateChannelDto) === "function" ? _b : Object, typeof (_c = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannels", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 멤버 가져오기' }),
    common_1.Get(':url/channels/:name/members'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannelMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 채널 멤버 초대하기' }),
    common_1.Post(':url/channels/:name/members'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceMembers", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 채팅 모두 가져오기' }),
    common_1.Get(':url/channels/:name/chats'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Query('perPage', common_1.ParseIntPipe)),
    __param(3, common_1.Query('page', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannelChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 채팅 생성하기' }),
    common_1.Post(':url/channels/:name/chats'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Body('content')),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannelChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 채널 이미지 업로드하기' }),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor('image', 10, {
        storage: multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                const ext = path_1.default.extname(file.originalname);
                cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    common_1.Post(':url/channels/:name/images'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.UploadedFiles()),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array, typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannelImages", null);
__decorate([
    swagger_1.ApiOperation({ summary: '안 읽은 개수 가져오기' }),
    common_1.Get(':url/channels/:name/unreads'),
    __param(0, common_1.Param('url')),
    __param(1, common_1.Param('name')),
    __param(2, common_1.Query('after', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getUnreads", null);
ChannelsController = __decorate([
    swagger_1.ApiTags('CHANNELS'),
    swagger_1.ApiCookieAuth('connect.sid'),
    common_1.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_1.Controller('api/workspaces'),
    __metadata("design:paramtypes", [typeof (_f = typeof channels_service_1.ChannelsService !== "undefined" && channels_service_1.ChannelsService) === "function" ? _f : Object])
], ChannelsController);
exports.ChannelsController = ChannelsController;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChannelDto = void 0;
const swagger_1 = __webpack_require__(6);
class CreateChannelDto {
}
__decorate([
    swagger_1.ApiProperty({
        example: 'dev team',
        description: 'channel name',
    }),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "name", void 0);
exports.CreateChannelDto = CreateChannelDto;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = __webpack_require__(11);
const events_gateway_1 = __webpack_require__(50);
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    common_1.Module({
        providers: [events_gateway_1.EventsGateway],
    })
], EventsModule);
exports.EventsModule = EventsModule;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMsModule = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const DMs_1 = __webpack_require__(25);
const Users_1 = __webpack_require__(19);
const Workspaces_1 = __webpack_require__(24);
const events_gateway_1 = __webpack_require__(50);
const dms_controller_1 = __webpack_require__(62);
const dms_service_1 = __webpack_require__(63);
let DMsModule = class DMsModule {
};
DMsModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([DMs_1.DMs, Users_1.Users, Workspaces_1.Workspaces])],
        controllers: [dms_controller_1.DMsController],
        providers: [dms_service_1.DMsService, events_gateway_1.EventsGateway],
    })
], DMsModule);
exports.DMsModule = DMsModule;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMsController = void 0;
const common_1 = __webpack_require__(11);
const common_2 = __webpack_require__(11);
const platform_express_1 = __webpack_require__(56);
const swagger_1 = __webpack_require__(6);
const fs = __importStar(__webpack_require__(57));
const multer_1 = __importDefault(__webpack_require__(58));
const path_1 = __importDefault(__webpack_require__(10));
const logged_in_guard_1 = __webpack_require__(41);
const user_decorator_1 = __webpack_require__(42);
const Users_1 = __webpack_require__(19);
const dms_service_1 = __webpack_require__(63);
try {
    fs.readdirSync('uploads');
}
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
let DMsController = class DMsController {
    constructor(dmsService) {
        this.dmsService = dmsService;
    }
    async getWorkspaceChannels(url, user) {
        return this.dmsService.getWorkspaceDMs(url, user.id);
    }
    async getWorkspaceDMChats(url, id, perPage, page, user) {
        return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
    }
    async createWorkspaceDMChats(url, id, content, user) {
        return this.dmsService.createWorkspaceDMChats(url, content, id, user.id);
    }
    async createWorkspaceDMImages(url, id, files, user) {
        return this.dmsService.createWorkspaceDMImages(url, files, id, user.id);
    }
    async getUnreads(url, id, after, user) {
        return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 DM 모두 가져오기' }),
    common_2.Get(':url/dms'),
    __param(0, common_2.Param('url')), __param(1, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getWorkspaceChannels", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 DM 채팅 모두 가져오기' }),
    common_2.Get(':url/dms/:id/chats'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.Query('perPage', common_1.ParseIntPipe)),
    __param(3, common_2.Query('page', common_1.ParseIntPipe)),
    __param(4, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, typeof (_b = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getWorkspaceDMChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 DM 채팅 생성하기' }),
    common_2.Post(':url/dms/:id/chats'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.Body('content')),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, typeof (_c = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "createWorkspaceDMChats", null);
__decorate([
    swagger_1.ApiOperation({ summary: '워크스페이스 특정 DM 이미지 업로드하기' }),
    common_2.UseInterceptors(platform_express_1.FilesInterceptor('image', 10, {
        storage: multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                const ext = path_1.default.extname(file.originalname);
                cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    common_2.Post(':url/dms/:id/images'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.UploadedFiles()),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Array, typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "createWorkspaceDMImages", null);
__decorate([
    swagger_1.ApiOperation({ summary: '안 읽은 개수 가져오기' }),
    common_2.Get(':url/dms/:id/unreads'),
    __param(0, common_2.Param('url')),
    __param(1, common_2.Param('id', common_1.ParseIntPipe)),
    __param(2, common_2.Query('after', common_1.ParseIntPipe)),
    __param(3, user_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getUnreads", null);
DMsController = __decorate([
    swagger_1.ApiTags('DMS'),
    swagger_1.ApiCookieAuth('connect.sid'),
    common_2.UseGuards(logged_in_guard_1.LoggedInGuard),
    common_2.Controller('api/workspaces'),
    __metadata("design:paramtypes", [typeof (_f = typeof dms_service_1.DMsService !== "undefined" && dms_service_1.DMsService) === "function" ? _f : Object])
], DMsController);
exports.DMsController = DMsController;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMsService = void 0;
const common_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(13);
const onlineMap_1 = __webpack_require__(53);
const typeorm_2 = __webpack_require__(20);
const DMs_1 = __webpack_require__(25);
const Users_1 = __webpack_require__(19);
const Workspaces_1 = __webpack_require__(24);
const events_gateway_1 = __webpack_require__(50);
function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}
let DMsService = class DMsService {
    constructor(workspacesRepository, dmsRepository, usersRepository, eventsGateway) {
        this.workspacesRepository = workspacesRepository;
        this.dmsRepository = dmsRepository;
        this.usersRepository = usersRepository;
        this.eventsGateway = eventsGateway;
    }
    async getWorkspaceDMs(url, myId) {
        return (this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('user.dms', 'dms', 'dms.senderId = :myId', { myId })
            .leftJoin('dms', 'workspace', 'workspace.url = :url', { url })
            .getMany());
    }
    async getWorkspaceDMChats(url, id, myId, perPage, page) {
        return this.dmsRepository
            .createQueryBuilder('dms')
            .innerJoinAndSelect('dms.Sender', 'sender')
            .innerJoinAndSelect('dms.Receiver', 'receiver')
            .innerJoin('dms.Workspace', 'workspace')
            .where('workspace.url = :url', { url })
            .andWhere('((dms.SenderId = :myId AND dms.ReceiverId = :id) OR (dms.ReceiverId = :myId AND dms.SenderId = :id))', { id, myId })
            .orderBy('dms.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    async createWorkspaceDMChats(url, content, id, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const dm = new DMs_1.DMs();
        dm.SenderId = myId;
        dm.ReceiverId = id;
        dm.content = content;
        dm.WorkspaceId = workspace.id;
        const savedDm = await this.dmsRepository.save(dm);
        const dmWithSender = await this.dmsRepository.findOne({
            where: { id: savedDm.id },
            relations: ['Sender'],
        });
        const receiverSocketId = getKeyByValue(onlineMap_1.onlineMap[`/ws-${workspace.url}`], Number(id));
        this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
    }
    async createWorkspaceDMImages(url, files, id, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        for (let i = 0; i < files.length; i++) {
            const dm = new DMs_1.DMs();
            dm.SenderId = myId;
            dm.ReceiverId = id;
            dm.content = files[i].path;
            dm.WorkspaceId = workspace.id;
            const savedDm = await this.dmsRepository.save(dm);
            const dmWithSender = await this.dmsRepository.findOne({
                where: { id: savedDm.id },
                relations: ['Sender'],
            });
            const receiverSocketId = getKeyByValue(onlineMap_1.onlineMap[`/ws-${workspace.url}`], Number(id));
            this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
        }
    }
    async getDMUnreadsCount(url, id, myId, after) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        return this.dmsRepository.count({
            where: {
                WorkspaceId: workspace.id,
                SenderId: id,
                ReceiverId: myId,
                createdAt: typeorm_2.MoreThan(new Date(after)),
            },
        });
    }
};
DMsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Workspaces_1.Workspaces)),
    __param(1, typeorm_1.InjectRepository(DMs_1.DMs)),
    __param(2, typeorm_1.InjectRepository(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof events_gateway_1.EventsGateway !== "undefined" && events_gateway_1.EventsGateway) === "function" ? _d : Object])
], DMsService);
exports.DMsService = DMsService;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontendMiddleware = void 0;
const common_1 = __webpack_require__(11);
const path_1 = __importDefault(__webpack_require__(10));
let FrontendMiddleware = class FrontendMiddleware {
    use(req, res, next) {
        const { baseUrl } = req;
        if (baseUrl.includes('/api')) {
            next();
        }
        else {
            res.sendFile(path_1.default.join(__dirname, '..', '..', '..', 'public', 'index.html'));
        }
    }
};
FrontendMiddleware = __decorate([
    common_1.Injectable()
], FrontendMiddleware);
exports.FrontendMiddleware = FrontendMiddleware;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(11);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const err = exception.getResponse();
        if (typeof err !== 'string' && err.error === 'Bad Request') {
            return response.status(status).json({
                success: false,
                code: status,
                data: err.message,
            });
        }
        response.status(status).json({
            success: false,
            code: status,
            data: err,
        });
    }
};
HttpExceptionFilter = __decorate([
    common_1.Catch(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;


/***/ })
/******/ ]);