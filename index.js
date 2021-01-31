module.exports = {};

/**
 * This `MockFunction` class is a utility for creating spys and stubs in a unit
 * test. To make a mock method, simply set one of these functions as the value
 * of the object whose method is to be mocked.
 *
 * Example:
 * ```
 * // Let's say we're testing a function that processes a HTTP request, and we
 * // need to make a function that simulates the HTTP request for our test.
 * const getHttpRequestStub =
 *         mockFunction(this)
 *         .returnValue('<your http request>');
 *
 * // Then, to pass the function to your code under test, use the `fn` property,
 * // like so:
 * someCustomFunction(getHttpRequestStub.fn);
 *
 * // Or, say you want a spy function that makes sure your HTTP parser is
 * // passing on the data that it should be
 * const getParsedHttpRequestSpy =
 *         mockFunction(this)
 *         .expectCall([<first expected arg>, <second expected arg>, ...]);
 * ```
 */
module.exports.mockFunction = function(testInstance) {
    let state = {
        _testInstance: testInstance,
        _returnValue: undefined,
        _expectedArguments: null,
    };

    let mock = function() {
        let aList = [];
        for (const a of arguments) {
            aList.push(a);
        }
        if (state._expectedArguments) {
            if (state._expectedArguments.length !== aList.length) {
                let message = `[${state._testInstance.call.name}][mockFunction]: Expected ${state._expectedArguments.length} arguments, but received ${aList.length}`;
                state._testInstance.error.messages.push(message);
            } else {
                let i;
                for (i = 0; i < aList.length; ++i) {
                    if (aList[i] !== state._expectedArguments[i]) {
                        let message = `[${state._testInstance.call.name}][mockFunction]: Expected argument ${i + 1} to be ${state._expectedArguments[i]}, but received ${aList[i]}`;
                        state._testInstance.error.messages.push(message);
                    }
                }
            }
        }
        return state._returnValue;
    };

    mock.expectCall = function() {
        state._expectedArguments = [];
        for (const a of arguments) {
            state._expectedArguments.push(a);
        }
        return mock;
    };

    mock.returnValue = function(value) {
        state._returnValue = value;
        return mock;
    };

    return mock;
};

module.exports.createMock = function(testInstance) {
};

const expects = {
    expectFalsey(value) {
        if (!!value) {
            let message = `[${this.call.name}][expectFalsey]: Expected falsey value, but received ${value}`;
            this.error.messages.push(message);
        }
    },
    expectTruthy(value) {
        if (!value) {
            let message = `[${this.call.name}][expectTruthy]: Expected truthy value, but received ${value}`;
            this.error.messages.push(message);
        }
    },
    expectLess(threshold, value) {
        if (value >= threshold) {
            let message = `[${this.call.name}][expectLess]: Expected less than ${threshold}, but received ${value}`;
            this.error.messages.push(message);
        }
    },
    expectGreater(threshold, value) {
        if (value <= threshold) {
            let message = `[${this.call.name}][expectGreater]: Expected greater than ${threshold}, but received ${value}`;
            this.error.messages.push(message);
        }
    },
    expectUndefined(value) {
        if (value !== undefined) {
            let message = `[${this.call.name}][expectUndefined]: Expected undefined, but received ${value}`;
            this.error.messages.push(message);
        }
    },
    expectNull(value) {
        if (value !== null) {
            let message = `[${this.call.name}][expectNull]: Expected null, but received ${value}`;
            this.error.messages.push(message);
        }
    },
    expectEqual(expected, actual) {
        if (expected !== actual) {
            let message = `[${this.call.name}][expectEqual]: Expected ${expected}, but received ${actual}`;
            this.error.messages.push(message);
        }
    },
};

module.exports.runTestSuite = function(tests) {
    let stack = [{
        items: Object
                .keys(tests)
                .map(key => ({ key, value: tests[key] })),
        nextIndex: 0,
    }];
    let results = [];
    while (stack.length > 0) {
        let top = stack[stack.length - 1];
        let i = top.nextIndex;
        if (top.nextIndex < top.items.length) {
            if (typeof top.items[i].value === 'function') {
                // Run the test
                const test = top.items[i].value;
                const name = test.name;
                const identifier = stack
                        .slice(0, stack.length - 1)
                        .map(el => el.items[el.nextIndex - 1].key)
                        .concat([ name ])
                        .join('::');
                let state = Object.create(expects);
                state.call = {
                    name: identifier,
                };
                state.error = { messages: [], };
                let result = test.call(state);
                if (result instanceof Promise) {
                    result = result.then(_ => state);
                } else {
                    result = Promise.resolve(state);
                }
                results.push(result);
            } else if (typeof top.items[i].value === 'object') {
                // This is a test sub-suite, push it to the stack
                stack.push({
                    items: Object
                            .keys(top.items[i].value)
                            .map(key => ({ key, value: top.items[i].value[key] })),
                    nextIndex: 0,
                });
            } else {
                // An invalid object was provided
            }
            ++top.nextIndex;
        } else {
            // We've reached the end this suite
            stack.pop();
        }
    }

    Promise
            .all(results)
            .then(values => {
                for (const v of values) {
                    for (const m of v.error.messages) {
                        console.log(m);
                    }
                }
            });
};

