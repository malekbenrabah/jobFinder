import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export class DateRangeFormControl extends FormControl {
    override setValue(value: { startDate: Date; endDate: Date }, options?: any) {
      if (value.startDate && value.endDate) {
        super.setValue(value, options);
      } else {
        super.setValue(null, options);
      }
    }
  }