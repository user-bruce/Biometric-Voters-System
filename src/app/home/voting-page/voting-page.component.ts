import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contestant } from 'src/app/shared/models/contestant';

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.css']
})
export class VotingPageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VotingPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contestant,) {

   }

   onNoClick(): void{
    this.dialogRef.close();
   }

  ngOnInit(): void {

  }

}
