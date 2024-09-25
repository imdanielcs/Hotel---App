import { TestBed } from '@angular/core/testing';

import { DbserviceService } from './dbservice.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ActivatedRoute,Router } from '@angular/router';
import { of } from 'rxjs';

describe('DbserviceService', () => {
  let service: DbserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    providers: [
      { provide: SQLite}
      ,{
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' })
        }
      }
    ]
    service = TestBed.inject(DbserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
