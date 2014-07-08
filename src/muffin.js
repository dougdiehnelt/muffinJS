(function(){
    "use strict";
    var eventsTable = [];
    var uniqueId = 0;
    var usePerformanceAPI = window && window.performance;
    var _startEvent = function(eventDescription){
        var id = ++uniqueId;
        if (usePerformanceAPI){
            eventsTable.push {
                id: id,
                eventDescription: eventDescription
            }
            window.performance.mark(id+'_start');
            return id;
        } else {
            throw "Performance API not available";
        }
    };

    var _stopEvent = function(uniqueId){
        if (usePerformanceAPI){
            window.performance.mark(uniqueId+'_end');
        } else {
            throw "Performance API not available";
        }
    };

    var _gatherStats = function(){
        var retData = {
            totalTime: 0,
            usingPerformanceAPI: usePerformanceAPI,
            events: []
        };
        var firstEventStartTime;
        var lastEventEndTime;
        _.each(eventsTable, function(event){
            if (usePerformanceAPI){
                window.performance.measure(event.id+'_total', event.id+'_start', event.id+'_end');
                var measures = window.performance.getEntriesByName(event.id+'_total');
                if (measures && measures.length === 1){
                    var measure = measures[0];
                    var measureEndTime = measure.startTime + measure.duration;
                    retData.push({
                        id: event.id,
                        description: event.eventDescription,
                        duration: measure.duration,
                        startTime: measure.startTime
                    });
                    if (!firstEventStartTime || measure.startTime < firstEventStartTime){
                        firstEventStartTime = measure.startTime;
                    }
                    if (!lastEventEndTime || measureEndTime > lastEventEndTime ){
                        lastEventEndTime = measureEndTime;
                    }
                }
            }
        });
        retData.totalTime = lastEventEndTime - firstEventStartTime;
        return retData;
    };

    var _noop = function() {
        return;
    }

    if (window && window.enableTimings){
        muffin = {
            startEvent: _startEvent,
            stopEvent: _stopEvent,
            gathStats: _gatherStats
        }
    } else {
        muffin = {
            startEvent: _noop,
            stopEvent: _noop,
            gathStats: _noop
        }
    }

})();
