/**
    Rx Ultralite!
    Rx on the Roku Tyler throws this (possibly related to browserify-ing Rx):
    Error: 'TypeError: 'undefined' is not a function (evaluating 'root.document.createElement('script')')'
 */

var Rx;

if (typeof window !== "undefined" && typeof window["Rx"] !== "undefined") {
    // Browser environment
    Rx = window["Rx"];
} else if (typeof global !== "undefined" && typeof global["Rx"] !== "undefined") {
    // Node.js environment
    Rx = global["Rx"];
} else if (typeof require !== 'undefined' || typeof window !== 'undefined' && window.require) {
    var r = typeof require !== 'undefined' && require || window.require;
    try {
        // CommonJS environment with rx module
        Rx = r("rx");
    } catch(e) {
        Rx = undefined;
    }
}

if(Rx === undefined) {
    Rx = {
        I: function() { return arguments[0]; },
        Disposable: (function() {
            
            function Disposable(a) {
                this.action = a;
            }
            
            Disposable.create = function(a) {
                return new Disposable(a);
            };
            
            Disposable.empty = new Disposable(function(){});
            
            Disposable.prototype.dispose = function() {
                if(typeof this.action === 'function') {
                    this.action();
                }
            };
            
            return Disposable;
        })(),
        Observable: (function() {
            
            function Observable(s) {
                this._subscribe = s;
            }
            
            Observable.create = Observable.createWithDisposable = function(s) {
                return new Observable(s);
            };
            
            Observable.fastCreateWithDisposable = Observable.create;
            
            Observable.fastReturnValue = function(value) {
                return Observable.create(function(observer) {
                    observer.onNext(value);
                    observer.onCompleted();
                });
            };
            
            // NOTE: Required for Router
            Observable.prototype.from;
            Observable.prototype.materialize;
            Observable.prototype.reduce;

            Observable.of = function() {
                var len = arguments.length, args = new Array(len);
                for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
                return Observable.create(function(observer) {
                    var errorOcurred = false;
                    try {
                        for(var i = 0; i < len; ++i) {
                            observer.onNext(args[i]);
                        }
                    } catch(e) {
                        errorOcurred = true;
                        observer.onError(e);
                    }
                    if(errorOcurred !== true) {
                        observer.onCompleted();
                    }
                });
            }

            Observable.prototype.subscribe = function(n, e, c) {
                return this._subscribe(
                    (n != null && typeof n === 'object') ?
                    n :
                    Rx.Observer.create(n, e, c)
                );
            };
            Observable.prototype.forEach = Observable.prototype.subscribe;
            
            Observable.prototype.catchException = function(next) {
                var self = this;
                return Observable.create(function(o) {
                    return self.subscribe(
                        function(x) { o.onNext(x); },
                        function(e) {
                            return (
                                (typeof next === 'function') ?
                                next(e) : next
                            ).subscribe(o);
                        },
                        function() { o.onCompleted(); });
                });
            };
            
            Observable.prototype.toArray = function() {
                var source = this;
                return Observable.create(function(observer) {
                    var list = [];
                    return source.subscribe(
                        function(x) { list.push(x); },
                        function(e) { observer.onError(e); },
                        function( ) {
                            observer.onNext(list);
                            observer.onCompleted();
                        });
                });
            };
            
            return Observable;
        })(),
        Observer: (function() {
            
            function Observer(n, e, c) {
                this.onNext =       n || Rx.I;
                this.onError =      e || Rx.I;
                this.onCompleted =  c || Rx.I;
            }
            
            Observer.create = function(n, e, c) {
                return new Observer(n, e, c);
            };
            
            return Observer;
        })(),
        Subject: (function(){
            function Subject() {
                this.observers = [];
            }
            Subject.prototype.subscribe = function(subscriber) {
                var a = this.observers,
                    n = a.length;
                a[n] = subscriber;
                return {
                    dispose: function() {
                        a.splice(n, 1);
                    }
                }
            };
            Subject.prototype.onNext = function(x) {
                var listeners = this.observers.concat(),
                    i = -1, n = listeners.length;
                while(++i < n) {
                    listeners[i].onNext(x);
                }
            };
            Subject.prototype.onError = function(e) {
                var listeners = this.observers.concat(),
                    i  = -1, n = listeners.length;
                this.observers.length = 0;
                while(++i < n) {
                    listeners[i].onError(e);
                }
            };
            Subject.prototype.onCompleted = function() {
                var listeners = this.observers.concat(),
                    i  = -1, n = listeners.length;
                this.observers.length = 0;
                while(++i < n) {
                    listeners[i].onCompleted();
                }
            };
        })()
    };
}

module.exports = Rx;
