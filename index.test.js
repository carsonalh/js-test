const { runTestSuite, mockFunction } = require('.');

runTestSuite({
    jstest: {
        failure: {
            expectEqual() {
                this.expectEqual(-1, 1);
            },
            expectNull() {
                this.expectNull(undefined);
            },
            expectUndefined() {
                this.expectUndefined(null);
            },
            expectTruthy() {
                this.expectTruthy(false);
            },
            expectFalsey() {
                this.expectFalsey(true);
            },
            expectGreater() {
                this.expectGreater(0, -1);
            },
            expectLess() {
                this.expectLess(0, 1);
            },
        },
        pass: {
            expectEqual() {
                this.expectEqual(0, 0);
            },
            expectNull() {
                this.expectNull(null);
            },
            expectUndefined() {
                this.expectUndefined(undefined);
            },
            expectTruthy() {
                this.expectTruthy(true);
            },
            expectFalsey() {
                this.expectFalsey(false);
            },
            expectGreater() {
                this.expectGreater(0, 1);
            },
            expectLess() {
                this.expectLess(0, -1);
            },
        },
        asyncPass: {
            async expectEqual() {
                this.expectEqual(0, 0);
            },
            async expectNull() {
                this.expectNull(null);
            },
            async expectUndefined() {
                this.expectUndefined(undefined);
            },
            async expectTruthy() {
                this.expectTruthy(true);
            },
            async expectFalsey() {
                this.expectFalsey(false);
            },
            async expectGreater() {
                this.expectGreater(0, 1);
            },
            async expectLess() {
                this.expectLess(0, -1);
            },
        },
        asyncFailure: {
            async expectEqual() {
                this.expectEqual(-1, 1);
            },
            async expectNull() {
                this.expectNull(undefined);
            },
            async expectUndefined() {
                this.expectUndefined(null);
            },
            async expectTruthy() {
                this.expectTruthy(false);
            },
            async expectFalsey() {
                this.expectFalsey(true);
            },
            async expectGreater() {
                this.expectGreater(0, -1);
            },
            async expectLess() {
                this.expectLess(0, 1);
            },
        },
        mockFunctionsPass: {
            createWithoutException() {
                let stub = mockFunction(this);
            },
            returnsValueAssignedToReturn() {
                let stub = mockFunction(this)
                    .returnValue(0);
                this.expectEqual(0, stub());
            },
        },
        mockFunctionsFail: {
            spyWrongNumberOfArguments() {
                let spy = mockFunction(this)
                    .expectCall(0);
                spy();
            },
            spyWrongArguments() {
                let spy = mockFunction(this)
                    .expectCall(1, 2, 3);
                spy(4, 5, 6);
            },
        },
    },
});

