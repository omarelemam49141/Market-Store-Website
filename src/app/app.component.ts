import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'Online Market OE';
  isLoading: boolean;

  constructor(private cdref: ChangeDetectorRef) {
    this.isLoading = true;
  }

  ngAfterViewInit() {
    this.isLoading = false;
    this.cdref.detectChanges();
  }
}
