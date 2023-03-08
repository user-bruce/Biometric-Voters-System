import { Contestant } from 'src/app/shared/models/contestant';
import { VotingService } from './../shared/services/voting.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VotingPageComponent } from './voting-page/voting-page.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Data
  contestants: any;
  titles: any;

  constructor(public dialog: MatDialog, public votingService: VotingService) { }

  openDialog(contestant: any): void{
    const dialogRef = this.dialog.open(VotingPageComponent,{
      data: contestant
    });
    dialogRef.afterClosed().subscribe(result =>{
    })
  }

  ngOnInit(): void {
    this.votingService.getAllContestants().subscribe({
      next: value =>{
        this.contestants = value;
      },
      error: err =>{
        console.log(err);
      }
    });
    this.votingService.getAllContestantRoles().subscribe({
      next: value =>{
        this.titles = value;
      },
      error: err =>{
        console.log(err)
      }
    })
  }

}
