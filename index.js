module.exports = {};

let state = {
    call: null,
    error: null,
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
            if (typeof top.items[i].value == 'function') {
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
            } else if (typeof top.items[i].value == 'object') {
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

