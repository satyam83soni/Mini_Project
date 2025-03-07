import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { OfferingsComponent } from './offerings/offerings.component';
import { LoginComponent } from './login/login.component';
import { PlansComponent } from './plans/plans.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent , HomeComponent ,OfferingsComponent, LoginComponent, PlansComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = "Satyam's Capstone";
}
