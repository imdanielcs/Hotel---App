import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAdminPage } from './view-admin.page';

describe('ViewAdminPage', () => {
  let component: ViewAdminPage;
  let fixture: ComponentFixture<ViewAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
