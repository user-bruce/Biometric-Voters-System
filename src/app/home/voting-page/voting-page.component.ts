import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Notiflix from 'notiflix';
import { Subscription } from 'rxjs';
import { Contestant } from 'src/app/shared/models/contestant';
import { Esp32AuthServiceService } from 'src/app/shared/services/esp32.auth.service.service';
import { VotingService } from 'src/app/shared/services/voting.service';
import { WebsocketService } from 'src/app/websocket.service';
import { LocalKey, LocalStorage } from 'ts-localstorage';

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.css']
})
export class VotingPageComponent implements OnInit {

  serverMessage: String = "...";
  wsSubscription!: Subscription;
  status: any;
  voter: any;

  constructor(public dialogRef: MatDialogRef<VotingPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private wsService: WebsocketService, private votingService: VotingService, private router: Router, private esp32Service: Esp32AuthServiceService) {
    this.wsSubscription = this.wsService.createObservableSocket("ws://192.168.43.134/ws").subscribe({
      next: data => {
        if (JSON.parse(data)['status'] === "sensor_ready") {
          console.log(JSON.parse(data)['id']);
        } else if (JSON.parse(data)['status'] === "vote_ready") {
          Notiflix.Notify.success(
            `${JSON.parse(data)['message']}`,
            {
              timeout: 3000,
            },
          );
        } else if (JSON.parse(data)['status'] === "vote_successful") {
          Notiflix.Notify.success(
            "Fingerprint matched",
            {
              timeout: 3000
            }
          )
          this.dialogRef.close();
          const key = new LocalKey("loggedVoter", "");
          LocalStorage.setItem(key, JSON.parse(data)['id'])
          this.submitVote();

          //Check if voter has voted
          const detailsKey = new LocalKey("loggedVoterDetails", "");
          LocalStorage.getItem(key)
          this.router.navigate(['/login']);
        }
        else if (JSON.parse(data)['status'] === "vote_failure") {
          Notiflix.Notify.success(
            `${JSON.parse(data)['message']}`,
            {
              timeout: 3000
            }
          )
        }
        else if (JSON.parse(data)['status'] === 'fingerprint_failure') {
          Notiflix.Notify.failure(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );

        }
        else if (JSON.parse(data)['status'] === 'fingerprint_match') {
          Notiflix.Notify.success(
            "Fingerprint matched",
            {
              timeout: 3000,
            }
          );
          this.dialogRef.close();
          this.router.navigate(['/login']);
        }
      },
      error: err => console.log('err'),
      complete: () => {

      }
    });
    setTimeout(() => {
      this.wsService.sendMessage('vote_request');
    }, 1000)
  }

  submitVote(): void {
    console.log(this.data)
    const key = new LocalKey("loggedVoter", '')
    let body = {
      contestant: this.data,
      voter: LocalStorage.getItem(key)
    }
    this.votingService.vote(body).subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        console.log(err)
      }
    })
    LocalStorage.clear();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

  }

}
