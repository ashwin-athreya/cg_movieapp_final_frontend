import { Component, OnInit } from '@angular/core';
import { Theatre } from '../theatre';
import { ActivatedRoute, Router } from '@angular/router';
import { ThetreService } from '../thetre.service';
import { Scren } from '../../screen/screen';
import { Show } from 'src/app/show/show';

@Component({
  selector: 'app-detail-view-theatre',
  templateUrl: './detail-view-theatre.component.html',
  styleUrls: ['./detail-view-theatre.component.css'],
})
export class DetailViewTheatreComponent implements OnInit {
  theatreId: number | undefined;
  theatre: Theatre = {
    theatreId: 0,
    theatreName: '',
    managerName: '',
    theatreCity: '',
    managerContact: '', // Add this property with a default value
    screen: [], // Assuming this is an array
  };
  screens: Scren[] = [];
  shows: Show[] = [];

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private tService: ThetreService
  ) {}

  ngOnInit(): void {
    this.theatreId = this.actRouter.snapshot.params['theatreId'];

    // Check if theatreId is defined before making the request
    if (this.theatreId !== undefined) {
      this.tService.findTheatre(this.theatreId).subscribe(
        (data: Theatre) => {
          // Merge data into the existing theatre object
          this.theatre = { ...this.theatre, ...data };

          // Check if this.theatre.screen is an array before iterating
          this.screens = Array.isArray(this.theatre.screen) ? this.theatre.screen : [];

          // Fetch shows for each screen
          this.screens.forEach((screen) => {
            this.tService.getShowsForScreen(screen.screenId).subscribe((showData: Show[]) => {
              // Check if showData is an array before assigning
              const shows = Array.isArray(showData) ? showData : [];
              this.shows = [...this.shows, ...shows];
            });
          });
        },
        (error) => {
          console.error('Error fetching theatre:', error);
        }
      );
    } else {
      console.error('theatreId is undefined.');
    }
  }

  removeTheatre(theatreId: number | undefined) {
    // Check if theatreId is defined before making the request
    if (theatreId !== undefined) {
      this.tService.deleteTheatre(theatreId).subscribe(
        (data: Theatre) => {
          this.ngOnInit();
          console.log(data);
        },
        (error) => {
          console.error('Error removing theatre:', error);
        }
      );
    } else {
      console.error('theatreId is undefined.');
    }
  }
}
