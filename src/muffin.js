(function(){
    "use strict";
    var eventsTable = [];
    var uniqueId = 0;
    var navigationStart = 0;
    var usePerformanceAPI = window && window.performance ? true : false;
    var _startEvent = function(eventDescription, optionalData){
        var id = ++uniqueId;
        if (usePerformanceAPI){
            eventsTable.push({
                id: id,
                eventDescription: eventDescription,
                optionalData: optionalData
            });
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
                if (measures && measures.length > 0){
                    var measure = measures[measures.length-1];
                    var measureStartTime = measure.startTime - navigationStart;
                    var measureEndTime = measureStartTime + measure.duration;
                    retData.events.push({
                        id: event.id,
                        description: event.eventDescription,
                        optionalData: event.optionalData,
                        duration: measure.duration,
                        startTime: measureStartTime
                    });
                    if (!firstEventStartTime || measureStartTime < firstEventStartTime){
                        firstEventStartTime = measureStartTime;
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
    var _recordNavigation = function() {
        eventsTable = [];
        navigationStart = usePerformanceAPI ? window.performance.now() : Date.now();
    };

    var _noop = function() {
        return;
    }

    if (window){
        window.muffin = {
            recordNavigation: _recordNavigation,
            startEvent: _startEvent,
            stopEvent: _stopEvent,
            gathStats: _gatherStats
        };
    } else {
        muffin = {
            startEvent: _noop,
            stopEvent: _noop,
            gathStats: _noop
        }
    }
    _recordNavigation();
})();
