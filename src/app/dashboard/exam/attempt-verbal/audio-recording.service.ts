import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import * as RecordRTC from 'recordrtc';
import moment from 'moment';


interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {

  private stream: MediaStream | null;
  private recorder: RecordRTC.StereoAudioRecorder | null;
  private interval: any;
  private startTime: moment.Moment | null;
  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();

  constructor() {
    this.stream = null;
    this.recorder = null;
    this.interval = null;
    this.startTime = null;
  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  startRecording() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(s => {
        this.stream = s;
        this.record();
      })
      .catch(error => {
        this._recordingFailed.next(error);
      });
  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {
    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream as MediaStream, {
      type: 'audio',
      mimeType: 'audio/webm'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(() => {
      const currentTime = moment();
      const diffTime = moment.duration(currentTime.diff(this.startTime));
      const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
      this._recordingTime.next(time);
    }, 1000);
  }

  private toString(value: number | undefined | null): string {
    let val = value?.toString() || '00';
    if (value !== null && value !== undefined && value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop(
        (blob: Blob) => {
          if (this.startTime) {
            const mp3Name = 'audio_' + new Date().getTime() + '.mp3';
            this.stopMedia();
            this._recorded.next({ blob: blob, title: mp3Name });
          }
        },
      );
    }
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }
}
