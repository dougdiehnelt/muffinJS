muffinJS
========

JavaScript performance library

Goals
=====

1. Lightweight
2. Agnostic of browser environment
3. If Performance API is available use its timings
4. If environmental variable not set, no-op all methods
5. Simple JSON return of data to report on with Mr. Peppermint
6. Gruntify the build process

**_Stretch Goals_**
1. Work with bower
2. NPM-able?

API
===

    string muffin.startEvent(description)
returns uniqueID of event to use when stopping event

    void muffin.stopEvent(uniqueID)

finish an event

    json muffin.gatherStats()
returns an object with all timing and stats required


Dependencies
============

* lodash

Mr. Peppermint
==============

1. Wrap a selenium test suite to setup browser to use muffin
2. Navigate to page and do actions
3. _Call muffin.gatherStats and record as results_ (need to figure this one out)
4. Create output report for each test with total timing and breakdown
5. ????
6. Store results between runs for comparison
7. **Profit**
