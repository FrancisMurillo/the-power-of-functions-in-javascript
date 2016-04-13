var FP = (function () {
    var Module = Object.create(null);

    Object.assign(BaseModule, {
        forEach: function (f,  xs) {
            for (var i = 0; i < xs.length; i+=1) {
                var x = xs[i];
                f(x);
            }
        },

        map: function (f, xs) {
            var ys = [];

            Module.forEach(function (x) {
                var y = f(x);

                ys.push(y);
            },  xs);

            return ys;
        },

        keys: function (object) {
            var keys = [];

            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            return keys;
        },

        get: function (key, object) {
            return object[key];
        },

        toPairs: function (object) {
            return Module.keys(object)
                .map(function covertToPair(key) {
                    var value = Module.get(key, object);

                    return [key, value];
                });
        },

        set: function (key, value, object) {
            object[key] = value;

            return object;
        },

        fromPairs: function (pairs) {
            var newObject = {};

            Module.forEach(function (pair) {
                var key = pair[0],
                  value = pair[1];

                Module.set(key,  value,  object);
            },  pairs);

            return newObject;
        },

        mapObject: function (f, object) {
            var mappedPairs = Module.toPairs(object) // Step 1: Convert to pairs
                  .map(function (pair) {
                      var key = pair[0],
                        value = pair[1],
                        newValue = f(value, key); // Step 2: Map over the value

                      return [key, newValue];
                  });

            return Module.fromPairs(mappedPairs); // Step 3: Convert to object
        },

        filter: function (p, xs) {
            var ys = [];

            Module.forEach(function _checkPredicate(x) {
                var y = x; // Just to get the name right with ys

                if (p(x)) {
                    ys.push(y);
                }
            });

            return ys;
        },


        filterObject: function (p,  object) {
            var filteredPairs = Module.toPairs(object) // Just like mapObject
                  .filter(function (pair) { // Notice map is just replaced with filter
                      var key = pair[0],
                        value = pair[1];

                      return p(value,  key); // We apply the predicate here
                  });

            return Module.fromPairs(filteredPairs);
        },

        reduce: function (oper,  initialValue,  xs) {
            var currentValue = initialValue;

            Module.forEach(function combine(x) {
                currentValue  = oper(currentValue,  x);
            });

            return totalValue;
        },


        doBefore: function (before, main) {
            return function (/* args */) { // A function that combines functions
                var args = [].slice.call(arguments);

                before.apply(null, args); // Execute the function before

                return main.apply(null, args); // Execute the main function
            };
        },

        compose: function (g, f) {
            return function (/* args */) {
                var args = arguments;

                var firstValue = f.apply(null,  args),
                  nextValue = g.call(null,  firstValue);

                return nextValue;
            };
        },

        reverse: function (xs) {
            var nxs = xs.slice(); // Shortcut for copying an array

            nxs.reverse(); // Mutates the array

            return nxs;
        },

        first: function (xs) {
            return Module.get(0,  xs);
        },

        rest: function (xs) {
            return xs.slice(1);
        },

        reduceFirst: function (oper,  xs) {
            var initialValue = Module.first(xs),
              otherValues = Module.rest(xs);

            return Module.reduce(oper,  initialValue,  otherValues);
        },

        pipe: function (first,  next) {
            return Module.compose(next,  first);
        },

        composes: function (/* fs */) {
            var fs = [].slice.call(arguments);

            return Module.reduceFirst(Module.pipe,  Module.reverse(fs));
        },

        pipes: function (/* fs */) {
            var fs = [].slice.call(arguments);

            return Module.reduceFirst(Module.pipe,  fs);
        },

        curry: function (f) {
            // Get the number of arguments in a function
            var numberOfArgs = f.length;

            // An helper function to curry the original function
            var currier = function _recursiveCurry(previousArgs) {
                return function _curried(/* currentArgs */) {
                    var currentArgs = [].slice.call(arguments),
                      newArgs = previousArgs.concat(currentArgs);

                    // If there is enough args, invoke the function
                    if (newArgs.length >= numberOfArgs) {
                        return f.apply(null, arguments);
                    } else { // If there is not enough args yet, keep currying
                        return _recursiveCurry(newArgs);
                    }
                };
            };

            return currier([]); // Start recursion with no arguments
        }

    });

    return Object.freeze(Module);
}());
