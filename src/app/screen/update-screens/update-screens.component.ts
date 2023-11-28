import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreService } from '../scre.service';
import { ScreenDTO } from 'src/app/screen-dto';

@Component({
  selector: 'app-update-screens',
  templateUrl: './update-screens.component.html',
  styleUrls: ['./update-screens.component.css'],
})

export class UpdateScreensComponent implements OnInit {
  screenId: number;
  scre: ScreenDTO;
  errorMessage: string;

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private sService: ScreService
  ) {}

  ngOnInit(): void {
    this.scre = new ScreenDTO();
    this.screenId = this.actRouter.snapshot.params['screenId'];
    this.sService.getScreenById(this.screenId).subscribe(
      (data) => {
        this.scre = data;
      },
      (error) => {
        console.error('Error fetching screen details:', error);
      }
    );
  }

  updateAScreen() {
    console.log('UpdateScreensComponent - Before update operation');
    this.sService.updateScreen(this.scre,this.scre.theatreId).subscribe(
      (res) => {
        console.log('UpdateScreensComponent - After successful update:', res);
        this.router.navigate(['/screen']);
      },
      (error) => {
        console.error('UpdateScreensComponent - Error during update:', error);
        if (error.status === 401) {
          console.log('UpdateScreensComponent - User unauthorized, maybe a logout issue');
        }
        this.errorMessage = 'Error updating screen. Please try again.';
      }
    );
    console.log('UpdateScreensComponent - After update operation');
  }
  
}
