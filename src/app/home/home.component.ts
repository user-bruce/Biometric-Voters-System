import { Contestant } from 'src/app/shared/models/contestant';
import { VotingService } from './../shared/services/voting.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VotingPageComponent } from './voting-page/voting-page.component';
import { WebsocketService } from '../websocket.service';
import { Router } from '@angular/router';
import { Esp32AuthServiceService } from '../shared/services/esp32.auth.service.service';
import { Subscription } from 'rxjs';
import { LocalKey, LocalStorage } from 'ts-localstorage';
import Notiflix from 'notiflix';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Data
  contestants: any;
  globalContestants: any;
  titles: any;
  totalContestants: number = 0;
  noContestants: boolean = false;
  dialogReference: any;
  serverMessage: String = "...";
  wsSubscription!: Subscription;
  status: any;
  voter: any;

  constructor(public dialog: MatDialog, public votingService: VotingService,private wsService: WebsocketService,private router: Router,private esp32Service: Esp32AuthServiceService) {

  }

  openDialog(contestant: any): void {
    this.wsService.sendMessage("vote_request");
    if(this.voter.voted==="YES"){
      Notiflix.Notify.failure(
        'Vote already exists',
        {
          timeout: 3000,
        }
      );
    }else{
      this.wsService.sendMessage('vote_request');
      const dialogRef = this.dialog.open(VotingPageComponent, {
        data: contestant
      });
      this.dialogReference = dialogRef
      dialogRef.afterClosed().subscribe(result => {
      })
    }
  }

  onChipClicked(chip: any) {
    this.noContestants = false;
    var newContestants:any = [];
    this.globalContestants.forEach((item: any) => {
      if(item.title.titleName == chip.titleName){
        newContestants.push(item);
      }
    });
    this.contestants = newContestants;
    this.checkContestantsLength(newContestants);
  }



  ngOnInit(): void {
    const key = new LocalKey("loggedVoter",'');
    const id = Number(LocalStorage.getItem(key));
    this.votingService.getAllContestants().subscribe({
      next: value => {
        this.contestants = value;
        this.totalContestants = value.length;
        this.checkContestantsLength(this.totalContestants);
        this.globalContestants = value;
      },
      error: err => {
        console.log(err);
      }
    });
    this.votingService.getAllContestantRoles().subscribe({
      next: value => {
        this.titles = value;
      },
      error: err => {
        console.log(err)
      }
    })
    this.votingService.getVoter(id).subscribe({
      next: value =>{
        this.voter = value
      },
      error: err =>{
        console.log(err.message);
      }
    })
  }

  onAllChipClicked(){
    this.contestants = this.globalContestants;
  }

  checkContestantsLength(totalContestants: number) {
    if (totalContestants < 1){
      this.noContestants = true;
    }else{
      this.noContestants = false
    }
  }
}
