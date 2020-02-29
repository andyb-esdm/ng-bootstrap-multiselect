import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IMultiSelectItem } from '../multi-select/multi-select-item.model';
import { IMultiSelectOptions } from '../multi-select/multi-select-options.model';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {

  data: IMultiSelectItem[] = [
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

  options: IMultiSelectOptions = {
    defaultLabel: 'Select a number',
    selectAllLabel: 'All numbers',
    deslectAllLabel: 'Deselect all',
    selectedLabel: 'numbers selected'
  };

  sites: any[] = [
    { siteCode: 'C', siteName: 'Crickhowell' },
    { siteCode: 'A', siteName: 'Abergavenny' },
    { siteCode: 'L', siteName: 'Llangattock' },
    { siteCode: 'B', siteName: 'Brecon' }
  ];

  siteOptions: IMultiSelectOptions = {
    defaultLabel: 'Select a site',
    selectAllLabel: 'All sites',
    deslectAllLabel: 'Deselect all',
    selectedLabel: 'sites selected',
    idProperty: 'siteCode',
    nameProperty: 'siteName'
  };

  public form = this.fb.group({
    name: ['andyb'],
    numbers: [[1, 2, 3]]
  });

  siteCodes = ['A', 'B'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.form.value);
    console.log(this.form.get('numbers'));
  }

  onTestModel() {
    console.log(this.siteCodes);
  }

}
