import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OfferingsComponent } from './offerings/offerings.component';



export const routes: Routes = [
    {
        path : "home",
        component : HomeComponent
    },
    // {
    //     path : "Login",
    //     component : LoginComponent
    // },
    // {
    //     path : "home",
    //     component : HomeComponent
    // },
    {
        path : "offerrings",
        component : OfferingsComponent
    }
];
