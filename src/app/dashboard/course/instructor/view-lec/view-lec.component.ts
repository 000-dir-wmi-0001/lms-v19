import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CourseService } from '../../course.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  selector: 'app-view-lec',
  templateUrl: './view-lec.component.html',
  styleUrls: ['./view-lec.component.css']
})
export class ViewLecComponent implements OnInit {

  constructor(private route: ActivatedRoute, private courseService: CourseService) { }

  thumbnail: any;
  cid: any;
  videoUrl: any

  ngOnInit(): void {
    const cid = this.route.snapshot.params['courseId'];
    const lid = this.route.snapshot.params['lectureId'];
    const fileName = this.route.snapshot.params['fileName']
    const thumbnail = this.route.snapshot.params['thumbnail']

    this.courseService.getVideo(cid, lid, fileName).subscribe({
      next: (videoUrl) => {
        this.videoUrl = videoUrl
        console.log(videoUrl);
        this.courseService.getVideoThumbnail(cid, lid, thumbnail).subscribe({
          next: (thumbnail) => {
            this.thumbnail = thumbnail;
          },
          error(err) {
          },
        })
      },
      error(err) {
      },
    })
  }


}
