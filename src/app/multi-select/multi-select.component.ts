import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IMultiSelectOptions } from './multi-select-options.model';
import { IMultiSelectItem } from './multi-select-item.model';

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
  @Input() items: IMultiSelectItem[];
  @Input() options: IMultiSelectOptions;

  onChange;
  onTouched;
  isDisabled;

  buttonLabel: string;

  selectAllLabel = 'Select All';
  deselectAllLabel = 'Deselect All';
  defaultLabel = 'Select a value';
  selectedLabel = 'items selected';

  private values: (string | number)[];

  constructor() { }

  ngOnInit(): void {
    if (this.options) {
      this.setupLabels();
    }
  }

  private setupLabels() {
    if (this.options.defaultLabel) {
      this.defaultLabel = this.options.defaultLabel;
    }
    if (this.options.selectAllLabel) {
      this.selectAllLabel = this.options.selectAllLabel;
    }
    if (this.options.deslectAllLabel) {
      this.deselectAllLabel = this.options.deslectAllLabel;
    }
    if (this.options.selectedLabel) {
      this.selectedLabel = this.options.selectedLabel;
    }
    this.buttonLabel = this.defaultLabel;
  }

  writeValue(values: (string | number)[]): void {
    this.values = values ? [...values] : [];
    this.bindToValues();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onItemClicked(id: string | number) {
    const index = this.values.indexOf(id);
    if (index !== -1) {
      this.values.splice(index, 1);
    } else {
      this.values.push(id);
    }
    this.bindToValues();
    this.onChange(this.values);
  }

  selectAll() {
    this.values = this.items.map(item => item.id);
    this.bindToValues();
    this.onChange(this.values);
  }

  deselectAll() {
    this.values = [];
    this.bindToValues();
    this.onChange(this.values);
  }

  private bindToValues() {
    this.items.forEach(item => item.checked = false);
    this.values.forEach((value: string | number) => {
      const selectedItem = this.items.find(item => item.id === value);
      if (selectedItem) {
        selectedItem.checked = true;
      }
    });
    if (this.values.length) {
      this.buttonLabel = `${this.values.length} ${this.selectedLabel}`;
    } else {
      this.buttonLabel = this.defaultLabel;
    }
  }

}
