import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-screen',
  standalone: true,
  imports: [MatButtonModule,MatCardModule, RouterModule],
  templateUrl: './help-screen.component.html',
  styleUrl: './help-screen.component.css'
})
export class HelpScreenComponent {

}
