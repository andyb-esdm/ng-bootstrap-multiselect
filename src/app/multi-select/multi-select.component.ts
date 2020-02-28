import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  values: number[];

  options = [
    { id: 1, name: 'one', checked: false },
    { id: 2, name: 'two', checked: false },
    { id: 3, name: 'three', checked: false },
    { id: 4, name: 'four', checked: false },
    { id: 5, name: 'five', checked: false },
    { id: 6, name: 'six', checked: false },
    { id: 7, name: 'seven', checked: false },
    { id: 8, name: 'eight', checked: false },
    { id: 9, name: 'nine', checked: false },
    { id: 10, name: 'ten', checked: false }
  ];

  writeValue(values: number[]): void {
    this.values = values ? values : [];
    this.bindToValues();
  }

  registerOnChange(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
  }

  onOptionClicked(id: number) {
    const index = this.values.indexOf(id);
    if (index !== -1) {
      this.values.splice(index, 1);
    } else {
      this.values.push(id);
    }
    this.bindToValues();
  }

  private bindToValues() {
    this.options.forEach(option => option.checked = false);
    this.values.forEach((value: number) => {
      const selectedOption = this.options.find(option => option.id === value);
      if (selectedOption) {
        selectedOption.checked = true;
      }
    });
  }

}
