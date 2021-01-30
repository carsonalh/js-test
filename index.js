module.exports = {};

let state = {
    call: null,
    error: null,
};

module.exports.runTestSuite = function(tests) {
    let stack = [{
        items: Object
                .keys(tests)
                .map(key => ({ key, value: tests[key] })),
        nextIndex: 0,
    }];
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
                state.call = {
                    name: identifier,
                };
                state.error = null;
                test();
                // TODO Extract the error handling/reporting later on
                if (state.error) {
                    console.log(state.error.message);
                }
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
}

module.exports.expectFalsey = function (value) {
    if (!!value) {
        let message = `[${state.call.name}][expectFalsey]: Expected falsey value, but received ${value}`;
        state.error = { message, };
    }
};

module.exports.expectTruthy = function (value) {
    if (!value) {
        let message = `[${state.call.name}][expectTruthy]: Expected truthy value, but received ${value}`;
        state.error = { message, };
    }
};

module.exports.expectLess = function (threshold, value) {
    if (value >= threshold) {
        let message = `[${state.call.name}][expectLess]: Expected less than ${threshold}, but received ${value}`;
        state.error = { message, };
    }
};

module.exports.expectGreater = function (threshold, value) {
    if (value <= threshold) {
        let message = `[${state.call.name}][expectGreater]: Expected greater than ${threshold}, but received ${value}`;
        state.error = { message, };
    }
};

module.exports.expectUndefined = function (value) {
    if (value !== undefined) {
        let message = `[${state.call.name}][expectUndefined]: Expected undefined, but received ${value}`;
        state.error = { message, };
    }
};

module.exports.expectNull = function (value) {
    if (value !== null) {
        let message = `[${state.call.name}][expectNull]: Expected null, but received ${value}`;
        state.error = { message, };
    }
};

module.exports.expectEqual = function (expected, actual) {
    if (expected !== actual) {
        let message = `[${state.call.name}][expectEqual]: Expected ${expected}, but received ${actual}`;
        state.error = { message, };
    }
};

