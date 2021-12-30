import { TestBed } from '@angular/core/testing';

import { ServiceRedisService } from './service-redis.service';

describe('ServiceRedisService', () => {
  let service: ServiceRedisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRedisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
