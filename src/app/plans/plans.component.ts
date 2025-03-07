// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-plans',
//   imports: [FormsModule ,CommonModule],
//   templateUrl: './plans.component.html',
//   styleUrl: './plans.component.css'
// })
// export class PlansComponent {

//   selectedPlan: string = '';
//   silverChecked: boolean = false;
//   platinumChecked: boolean = true;
//   titaniumChecked: boolean = false;

//   selectPlan(plan: string) {
//     this.selectedPlan = plan;
//     this.silverChecked = plan === 'silver';
//     this.platinumChecked = plan === 'platinum';
//     this.titaniumChecked = plan === 'titanium';
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent {
  selectedPlan: string = 'platinum'; // Set default selected plan
  silverChecked: boolean = false;
  platinumChecked: boolean = true;
  titaniumChecked: boolean = false;

  selectPlan(plan: string) {
    this.selectedPlan = plan;
    this.silverChecked = plan === 'silver';
    this.platinumChecked = plan === 'platinum';
    this.titaniumChecked = plan === 'titanium';
  }
}
