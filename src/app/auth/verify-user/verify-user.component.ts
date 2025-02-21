import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-verify-user',
  imports: [],
  templateUrl: './verify-user.component.html',
  styleUrl: './verify-user.component.css'
})
export class VerifyUserComponent implements OnInit {

  constructor(private activatedroute:ActivatedRoute,private authService:AuthService,private router:Router) { }
  token:any
  isVerified=true

  ngOnInit(): void {
    this.token=this.activatedroute.snapshot.paramMap.get("token")
    this.authService.verifyUser(this.token).subscribe({
      next: (data:any) => {
        this.isVerified=data;
        console.log(data)
        this.router.navigate([`auth/login`,]);
      },
      error: (err:any) => {
        console.log(err)
      }
    })
  }



}
