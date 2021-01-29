function sum(a, b) {
    return a + b;
}

let globalError = false;

runTestSuite({
    sum: {
        worksForSingleCase() {
            let a, b;
            a = 2;
            b = 3;
            expectEqual(5, sum(a, b));
        },
        worksForAnotherCase() {
            let a, b;
            a = 2;
            b = -1;
            expectEqual(1, sum(a, b));
        },
        worksForOneMoreCase() {
            let a, b;
            a = 2;
            b = -2;
            expectEqual(0, sum(a, b));
        },
        sub: {
            inner: {
                hereIsAnotherTest() {
                    expectEqual(-1, 1);
                },
            },
        },
    },
});

function expectEqual(expected, actual) {
    if (expected !== actual) {
        globalError = true;
    }
}

function runTestSuite(tests) {
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
                console.log(`Running test ${identifier}`);
                test();
                // TODO Extract the error handling/reporting later on
                if (globalError) {
                    console.log('There was an error.');
                    // Note: This is the only artificial way this loop can exit
                    break;
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

