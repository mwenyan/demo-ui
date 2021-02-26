import { HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';

export default {
    POST: {
        'http://localhost/packages/create': {
            handler: createPackage
        }
    },
    GET: {
        'http://localhost/tracking/internal/nls/12345': {
            handler: getTimeline
        },
        'http://localhost/tracking/12345/txn1': {
            handler: getTransferTxnDetail
        }
    },
    PUT: {
        'http://localhost/packages/pickup?uid=7bf55f10a8f2df21': {
            handler: pickup
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
        {
            uid: '7bf55f10a8f2df21',
            timeline: [
                {
                    eventTime: '2021-02-24T16:08:20Z',
                    eventType: 'pickup',
                    location: 'E 16th St., New York, NY',
                    latitude: 40.6506,
                    longitude: -74.1225,
                    route: 'NLS009'
                },
                {
                    eventTime: '2021-02-24T19:59:49Z',
                    eventType: 'arrive',
                    location: 'NLS: JFK, New York, NY',
                    latitude: 40.7128,
                    longitude: -74.006,
                    route: 'NLS009'
                },
                {
                    eventTime: '2021-02-25T01:05:09Z',
                    eventType: 'transfer',
                    location: 'NLS: DEN, Denver, CO',
                    latitude: 39.7392,
                    longitude: -104.9903
                },
                {
                    eventTime: '2021-02-25T01:05:39Z',
                    eventType: 'transferAck',
                    location: 'SLS: DEN, Denver, CO',
                    latitude: 39.7392,
                    longitude: -104.9903
                },
                {
                    eventTime: '2021-02-25T07:02:12Z',
                    eventType: 'depart',
                    location: 'SLS: DEN, Denver, CO',
                    latitude: 39.7392,
                    longitude: -104.9903,
                    route: 'SLS003'
                },
                {
                    eventTime: '2021-02-25T09:00:39Z',
                    eventType: 'arrive',
                    location: 'SLS: LAX, Los Angeles, CA',
                    latitude: 33.9416,
                    longitude: -118.4085,
                    route: 'SLS003'
                },
                {
                    eventTime: '2021-02-25T16:03:56Z',
                    eventType: 'depart',
                    location: 'SLS: LAX, Los Angeles, CA',
                    latitude: 33.9416,
                    longitude: -118.4085,
                    route: 'SLS004'
                },
                {
                    eventTime: '2021-02-25T19:47:56Z',
                    eventType: 'deliver',
                    location: 'E Florence Ave, Los Angeles, CA',
                    latitude: 33.8775,
                    longitude: -118.5583,
                    route: 'SLS004'
                }
            ],
            routes: [
                {
                    routeNbr: 'NLS009',
                    departureTime: '2021-02-24T13:01:20Z',
                    from: 'NLS: JFK, New York, NY',
                    arrivalTime: '2021-02-24T19:59:49Z',
                    to: 'NLS: JFK, New York, NY',
                    containers: 'NLS009000.NLS009001',
                    violated: true,
                    measurements: [
                        {
                            periodStart: '2021-02-24T16:00:58Z',
                            periodEnd: '2021-02-24T16:08:20Z',
                            minValue: -75.54,
                            maxValue: -62.83,
                            violated: false
                        },
                        {
                            periodStart: '2021-02-24T16:08:20Z',
                            periodEnd: '2021-02-24T16:10:58Z',
                            minValue: -50.46,
                            maxValue: -43.67,
                            violated: true
                        },
                        {
                            periodStart: '2021-02-24T16:10:58Z',
                            periodEnd: '2021-02-24T19:59:49Z',
                            minValue: -75.54,
                            maxValue: -62.83,
                            violated: false
                        }
                    ]
                },
                {
                    routeNbr: 'SLS003',
                    departureTime: '2021-02-25T07:02:12Z',
                    from: 'SLS: DEN, Denver, CO',
                    arrivalTime: '2021-02-25T09:00:39Z',
                    to: 'SLS: LAX, Los Angeles, CA',
                    containers: 'SLS002000.SLS002001.SLS002002',
                    violated: false,
                    measurements: [
                        {
                            periodStart: '2021-02-25T07:02:12Z',
                            periodEnd: '2021-02-25T09:00:39Z',
                            minValue: -68.6,
                            maxValue: -67.17,
                            violated: false
                        }
                    ]
                },
                {
                    routeNbr: 'SLS004',
                    departureTime: '2021-02-25T16:03:56Z',
                    from: 'SLS: LAX, Los Angeles, CA',
                    arrivalTime: '2021-02-25T22:57:58Z',
                    to: 'SLS: LAX, Los Angeles, CA',
                    containers: 'SLS004000.SLS004001',
                    violated: false,
                    measurements: [
                        {
                            periodStart: '2021-02-25T16:03:56Z',
                            periodEnd: '2021-02-25T19:47:56Z',
                            minValue: -66.33,
                            maxValue: -60.17,
                            violated: false
                        }
                    ]
                }
            ]
        }
    }));
}

function getTimeline2(): Observable<HttpResponse<any>> {
    return of(new HttpResponse({ status: 200, body:
        {
            'tracking-id': '12345',
            package: {
              sender: {
                name: 'john smith',
                address: '33 aberdeen st, windermere, fl 34786'
              },
              recipient: {
                name: 'kevin smith',
                address: '33 aberdeen st, chicago, il 60089'
              },
              content: 'PfVaccine',
              'created-datetime': '2021-02-20T10:00:00-5:00',
              shipper: 'NLS',
              constraints: [
                {
                  type: 'temperature',
                  'min-value': 1,
                  'max-value': 10,
                  'value-unit': 'F'
                }
              ]
            },
            'logistic-events':
            [
              {
                event: 'created',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'ORD',
                handler: 'john smith',
                'event-device-id': '',
                'event-source': {
                  id: '12345',
                  type: 'package'
                }
              },
              {
                event: 'induction',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'ORD',
                handler: 'emp123',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  id: '12345',
                  type: 'package'
                }
              },
              {
                event: 'stow',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'ORD',
                handler: 'emp123',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  id: '12345',
                  type: 'package'
                },
                'event-target': {
                  id: 'dddd',
                  type: 'ULD'
                }
              },
              {
                event: 'loaded',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'ORD',
                handler: '12345',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  id: 'dddd',
                  type: 'ULD'
                },
                'event-target': {
                  type: 'flight',
                  id: '123',
                  origin: 'ORD',
                  destination: 'DEN',
                  etd: '',
                  eta: ''
                }
              },
              {
                event: 'departed',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '123',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'flight',
                  id: '123'
                }
              },
              {
                event: 'arrived',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '123',
                'event-device-id': '',
                'event-source': {
                  type: 'flight',
                  id: '123'
                }
              },
              {
                event: 'offloaded',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '123',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'ULD',
                  id: '123'
                },
                'event-target': {
                  type: 'flight',
                  id: '123',
                  origin: 'ORD',
                  destination: 'DEN'
                }
              },
              {
                event: 'sorting',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '12345',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'package',
                  id: '12345'
                }
              },
              {
                event: 'stow',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '12345',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'ULD',
                  id: '123'
                },
                'event-target': {
                  id: 'tttt',
                  type: 'ULD'
                }
              },
              {
                event: 'loaded',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '12345',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'ULD',
                  id: '123'
                },
                'event-target': {
                  type: 'truck',
                  id: '123',
                  origin: 'DEN',
                  destination: 'DEN',
                  etd: '',
                  eta: ''
                }
              },
              {
                event: 'departed',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '12345',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'truck',
                  id: '123',
                  origin: 'NLS DEN',
                  destination: 'SLS DEN',
                  adt: ''
                }
              },
              {
                event: 'arrived',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '12345',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'truck',
                  id: '123'
                }
              },
              {
                event: 'transferred',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                location: 'DEN',
                handler: '12345',
                'event-device-id': 'event-device-id id',
                'event-source': {
                  type: 'package',
                  id: '12345'
                },
                'event-target': {
                  type: 'shipper',
                  id: 'SLS'
                },
                'txn-id': 'txn1'
              }
            ],
            'constraint-violation-events': [
              {
                event: '',
                'event-datetime': '2020-02-11T10:00:00-05:00',
                'event-device': '',
                longitude: '',
                latitude : '',
                value: 12,
                'value-unit': 'F'
              }
            ]
          }
    }));
}
