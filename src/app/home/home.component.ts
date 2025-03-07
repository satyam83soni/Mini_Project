import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  show1 = false;

  toggle1() {
    this.show1 = !this.show1;
  }
  show2 = false;

  toggle2() {
    this.show2 = !this.show2;
  }

}
