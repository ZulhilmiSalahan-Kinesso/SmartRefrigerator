import { Injectable } from '@angular/core';
    // Imports the Google Cloud client library
import { Vision } from '@google-cloud/vision';

@Injectable({
  providedIn: 'root'
})
export class GoogleVisionService {

  constructor(googleVision: Vision) { }

  async quickstart() {
    // Creates a client
    const client = new Vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    const [result] = await client.labelDetection('./resources/wakeupcat.jpg');
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
  }
}
