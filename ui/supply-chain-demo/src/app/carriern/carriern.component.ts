import { Component } from '@angular/core';
import { CarrierComponent } from '../templates/carrier.component';
import { FormBuilder } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';



@Component({
  selector: 'app-carriern',
  templateUrl: '../templates/states.component.html',
  styleUrls: ['../templates/states.component.scss']
})
export class CarriernComponent extends CarrierComponent{
  constructor(fb: FormBuilder, blockchainSvc: BlockchainService) {
    super(fb, blockchainSvc);
    this.companyId = 'nls';
  }
}

