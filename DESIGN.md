# Library Design

---

This document aims to lay out the design ideas intended to be implemented in the
future of this library.

## Remarks of Current Implementation

Now, the library has a means of writing tests that have better failure messages
than just saying "an error occurred," along with some more useful functions for
checking data than `expectEqual`.

What the current implementation is not capable of, however, is the ability to
test asynchronous code; a core feature of many JavaScript applications. And I
think this should be the next course of action for the development of this
library.

## Possible Future Implementations

To modify the current code to support async functions, we should modify the code
to work with promises instead of just calling the function directly. The first
change that would have to be made to the existing code would be to give each
test function its own state object to which the expect functions should bind.
This is because the current global state model would not support asynchronous tests in the same way
individualised states would. Then, instead of running each test directly, each
test would have its promise added to some array. Then, once all the promises are
resolved, the outputs of the tests are displayed.

