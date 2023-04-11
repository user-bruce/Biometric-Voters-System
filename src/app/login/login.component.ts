import { Esp32AuthServiceService } from './../shared/services/esp32.auth.service.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Notiflix from 'notiflix';
import { WebsocketService } from '../websocket.service';
import { Router } from '@angular/router';
import { VotingService } from '../shared/services/voting.service';
import { LocalKey, LocalStorage } from 'ts-localstorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  serverMessage!: String;
  wsSubscription!: Subscription;
  status: any;
  voter: any;

  //TODO: Replace the url with actual one from esp32
  constructor(private wsService: WebsocketService, private votingService: VotingService, private router: Router, private esp32Service: Esp32AuthServiceService) {

    this.wsSubscription = this.wsService.createObservableSocket("ws://192.168.43.134/ws").subscribe({
      next: data => {
        if (JSON.parse(data)['status'] === "login_successful") {
          const key = new LocalKey("loggedVoter", "")
          LocalStorage.setItem(key, JSON.parse(data)['id'])
          this.getVoterDetails(Number(JSON.parse(data)['id']))
          this.goToHome();
        } else if (JSON.parse(data)['status'] === 'login_ready') {
          Notiflix.Notify.success(
            `${JSON.parse(data)['message']}`,
            {
              timeout: 3000,
            },
          );
        } else if (JSON.parse(data)['status'] === 'fingerprint_failure') {
          Notiflix.Notify.failure(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );
        }
        else if (JSON.parse(data)['status'] === 'fingerprint_match') {
          Notiflix.Notify.success(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );
          const key = new LocalKey("loggedVoter", "")
          LocalStorage.setItem(key, JSON.parse(data)['id'])
          this.getVoterDetails(Number(JSON.parse(data)['id']))
          this.goToHome();
        } else if (JSON.parse(data)['status'] === "voter_id") {
          Notiflix.Notify.success(
            `${JSON.parse(data)['message']}`,
            {
              timeout: 3000
            }
          )
        }
        else if (JSON.parse(data)['status'] === 'login_failure') {
          Notiflix.Notify.failure(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );
        }
      },
      error: err => console.log('err'),
      complete: () => {

      }
    });

    setTimeout(() => {
      this.wsService.sendMessage('login_request')
    }, 1000
    );
  }

  getVoterDetails(id: number): void {
    this.votingService.getVoterDetails(id).subscribe({
      next: value => {
        const key = new LocalKey("loggedVoterDetails", "");
        LocalStorage.setItem(key, value)
        this.voter = value;
      },
      error: err => {
        console.log(err.message)
      }
    })
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  closeSocket() {
    this.wsSubscription.unsubscribe();
    this.status = 'This socket is closed';
  }

  ngOnInit(): void {
  }



}
