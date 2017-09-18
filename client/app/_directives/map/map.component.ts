import {
    Component, OnInit, ViewChild, NgZone, ElementRef, Input, AfterContentChecked
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AgmMap, MapsAPILoader} from '@agm/core';
import {DataService} from "../../_services/data/data.service";

declare let google: any;

@Component({
    moduleId: module.id,
    selector: 'app-map',
    templateUrl: 'map.component.html'
})

export class MapComponent implements OnInit, AfterContentChecked {
    @Input() search: boolean;
    @Input() edit: boolean;
    @Input() single: boolean;
    @Input() multiple: boolean;
    @Input() lat: number;
    @Input() lng: number;
    @Input() courses: any[];

    @ViewChild("search")
    public searchElementRef: ElementRef;

    @ViewChild(AgmMap) private map: AgmMap;

    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;

    courseArr: any[];

    constructor(private dataService: DataService,
                private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone) {
    }

    ngOnInit() {
        if (this.search) {
            this.searchControl = new FormControl();

            this.setCurrentPosition();

            this.mapsAPILoader.load().then(() => {
                let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                    types: ["address"]
                });
                autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                        if (place.geometry === undefined || place.geometry === null) {
                            return;
                        }
                        this.dataService.latitude = place.geometry.location.lat();
                        this.dataService.longitude = place.geometry.location.lng();
                        this.latitude = place.geometry.location.lat();
                        this.longitude = place.geometry.location.lng();
                        this.zoom = 14;
                    });
                });
            });
        } else {
            this.setCurrentPosition();
        }
    }

    ngAfterContentChecked() {
        if(this.single && this.lat && this.lng || this.multiple && this.lat && this.lng && this.courses) {
            this.map.triggerResize().then(() => {
                this.latitude = this.lat;
                this.longitude = this.lng;
                this.zoom = 14;
            });
        }
    }

    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 14;
            });
        }
    }
}