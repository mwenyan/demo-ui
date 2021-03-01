import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { BlockchainService } from '../blockchain.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.scss']
})
export class SenderComponent implements OnInit {
  states = new Map([
    ['Atlanta', 'GA'],
    ['Chicago', 'IL'],
    ['Denver', 'CO'],
    ['Los Angeles', 'CA'],
    ['New York', 'NY'],
    ['Seattle', 'WA'],
    ['Houston', 'TX']
  ]);
  pkgSenderFormGroup: FormGroup;
  pkgReceiverFormGroup: FormGroup;
  pkgContentFormGroup: FormGroup;
  qrFormGroup: FormGroup;
  doneFormGroup: FormGroup;

  constructor(private fmBuilder: FormBuilder, private blockchainSvc: BlockchainService) {
    this.pkgSenderFormGroup = this.fmBuilder.group({
      senderName: '',
      senderAddr: '',
      senderCity: '',
      senderState: '',
      senderZip: ''
    });

    this.pkgReceiverFormGroup = this.fmBuilder.group({
      receiverName: '',
      receiverAddr: '',
      receiverCity: '',
      receiverState: '',
      receiverZip: ''
    });

    this.pkgContentFormGroup = this.fmBuilder.group({
      height: '',
      width: '',
      depth: '',
      weight: '',
      content: '',
      contentDesc: '',
      startlot: '',
      endlot: '',
      count: 1,
      producer: '',
      dryice: ''
    });

    this.qrFormGroup = this.fmBuilder.group({
      shippingCompany: '',
      trackingId: '',
      pickupTime: '',
      deliveryTime: ''
    });

    this.doneFormGroup = this.fmBuilder.group({
      spinning: true,
      status: ''
    });
  }

  ngOnInit(): void {
  }

  createPkg(stepper: MatHorizontalStepper): void {
    console.log('createPkg....');
    const data = JSON.parse(`{ }`);
    const sender = JSON.parse(`{ }`);
    const receiver = JSON.parse(`{ }`);
    const contentd = JSON.parse(`{ }`);

    data.height = this.pkgContentFormGroup.value.height;
    data.width = this.pkgContentFormGroup.value.width;
    data.depth = this.pkgContentFormGroup.value.depth;
    if (Boolean(this.pkgContentFormGroup.value.dryice)){
      data['dry-ice-weight'] = this.pkgContentFormGroup.value.dryice;
    }

    data.sender = this.pkgSenderFormGroup.value.senderName;
    sender.street = this.pkgSenderFormGroup.value.senderAddr;
    sender.city = this.pkgSenderFormGroup.value.senderCity;
    sender['state-province'] = this.pkgSenderFormGroup.value.senderState;
    sender['postal-code'] = this.pkgSenderFormGroup.value.senderZip;
    sender.country = 'USA';
    data.from = sender;

    data.recipient = this.pkgReceiverFormGroup.value.receiverName;
    receiver.street = this.pkgReceiverFormGroup.value.receiverAddr;
    receiver.city = this.pkgReceiverFormGroup.value.receiverCity;
    receiver['state-province'] = this.pkgReceiverFormGroup.value.receiverState;
    receiver['postal-code'] = this.pkgReceiverFormGroup.value.receiverZip;
    receiver.country = 'USA';
    data.to = receiver;

    contentd.product = this.pkgContentFormGroup.value.content;
    if (contentd.product === 'standard'){
      data.handling = 'N';
    } else {
      data.handling = 'P';
    }
    contentd.description = this.pkgContentFormGroup.value.contentDesc;
    if (Boolean(this.pkgContentFormGroup.value.producer)){
      contentd.producer = this.pkgContentFormGroup.value.producer;
    }
    if (Boolean(this.pkgContentFormGroup.value.count)){
      contentd.count = this.pkgContentFormGroup.value.count;
    }
    if (Boolean(this.pkgContentFormGroup.value.startlot)){
      contentd['start-lot-number'] = this.pkgContentFormGroup.value.startlot;
    }
    if (Boolean(this.pkgContentFormGroup.value.endlot)){
      contentd['end-lot-number'] = this.pkgContentFormGroup.value.endlot;
    }
    data.content = contentd;

    this.blockchainSvc.createPackage(data).subscribe(
      (val) => {
        const datepipe: DatePipe = new DatePipe('en-US');
        this.qrFormGroup.setValue({shippingCompany: val.carrier,
                                    trackingId: val.uid,
                                    pickupTime: datepipe.transform(val['estimated-pickup'], 'EEEE, MMMM d, y, h:mm:ss a'),
                                    deliveryTime: datepipe.transform(val['estimated-delivery'], 'EEEE, MMMM d, y, h:mm:ss a')
                                  });
      },
      response => {
        console.log('error =', response);
      },
      () => {
        console.log('completed');
        stepper.next();
      }
    );
  }

  shipIt(stepper: MatHorizontalStepper): void {
    stepper.next();
    this.blockchainSvc.pickup(this.qrFormGroup.value.trackingId).subscribe(
      (val) => {
        this.doneFormGroup.controls.status.setValue(val);
      },
      response => {
        console.log('error =', response);
        this.doneFormGroup.controls.spinning.setValue(false);
        this.doneFormGroup.controls.status.setValue(response);
      },
      () => {
        console.log('completed');
        this.doneFormGroup.controls.spinning.setValue(false);
      }
    );
  }

  onCityChange(isSender: boolean, e: any): void {
    if (isSender) {
      this.pkgSenderFormGroup.controls.senderState.setValue(this.states.get(e.value));
    } else {
      this.pkgReceiverFormGroup.controls.receiverState.setValue(this.states.get(e.value));
    }
  }
}
