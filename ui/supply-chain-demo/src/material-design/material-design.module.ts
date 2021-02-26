// src/material-design/material-design.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QRCodeModule } from 'angularx-qrcode';
import {  MatSelectModule } from '@angular/material/select';

const modules: any[] = [
  MatButtonModule,
  MatCheckboxModule,
  CdkTableModule,
  CommonModule,
  MatToolbarModule,
  FormsModule,
  ReactiveFormsModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  QRCodeModule,
  MatSelectModule,
];

// Declare Module that imports/exports the @angular/material modules needed in the app
@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialDesignModule {}
