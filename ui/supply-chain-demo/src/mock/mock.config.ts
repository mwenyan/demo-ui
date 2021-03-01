import { HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';

export default {
    POST: {
        'http://localhost/shipping/verifytransaction': {
            handler: getBlockchainTxn
        },
        'http://localhost/shipping/verifytemperature': {
            handler: getBlockchainTxn
        }
    },
    GET: {
        'http://localhost/packages/timeline?uid=12345': {
            handler: getTimeline
        }
    },
    PUT: {
        'http://localhost/packages/pickup?uid=7bf55f10a8f2df21': {
            handler: pickup
        },
        'http://localhost/packages/create': {
            handler: createPackage
        }
    }
};

function pickup(): Observable<HttpResponse<any>> {
    return of(new HttpResponse({ status: 200, body:
        {}}));
}

function createPackage(): Observable<HttpResponse<any>> {
    return of(new HttpResponse({ status: 200, body:
        {
            uid: '7bf55f10a8f2df21',
            handling: 'P',
            product: 'PfizerVaccine',
            carrier: 'NLS',
            created: '2021-02-23T12:02:32-05:00', 'estimated-pickup': '2021-02-24T11:07:00-05:00', 'estimated-delivery': '2021-02-25T11:44:00-08:00', sender: 'John', from: {street: 'E 16th St.', city: 'New York', 'state-province': 'NY', 'postal-code': '11212', country: 'USA', longitude: -74.1225, latitude: 40.6506}, recipient: 'Jane', to: {street: 'E Florence Ave', city: 'Los Angeles', 'state-province': 'CA', 'postal-code': '90001', country: 'USA', longitude: -118.5583, latitude: 33.8775}}
    }));
}


function getTransferTxnDetail(): Observable<HttpResponse<any>> {
    return of(new HttpResponse({ status: 200, body:
        {
            'shipping-company': 'NLS',
            'tracking-id': '123fgghh',
            'estimated-pickup-time': '2014-02-01T09:28:56.321-10:00',
            'estimated-delivery-time': '2014-02-01T09:28:56.321-10:00',
            qrcode: 'kdjfjfjjeowldkdfkfjjghgjelwldfjjgj'
        }
    }));
}

function getTimeline(): Observable<HttpResponse<any>> {
    return of(new HttpResponse( {status: 200, body:
        // tslint:disable-next-line:max-line-length
      {uid: '183d5c1134c4e7f6', timeline: [{eventTime: '2021-02-27T15:55:55Z', eventType: 'pickup', location: 'E 16th St., New York, NY', latitude: 40.6246, longitude: -74.0822, route: 'NLS006'}, {eventTime: '2021-02-27T19:58:44Z', eventType: 'arrive', location: 'NLS: JFK, New York, NY', latitude: 40.7128, longitude: -74.006, route: 'NLS006'}, {eventTime: '2021-02-27T20:56:23Z', eventType: 'depart', location: 'NLS: JFK, New York, NY', latitude: 40.7128, longitude: -74.006, route: 'NLS004'}, {eventTime: '2021-02-28T01:05:33Z', eventType: 'arrive', location: 'NLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903, route: 'NLS004'}, {eventTime: '2021-02-28T01:05:33Z', eventType: 'transfer', location: 'NLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903}, {eventTime: '2021-02-28T01:06:03Z', eventType: 'transferAck', location: 'SLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903}, {eventTime: '2021-02-28T07:02:20Z', eventType: 'depart', location: 'SLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903, route: 'SLS006'}, {eventTime: '2021-02-28T08:56:24Z', eventType: 'arrive', location: 'SLS: LAX, Los Angeles, CA', latitude: 33.9416, longitude: -118.4085, route: 'SLS006'}, {eventTime: '2021-02-28T16:04:54Z', eventType: 'depart', location: 'SLS: LAX, Los Angeles, CA', latitude: 33.9416, longitude: -118.4085, route: 'SLS007'}, {eventTime: '2021-02-28T19:02:54Z', eventType: 'deliver', location: 'E Florence Ave, Los Angeles, CA', latitude: 33.8238, longitude: -118.3561, route: 'SLS007'}], routes: [{routeNbr: 'NLS006', departureTime: '2021-02-27T13:03:55Z', from: 'NLS: JFK, New York, NY', arrivalTime: '2021-02-27T19:58:44Z', to: 'NLS: JFK, New York, NY', containers: 'NLS006000.NLS006002', violated: false, measurements: [{periodStart: '2021-02-27T15:55:55Z', periodEnd: '2021-02-27T19:58:44Z', minValue: -67.01, maxValue: -63.1, violated: false}]}, {routeNbr: 'NLS004', departureTime: '2021-02-27T20:56:23Z', from: 'NLS: JFK, New York, NY', arrivalTime: '2021-02-28T01:05:33Z', to: 'NLS: DEN, Denver, CO', containers: 'NLS004000.NLS004007.NLS004008', violated: false, measurements: [{periodStart: '2021-02-27T20:56:23Z', periodEnd: '2021-02-28T01:05:33Z', minValue: -65.45, maxValue: -61.75, violated: false}]}, {routeNbr: 'SLS006', departureTime: '2021-02-28T07:02:20Z', from: 'SLS: DEN, Denver, CO', arrivalTime: '2021-02-28T08:56:24Z', to: 'SLS: LAX, Los Angeles, CA', containers: 'SLS005000.SLS005007.SLS005008', violated: true, measurements: [{periodStart: '2021-02-28T07:02:20Z', periodEnd: '2021-02-28T07:04:25Z', minValue: -71.91, maxValue: -65.46, violated: false}, {periodStart: '2021-02-28T07:04:25Z', periodEnd: '2021-02-28T07:27:22Z', minValue: -58.66, maxValue: -52.19, violated: true}, {periodStart: '2021-02-28T07:27:22Z', periodEnd: '2021-02-28T08:56:24Z', minValue: -74.01, maxValue: -62.12, violated: false}]}, {routeNbr: 'SLS007', departureTime: '2021-02-28T16:04:54Z', from: 'SLS: LAX, Los Angeles, CA', arrivalTime: '2021-02-28T23:03:37Z', to: 'SLS: LAX, Los Angeles, CA', containers: 'SLS007000.SLS007001', violated: false, measurements: [{periodStart: '2021-02-28T16:04:54Z', periodEnd: '2021-02-28T19:02:54Z', minValue: -78.43, maxValue: -69.28, violated: false}]}]}
    }));
}

function getBlockchainTxn(): Observable<HttpResponse<any>> {
    return of(new HttpResponse({ status: 200, body:
      // tslint:disable-next-line:max-line-length
      {uid: '183d5c1134c4e7f6', timeline: [{eventTime: '2021-02-27T15:55:55Z', eventType: 'pickup', location: 'E 16th St., New York, NY', latitude: 40.6246, longitude: -74.0822, route: 'NLS006'}, {eventTime: '2021-02-27T19:58:44Z', eventType: 'arrive', location: 'NLS: JFK, New York, NY', latitude: 40.7128, longitude: -74.006, route: 'NLS006'}, {eventTime: '2021-02-27T20:56:23Z', eventType: 'depart', location: 'NLS: JFK, New York, NY', latitude: 40.7128, longitude: -74.006, route: 'NLS004'}, {eventTime: '2021-02-28T01:05:33Z', eventType: 'arrive', location: 'NLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903, route: 'NLS004'}, {eventTime: '2021-02-28T01:05:33Z', eventType: 'transfer', location: 'NLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903}, {eventTime: '2021-02-28T01:06:03Z', eventType: 'transferAck', location: 'SLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903}, {eventTime: '2021-02-28T07:02:20Z', eventType: 'depart', location: 'SLS: DEN, Denver, CO', latitude: 39.7392, longitude: -104.9903, route: 'SLS006'}, {eventTime: '2021-02-28T08:56:24Z', eventType: 'arrive', location: 'SLS: LAX, Los Angeles, CA', latitude: 33.9416, longitude: -118.4085, route: 'SLS006'}, {eventTime: '2021-02-28T16:04:54Z', eventType: 'depart', location: 'SLS: LAX, Los Angeles, CA', latitude: 33.9416, longitude: -118.4085, route: 'SLS007'}, {eventTime: '2021-02-28T19:02:54Z', eventType: 'deliver', location: 'E Florence Ave, Los Angeles, CA', latitude: 33.8238, longitude: -118.3561, route: 'SLS007'}], routes: [{routeNbr: 'NLS006', departureTime: '2021-02-27T13:03:55Z', from: 'NLS: JFK, New York, NY', arrivalTime: '2021-02-27T19:58:44Z', to: 'NLS: JFK, New York, NY', containers: 'NLS006000.NLS006002', violated: false, measurements: [{periodStart: '2021-02-27T15:55:55Z', periodEnd: '2021-02-27T19:58:44Z', minValue: -67.01, maxValue: -63.1, violated: false}]}, {routeNbr: 'NLS004', departureTime: '2021-02-27T20:56:23Z', from: 'NLS: JFK, New York, NY', arrivalTime: '2021-02-28T01:05:33Z', to: 'NLS: DEN, Denver, CO', containers: 'NLS004000.NLS004007.NLS004008', violated: false, measurements: [{periodStart: '2021-02-27T20:56:23Z', periodEnd: '2021-02-28T01:05:33Z', minValue: -65.45, maxValue: -61.75, violated: false}]}, {routeNbr: 'SLS006', departureTime: '2021-02-28T07:02:20Z', from: 'SLS: DEN, Denver, CO', arrivalTime: '2021-02-28T08:56:24Z', to: 'SLS: LAX, Los Angeles, CA', containers: 'SLS005000.SLS005007.SLS005008', violated: true, measurements: [{periodStart: '2021-02-28T07:02:20Z', periodEnd: '2021-02-28T07:04:25Z', minValue: -71.91, maxValue: -65.46, violated: false}, {periodStart: '2021-02-28T07:04:25Z', periodEnd: '2021-02-28T07:27:22Z', minValue: -58.66, maxValue: -52.19, violated: true}, {periodStart: '2021-02-28T07:27:22Z', periodEnd: '2021-02-28T08:56:24Z', minValue: -74.01, maxValue: -62.12, violated: false}]}, {routeNbr: 'SLS007', departureTime: '2021-02-28T16:04:54Z', from: 'SLS: LAX, Los Angeles, CA', arrivalTime: '2021-02-28T23:03:37Z', to: 'SLS: LAX, Los Angeles, CA', containers: 'SLS007000.SLS007001', violated: false, measurements: [{periodStart: '2021-02-28T16:04:54Z', periodEnd: '2021-02-28T19:02:54Z', minValue: -78.43, maxValue: -69.28, violated: false}]}]}
    }));
}
