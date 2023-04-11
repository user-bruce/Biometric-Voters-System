import { LocalKey } from './../../../node_modules/ts-localstorage/src/index';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Notiflix from 'notiflix';
import { WebsocketService } from '../websocket.service';
import { Esp32AuthServiceService } from '../shared/services/esp32.auth.service.service';
import { Router } from '@angular/router';
import { VotingService } from '../shared/services/voting.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  serverMessage: String = "...";
  wsSubscription!: Subscription;
  status: any;

  constructor(private wsService: WebsocketService, private votingService: VotingService, private router: Router, private esp32Service: Esp32AuthServiceService) {
    this.wsSubscription = this.wsService.createObservableSocket("ws://192.168.43.134/ws").subscribe({
      next: data => {
        if (JSON.parse(data)['status'] === "signup_successful") {
          let body = {
            fingerprintID: JSON.parse(data)['id'],
            voted: 'NO'
          }
          this.submitVoter(body);
          this.goToLogin()
        } else if (JSON.parse(data)['status'] === "sensor_ready") {
          Notiflix.Notify.success(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
          );

        } else if (JSON.parse(data)['status'] === 'signup_ready') {
          Notiflix.Notify.success(
            JSON.parse(data)['message'],
            {
              timeout: 3000,
            }
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
        }
      },
      error: err => console.log('err'),
      complete: () => {

      }
    });

    setTimeout(() => {
      this.wsService.sendMessage('signup_request')
    }, 1000
    );
  }

  submitVoter(body: any) {
    this.votingService.registerVoter(body).subscribe({
      next: value => {
        Notiflix.Notify.success(
          'Submitted voter to DB',
          {
            timeout: 3000,
          },
        );
      },
      error: err => {
        console.log(err)
        Notiflix.Notify.failure(
          `${err.message}`,
          {
            timeout: 3000,
          },
        );
      }
    })
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  closeSocket() {
    this.wsSubscription.unsubscribe();
    this.status = 'This socket is closed';
  }

  ngOnInit(): void {

  }

}
