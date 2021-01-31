# Library Design

---

This document aims to lay out the design ideas intended to be implemented in the
future of this library.

## Remarks of Current Implementation

All that is keeping the current implementation from being a full test harness is
a method to mock functions, and (by extension) methods. Although if an interface
for function mocking is provided, then method mocking should be trivial.

## Possible Future Implementations

Since all functions and objects are things that are all evaluated at runtime, it
should be rather trivial to implement this; especially with the help of
closures, and the current design of the library (what with all the functions
sharing the `this` object).

