const {
    runTestSuite,
    expectEqual,
    expectNull,
    expectUndefined,
    expectTruthy,
    expectFalsey,
    expectGreater,
    expectLess,
} = require('.');

runTestSuite({
    jstest: {
        failure: {
            expectEqual() {
                expectEqual(-1, 1);
            },
            expectNull() {
                expectNull(undefined);
            },
            expectUndefined() {
                expectUndefined(null);
            },
            expectTruthy() {
                expectTruthy(false);
            },
            expectFalsey() {
                expectFalsey(true);
            },
            expectGreater() {
                expectGreater(0, -1);
            },
            expectLess() {
                expectLess(0, 1);
            },
        },
        pass: {
            expectEqual() {
                expectEqual(0, 0);
            },
            expectNull() {
                expectNull(null);
            },
            expectUndefined() {
                expectUndefined(undefined);
            },
            expectTruthy() {
                expectTruthy(true);
            },
            expectFalsey() {
                expectFalsey(false);
            },
            expectGreater() {
                expectGreater(0, 1);
            },
            expectLess() {
                expectLess(0, -1);
            },
        },
    },
});

