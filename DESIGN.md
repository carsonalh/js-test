# Library Design

---

This document aims to lay out the design ideas intended to be implemented in the
future of this library.

---

## Remarks of Current Implementation

The current implementation has the ability for the user to structure their tests
into a suite hierarchy, characterised by the object that is passed into
`runTestSuite()`.

What the current implementation is lacking, however, is the ability to write
meaningful tests for many data types (there only exists the single `expectEqual`
function). It also lacks what I would argue to be the most crucial part of a
test framework: meaningful failure messages.

## Possible Future Implementations

I think it only sensible that the next course of action should be to design a
system for generating concise, and meaningful failure messages. The following
are possible design implementations for the aforementioned system:

1. A halt-on-failure system, wherein any tests scheduled to be run after a test
   which has failed will not run until the current test passes. This approach
   will take less memory, but is also likely to not give the user a complete
   idea of what is going on with their code under test; a possibly detrimental
   side effect.
1. A log-and-continue-on-failure system, wherein a test failure does nothing
   more than log the failure of the test, but continues to run all the following
   tests. This will take more time to execute if and only if there are failing
   tests.

---

Out of the two previously mentioned strategies, the most logical seems to be to
log _all_ the test failures. Although this will take more time to execute, this
is a performance cost that I believe to be worth the benefit that it provides
the user.

