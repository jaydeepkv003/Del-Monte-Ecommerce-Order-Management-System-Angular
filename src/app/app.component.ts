import { Component, Injectable } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
@Injectable()
export class AppComponent {
  constructor() {}
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(this.showPosition);
  // }
  // showPosition(position): void {
  //   debugger;
  //   const innerHTML =
  //     'Latitude: ' +
  //     position.coords.latitude +
  //     '<br>Longitude: ' +
  //     position.coords.longitude;
  // }
  // var geocoder = new google.maps.Geocoder();
  // var latlng = new google.maps.LatLng(lat, lng);
  // geocoder.geocode({ 'latLng': latlng }, function (results, status) {
  //      if (status == google.maps.GeocoderStatus.OK) {
  //           if (results[0]) {
  //             var add = results[0].formatted_address ;
  //           }
  //      }
  // }
}
