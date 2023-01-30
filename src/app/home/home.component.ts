import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VotingPageComponent } from './voting-page/voting-page.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Name
  name: string | undefined;
  position: string | undefined;

  constructor(public dialog: MatDialog) { }

  //Open the dialog
  openDialog(): void{
    const dialogRef = this.dialog.open(VotingPageComponent,{
      data: {
        name : this.name,
        position: this.position,
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
    })
  }

  ngOnInit(): void {
    this.name="Mr Bruce Chimoyo";
    this.position = "Mayor";
  }

}
